module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[project]/packages/shared/src/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = /*TURBOPACK member replacement*/ __turbopack_context__.g;
const prisma = globalForPrisma.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: [
        'query',
        'error',
        'warn'
    ]
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/packages/shared/src/types/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Common types used across packages
__turbopack_context__.s([
    "DEFAULT_SCORING_WEIGHTS",
    ()=>DEFAULT_SCORING_WEIGHTS
]);
const DEFAULT_SCORING_WEIGHTS = {
    storeFit: 0.25,
    gapFill: 0.20,
    trendScore: 0.15,
    marginPotential: 0.15,
    competitionLevel: 0.10,
    seasonalAlignment: 0.15
};
}),
"[project]/packages/shared/src/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Shared exports for BrandMind AI
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/types/index.ts [app-route] (ecmascript)");
;
;
}),
"[project]/packages/backend/src/shopify/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "getShopify",
    ()=>getShopify,
    "sessionStorage",
    ()=>sessionStorage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$shopify$2d$api$2f$dist$2f$esm$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@shopify/shopify-api/dist/esm/lib/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$shopify$2d$api$2f$dist$2f$esm$2f$lib$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/shopify-api/dist/esm/lib/types.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$shopify$2d$api$2f$dist$2f$esm$2f$adapters$2f$web$2d$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/shopify-api/dist/esm/adapters/web-api/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$shopify$2d$app$2d$session$2d$storage$2d$prisma$2f$dist$2f$esm$2f$prisma$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/shopify-app-session-storage-prisma/dist/esm/prisma.mjs [app-route] (ecmascript)");
;
;
;
;
let shopifyInstance = null;
function getShopify() {
    if (shopifyInstance) return shopifyInstance;
    const apiKey = (process.env.SHOPIFY_API_KEY || '').trim();
    const apiSecretKey = (process.env.SHOPIFY_API_SECRET || '').trim();
    const appUrl = (process.env.SHOPIFY_APP_URL || '').trim();
    if (!apiKey || apiKey === 'MISSING') {
        console.error('[Shopify Client] CRITICAL: SHOPIFY_API_KEY is missing or invalid.');
    }
    shopifyInstance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$shopify$2d$api$2f$dist$2f$esm$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shopifyApi"])({
        apiKey: apiKey || 'MISSING',
        apiSecretKey: apiSecretKey || 'MISSING',
        scopes: process.env.SCOPES?.split(',') || [
            'read_products',
            'read_orders',
            'read_customers'
        ],
        hostName: appUrl.replace(/https?:\/\//, '') || 'localhost',
        apiVersion: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$shopify$2d$api$2f$dist$2f$esm$2f$lib$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiVersion"].October24,
        isEmbeddedApp: false,
        logger: {
            level: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$shopify$2d$api$2f$dist$2f$esm$2f$lib$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LogSeverity"].Info
        }
    });
    return shopifyInstance;
}
// Export a proxy as default for backward compatibility
const shopify = new Proxy({}, {
    get (_, prop) {
        return getShopify()[prop];
    }
});
const sessionStorage = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$shopify$2d$app$2d$session$2d$storage$2d$prisma$2f$dist$2f$esm$2f$prisma$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PrismaSessionStorage"](__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"]);
const __TURBOPACK__default__export__ = shopify;
}),
"[project]/packages/backend/src/shopify/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$shopify$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/src/shopify/client.ts [app-route] (ecmascript)");
;
;
}),
"[project]/packages/backend/src/auth/session.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getConnectedShop",
    ()=>getConnectedShop,
    "getCurrentShop",
    ()=>getCurrentShop,
    "getCurrentUser",
    ()=>getCurrentUser,
    "isOnboardingComplete",
    ()=>isOnboardingComplete
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-route] (ecmascript)");
;
;
async function getConnectedShop() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const cookieDomain = cookieStore.get('shopify_connected_shop')?.value;
    if (cookieDomain) return cookieDomain;
    // Fallback to user session
    const shop = await getCurrentShop();
    return shop?.shopDomain || null;
}
async function getCurrentUser() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const userId = cookieStore.get('user_session')?.value;
    if (!userId) return null;
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
        where: {
            id: userId
        },
        include: {
            shops: true
        }
    });
    return user;
}
async function getCurrentShop() {
    const user = await getCurrentUser();
    if (!user || user.shops.length === 0) return null;
    // Return the first shop (for now, single shop per user)
    return user.shops[0];
}
async function isOnboardingComplete() {
    const shop = await getCurrentShop();
    return shop?.onboardingComplete ?? false;
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/packages/backend/src/auth/crypto.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decrypt",
    ()=>decrypt,
    "encrypt",
    ()=>encrypt
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_key_at_least_32_chars_long!!'; // Use env in prod
const IV_LENGTH = 16;
function encrypt(text) {
    const iv = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(IV_LENGTH);
    const cipher = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([
        encrypted,
        cipher.final()
    ]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}
function decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([
        decrypted,
        decipher.final()
    ]);
    return decrypted.toString();
}
}),
"[project]/packages/backend/src/sync/sync-audit.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSyncLog",
    ()=>createSyncLog,
    "updateSyncLog",
    ()=>updateSyncLog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-route] (ecmascript)");
