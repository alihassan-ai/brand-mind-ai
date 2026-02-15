import { NextRequest, NextResponse } from 'next/server';
import shopify, { sessionStorage } from '@brandmind/backend/shopify';
import { prisma } from '@brandmind/shared';
import { getCurrentUser } from '@brandmind/backend/auth/session';
import { encrypt } from '@brandmind/backend/auth/crypto';
import { cookies } from 'next/headers';
import { runFullSync } from '@brandmind/backend/sync/shopify-sync';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        console.log('[Shopify Callback] Incoming URL:', req.url);
        console.log('[Shopify Callback] Headers Host:', req.headers.get('host'));
        console.log('[Shopify Callback] Headers X-Forwarded-Proto:', req.headers.get('x-forwarded-proto'));

        const user = await getCurrentUser();
        console.log('[Shopify Callback] User found:', user ? user.id : 'NONE');

        if (!user) {
            console.error('[Shopify Callback] No user session found. Redirecting to login.');
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }

        // Validate the callback
        const callbackResponse = await shopify.auth.callback({
            rawRequest: req,
            rawResponse: new Response(),
        });

        const { session } = callbackResponse;
        if (!session || !session.accessToken) {
            throw new Error('Failed to retrieve session from Shopify');
        }

        // Save session to storage (optional but good practice for Shopify API)
        await sessionStorage.storeSession(session);

        const shopDomain = session.shop;
        const accessToken = session.accessToken;

        // Check if shop is already connected to ANOTHER user
        const existingShop = await prisma.shop.findUnique({ where: { shopDomain } });
        if (existingShop && existingShop.userId && existingShop.userId !== user.id) {
            console.error(`[Shopify OAuth Callback] Shop ${shopDomain} already connected to another user ${existingShop.userId}`);
            return NextResponse.redirect(new URL('/onboarding?error=shop_already_connected', req.url));
        }

        // Save or update shop in our DB
        const shop = await prisma.shop.upsert({
            where: { shopDomain },
            update: {
                accessToken: encrypt(accessToken),
                userId: user.id,
            },
            create: {
                shopDomain,
                accessToken: encrypt(accessToken),
                userId: user.id,
            },
        });

        // Set cookie for reference
        const cookieStore = await cookies();
        cookieStore.set("shopify_connected_shop", shopDomain, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: "/",
        });

        // Trigger background sync (Phase 1: 6 months, Phase 2: everything else)
        runFullSync(shop.id).catch(err => {
            console.error('[Shopify OAuth Callback] Sync failed to start:', err);
        });

        // Redirect to a page that starts the sync and shows progress
        // Use SHOPIFY_APP_URL if available to ensure we stay on the correct domain (ngrok)
        const baseUrl = process.env.SHOPIFY_APP_URL || '';
        const redirectUrl = new URL(`${baseUrl}/onboarding`);
        redirectUrl.searchParams.set('shop', shopDomain);
        redirectUrl.searchParams.set('mode', 'oauth_complete');

        return NextResponse.redirect(redirectUrl);
    } catch (error: any) {
        console.error('[Shopify OAuth Callback] Error:', error);
        // Redirect to onboarding with error
        return NextResponse.redirect(new URL('/onboarding?error=oauth_failed', req.url));
    }
}
