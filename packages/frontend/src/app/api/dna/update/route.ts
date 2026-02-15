import { NextRequest, NextResponse } from "next/server";
import { getConnectedShop } from "@brandmind/backend/auth/session";
import { updateDNAField, checkDNACompleteness } from "@brandmind/brain";
import { prisma } from "@brandmind/shared";

export async function POST(req: NextRequest) {
  try {
    const shopDomain = await getConnectedShop();

    if (!shopDomain) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const shop = await prisma.shop.findUnique({ where: { shopDomain } });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const { field, value } = await req.json();

    if (!field) {
      return NextResponse.json({ error: "Field is required" }, { status: 400 });
    }

    // Update the field
    await updateDNAField(shop.id, field, value);

    // Return updated completeness
    const completeness = await checkDNACompleteness(shop.id);

    return NextResponse.json({
      success: true,
      completeness,
    });
  } catch (error: any) {
    console.error("[DNA Update API] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
