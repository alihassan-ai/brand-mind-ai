import { NextResponse } from "next/server";
import { getCurrentUser } from "@brandmind/backend/auth/session";
import { prisma } from "@brandmind/shared";

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Check if email is already taken by another user
        if (email !== user.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                return NextResponse.json({ error: "Email already in use" }, { status: 400 });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                name,
                email,
            },
        });

        return NextResponse.json({ success: true, user: { name: updatedUser.name, email: updatedUser.email } });
    } catch (error: any) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
