import { NextRequest, NextResponse } from 'next/server';
import shopify from '@brandmind/backend/shopify';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get('shop');

    if (!shop) {
        return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 });
    }

    console.log('[Shopify OAuth Debug] process.env.SHOPIFY_API_KEY:', process.env.SHOPIFY_API_KEY ? 'FOUND' : 'MISSING');
    console.log('[Shopify OAuth Debug] process.env.SHOPIFY_APP_URL:', process.env.SHOPIFY_APP_URL);

    // Normalize shop domain
    let cleanShop = shop.toLowerCase().trim();
    if (!cleanShop.includes('.myshopify.com')) {
        cleanShop = `${cleanShop}.myshopify.com`;
    }

    try {
        // Begin OAuth flow
        // Note: shopify.auth.begin returns a response that sets a cookie and redirects
        return await shopify.auth.begin({
            shop: cleanShop,
            callbackPath: '/api/auth/shopify/callback',
            isOnline: false,
            rawRequest: req,
            rawResponse: new Response(), // This is a dummy as we'll construct our own redirect
        });
    } catch (error: any) {
        console.error('[Shopify OAuth] Failed to begin:', error);
        return NextResponse.json({ error: 'Failed to initiate Shopify auth' }, { status: 500 });
    }
}
