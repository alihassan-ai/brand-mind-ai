import { shopifyApi, ApiVersion, LogSeverity, Shopify } from '@shopify/shopify-api';
import '@shopify/shopify-api/adapters/web-api';
import { prisma } from '@brandmind/shared';
import { PrismaSessionStorage } from '@shopify/shopify-app-session-storage-prisma';

let shopifyInstance: Shopify | null = null;

export function getShopify(): Shopify {
    if (shopifyInstance) return shopifyInstance;

    const apiKey = (process.env.SHOPIFY_API_KEY || '').trim();
    const apiSecretKey = (process.env.SHOPIFY_API_SECRET || '').trim();
    const appUrl = (process.env.SHOPIFY_APP_URL || '').trim();

    if (!apiKey || apiKey === 'MISSING') {
        console.error('[Shopify Client] CRITICAL: SHOPIFY_API_KEY is missing or invalid.');
    }

    shopifyInstance = shopifyApi({
        apiKey: apiKey || 'MISSING',
        apiSecretKey: apiSecretKey || 'MISSING',
        scopes: process.env.SCOPES?.split(',') || ['read_products', 'read_orders', 'read_customers'],
        hostName: appUrl.replace(/https?:\/\//, '') || 'localhost',
        apiVersion: ApiVersion.October24,
        isEmbeddedApp: false,
        logger: {
            level: LogSeverity.Info,
        },
    });

    return shopifyInstance;
}

// Export a proxy as default for backward compatibility
const shopify = new Proxy({} as Shopify, {
    get(_, prop) {
        return (getShopify() as any)[prop];
    }
});

export const sessionStorage = new PrismaSessionStorage(prisma);

export default shopify;
