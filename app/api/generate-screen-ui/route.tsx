import {NextRequest, NextResponse} from "next/server";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {APP_LAYOUT_CONFIG_PROMPT, GENERATION_SCREEN_PROMPT} from "@/lib/prompt";
import {db} from "@/configs/db";
import {projectsTable, screenConfigsTable} from "@/configs/schema";
import {and, eq} from "drizzle-orm";
import {safeParseJSON} from "@/app/api/generate-config/route";

export async function POST(req:NextRequest) {

    try {




        const {projectId, screenName, screenId, purpose, screenDescription, apiKey, deviceType } =  await req.json()
        if (!apiKey) {
            return NextResponse.json(
                { error: "Gemini API key missing" },
                { status: 401 }
            )
        }
        const userInput= `
            screen Name is ${screenName},
            screen Purpose: ${purpose},
            screen Description: ${screenDescription}
        `

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        let maxWidth = "100%";
        if (deviceType === "mobile") maxWidth = "375px";
        if (deviceType === "desktop") maxWidth = "100%";

        const rootContainer = `<div class="relative w-full max-w-[${maxWidth}] mx-auto min-h-screen bg-[var(--background)]">`;
        const fullPrompt = `
SYSTEM INSTRUCTIONS (STRICT):
${GENERATION_SCREEN_PROMPT.replace('{deviceType}', deviceType)
            .replace('DEVICE_MAX_WIDTH', maxWidth)}

USER REQUEST:
${userInput}
`;
        let result;

        try {
            result = await model.generateContent(fullPrompt);
        } catch (err: any) {
            if (err?.status === 429) {
                return NextResponse.json(
                    {
                        error: "AI quota exceeded",
                        retryAfter: err.errorDetails?.find((e:any)=>e.retryDelay)?.retryDelay ?? "60s"
                    },
                    { status: 429 }
                );
            }
            throw err;
        }




        console.log('aiRESPONSE===')
        console.log(result.response.text())
        const code = result.response.text()
        const updateResult = await db.update(screenConfigsTable)
            .set({
                code: code
            }).where(and(eq(screenConfigsTable.projectId, projectId), eq(screenConfigsTable.screenId, screenId) )).returning()

        return NextResponse.json({aiResult: updateResult})


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
        if (err?.status === 429) {
            return NextResponse.json(
                {
                    error: "AI_QUOTA_EXCEEDED",
                    retryAfter:
                        err.errorDetails?.find((e: any) => e.retryDelay)?.retryDelay ?? "60s",
                },
                { status: 429 }
            );
        }

        if (err?.status === 401) {
            return NextResponse.json(
                { error: "API_KEY_INVALID" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: "AI_FAILED" },
            { status: 500 }
        );
    }

}