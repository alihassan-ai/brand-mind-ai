import { NextRequest, NextResponse } from "next/server";
import { getConnectedShop } from "@brandmind/backend/auth/session";
import { checkDNACompleteness } from "@brandmind/brain";
import { prisma } from "@brandmind/shared";

export async function GET(req: NextRequest) {
  try {
    const shopDomain = await getConnectedShop();

    if (!shopDomain) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const shop = await prisma.shop.findUnique({ where: { shopDomain } });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const completeness = await checkDNACompleteness(shop.id);

    return NextResponse.json(completeness);
  } catch (error: any) {
    console.error("[DNA Completeness API] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
