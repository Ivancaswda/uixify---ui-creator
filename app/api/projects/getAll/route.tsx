import {NextRequest, NextResponse} from "next/server";
import getServerUser from "@/lib/auth-server";
import {db} from "@/configs/db";
import {projectsTable, screenConfigsTable} from "@/configs/schema";
import {and, desc, eq} from "drizzle-orm";

export async function GET(req:NextRequest) {
    try {

        const user = await getServerUser()

        if (!user) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 400})
        }


        const result = await db.select().from(projectsTable)
            .where( eq(projectsTable.createdBy, user?.email)).orderBy(desc(projectsTable.createdOn))




        return NextResponse.json({projects:result})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error}, {status: 500})

    }
}