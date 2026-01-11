import {NextRequest, NextResponse} from "next/server";
import {db} from "@/configs/db";
import {projectsTable} from "@/configs/schema";
import {eq} from "drizzle-orm";

export async function POST(req: NextRequest) {
    const { projectId, apiKey } = await req.json()

    await db
        .update(projectsTable)
        .set({ apiKey })
        .where(eq(projectsTable.projectId, projectId))

    return NextResponse.json({ success: true })
}