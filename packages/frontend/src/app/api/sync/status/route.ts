import { NextResponse } from "next/server";
import { getConnectedShop } from "@brandmind/backend/auth/session";
import { prisma } from "@brandmind/shared";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const shopDomain = await getConnectedShop();

    if (!shopDomain) {
      return NextResponse.json({ error: "No shop connected" }, { status: 401 });
    }

    const shop = await prisma.shop.findUnique({
      where: { shopDomain },
      select: {
        syncStatus: true,
        lastSyncAt: true
      }
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json({
      syncStatus: shop.syncStatus,
      lastSyncAt: shop.lastSyncAt
    });
  } catch (error: any) {
    console.error("Sync status error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
