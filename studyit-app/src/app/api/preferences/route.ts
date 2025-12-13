import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * GET /api/preferences
 * Retrieves user preferences.
 * @param {Request} req - The request object containing 'userId' in search params.
 * @returns {Promise<NextResponse>} JSON response with user preferences.
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const data = db.read();
        const user = data.users.find(u => u.id === userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ preferences: user.preferences });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * POST /api/preferences
 * Updates user preferences.
 * @param {Request} req - The request object containing userId and preferences object.
 * @returns {Promise<NextResponse>} JSON response with updated preferences.
 */
export async function POST(req: Request) {
    try {
        const { userId, preferences } = await req.json();
        console.log(`[Preferences API] Received POST for userId: ${userId}`);

        const data = db.read();
        const userIndex = data.users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            console.error(`[Preferences API] User not found for ID: ${userId}`);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        data.users[userIndex].preferences = {
            ...data.users[userIndex].preferences,
            ...preferences
        };

        // Also split subjects string into array for DB consistency if needed
        if (typeof preferences.subjects === 'string') {
            data.users[userIndex].preferences.subjects = preferences.subjects.split(',').map((s: string) => s.trim()).filter(Boolean);
        }

        db.write(data);

        return NextResponse.json({ preferences: data.users[userIndex].preferences });
    } catch (error) {
        console.error("Error in POST /api/preferences:", error);
        return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 });
    }
}
