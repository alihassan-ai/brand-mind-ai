import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@brandmind/shared";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
        }

        // Find and validate token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true }
        });

        if (!resetToken || resetToken.expiresAt < new Date()) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        // Update password
        const passwordHash = await hash(password, 12);
        await prisma.user.update({
            where: { id: resetToken.userId },
            data: { passwordHash }
        });

        // Delete the token
        await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Reset Password] Error:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
