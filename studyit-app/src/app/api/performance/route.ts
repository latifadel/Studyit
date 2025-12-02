import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const data = db.read();
        const perf = data.performance.find(p => p.userId === userId) || {
            userId, xp: 0, level: 1, streak: 0, lastStudyDate: new Date().toISOString(), totalStudyTime: 0, quizzesTaken: 0, flashcardsReviewed: 0
        };

        // Aggregate daily activity from quiz results (last 7 days)
        const activityMap = new Map<string, number>();
        const now = new Date();

        // Initialize last 7 days with 0
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
            activityMap.set(dateStr, 0);
        }

        // Sum up quiz scores/activity (using score as a proxy for "minutes" or effort for now)
        // In a real app, we'd track time spent per session
        const userQuizzes = data.quizResults.filter(q => q.userId === userId);

        userQuizzes.forEach(q => {
            const date = new Date(q.date);
            // Only count if within last 7 days
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 7) {
                const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
                if (activityMap.has(dateStr)) {
                    // Estimate 5 mins per quiz
                    activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 5);
                }
            }
        });

        const activity = Array.from(activityMap.entries()).map(([date, minutes]) => ({
            date,
            minutes
        }));

        return NextResponse.json({ perf, activity });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
