import { NextRequest, NextResponse } from "next/server";
import getServerUser from "@/lib/auth-server";
import { db } from "@/configs/db";
import { projectsTable, usersTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const { userInput, user, device, projectId, screenCount, apiKey } = await req.json();

        if (!user) {
            return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
        }


        if (!user.isPremium) {
            const projectsCount = await db
                .select({ count: projectsTable.projectId })
                .from(projectsTable)
                .where(eq(projectsTable.createdBy, user.email));

            if (projectsCount.length >= 3) {
                return NextResponse.json(
                    { error: "PROJECT_LIMIT_REACHED" },
                    { status: 403 }
                );
            }
        }

        const result = await db
            .insert(projectsTable)
            .values({
                projectId,
                createdBy: user.email,
                device,
                userInput,
                projectVisualDescription: null,
                screenCount: screenCount ?? 3,
                apiKey,
            })
            .returning();

        return NextResponse.json({ response: result[0] });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
    }
}