;
async function createSyncLog(shopId, resource) {
    return await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].syncEvent.create({
        data: {
            shopId,
            resource,
            status: 'running',
            startedAt: new Date()
        }
    });
}
async function updateSyncLog(logId, data) {
    return await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].syncEvent.update({
        where: {
            id: logId
        },
        data: {
            ...data,
            completedAt: new Date()
        }
    });
}
}),
"[project]/packages/backend/src/sync/shopify-sync.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runFullSync",
    ()=>runFullSync,
    "syncCustomers",
    ()=>syncCustomers,
    "syncOrders",
    ()=>syncOrders,
    "syncProducts",
    ()=>syncProducts,
    "syncRecentData",
    ()=>syncRecentData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$auth$2f$crypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/src/auth/crypto.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$sync$2d$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/src/sync/sync-audit.ts [app-route] (ecmascript)");
;
;
;
async function shopifyRequest(shop, accessToken, endpoint, params = {}) {
    const url = new URL(`https://${shop}/admin/api/2024-10/${endpoint}`);
    Object.entries(params).forEach(([k, v])=>url.searchParams.set(k, v));
    const response = await fetch(url.toString(), {
        headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Shopify API error (${response.status}): ${text}`);
    }
    return response.json();
}
async function getOrInitSyncState(shopId, resource) {
    let state = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].syncState.findUnique({
        where: {
            shopId_resource: {
                shopId,
                resource
            }
        }
    });
    if (!state) {
        state = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].syncState.create({
            data: {
                shopId,
                resource,
                lastId: '0'
            }
        });
    }
    return state;
}
async function updateSyncState(shopId, resource, lastId) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].syncState.update({
        where: {
            shopId_resource: {
                shopId,
                resource
            }
        },
        data: {
            lastId,
            lastSyncedAt: new Date()
        }
    });
}
async function syncProducts(shopId, shopDomain, accessToken) {
    console.log(`[Sync] Fetching products for ${shopDomain}`);
    // incremental sync logic
    const syncState = await getOrInitSyncState(shopId, 'products');
    let sinceId = parseInt(syncState.lastId);
    console.log(`[Sync] Resuming products from ID: ${sinceId}`);
    let totalProducts = 0;
    let maxId = sinceId;
    while(true){
        const data = await shopifyRequest(shopDomain, accessToken, 'products.json', {
            limit: '250',
            since_id: sinceId.toString()
        });
        const products = data.products || [];
        if (products.length === 0) break;
        for (const product of products){
            // Upsert product
            const dbProduct = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.upsert({
                where: {
                    shopifyId: product.id.toString()
                },
                update: {
                    title: product.title,
                    handle: product.handle,
                    vendor: product.vendor,
                    productType: product.product_type,
                    updatedAt: new Date(product.updated_at)
                },
                create: {
                    shopId,
                    shopifyId: product.id.toString(),
                    title: product.title,
                    handle: product.handle,
                    vendor: product.vendor,
                    productType: product.product_type,
                    createdAt: new Date(product.created_at),
                    updatedAt: new Date(product.updated_at)
                }
            });
            // Upsert variants
            for (const variant of product.variants){
                await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].variant.upsert({
                    where: {
                        shopifyId: variant.id.toString()
                    },
                    update: {
                        title: variant.title,
                        sku: variant.sku,
                        price: parseFloat(variant.price),
                        inventoryQuantity: variant.inventory_quantity
                    },
                    create: {
                        productId: dbProduct.id,
                        shopifyId: variant.id.toString(),
                        title: variant.title,
                        sku: variant.sku,
                        price: parseFloat(variant.price),
                        inventoryQuantity: variant.inventory_quantity
                    }
                });
            }
            if (product.id > maxId) maxId = product.id;
            sinceId = product.id;
            totalProducts++;
        }
        // Update state after each batch to be safe
        await updateSyncState(shopId, 'products', maxId.toString());
        console.log(`[Sync] Processed ${totalProducts} products...`);
    }
    console.log(`[Sync] Finished syncing ${totalProducts} products`);
    return totalProducts;
}
async function syncOrders(shopId, shopDomain, accessToken) {
    console.log(`[Sync] Fetching orders for ${shopDomain}`);
    const syncState = await getOrInitSyncState(shopId, 'orders');
    let sinceId = parseInt(syncState.lastId);
    console.log(`[Sync] Resuming orders from ID: ${sinceId}`);
    let totalOrders = 0;
    let maxId = sinceId;
    while(true){
        const params = {
            limit: '250',
            since_id: sinceId.toString(),
            status: 'any'
        };
        // If a start date is provided, we use it to filter
        if (params.created_at_min) {
        // Wait, shopify API for orders using since_id and created_at_min together can be tricky
        // Better to use created_at_min for the initial high-priority sync
        }
        const data = await shopifyRequest(shopDomain, accessToken, 'orders.json', params);
        const orders = data.orders || [];
        if (orders.length === 0) break;
        for (const order of orders){
            // Get customer ID if exists
            let customerId = null;
            if (order.customer?.id) {
                const customer = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].customer.findUnique({
                    where: {
                        shopifyId: order.customer.id.toString()
                    }
                });
                customerId = customer?.id || null;
            }
            // Upsert order with customer linking
            const dbOrder = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.upsert({
                where: {
                    shopifyId: order.id.toString()
                },
                update: {
                    customerId,
                    totalPrice: parseFloat(order.total_price),
                    subtotalPrice: parseFloat(order.subtotal_price),
                    totalTax: parseFloat(order.total_tax),
                    totalDiscounts: parseFloat(order.total_discounts),
                    financialStatus: order.financial_status || null,
                    fulfillmentStatus: order.fulfillment_status || null,
                    updatedAt: new Date(order.updated_at)
                },
                create: {
                    shopId,
                    shopifyId: order.id.toString(),
                    customerId,
                    orderNumber: order.order_number.toString(),
                    totalPrice: parseFloat(order.total_price),
                    subtotalPrice: parseFloat(order.subtotal_price),
                    totalTax: parseFloat(order.total_tax),
                    totalDiscounts: parseFloat(order.total_discounts),
                    financialStatus: order.financial_status || null,
                    fulfillmentStatus: order.fulfillment_status || null,
                    currency: order.currency,
                    createdAt: new Date(order.created_at),
                    updatedAt: new Date(order.updated_at)
                }
            });
            // Update shop currency if not set or different
            if (order.currency) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].shop.update({
                    where: {
                        id: shopId
                    },
                    data: {
                        currencyCode: order.currency
                    }
                }).catch(()=>{}); // ignore errors during catch-all sync
            }
            // Upsert line items
            for (const item of order.line_items){
                await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].orderLineItem.upsert({
                    where: {
                        shopifyId: item.id.toString()
                    },
                    update: {
                        quantity: item.quantity,
                        price: parseFloat(item.price),
                        totalDiscount: parseFloat(item.total_discount)
                    },
                    create: {
                        orderId: dbOrder.id,
                        shopifyId: item.id.toString(),
                        productId: item.product_id?.toString() || null,
                        variantId: item.variant_id?.toString() || null,
                        title: item.title,
                        quantity: item.quantity,
                        price: parseFloat(item.price),
                        totalDiscount: parseFloat(item.total_discount)
                    }
                });
            }
            // Upsert refunds
            for (const refund of order.refunds || []){
                const refundAmount = refund.transactions?.reduce((sum, t)=>sum + parseFloat(t.amount || '0'), 0) || 0;
                await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].refund.upsert({
                    where: {
                        shopifyId: refund.id.toString()
                    },
                    update: {
                        amount: refundAmount
                    },
                    create: {
                        orderId: dbOrder.id,
                        shopifyId: refund.id.toString(),
                        amount: refundAmount,
                        createdAt: new Date(refund.created_at)
                    }
                });
            }
            if (order.id > maxId) maxId = order.id;
            sinceId = order.id;
            totalOrders++;
        }
        await updateSyncState(shopId, 'orders', maxId.toString());
        console.log(`[Sync] Processed ${totalOrders} orders...`);
    }
    console.log(`[Sync] Finished syncing ${totalOrders} orders`);
    return totalOrders;
}
async function syncRecentData(shopId, shopDomain, accessToken) {
    console.log(`[Sync] Running prioritized sync (last 6 months) for ${shopDomain}`);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const dateStr = sixMonthsAgo.toISOString();
    // 1. Sync Products (always sync all products as they are typically few)
    await syncProducts(shopId, shopDomain, accessToken);
    // 2. Sync Recent Orders
    console.log(`[Sync] Fetching orders since ${dateStr}`);
    let totalOrders = 0;
    let nextPageInfo = "";
    // For recent sync, we might want to use created_at_min
    // However, shopifyRequest doesn't support Link header pagination yet in this simple implementation
    // For the beta, we'll keep it simple but add the date filter if supported by the endpoint
    // Actually, let's refine syncOrders to accept an optional startDate
    return await syncOrdersWithFilter(shopId, shopDomain, accessToken, dateStr);
}
async function syncOrdersWithFilter(shopId, shopDomain, accessToken, startDate) {
    let totalOrders = 0;
    let sinceId = 0;
    while(true){
        const params = {
            limit: '250',
            since_id: sinceId.toString(),
            status: 'any'
        };
        if (startDate) params.created_at_min = startDate;
        const data = await shopifyRequest(shopDomain, accessToken, 'orders.json', params);
        const orders = data.orders || [];
        if (orders.length === 0) break;
        for (const order of orders){
            // ... (Same order processing logic as in syncOrders)
            // To avoid duplication, I should have refactored syncOrders
            // I'll do that in a follow-up if needed, but for now I'll just reuse the core logic
            await processOrder(shopId, order);
            if (order.id > sinceId) sinceId = order.id;
            totalOrders++;
        }
        console.log(`[Sync] Processed ${totalOrders} recent orders...`);
    }
    return totalOrders;
}
// Extract order processing to a reusable function
async function processOrder(shopId, order) {
    // Get customer ID if exists
    let customerId = null;
    if (order.customer?.id) {
        const customer = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].customer.findUnique({
            where: {
                shopifyId: order.customer.id.toString()
            }
        });
        customerId = customer?.id || null;
    }
    // Upsert order
    const dbOrder = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.upsert({
        where: {
            shopifyId: order.id.toString()
        },
        update: {
            customerId,
            totalPrice: parseFloat(order.total_price),
            subtotalPrice: parseFloat(order.subtotal_price),
            totalTax: parseFloat(order.total_tax),
            totalDiscounts: parseFloat(order.total_discounts),
            financialStatus: order.financial_status || null,
            fulfillmentStatus: order.fulfillment_status || null,
            updatedAt: new Date(order.updated_at)
        },
        create: {
            shopId,
            shopifyId: order.id.toString(),
            customerId,
            orderNumber: order.order_number.toString(),
            totalPrice: parseFloat(order.total_price),
            subtotalPrice: parseFloat(order.subtotal_price),
            totalTax: parseFloat(order.total_tax),
            totalDiscounts: parseFloat(order.total_discounts),
            financialStatus: order.financial_status || null,
            fulfillmentStatus: order.fulfillment_status || null,
            currency: order.currency,
            createdAt: new Date(order.created_at),
            updatedAt: new Date(order.updated_at)
        }
    });
    // Update shop currency
    if (order.currency) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].shop.update({
            where: {
                id: shopId
            },
            data: {
                currencyCode: order.currency
            }
        }).catch(()=>{});
    }
    // Upsert line items
    for (const item of order.line_items){
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].orderLineItem.upsert({
            where: {
                shopifyId: item.id.toString()
            },
            update: {
                quantity: item.quantity,
                price: parseFloat(item.price),
                totalDiscount: parseFloat(item.total_discount)
            },
            create: {
                orderId: dbOrder.id,
                shopifyId: item.id.toString(),
                productId: item.product_id?.toString() || null,
                variantId: item.variant_id?.toString() || null,
                title: item.title,
                quantity: item.quantity,
                price: parseFloat(item.price),
                totalDiscount: parseFloat(item.total_discount)
            }
        });
    }
    // Upsert refunds
    for (const refund of order.refunds || []){
        const refundAmount = refund.transactions?.reduce((sum, t)=>sum + parseFloat(t.amount || '0'), 0) || 0;
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].refund.upsert({
            where: {
                shopifyId: refund.id.toString()
            },
            update: {
                amount: refundAmount
            },
            create: {
                orderId: dbOrder.id,
                shopifyId: refund.id.toString(),
                amount: refundAmount,
                createdAt: new Date(refund.created_at)
            }
        });
    }
}
async function syncCustomers(shopId, shopDomain, accessToken) {
    console.log(`[Sync] Fetching customers for ${shopDomain}`);
    const syncState = await getOrInitSyncState(shopId, 'customers');
    let sinceId = parseInt(syncState.lastId);
    console.log(`[Sync] Resuming customers from ID: ${sinceId}`);
    let totalCustomers = 0;
    let maxId = sinceId;
    while(true){
        const data = await shopifyRequest(shopDomain, accessToken, 'customers.json', {
            limit: '250',
            since_id: sinceId.toString()
        });
        const customers = data.customers || [];
        if (customers.length === 0) break;
        for (const customer of customers){
            await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].customer.upsert({
                where: {
                    shopifyId: customer.id.toString()
                },
                update: {
                    email: customer.email,
                    firstName: customer.first_name,
                    lastName: customer.last_name
                },
                create: {
                    shopId,
                    shopifyId: customer.id.toString(),
                    email: customer.email,
                    firstName: customer.first_name,
                    lastName: customer.last_name,
                    createdAt: new Date(customer.created_at)
                }
            });
            if (customer.id > maxId) maxId = customer.id;
            sinceId = customer.id;
            totalCustomers++;
        }
        await updateSyncState(shopId, 'customers', maxId.toString());
        console.log(`[Sync] Processed ${totalCustomers} customers...`);
    }
    console.log(`[Sync] Finished syncing ${totalCustomers} customers`);
    return totalCustomers;
}
async function runFullSync(shopId) {
    const shop = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].shop.findUnique({
        where: {
            id: shopId
        }
    });
    if (!shop) throw new Error('Shop not found');
    const accessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$auth$2f$crypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decrypt"])(shop.accessToken);
    const shopDomain = shop.shopDomain;
    console.log(`[Sync] Starting Smart Sync for ${shopDomain}`);
    const results = {
        products: 0,
        orders: 0,
        customers: 0
    };
    let logId = '';
    try {
        const log = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$sync$2d$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSyncLog"])(shopId, 'full');
        logId = log.id;
        // PHASE 1: Prioritized Sync (Last 6 Months)
        console.log(`[Sync] Phase 1: Prioritized Sync (6 Months)`);
        results.products = await syncProducts(shopId, shopDomain, accessToken);
        results.orders = await syncRecentData(shopId, shopDomain, accessToken);
        results.customers = await syncCustomers(shopId, shopDomain, accessToken);
        console.log(`[Sync] Phase 1 Complete. Triggering Phase 2 (Historical) in background...`);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$sync$2d$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateSyncLog"])(logId, {
            status: 'success',
            stats: results
        });
        // PHASE 2: Historical Sync (Background)
        (async ()=>{
            let histLogId = '';
            try {
                const histLog = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$sync$2d$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSyncLog"])(shopId, 'historical');
                histLogId = histLog.id;
                console.log(`[Sync] Phase 2: Starting historical sync for ${shopDomain}`);
                // syncOrders without startDate will fetch all remaining history using since_id
                const orders = await syncOrders(shopId, shopDomain, accessToken);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$sync$2d$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateSyncLog"])(histLogId, {
                    status: 'success',
                    stats: {
                        orders
                    }
                });
                console.log(`[Sync] Phase 2 Complete for ${shopDomain}`);
            } catch (err) {
                console.error('[Sync] Historical sync failed:', err.message);
                if (histLogId) {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$sync$2d$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateSyncLog"])(histLogId, {
                        status: 'failed',
                        error: err.message
                    });
                }
            }
        })();
    } catch (err) {
        console.error('[Sync] Smart Sync failed:', err.message);
    }
    console.log(`[Sync] Prioritized sync results:`, results);
    return results;
}
}),
"[project]/packages/frontend/src/app/api/auth/shopify/callback/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$shopify$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/backend/src/shopify/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$shopify$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/src/shopify/client.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/src/auth/session.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$auth$2f$crypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/src/auth/crypto.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$shopify$2d$sync$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/src/sync/shopify-sync.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
async function GET(req) {
    try {
        console.log('[Shopify Callback] Incoming URL:', req.url);
        console.log('[Shopify Callback] Headers Host:', req.headers.get('host'));
        console.log('[Shopify Callback] Headers X-Forwarded-Proto:', req.headers.get('x-forwarded-proto'));
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        console.log('[Shopify Callback] User found:', user ? user.id : 'NONE');
        if (!user) {
            console.error('[Shopify Callback] No user session found. Redirecting to login.');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/auth/login', req.url));
        }
        // Validate the callback
        const callbackResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$shopify$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].auth.callback({
            rawRequest: req,
            rawResponse: new Response()
        });
        const { session } = callbackResponse;
        if (!session || !session.accessToken) {
            throw new Error('Failed to retrieve session from Shopify');
        }
        // Save session to storage (optional but good practice for Shopify API)
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$shopify$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessionStorage"].storeSession(session);
        const shopDomain = session.shop;
        const accessToken = session.accessToken;
        // Check if shop is already connected to ANOTHER user
        const existingShop = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].shop.findUnique({
            where: {
                shopDomain
            }
        });
        if (existingShop && existingShop.userId && existingShop.userId !== user.id) {
            console.error(`[Shopify OAuth Callback] Shop ${shopDomain} already connected to another user ${existingShop.userId}`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/onboarding?error=shop_already_connected', req.url));
        }
        // Save or update shop in our DB
        const shop = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].shop.upsert({
            where: {
                shopDomain
            },
            update: {
                accessToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$auth$2f$crypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encrypt"])(accessToken),
                userId: user.id
            },
            create: {
                shopDomain,
                accessToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$auth$2f$crypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encrypt"])(accessToken),
                userId: user.id
            }
        });
        // Set cookie for reference
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        cookieStore.set("shopify_connected_shop", shopDomain, {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60,
            path: "/"
        });
        // Trigger background sync (Phase 1: 6 months, Phase 2: everything else)
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$shopify$2d$sync$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runFullSync"])(shop.id).catch((err)=>{
            console.error('[Shopify OAuth Callback] Sync failed to start:', err);
        });
        // Redirect to a page that starts the sync and shows progress
        // Use SHOPIFY_APP_URL if available to ensure we stay on the correct domain (ngrok)
        const baseUrl = process.env.SHOPIFY_APP_URL || '';
        const redirectUrl = new URL(`${baseUrl}/onboarding`);
        redirectUrl.searchParams.set('shop', shopDomain);
        redirectUrl.searchParams.set('mode', 'oauth_complete');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(redirectUrl);
    } catch (error) {
        console.error('[Shopify OAuth Callback] Error:', error);
        // Redirect to onboarding with error
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/onboarding?error=oauth_failed', req.url));
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a60ec730._.js.map