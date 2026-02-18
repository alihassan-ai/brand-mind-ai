import { NextResponse } from "next/server";
import { getConnectedShop } from "@brandmind/backend/auth/session";
import { runFullSync } from "@brandmind/backend/sync/shopify-sync";
import { prisma } from "@brandmind/shared";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const shopDomain = await getConnectedShop();

    if (!shopDomain) {
      return NextResponse.json({ error: "No shop connected" }, { status: 401 });
    }

    const shop = await prisma.shop.findUnique({ where: { shopDomain } });
    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    await runFullSync(shop.id);

    return NextResponse.json({ success: true, message: "Sync completed" });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
