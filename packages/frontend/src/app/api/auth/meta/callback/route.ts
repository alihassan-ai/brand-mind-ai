import { NextResponse } from "next/server";
import { getCurrentUser, getConnectedShop } from "@brandmind/backend/auth/session";
import { prisma } from "@brandmind/shared";
import { encrypt } from "@brandmind/backend/auth/crypto";

const META_APP_ID = process.env.META_APP_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;
const REDIRECT_URI = `${process.env.SHOPIFY_APP_URL}/api/auth/meta/callback`;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
        return NextResponse.redirect(new URL("/growth-engine?error=" + error, request.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL("/growth-engine?error=no_code", request.url));
    }

    const user = await getCurrentUser();
    const shopDomain = await getConnectedShop();

    if (!user || !shopDomain) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const shop = await prisma.shop.findUnique({ where: { shopDomain } });
    if (!shop) {
        return NextResponse.redirect(new URL("/growth-engine?error=no_shop", request.url));
    }

    try {
        // 1. Exchange code for short-lived token
        const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${META_APP_ID}&redirect_uri=${REDIRECT_URI}&client_secret=${META_APP_SECRET}&code=${code}`;
        const tokenRes = await fetch(tokenUrl);
        const tokenData = await tokenRes.json();

        if (tokenData.error) {
            throw new Error(tokenData.error.message);
        }

        const shortLivedToken = tokenData.access_token;

        // 2. Exchange short-lived token for long-lived token
        const longLivedUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${META_APP_ID}&client_secret=${META_APP_SECRET}&fb_exchange_token=${shortLivedToken}`;
        const longLivedRes = await fetch(longLivedUrl);
        const longLivedData = await longLivedRes.json();

        if (longLivedData.error) {
            throw new Error(longLivedData.error.message);
        }

        const longLivedToken = longLivedData.access_token;

        // 3. Get Ad Account ID (First available or let user choose later. For MVP, fetch first business ad account)
        // We'll fetch the user's ad accounts
        const accountsUrl = `https://graph.facebook.com/v19.0/me/adaccounts?access_token=${longLivedToken}&fields=name,account_id,currency,timezone_name`;
        const accountsRes = await fetch(accountsUrl);
        const accountsData = await accountsRes.json();

        if (!accountsData.data || accountsData.data.length === 0) {
            // Token valid but no ad account. Store token but mark status as 'no_account'
            await prisma.metaAccount.upsert({
                where: { shopId: shop.id },
                update: {
                    accessToken: encrypt(longLivedToken),
                    status: "no_ad_account",
                    adAccountId: "pending",
                },
                create: {
                    shopId: shop.id,
                    accessToken: encrypt(longLivedToken),
                    status: "no_ad_account",
                    adAccountId: "pending"
                }
            });
            return NextResponse.redirect(new URL("/growth-engine?warning=no_ad_account", request.url));
        }

        // Default to first account for MVP
        const firstAccount = accountsData.data[0];

        // 4. Save to DB
        await prisma.metaAccount.upsert({
            where: { shopId: shop.id },
            update: {
                accessToken: encrypt(longLivedToken),
                adAccountId: firstAccount.account_id, // e.g. "act_123456" => API usually returns "act_..." or just number. 
                // Facebook API /me/adaccounts usually returns "act_123" in id, or just 123 in account_id.
                // Let's verify format. The graph Explorer confirms 'account_id' is just digits. 'id' is 'act_digits'.
                // We'll store what we need. For SDK usage, 'act_' is often implicit or required.
                // Let's store account_id (digits) and prepend act_ when calling if needed, or store "act_" + id.
                // Safe bet: store "act_" + account_id (if not present) 
                status: "active",
                lastSyncedAt: new Date()
            },
            create: {
                shopId: shop.id,
                accessToken: encrypt(longLivedToken),
                adAccountId: firstAccount.account_id,
                status: "active",
                lastSyncedAt: new Date()
            }
        });

        return NextResponse.redirect(new URL("/growth-engine?success=meta_connected", request.url));

    } catch (err: any) {
        console.error("Meta Auth Error:", err);
        return NextResponse.redirect(new URL("/growth-engine?error=auth_failed", request.url));
    }
}
