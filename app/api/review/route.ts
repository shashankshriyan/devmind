import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }

   
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an expert code reviewer. Review the following ${language} code and provide feedback in this exact format:

## ✅ What's Good
- List what the code does well

## ❌ Bugs Found
- List any bugs or errors found

## 💡 Improvements
- List specific improvements

## ⚡ Performance
- List any performance issues

## 📝 Revised Code
\`\`\`${language}
// Provide improved version of the code here
\`\`\`

Here is the code to review:
\`\`\`${language}
${code}
\`\`\``;

    const result = await model.generateContent(prompt);
    const feedback = result.response.text();

    // Save to database
    await prisma.codeReview.create({
      data: {
        code,
        language,
        feedback,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ feedback }, { status: 200 });
 } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },  // ← this
      { status: 500 }
    );
  }
}