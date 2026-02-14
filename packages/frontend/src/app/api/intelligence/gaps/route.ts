import { NextResponse } from "next/server";
import { getCurrentUser, getConnectedShop } from "@brandmind/backend/auth/session";
import { detectAllGaps } from "@brandmind/brain/intelligence/gap-detector";
import { prisma } from "@brandmind/shared";

export async function POST() {
  try {
    const user = await getCurrentUser();
    const shopDomain = await getConnectedShop();

    if (!user || !shopDomain) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shop = await prisma.shop.findUnique({ where: { shopDomain } });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const gaps = await detectAllGaps(shop.id);

    return NextResponse.json({ success: true, data: gaps });
  } catch (error: any) {
    console.error("Gap detection error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    const shopDomain = await getConnectedShop();

    if (!user || !shopDomain) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shop = await prisma.shop.findUnique({ where: { shopDomain } });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const gaps = await prisma.catalogGap.findMany({
      where: { shopId: shop.id, status: "active" },
      orderBy: { confidence: "desc" },
    });

    return NextResponse.json({ success: true, data: gaps });
  } catch (error: any) {
    console.error("Gap fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
