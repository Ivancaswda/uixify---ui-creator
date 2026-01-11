import {NextRequest, NextResponse} from "next/server";
import {db} from "@/configs/db";
import {screenConfigsTable} from "@/configs/schema";
import {and, eq} from "drizzle-orm";
import getServerUser from "@/lib/auth-server";

export async function DELETE(req:NextRequest) {

    try {

        const url = new URL(req.url);
        const projectId = url.searchParams.get("projectId");
        const screenId = url.searchParams.get("screenId");
        console.log('screenId', screenId)
        console.log('projectId', projectId)
        const user =await getServerUser()

        if (!user) {
            return NextResponse.json({error: 'Unauthorized user'}, {status: 404})
        }
        const deletedResult = await db
            .delete(screenConfigsTable)
            .where(
                and(
                    eq(screenConfigsTable.projectId, projectId),
                    eq(screenConfigsTable.screenId, screenId)
                )
            )
            .returning();

        if (deletedResult.length === 0) {
            return NextResponse.json(
                { error: "Screen not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error}, {status: 500})
    }
}