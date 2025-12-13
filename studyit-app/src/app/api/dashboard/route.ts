/**
 * FR #18:When the user clicks Start Study Session (and finishes), the system shall display updated streaks and achievements.
 */
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * GET /api/dashboard
 * Retrieves dashboard data including user stats, today's tasks, and a greeting.
 * @param {Request} req - The request object containing 'userId' in search params.
 * @returns {Promise<NextResponse>} JSON response with stats, todayItems, and greeting.
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const data = db.read();

        // Get Stats
        const stats = data.performance.find(p => p.userId === userId) || {
            userId, xp: 0, level: 1, streak: 0, lastStudyDate: new Date().toISOString(), totalStudyTime: 0
        };

        // Get Today's Plan Items
        const plan = data.plans.find(p => p.userId === userId); // Simplified: just get the first plan
        const todayItems = plan ? plan.items.filter(i => !i.completed).slice(0, 3) : [];

        return NextResponse.json({
            stats,
            todayItems,
            greeting: getGreeting()
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}
