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
"[project]/packages/frontend/src/app/api/auth/shopify/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$shopify$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/backend/src/shopify/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$shopify$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/src/shopify/client.ts [app-route] (ecmascript)");
;
;
async function GET(req) {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get('shop');
    if (!shop) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Missing shop parameter'
        }, {
            status: 400
        });
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
        return await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$shopify$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].auth.begin({
            shop: cleanShop,
            callbackPath: '/api/auth/shopify/callback',
            isOnline: false,
            rawRequest: req,
            rawResponse: new Response()
        });
    } catch (error) {
        console.error('[Shopify OAuth] Failed to begin:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to initiate Shopify auth'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5590d9a6._.js.map