import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@brandmind/shared";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.redirect(new URL('/auth/login?error=missing_token', req.url));
    }

    try {
        const trimmedToken = token.trim();
        console.log(`[Email Verification] Attempting to verify token: "${trimmedToken}"`);

        const user = await prisma.user.findUnique({
            where: { verificationToken: trimmedToken }
        });

        if (!user) {
            console.error(`[Email Verification] No user found with token: "${trimmedToken}"`);
            return NextResponse.redirect(new URL('/auth/login?error=invalid_token', req.url));
        }

        console.log(`[Email Verification] Found user: ${user.email}. Marking as verified.`);

        // Mark as verified
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                verificationToken: null, // Clear token
            }
        });

        // Set user session cookie
        const cookieStore = await cookies();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        cookieStore.set("user_session", user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: expiresAt,
            path: "/",
        });

        // Redirect to profile completion
        return NextResponse.redirect(new URL('/auth/complete-profile', req.url));
    } catch (error) {
        console.error('[Email Verification] Error:', error);
        return NextResponse.redirect(new URL('/auth/login?error=verification_failed', req.url));
    }
}
