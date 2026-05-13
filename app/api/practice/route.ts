import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const logs = await prisma.practiceLog.findMany({
            where: { userId: session.user.id },
            orderBy: { solvedAt: "desc" },
        });

        return NextResponse.json({ logs }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { topic, difficulty, question, answer } = await req.json();

        if (!topic || !difficulty || !question) {
            return NextResponse.json({ error: "Topic, difficulty and question are required" }, { status: 400 });
        }

        const log = await prisma.practiceLog.create({
            data: {
                topic,
                difficulty,
                question,
                answer: answer || null,
                userId: session.user.id,
            },
        });

        return NextResponse.json({ log }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const id = req.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const { topic, difficulty, question, answer } = await req.json();

        const log = await prisma.practiceLog.updateMany({
            where: { id, userId: session.user.id },
            data: { topic, difficulty, question, answer: answer || null },
        });

        const updated = await prisma.practiceLog.findUnique({ where: { id } });

        return NextResponse.json({ log: updated }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const id = req.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await prisma.practiceLog.deleteMany({
            where: { id, userId: session.user.id },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}