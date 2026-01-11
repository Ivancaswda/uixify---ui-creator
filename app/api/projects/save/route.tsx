import {NextRequest, NextResponse} from "next/server";
import {db} from "@/configs/db";
import {projectsTable} from "@/configs/schema";
import {eq} from "drizzle-orm";

export async function PUT(req: NextRequest) {
    try {
        const {projectName, theme, projectId} = await req.json();

        const result = await db.update(projectsTable).set({
            projectName: projectName,
            theme: theme
        }).where(eq(projectsTable.projectId, projectId))
            .returning()

        return  NextResponse.json({project: result[0]})
    } catch (error) {
        return NextResponse.json({ error: error}, {status: 500})
    }
}