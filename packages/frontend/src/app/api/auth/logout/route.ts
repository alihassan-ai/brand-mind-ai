import { NextResponse } from "next/server";
import { prisma } from "@brandmind/shared";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (sessionId) {
      await prisma.session.delete({ where: { id: sessionId } }).catch(() => { });
      cookieStore.delete("session_id");
    }

    // Fix: Clear the user_session and shopify_connected_shop cookies
    cookieStore.delete("user_session");
    cookieStore.delete("shopify_connected_shop");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
