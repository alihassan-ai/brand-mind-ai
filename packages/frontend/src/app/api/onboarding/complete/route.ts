import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@brandmind/shared";
import { getCurrentUser } from "@brandmind/backend/auth/session";
import { cookies } from "next/headers";
import { encrypt } from "@brandmind/backend/auth/crypto";
import { runFullSync } from "@brandmind/backend/sync/shopify-sync";
import { runBackgroundAnalysis, computeStoreDNA, detectAllGaps } from "@brandmind/brain";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { shopDomain, accessToken } = await req.json();

    if (!shopDomain || !accessToken) {
      return NextResponse.json({ error: "Shop domain and access token are required" }, { status: 400 });
    }

    // Normalize domain
    let domain = shopDomain.toLowerCase().trim();
    if (!domain.includes(".myshopify.com")) {
      domain = `${domain}.myshopify.com`;
    }

    // Check if shop already exists
    let shop = await prisma.shop.findUnique({ where: { shopDomain: domain } });

    if (shop) {
      // Update existing shop
      shop = await prisma.shop.update({
        where: { id: shop.id },
        data: {
          accessToken: encrypt(accessToken),
          userId: user.id,
        },
      });
    } else {
      // Create new shop
      shop = await prisma.shop.create({
        data: {
          shopDomain: domain,
          accessToken: encrypt(accessToken),
          userId: user.id,
        },
      });
    }

    // Set cookie for connected shop
    const cookieStore = await cookies();
    cookieStore.set("shopify_connected_shop", domain, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    // Auto-sync and analyze in background (don't block response)
    // This runs after response is sent
    (async () => {
      try {
        console.log(`[Onboarding] Starting auto-sync for ${domain}...`);

        // Step 1: Sync Shopify data
        await runFullSync(domain);
        console.log(`[Onboarding] Sync complete for ${domain}`);

        // Step 2: Compute Store DNA
        await computeStoreDNA(shop.id);
        console.log(`[Onboarding] Store DNA computed for ${domain}`);

        // Step 3: Run pattern analysis
        await runBackgroundAnalysis(shop.id);
        console.log(`[Onboarding] Pattern analysis complete for ${domain}`);

        // Step 4: Detect gaps
        await detectAllGaps(shop.id);
        console.log(`[Onboarding] Gap detection complete for ${domain}`);

        console.log(`[Onboarding] ✓ Full analysis complete for ${domain}`);
      } catch (err) {
        console.error(`[Onboarding] Background analysis failed for ${domain}:`, err);
      }
    })();

    return NextResponse.json({ success: true, shopId: shop.id, message: "Connected! Analyzing your store..." });
  } catch (error: any) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
