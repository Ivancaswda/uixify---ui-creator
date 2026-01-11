import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    APP_LAYOUT_CONFIG_PROMPT,
    GENERATE_NEW_SCREEN_IN_EXISTING_PROJECT_PROMPT,
} from "@/lib/prompt";
import { db } from "@/configs/db";
import { projectsTable, screenConfigsTable } from "@/configs/schema";
import { eq } from "drizzle-orm";



/* -------------------- utils -------------------- */

function cleanJSON(content: string) {
    return content.replace(/```json/g, "").replace(/```/g, "").trim();
}

function safeParseJSON(jsonString: string) {
    const cleaned = cleanJSON(jsonString);
    try {
        return { ok: true, data: JSON.parse(cleaned) };
    } catch (error: any) {
        return { ok: false, raw: jsonString, error: error.message };
    }
}

/* -------------------- model fallback -------------------- */

const MODELS_STAGE_1 = [
    "gemini-2.5-flash",
];

const MODELS_STAGE_2 = [
    "gemini-2.5-flash",
];

async function generateWithFallback(
    prompt: string,
    models: string[],
    apiKey: string
) {

    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of models) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            return await model.generateContent(prompt);
        } catch (err: any) {
            if (err?.status !== 503) throw err;
            console.warn(`⚠️ Model ${modelName} overloaded, trying next...`);
        }
    }

    throw new Error("All Gemini models are overloaded");
}

/* -------------------- route -------------------- */
type NormalizedScreen = {
    screenId: string
    screenName: string
    purpose: string
    screenDescription: string
}
function normalizeScreens(aiData: any): NormalizedScreen[] {
    // CASE 1: full project with screens[]
    if (Array.isArray(aiData.screens)) {
        return aiData.screens.map((s: any) => ({
            screenId: s.id,
            screenName: s.name,
            purpose: s.purpose,
            screenDescription: s.layout ?? s.layoutDescription,
        }));
    }

    // CASE 2: single screen object
    if (aiData.id && aiData.name) {
        return [{
            screenId: aiData.id,
            screenName: aiData.name,
            purpose: aiData.purpose,
            screenDescription: aiData.layoutDescription ?? aiData.layout,
        }];
    }

    throw new Error("AI response has unknown screen shape");
}
export async function POST(req: NextRequest) {
    try {
        const {
            userInput,
            deviceType,
            projectId,
            oldScreenDescription,
            theme,
            projectName,
            screenCount,
            apiKey
        } = await req.json();

        const normalizedScreenCount = Math.min(
            Math.max(Number(screenCount) || 1, 1),
            4
        )


        if (!apiKey) {
            return NextResponse.json(
                { error: "Gemini API key missing" },
                { status: 401 }
            )
        }
        /* ======================================================
           STAGE 1 — generate screen IDEA (light prompt)
        ====================================================== */

        const promptStage1 = `
You are a senior product designer.

Context:
- Device type: ${deviceType}
- Project theme: ${theme}
- Existing screen description:
${oldScreenDescription || "N/A"}

User request:
${userInput}

TASK:
Describe ONE new screen to add to this project.

Return JSON ONLY:
{
  "id": "kebab-case",
  "name": "string",
  "purpose": "one clear sentence",
  "layoutDescription": "clear but not overly strict"
}
`;

        const stage1Result = await generateWithFallback(
            promptStage1,
            MODELS_STAGE_1,
            apiKey
        );

        const stage1Parsed = safeParseJSON(stage1Result.response.text());
        if (!stage1Parsed.ok) {
            return NextResponse.json(
                { error: "Stage 1 invalid JSON", raw: stage1Parsed.raw },
                { status: 422 }
            );
        }

        /* ======================================================
           STAGE 2 — normalize to STRICT format
        ====================================================== */

        const strictSystemPrompt = oldScreenDescription
            ? GENERATE_NEW_SCREEN_IN_EXISTING_PROJECT_PROMPT
                .replace("{deviceType}", deviceType)
                .replace("{theme}", theme)
            : APP_LAYOUT_CONFIG_PROMPT
                .replace("{deviceType}", deviceType)
                .replace("{screenCount}", String(normalizedScreenCount));

        const promptStage2 = `
SYSTEM INSTRUCTIONS (STRICT):
${strictSystemPrompt}

Existing project description:
${oldScreenDescription || "N/A"}

Draft screen (DO NOT CHANGE INTENT):
${JSON.stringify(stage1Parsed.data, null, 2)}

TASK:
Validate and normalize this screen.
Return ONLY valid JSON.
`;

        const stage2Result = await generateWithFallback(
            promptStage2,
            MODELS_STAGE_2,
            apiKey
        );

        const stage2Parsed = safeParseJSON(stage2Result.response.text());
        if (!stage2Parsed.ok) {
            return NextResponse.json(
                { error: "Stage 2 invalid JSON", raw: stage2Parsed.raw },
                { status: 422 }
            );
        }

        const aiData = stage2Parsed.data;

        /* ======================================================
           SAVE PROJECT META (only for initial generation)
        ====================================================== */

        if (!oldScreenDescription && aiData.designSystem) {
            const projectVisualDescription = `
PURPOSE:
${aiData.purpose}

LAYOUT:
${aiData.layoutDescription}

DESIGN SYSTEM:
Style: ${aiData.designSystem.designStyle}
Layout: ${aiData.designSystem.layoutApproach}
Colors: ${aiData.designSystem.colorStrategy}
Typography: ${aiData.designSystem.typography}
Spacing: ${aiData.designSystem.spacingSystem}
Radius: ${aiData.designSystem.borderRadius}
Shadows: ${aiData.designSystem.shadowStyle}

NAVIGATION:
${aiData.navigation?.type}
${aiData.navigation?.description}
`;

            await db
                .update(projectsTable)
                .set({
                    theme: aiData.designSystem.theme,
                    projectName: aiData.projectName || projectName,
                    projectVisualDescription,
                })
                .where(eq(projectsTable.projectId, projectId));
        }

        console.log('aiData====')
        console.log(aiData)

        const normalizedScreens = normalizeScreens(aiData);

        const insertedScreens = await db
            .insert(screenConfigsTable)
            .values(
                normalizedScreens.map(screen => ({
                    projectId,
                    screenId: screen.screenId,
                    screenName: screen.screenName,
                    purpose: screen.purpose,
                    screenDescription: screen.screenDescription,
                }))
            )
            .returning();

        return NextResponse.json({
            success: true,
            screens: insertedScreens,
        });

    } catch (err: any) {
        console.log(err)
        if (
            err?.status === 400 &&
            err.message.toLowerCase().includes("location is not supported")
        ) {
            return NextResponse.json(
                {
                    error: "AI_REGION_BLOCKED",
                    message: "Gemini API is not available in your region",
                },
                { status: 400 }
            );
        }
        if (err?.status === 429 || err?.status === 503) {
            console.log(err)
            return NextResponse.json(
                {
                    error: "API_KEY_INVALID",
                    reason: err.status,
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "AI_FAILED" },
            { status: 500 }
        );
    }
}
