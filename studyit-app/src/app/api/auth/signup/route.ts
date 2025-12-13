import { AuthService } from "@/services/authService";
import { NextResponse } from "next/server";

/**
 * POST /api/auth/signup
 * Registers a new user with email and password.
 * @param {Request} req - The request object containing email and password in JSON body.
 * @returns {Promise<NextResponse>} JSON response with created user object or error message.
 */
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
