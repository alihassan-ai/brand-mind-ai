import { NextResponse } from "next/server";
import { getCurrentUser, getConnectedShop } from "@brandmind/backend/auth/session";
import { calculateRFM, generateRetentionInsights } from "@brandmind/brain/agents/retention-agent";
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

    // Calculate RFM scores
    await calculateRFM(shop.id);

    // Generate insights
    const insights = await generateRetentionInsights(shop.id);

    return NextResponse.json({ success: true, data: insights });
  } catch (error: any) {
    console.error("Retention agent error:", error);
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

    const insights = await prisma.retentionInsight.findMany({
      where: { shopId: shop.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ success: true, data: insights });
  } catch (error: any) {
    console.error("Retention fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
