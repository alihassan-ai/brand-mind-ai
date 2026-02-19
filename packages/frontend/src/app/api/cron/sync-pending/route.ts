import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@brandmind/shared";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Vercel Cron Job: Pick up shops stuck in PENDING status
 *
 * Runs every 5 minutes to catch shops where:
 * - User closed browser before client-side sync triggered
 * - Client-side sync failed silently
 * - Network issues prevented initial trigger
 *
 * This ensures 100% sync coverage.
 */
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret (Vercel automatically adds this header)
    const authHeader = req.headers.get("authorization");

    if (!process.env.CRON_SECRET) {
      console.error("[Cron] CRON_SECRET not configured");
      return NextResponse.json(
        { error: "CRON_SECRET not configured" },
        { status: 500 }
      );
    }

    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

    if (authHeader !== expectedAuth) {
      console.error("[Cron] Unauthorized cron request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Cron] Starting sync-pending job...");

    // Find shops that have been PENDING for more than 3 minutes
    // (gives client-side trigger time to fire first)
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);

    const pendingShops = await prisma.shop.findMany({
      where: {
        syncStatus: "PENDING",
        installedAt: {
          lt: threeMinutesAgo
        }
      },
      take: 10, // Process max 10 per run (prevents overwhelming the system)
      orderBy: {
        installedAt: "asc" // Oldest first
      }
    });

    if (pendingShops.length === 0) {
      console.log("[Cron] No pending shops found");
      return NextResponse.json({
        success: true,
        message: "No pending shops",
        processed: 0
      });
    }

    console.log(`[Cron] Found ${pendingShops.length} pending shops:`,
      pendingShops.map(s => s.shopDomain)
    );

    const results = [];

    // Trigger sync for each pending shop
    for (const shop of pendingShops) {
      try {
        const appUrl = process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        console.log(`[Cron] Triggering sync for ${shop.shopDomain}...`);

        const response = await fetch(`${appUrl}/api/sync/trigger`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.INTERNAL_API_SECRET}`
          },
          body: JSON.stringify({ shopId: shop.id })
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`[Cron] ✓ Sync triggered for ${shop.shopDomain}`);
          results.push({
            shopDomain: shop.shopDomain,
            status: "triggered",
            skipped: data.skipped || false
          });
        } else {
          const error = await response.text();
          console.error(`[Cron] ✗ Failed to trigger sync for ${shop.shopDomain}:`, error);
          results.push({
            shopDomain: shop.shopDomain,
            status: "failed",
            error
          });
        }
      } catch (error: any) {
        console.error(`[Cron] ✗ Error triggering sync for ${shop.shopDomain}:`, error.message);
        results.push({
          shopDomain: shop.shopDomain,
          status: "error",
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.status === "triggered").length;

    console.log(`[Cron] Completed: ${successCount}/${pendingShops.length} syncs triggered`);

    return NextResponse.json({
      success: true,
      message: `Processed ${pendingShops.length} pending shops`,
      processed: pendingShops.length,
      triggered: successCount,
      results
    });
  } catch (error: any) {
    console.error("[Cron] Fatal error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
