import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@brandmind/shared";
import { hash } from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        verificationToken,
      },
    });

    // Send verification email
    const { sendVerificationEmail } = await import("@brandmind/backend");

    if (!process.env.RESEND_API_KEY) {
      console.error("[Signup] RESEND_API_KEY is missing. Email skipped.");
    } else {
      const emailResult = await sendVerificationEmail(email, "User", verificationToken);
      if (!emailResult.success) {
        console.error("Failed to send verification email:", emailResult.error);
        // We still return success for the user creation, but log the error
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
