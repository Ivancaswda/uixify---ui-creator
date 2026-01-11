import {NextRequest, NextResponse} from "next/server";
import getServerUser from "@/lib/auth-server";
import {db} from "@/configs/db";
import {projectsTable, screenConfigsTable} from "@/configs/schema";
import {and, eq} from "drizzle-orm";

export async function GET(req:NextRequest) {
    try {
        const projectId = await req.nextUrl.searchParams.get('projectId')
        const user = await getServerUser()


        const result = await db.select().from(projectsTable)
            .where(and(eq(projectsTable.projectId, projectId), eq(projectsTable.createdBy, user?.email)))

        const screenConfig = await db.select().from(screenConfigsTable)
            .where(eq(screenConfigsTable.projectId, projectId))


        return NextResponse.json({project:result[0], screenConfig: screenConfig})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error}, {status: 500})

    }
}