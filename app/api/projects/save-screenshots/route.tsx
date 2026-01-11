import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/db";
import { projectsTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    const { projectId, screenshots } = await req.json();

    if (!projectId || !screenshots?.length) {
        return NextResponse.json({ error: "INVALID_DATA" }, { status: 400 });
    }

    await db
        .update(projectsTable)
        .set({
            screenShot: screenshots,
        })
        .where(eq(projectsTable.projectId, projectId));

    return NextResponse.json({ success: true });
}
