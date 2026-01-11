import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/db";
import { projectsTable, screenConfigsTable } from "@/configs/schema";
import { and, eq } from "drizzle-orm";

export async function DELETE(req: NextRequest) {
    try {
        const { projectId } = await req.json();

        if (!projectId) {
            return NextResponse.json(
                { error: "PROJECT_ID_MISSING" },
                { status: 400 }
            );
        }

        // 1️⃣ Удаляем экраны проекта
        await db
            .delete(screenConfigsTable)
            .where(eq(screenConfigsTable.projectId, projectId));

        // 2️⃣ Удаляем сам проект
        const deleted = await db
            .delete(projectsTable)
            .where(eq(projectsTable.projectId, projectId))
            .returning();

        if (!deleted.length) {
            return NextResponse.json(
                { error: "PROJECT_NOT_FOUND" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "DELETE_PROJECT_FAILED" },
            { status: 500 }
        );
    }
}