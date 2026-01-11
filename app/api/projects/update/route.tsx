import {NextRequest, NextResponse} from "next/server";
import {db} from "@/configs/db";
import {projectsTable} from "@/configs/schema";
import {eq} from "drizzle-orm";

export async function PUT(req: NextRequest) {
    try {
        const {projectName, theme, projectId, screenShot} = await req.json()

        const result = await db.update(projectsTable).set({
            projectName: projectName,
            theme: theme,
            screenShot: screenShot as string ?? null
        }).where(eq(projectsTable.projectId, projectId))
        return NextResponse.json({success: true})
    } catch (error) {
        return NextResponse.json({success:false, error: error}, {status: 500})
    }
}