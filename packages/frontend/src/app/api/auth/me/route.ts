import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@brandmind/backend/auth/session";

export async function GET(req: NextRequest) {
    try {
        const userBuffer = await getCurrentUser();

        if (!userBuffer) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // Sanitize user object for frontend
        const user = {
            id: userBuffer.id,
            email: userBuffer.email,
            name: userBuffer.name,
            emailVerified: userBuffer.emailVerified,
            role: userBuffer.role,
        };

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Auth status error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
