import { AuthService } from "@/services/authService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password || password.length < 6) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const user = await AuthService.signup(email, password);

        if (!user) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        const { passwordHash, ...safeUser } = user;
        return NextResponse.json({ user: safeUser });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
