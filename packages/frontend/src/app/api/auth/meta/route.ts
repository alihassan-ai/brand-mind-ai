import { NextResponse } from "next/server";
import { getCurrentUser, getConnectedShop } from "@brandmind/backend/auth/session";

const META_APP_ID = process.env.META_APP_ID;
const REDIRECT_URI = `${process.env.SHOPIFY_APP_URL}/api/auth/meta/callback`;

export async function GET() {
    const user = await getCurrentUser();
    const shopDomain = await getConnectedShop();

    if (!user || !shopDomain) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!META_APP_ID) {
        return NextResponse.json({ error: "Missing META_APP_ID" }, { status: 500 });
    }

    // Scopes: ads_read for insights, ads_management for campaigns
    const scopes = "ads_read,ads_management,read_insights";
    const state = shopDomain; // Use shopDomain as state (simple for now, consider signing it later)

    const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${REDIRECT_URI}&state=${state}&scope=${scopes}`;

    return NextResponse.redirect(authUrl);
}
