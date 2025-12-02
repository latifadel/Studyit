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
        const user = data.users.find(u => u.id === userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ preferences: user.preferences });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId, preferences } = await req.json();

        const data = db.read();
        const userIndex = data.users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
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
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
