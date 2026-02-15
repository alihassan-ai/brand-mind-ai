import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@brandmind/shared";
import { sendPasswordResetEmail } from "@brandmind/backend";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        // Industry standard: don't reveal if user exists or not
        if (!user) {
            return NextResponse.json({ success: true });
        }

        // Generate secure token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Save token
        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token,
                expiresAt,
            }
        });

        // Send email
        await sendPasswordResetEmail(email, user.name || "User", token);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Forgot Password] Error:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
