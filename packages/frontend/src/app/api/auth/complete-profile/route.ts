import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@brandmind/shared";
import { getCurrentUser } from "@brandmind/backend/auth/session";

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!user.emailVerified) {
            return NextResponse.json({ error: "Email not verified" }, { status: 403 });
        }

        const { name } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        // Update user
        await prisma.user.update({
            where: { id: user.id },
            data: { name },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Complete profile error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
