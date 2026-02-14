import { NextResponse } from "next/server";
import { getCurrentUser } from "@brandmind/backend/auth/session";
import { prisma } from "@brandmind/shared";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Current and new passwords are required" }, { status: 400 });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid current password" }, { status: 400 });
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
            },
        });

        return NextResponse.json({ success: true, message: "Password updated successfully" });
    } catch (error: any) {
        console.error("Password update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
