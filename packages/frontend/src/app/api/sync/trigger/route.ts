import { NextRequest, NextResponse } from "next/server";
import { runFullSync } from "@brandmind/backend/sync/shopify-sync";
import { prisma } from "@brandmind/shared";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

/**
 * Internal endpoint to trigger sync for a specific shop.
 * Used by:
 * - Cron job (picks up PENDING shops)
 * - Manual admin triggers
 * - Fallback mechanisms
 */
export async function POST(req: NextRequest) {
  try {
    // Verify internal secret (prevents abuse)
    const authHeader = req.headers.get("authorization");
    const expectedAuth = `Bearer ${process.env.INTERNAL_API_SECRET}`;

    if (!process.env.INTERNAL_API_SECRET) {
      console.error("[Sync Trigger] INTERNAL_API_SECRET not configured");
      return NextResponse.json(
        { error: "Internal API secret not configured" },
        { status: 500 }
      );
    }

    if (authHeader !== expectedAuth) {
      console.error("[Sync Trigger] Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { shopId } = body;

    if (!shopId) {
      return NextResponse.json(
        { error: "shopId is required" },
        { status: 400 }
      );
    }

    // Verify shop exists
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Check if already syncing (prevent duplicate syncs)
    if (shop.syncStatus === "IN_PROGRESS") {
      console.log(`[Sync Trigger] Shop ${shop.shopDomain} already syncing, skipping`);
      return NextResponse.json({
        success: true,
        message: "Sync already in progress",
        skipped: true
      });
    }

    console.log(`[Sync Trigger] Starting sync for shop ${shop.shopDomain} (${shopId})`);

    // Mark as in progress
    await prisma.shop.update({
      where: { id: shopId },
      data: { syncStatus: "IN_PROGRESS" }
    });

    try {
      await runFullSync(shopId);

      // Mark as completed
      await prisma.shop.update({
        where: { id: shopId },
        data: {
          syncStatus: "COMPLETED",
          lastSyncAt: new Date()
        }
      });

      console.log(`[Sync Trigger] Sync completed for shop ${shop.shopDomain}`);

      return NextResponse.json({
        success: true,
        message: "Sync completed",
        shopDomain: shop.shopDomain
      });
    } catch (syncError: any) {
      console.error(`[Sync Trigger] Sync failed for ${shop.shopDomain}:`, syncError);

      // Mark as failed
      await prisma.shop.update({
        where: { id: shopId },
        data: { syncStatus: "FAILED" }
      });

      throw syncError;
    }
  } catch (error: any) {
    console.error("[Sync Trigger] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
