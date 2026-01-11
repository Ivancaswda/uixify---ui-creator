import {NextRequest, NextResponse} from "next/server";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {APP_LAYOUT_CONFIG_PROMPT} from "@/lib/prompt";
import {safeParseJSON} from "@/app/api/generate-config/route";
import {db} from "@/configs/db";
import {projectsTable, screenConfigsTable} from "@/configs/schema";
import {and, eq} from "drizzle-orm";




 function cleanJSON(content: string) {
    return content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
}




export async function POST(req: NextRequest) {
   try {
       const apiKey =
           req.headers.get("x-gemini-key") ||
           process.env.GEMINI_API_KEY

       if (!apiKey) {
           return NextResponse.json(
               { error: "Gemini API key missing" },
               { status: 401 }
           )
       }
       const {projectId, screenId, oldCode, userInput} = await req.json();
       const genAI = new GoogleGenerativeAI(apiKey);
       const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

       const USER_INPUT = `
У тебя уже есть готовый HTML-интерфейс, написанный с использованием Tailwind CSS.

Твоя задача:
— Внести ТОЛЬКО те изменения, которые просит пользователь
— Сохранить существующий дизайн, стили, отступы, цвета и структуру
— НИЧЕГО не улучшать и не оптимизировать по своей инициативе
— НЕ менять layout, если пользователь прямо этого не просит
— НЕ удалять существующие элементы, если это не указано явно

ВАЖНО:
— Работай исключительно с предоставленным кодом
— Верни ТОЛЬКО итоговый HTML-код
— Без комментариев, пояснений и markdown
— Без \`\`\` и текста вне HTML

Текущий код:
${oldCode}

Запрос пользователя:
${userInput}
`;
       const fullPrompt = `USER REQUEST:
        ${USER_INPUT}
        `;


       const result = await model.generateContent(fullPrompt);


       const code = result.response.text()
       const updateResult = await db.update(screenConfigsTable)
           .set({
               code: code
           }).where(and(eq(screenConfigsTable.projectId, projectId), eq(screenConfigsTable.screenId, screenId) )).returning()



        return NextResponse.json({success:true, aiResult:updateResult[0]})

   } catch (err: any) {
       if (
           err?.status === 400 &&
           err.message.toLowerCase().includes("location is not supported")
       ) {
           return NextResponse.json(
               {
                   error: "AI_REGION_BLOCKED",
                   message: "Gemini API is not available in your region",
               },
               { status: 400 }
           );
       }
       if (err?.status === 429 || err?.status === 503) {
           return NextResponse.json(
               {
                   error: "API_KEY_INVALID",
                   reason: err.status,
               },
               { status: 409 }
           );
       }

       return NextResponse.json(
           { error: "AI_FAILED" },
           { status: 500 }
       );
   }

}