import { AIService } from "@/services/ai/planGenerator";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * POST /api/plan/generate
 * Generates a new 3-day study plan for the user using AI.
 * @param {Request} req - The request object containing userId.
 * @returns {Promise<NextResponse>} JSON response with the generated plan.
 */
export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        const data = db.read();
        const user = data.users.find(u => u.id === userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const planItems = await AIService.generateStudyPlan(user.preferences);

        // Save plan to DB
        const newPlan = {
            id: crypto.randomUUID(),
            userId: user.id,
            items: planItems.map(item => ({
                id: crypto.randomUUID(),
                ...item,
                completed: false
            })),
            createdAt: new Date().toISOString()
        };

        data.plans.push(newPlan);
        db.write(data);

        return NextResponse.json({ plan: newPlan });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
