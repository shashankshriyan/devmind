import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topic, difficulty, type } = await req.json();

    if (!topic || !difficulty || !type) {
      return NextResponse.json(
        { error: "Topic, difficulty and type are required" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert technical interviewer. Generate a ${difficulty} level ${type} interview question about ${topic}.

Respond in this exact format:

## ❓ Question
Write the question here clearly

## 📝 Example
Show an input/output example if applicable

## 💡 Hint
Give a helpful hint without giving away the answer

## ✅ Solution Approach
Explain the approach to solve it step by step

## 💻 Code Solution
\`\`\`
Write the code solution here
\`\`\`

## ⏱️ Time & Space Complexity
- Time: O(?)
- Space: O(?)`;

    const result = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    });

    const question = result.choices[0].message.content || "";

    return NextResponse.json({ question }, { status: 200 });
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    );
  }
}




export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topic, difficulty, question } = await req.json();

    await prisma.practiceLog.create({
      data: {
        topic,
        difficulty,
        question,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "Saved to practice log!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}