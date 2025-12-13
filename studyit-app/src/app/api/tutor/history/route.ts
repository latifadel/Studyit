import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * GET /api/tutor/history
 * Retrieves chat session history for a user.
 * @param {Request} req - The request object containing 'userId' in search params.
 * @returns {Promise<NextResponse>} JSON response with chat history.
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const data = db.read();
        const history = data.chatHistory
            .filter(c => c.userId === userId)
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        return NextResponse.json({ history });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * DELETE /api/tutor/history
 * Deletes a chat session.
 * @param {Request} req - The request object containing 'sessionId' and 'userId' in search params.
 * @returns {Promise<NextResponse>} JSON response indicating success.
 */
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("sessionId");
        const userId = searchParams.get("userId");

        if (!sessionId || !userId) {
            return NextResponse.json({ error: "Session ID and User ID required" }, { status: 400 });
        }

        const data = db.read();
        data.chatHistory = data.chatHistory.filter(c => c.id !== sessionId || c.userId !== userId);
        db.write(data);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
