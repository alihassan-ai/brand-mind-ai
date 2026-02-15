import { NextResponse } from "next/server";
import { getConnectedShop } from "@brandmind/backend/auth/session";
import { runFullSync } from "@brandmind/backend/sync/shopify-sync";

export async function POST() {
  try {
    const shopDomain = await getConnectedShop();

    if (!shopDomain) {
      return NextResponse.json({ error: "No shop connected" }, { status: 401 });
    }

    await runFullSync(shopDomain);

    return NextResponse.json({ success: true, message: "Sync completed" });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
