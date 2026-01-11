import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/db";
import { projectsTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const { projectId, apiKey } = await req.json();

        if (!projectId || !apiKey) {
            return NextResponse.json(
                { error: "PROJECT_ID_OR_API_KEY_MISSING" },
                { status: 400 }
            );
        }

        await db
            .update(projectsTable)
            .set({ apiKey })
            .where(eq(projectsTable.projectId, projectId));

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json(
            { error: "FAILED_TO_UPDATE_API_KEY" },
            { status: 500 }
        );
    }
}
