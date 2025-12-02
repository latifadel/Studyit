import { AuthService } from "@/services/authService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        const user = await AuthService.login(email, password);

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // In a real app, we would set a secure HTTP-only cookie here.
        // For this demo, we'll return the user object and handle session on client/context.
        const { passwordHash, ...safeUser } = user;
        return NextResponse.json({ user: safeUser });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
