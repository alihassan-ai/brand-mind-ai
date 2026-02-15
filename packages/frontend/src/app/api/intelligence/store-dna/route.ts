import { NextResponse } from "next/server";
import { getCurrentUser, getConnectedShop } from "@brandmind/backend/auth/session";
import { computeStoreDNA } from "@brandmind/brain/intelligence/store-dna";
import { prisma } from "@brandmind/shared";
import { redirect } from "next/navigation";

export async function POST() {
  try {
    const user = await getCurrentUser();
    const shopDomain = await getConnectedShop();

    if (!user || !shopDomain) {
      return NextResponse.redirect(new URL("/auth/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
    }

    const shop = await prisma.shop.findUnique({ where: { shopDomain } });

    if (!shop) {
      return NextResponse.redirect(new URL("/onboarding", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
    }

    await computeStoreDNA(shop.id);

    // Redirect back to DNA page
    return NextResponse.redirect(new URL("/intelligence/dna", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  } catch (error: any) {
    console.error("Store DNA error:", error);
    return NextResponse.redirect(new URL("/intelligence/dna?error=true", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
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

    const dna = await prisma.storeDNA.findUnique({ where: { shopId: shop.id } });

    return NextResponse.json({ success: true, data: dna });
  } catch (error: any) {
    console.error("Store DNA error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
