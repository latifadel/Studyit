import { db, QuizResult } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const data = db.read();
        const results = data.quizResults
            .filter(q => q.userId === userId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return NextResponse.json({ results });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId, topic, score, totalQuestions } = await req.json();

        const data = db.read();
        const newResult: QuizResult = {
            id: crypto.randomUUID(),
            userId,
            topic,
            score,
            totalQuestions,
            date: new Date().toISOString()
        };

        data.quizResults.push(newResult);

        // Update User Performance
        const perf = data.performance.find(p => p.userId === userId);
        if (perf) {
            perf.xp += score * 10; // 10 XP per correct answer
            perf.quizzesTaken = (perf.quizzesTaken || 0) + 1;
            // Level up logic
            if (perf.xp >= perf.level * 100) {
                perf.level += 1;
            }
        }

        db.write(data);

        return NextResponse.json({ result: newResult });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
