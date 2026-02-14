module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/packages/frontend/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/packages/frontend/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/packages/frontend/src/app/(app)/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/packages/frontend/src/app/(app)/layout.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/packages/backend/src/auth/crypto.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/packages/backend/src/sync/sync-audit.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSyncLog",
    ()=>createSyncLog,
    "updateSyncLog",
    ()=>updateSyncLog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
;
async function createSyncLog(shopId, resource) {
    return await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].syncEvent.create({
        data: {
            shopId,
            resource,
            status: 'running',
            startedAt: new Date()
        }
    });
}
async function updateSyncLog(logId, data) {
    return await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].syncEvent.update({
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
"[project]/packages/backend/src/sync/shopify-sync.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$auth$2f$crypto$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/src/auth/crypto.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$sync$2d$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/src/sync/sync-audit.ts [app-rsc] (ecmascript)");
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
    let state = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].syncState.findUnique({
        where: {
            shopId_resource: {
                shopId,
                resource
            }
        }
    });
    if (!state) {
        state = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].syncState.create({
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
    await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].syncState.update({
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
            const dbProduct = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.upsert({
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
                await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].variant.upsert({
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
                const customer = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].customer.findUnique({
                    where: {
                        shopifyId: order.customer.id.toString()
                    }
                });
                customerId = customer?.id || null;
            }
            // Upsert order with customer linking
            const dbOrder = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].order.upsert({
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
                await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].shop.update({
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
                await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].orderLineItem.upsert({
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
                await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].refund.upsert({
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
        const customer = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].customer.findUnique({
            where: {
                shopifyId: order.customer.id.toString()
            }
        });
        customerId = customer?.id || null;
    }
    // Upsert order
    const dbOrder = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].order.upsert({
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
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].shop.update({
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
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].orderLineItem.upsert({
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
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].refund.upsert({
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
            await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].customer.upsert({
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
    const shop = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].shop.findUnique({
        where: {
            id: shopId
        }
    });
    if (!shop) throw new Error('Shop not found');
    const accessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$auth$2f$crypto$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decrypt"])(shop.accessToken);
    const shopDomain = shop.shopDomain;
    console.log(`[Sync] Starting Smart Sync for ${shopDomain}`);
    const results = {
        products: 0,
        orders: 0,
        customers: 0
    };
    let logId = '';
    try {
        const log = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$sync$2d$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createSyncLog"])(shopId, 'full');
        logId = log.id;
        // PHASE 1: Prioritized Sync (Last 6 Months)
        console.log(`[Sync] Phase 1: Prioritized Sync (6 Months)`);
        results.products = await syncProducts(shopId, shopDomain, accessToken);
        results.orders = await syncRecentData(shopId, shopDomain, accessToken);
        results.customers = await syncCustomers(shopId, shopDomain, accessToken);
        console.log(`[Sync] Phase 1 Complete. Triggering Phase 2 (Historical) in background...`);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$sync$2d$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateSyncLog"])(logId, {
            status: 'success',
            stats: results
        });
        // PHASE 2: Historical Sync (Background)
        (async ()=>{
            let histLogId = '';
            try {
                const histLog = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$sync$2d$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createSyncLog"])(shopId, 'historical');
                histLogId = histLog.id;
                console.log(`[Sync] Phase 2: Starting historical sync for ${shopDomain}`);
                // syncOrders without startDate will fetch all remaining history using since_id
                const orders = await syncOrders(shopId, shopDomain, accessToken);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$sync$2d$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateSyncLog"])(histLogId, {
                    status: 'success',
                    stats: {
                        orders
                    }
                });
                console.log(`[Sync] Phase 2 Complete for ${shopDomain}`);
            } catch (err) {
                console.error('[Sync] Historical sync failed:', err.message);
                if (histLogId) {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$sync$2d$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateSyncLog"])(histLogId, {
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
"[project]/packages/brain/src/intelligence/store-dna.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyzePriceBands",
    ()=>analyzePriceBands,
    "analyzeProductTypePerformance",
    ()=>analyzeProductTypePerformance,
    "analyzeSeasonality",
    ()=>analyzeSeasonality,
    "analyzeVendorPerformance",
    ()=>analyzeVendorPerformance,
    "calculateProductVelocities",
    ()=>calculateProductVelocities,
    "computeStoreDNA",
    ()=>computeStoreDNA,
    "findEntryProducts",
    ()=>findEntryProducts
]);
/**
 * Store DNA Extractor
 * Analyzes store data to extract patterns, preferences, and intelligence
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
;
// ============================================
// HELPER FUNCTIONS
// ============================================
function toNumber(val) {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;
    return Number(val);
}
function getPriceBandLabel(price) {
    if (price < 25) return '0-25 (Budget)';
    if (price < 50) return '25-50 (Mid)';
    if (price < 100) return '50-100 (Premium)';
    if (price < 200) return '100-200 (Luxury)';
    return '200+ (Ultra)';
}
function getPriceBandBounds(band) {
    const bounds = {
        '0-25 (Budget)': {
            min: 0,
            max: 25
        },
        '25-50 (Mid)': {
            min: 25,
            max: 50
        },
        '50-100 (Premium)': {
            min: 50,
            max: 100
        },
        '100-200 (Luxury)': {
            min: 100,
            max: 200
        },
        '200+ (Ultra)': {
            min: 200,
            max: Infinity
        }
    };
    return bounds[band] || {
        min: 0,
        max: 0
    };
}
async function calculateProductVelocities(shopId) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    // Get all products with their sales data
    const products = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
        where: {
            shopId
        },
        select: {
            id: true,
            shopifyId: true,
            title: true,
            createdAt: true
        }
    });
    const velocities = [];
    for (const product of products){
        // Total units sold (all time)
        const totalSales = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].orderLineItem.aggregate({
            where: {
                productId: product.shopifyId,
                order: {
                    shopId
                }
            },
            _sum: {
                quantity: true
            }
        });
        // Sales in last 30 days
        const sales30d = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].orderLineItem.aggregate({
            where: {
                productId: product.shopifyId,
                order: {
                    shopId,
                    createdAt: {
                        gte: thirtyDaysAgo
                    }
                }
            },
            _sum: {
                quantity: true
            }
        });
        // Sales 30-60 days ago
        const sales60d = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].orderLineItem.aggregate({
            where: {
                productId: product.shopifyId,
                order: {
                    shopId,
                    createdAt: {
                        gte: sixtyDaysAgo,
                        lt: thirtyDaysAgo
                    }
                }
            },
            _sum: {
                quantity: true
            }
        });
        const totalUnitsSold = totalSales._sum.quantity || 0;
        const daysSinceCreated = Math.max(1, Math.floor((now.getTime() - product.createdAt.getTime()) / (24 * 60 * 60 * 1000)));
        const velocity = totalUnitsSold / daysSinceCreated;
        const velocity30d = (sales30d._sum.quantity || 0) / 30;
        const velocity60d = (sales60d._sum.quantity || 0) / 30;
        const acceleration = velocity30d - velocity60d;
        // Determine lifecycle stage
        let lifecycleStage;
        if (velocity < 0.01) {
            lifecycleStage = 'dead';
        } else if (acceleration > 0.05) {
            lifecycleStage = 'rising';
        } else if (acceleration < -0.05) {
            lifecycleStage = 'declining';
        } else {
            lifecycleStage = 'peak';
        }
        velocities.push({
            productId: product.id,
            title: product.title,
            velocity: Math.round(velocity * 100) / 100,
            acceleration: Math.round(acceleration * 100) / 100,
            lifecycleStage,
            daysSinceCreated,
            totalUnitsSold
        });
    }
    return velocities.sort((a, b)=>b.velocity - a.velocity);
}
async function analyzePriceBands(shopId) {
    // Get all line items with their prices
    const lineItems = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].orderLineItem.findMany({
        where: {
            order: {
                shopId
            }
        },
        select: {
            price: true,
            quantity: true,
            orderId: true
        }
    });
    // Get refunds by order
    const refunds = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].refund.findMany({
        where: {
            order: {
                shopId
            }
        },
        select: {
            orderId: true,
            amount: true
        }
    });
    const refundedOrders = new Set(refunds.map((r)=>r.orderId));
    // Group by price band
    const bandData = {};
    const bandLabels = [
        '0-25 (Budget)',
        '25-50 (Mid)',
        '50-100 (Premium)',
        '100-200 (Luxury)',
        '200+ (Ultra)'
    ];
    bandLabels.forEach((b)=>bandData[b] = {
            revenue: 0,
            orders: new Set(),
            refunds: 0,
            prices: []
        });
    for (const item of lineItems){
        const price = toNumber(item.price);
        const band = getPriceBandLabel(price);
        bandData[band].revenue += price * item.quantity;
        bandData[band].orders.add(item.orderId);
        bandData[band].prices.push(price);
        if (refundedOrders.has(item.orderId)) {
            bandData[band].refunds++;
        }
    }
    // Get product counts per band
    const variants = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].variant.findMany({
        where: {
            product: {
                shopId
            }
        },
        select: {
            price: true
        }
    });
    const productCountByBand = {};
    bandLabels.forEach((b)=>productCountByBand[b] = 0);
    for (const v of variants){
        const band = getPriceBandLabel(toNumber(v.price));
        productCountByBand[band]++;
    }
    // Build price bands array
    const priceBands = bandLabels.map((band)=>{
        const data = bandData[band];
        const bounds = getPriceBandBounds(band);
        const orderCount = data.orders.size;
        return {
            band,
            min: bounds.min,
            max: bounds.max === Infinity ? 1000 : bounds.max,
            revenue: Math.round(data.revenue * 100) / 100,
            orders: orderCount,
            products: productCountByBand[band],
            avgPrice: data.prices.length > 0 ? Math.round(data.prices.reduce((a, b)=>a + b, 0) / data.prices.length * 100) / 100 : 0,
            refundRate: orderCount > 0 ? Math.round(data.refunds / orderCount * 10000) / 100 : 0
        };
    });
    // Find sweet spot: highest (revenue × velocity) / (1 + refundRate)
    const sweetSpot = priceBands.reduce((best, current)=>{
        const currentScore = current.revenue * current.orders / (1 + current.refundRate / 100);
        const bestScore = best.revenue * best.orders / (1 + best.refundRate / 100);
        return currentScore > bestScore ? current : best;
    }, priceBands[0]).band;
    return {
        priceBands,
        sweetSpot
    };
}
async function analyzeProductTypePerformance(shopId) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    // Get products with their types
    const products = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
        where: {
            shopId
        },
        select: {
            shopifyId: true,
            productType: true
        }
    });
    const productTypeMap = new Map(products.map((p)=>[
            p.shopifyId,
            p.productType || 'Uncategorized'
        ]));
    // Get sales data by product
    const lineItems = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].orderLineItem.findMany({
        where: {
            order: {
                shopId
            }
        },
        include: {
            order: {
                select: {
                    createdAt: true
                }
            }
        }
    });
    // Aggregate by product type
    const typeData = {};
    for (const item of lineItems){
        const productType = productTypeMap.get(item.productId || '') || 'Uncategorized';
        if (!typeData[productType]) {
            typeData[productType] = {
                revenue: 0,
                revenue30d: 0,
                revenue60d: 0,
                orders: new Set()
            };
        }
        const revenue = toNumber(item.price) * item.quantity;
        typeData[productType].revenue += revenue;
        typeData[productType].orders.add(item.orderId);
        const orderDate = item.order.createdAt;
        if (orderDate >= thirtyDaysAgo) {
            typeData[productType].revenue30d += revenue;
        } else if (orderDate >= sixtyDaysAgo) {
            typeData[productType].revenue60d += revenue;
        }
    }
    const totalRevenue = Object.values(typeData).reduce((sum, d)=>sum + d.revenue, 0);
    const performances = Object.entries(typeData).map(([type, data])=>{
        const growthRate = data.revenue60d > 0 ? (data.revenue30d - data.revenue60d) / data.revenue60d * 100 : 0;
        return {
            type,
            revenue: Math.round(data.revenue * 100) / 100,
            revenueShare: totalRevenue > 0 ? Math.round(data.revenue / totalRevenue * 10000) / 100 : 0,
            orderCount: data.orders.size,
            growthRate: Math.round(growthRate * 100) / 100,
            avgOrderValue: data.orders.size > 0 ? Math.round(data.revenue / data.orders.size * 100) / 100 : 0
        };
    });
    return performances.sort((a, b)=>b.revenue - a.revenue);
}
async function analyzeVendorPerformance(shopId) {
    // Get products with vendors
    const products = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
        where: {
            shopId
        },
        select: {
            shopifyId: true,
            vendor: true
        }
    });
    const vendorMap = new Map(products.map((p)=>[
            p.shopifyId,
            p.vendor || 'Unknown'
        ]));
    // Get sales data
    const lineItems = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].orderLineItem.findMany({
        where: {
            order: {
                shopId
            }
        },
        select: {
            productId: true,
            price: true,
            quantity: true,
            orderId: true
        }
    });
    // Get refunds
    const refunds = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].refund.findMany({
        where: {
            order: {
                shopId
            }
        },
        select: {
            orderId: true
        }
    });
    const refundedOrders = new Set(refunds.map((r)=>r.orderId));
    // Aggregate by vendor
    const vendorData = {};
    for (const item of lineItems){
        const vendor = vendorMap.get(item.productId || '') || 'Unknown';
        if (!vendorData[vendor]) {
            vendorData[vendor] = {
                revenue: 0,
                orders: new Set(),
                refunds: 0
            };
        }
        vendorData[vendor].revenue += toNumber(item.price) * item.quantity;
        vendorData[vendor].orders.add(item.orderId);
        if (refundedOrders.has(item.orderId)) {
            vendorData[vendor].refunds++;
        }
    }
    const totalRevenue = Object.values(vendorData).reduce((sum, d)=>sum + d.revenue, 0);
    // Count products per vendor
    const vendorProductCount = {};
    for (const p of products){
        const v = p.vendor || 'Unknown';
        vendorProductCount[v] = (vendorProductCount[v] || 0) + 1;
    }
    const vendors = Object.entries(vendorData).map(([vendor, data])=>({
            vendor,
            revenue: Math.round(data.revenue * 100) / 100,
            revenueShare: totalRevenue > 0 ? Math.round(data.revenue / totalRevenue * 10000) / 100 : 0,
            refundRate: data.orders.size > 0 ? Math.round(data.refunds / data.orders.size * 10000) / 100 : 0,
            productCount: vendorProductCount[vendor] || 0
        }));
    // Calculate HHI (Herfindahl-Hirschman Index)
    // HHI = Σ(market_share²), ranges from 0 (perfect competition) to 1 (monopoly)
    const hhi = vendors.reduce((sum, v)=>{
        const share = v.revenueShare / 100;
        return sum + share * share;
    }, 0);
    return {
        vendors: vendors.sort((a, b)=>b.revenue - a.revenue),
        concentrationHHI: Math.round(hhi * 10000) / 10000
    };
}
async function analyzeSeasonality(shopId) {
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    // Get orders with dates
    const orders = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].order.findMany({
        where: {
            shopId
        },
        select: {
            createdAt: true,
            totalPrice: true
        }
    });
    // Aggregate by month
    const monthlyData = {};
    for(let i = 0; i < 12; i++){
        monthlyData[i] = {
            revenue: 0,
            count: 0
        };
    }
    for (const order of orders){
        const month = order.createdAt.getMonth();
        monthlyData[month].revenue += toNumber(order.totalPrice);
        monthlyData[month].count++;
    }
    const avgMonthlyRevenue = Object.values(monthlyData).reduce((sum, d)=>sum + d.revenue, 0) / 12;
    const seasonality = Object.entries(monthlyData).map(([month, data])=>({
            month: parseInt(month),
            monthName: monthNames[parseInt(month)],
            revenue: Math.round(data.revenue * 100) / 100,
            revenueIndex: avgMonthlyRevenue > 0 ? Math.round(data.revenue / avgMonthlyRevenue * 100) / 100 : 0,
            orderCount: data.count
        }));
    return seasonality;
}
async function findEntryProducts(shopId) {
    // Get all line items to analyze popular products
    const lineItems = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].orderLineItem.findMany({
        where: {
            order: {
                shopId
            }
        },
        select: {
            title: true
        }
    });
    // Count occurrences
    const productCounts = {};
    for (const item of lineItems){
        productCounts[item.title] = (productCounts[item.title] || 0) + 1;
    }
    const total = lineItems.length;
    return Object.entries(productCounts).map(([title, count])=>({
            title,
            count,
            share: total > 0 ? Math.round(count / total * 10000) / 100 : 0
        })).sort((a, b)=>b.count - a.count).slice(0, 10);
}
async function computeStoreDNA(shopId) {
    console.log(`[StoreDNA] Computing DNA for shop: ${shopId}`);
    // Run all calculators
    const [velocities, priceAnalysis, typePerformance, vendorAnalysis, seasonality, entryProducts] = await Promise.all([
        calculateProductVelocities(shopId),
        analyzePriceBands(shopId),
        analyzeProductTypePerformance(shopId),
        analyzeVendorPerformance(shopId),
        analyzeSeasonality(shopId),
        findEntryProducts(shopId)
    ]);
    // Load basket affinities from PatternMemory (cross_purchase pattern)
    const crossPurchasePattern = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].patternMemory.findUnique({
        where: {
            shopId_patternType: {
                shopId,
                patternType: 'cross_purchase'
            }
        }
    });
    const basketAffinities = [];
    if (crossPurchasePattern) {
        const patternData = crossPurchasePattern.patternData;
        const topPairs = patternData?.topPairs || [];
        for (const pair of topPairs){
            basketAffinities.push({
                product1: pair.products[0],
                product2: pair.products[1],
                cooccurrence: pair.count,
                lift: Math.min(3, pair.count / 5)
            });
        }
    }
    // Categorize products by lifecycle
    const rising = velocities.filter((v)=>v.lifecycleStage === 'rising');
    const peak = velocities.filter((v)=>v.lifecycleStage === 'peak');
    const declining = velocities.filter((v)=>v.lifecycleStage === 'declining');
    const dead = velocities.filter((v)=>v.lifecycleStage === 'dead');
    // Calculate health scores
    const catalogHealthScore = Math.min(100, Math.round((rising.length * 2 + peak.length * 1.5 - declining.length * 0.5 - dead.length) / Math.max(1, velocities.length) * 50 + 50));
    const customerHealthScore = Math.min(100, Math.round((entryProducts.length > 3 ? 30 : entryProducts.length * 10) + (vendorAnalysis.concentrationHHI < 0.25 ? 30 : 15) + 40 // Base score
    ));
    // Upsert to database
    const storeDNA = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].storeDNA.upsert({
        where: {
            shopId
        },
        update: {
            priceSweetSpot: {
                sweetSpot: priceAnalysis.sweetSpot
            },
            priceBands: priceAnalysis.priceBands,
            topPerformingTypes: typePerformance.slice(0, 5),
            growingTypes: typePerformance.filter((t)=>t.growthRate > 10),
            decliningTypes: typePerformance.filter((t)=>t.growthRate < -10),
            productLifecycles: velocities.slice(0, 50).map((v)=>({
                    productId: v.productId,
                    stage: v.lifecycleStage,
                    velocity: v.velocity,
                    acceleration: v.acceleration
                })),
            customerSegments: [],
            basketAffinities: basketAffinities,
            entryProducts: entryProducts,
            upgradePaths: [],
            vendorPerformance: vendorAnalysis.vendors.slice(0, 10),
            vendorConcentration: vendorAnalysis.concentrationHHI,
            seasonalityCurve: seasonality,
            catalogHealthScore,
            customerHealthScore,
            computedAt: new Date()
        },
        create: {
            shopId,
            priceSweetSpot: {
                sweetSpot: priceAnalysis.sweetSpot
            },
            priceBands: priceAnalysis.priceBands,
            topPerformingTypes: typePerformance.slice(0, 5),
            growingTypes: typePerformance.filter((t)=>t.growthRate > 10),
            decliningTypes: typePerformance.filter((t)=>t.growthRate < -10),
            productLifecycles: velocities.slice(0, 50).map((v)=>({
                    productId: v.productId,
                    stage: v.lifecycleStage,
                    velocity: v.velocity,
                    acceleration: v.acceleration
                })),
            customerSegments: [],
            basketAffinities: basketAffinities,
            entryProducts: entryProducts,
            upgradePaths: [],
            vendorPerformance: vendorAnalysis.vendors.slice(0, 10),
            vendorConcentration: vendorAnalysis.concentrationHHI,
            seasonalityCurve: seasonality,
            catalogHealthScore,
            customerHealthScore
        }
    });
    console.log(`[StoreDNA] Computation complete. Catalog Health: ${catalogHealthScore}, Customer Health: ${customerHealthScore}, Basket Affinities: ${basketAffinities.length}`);
    return storeDNA;
}
}),
"[project]/packages/brain/src/intelligence/gap-detector.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "detectAllGaps",
    ()=>detectAllGaps,
    "detectCategoryGaps",
    ()=>detectCategoryGaps,
    "detectPriceGaps",
    ()=>detectPriceGaps,
    "detectSeasonalGaps",
    ()=>detectSeasonalGaps,
    "detectVariantGaps",
    ()=>detectVariantGaps
]);
/**
 * Gap Detection Engine
 * Identifies opportunities in the store's catalog
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
;
// ============================================
// HELPERS
// ============================================
function toNumber(val) {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;
    return Number(val);
}
async function detectPriceGaps(shopId) {
    const gaps = [];
    // Get variants with prices
    const variants = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].variant.findMany({
        where: {
            product: {
                shopId
            }
        },
        select: {
            price: true
        }
    });
    // Get sales by price bands
    const lineItems = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].orderLineItem.findMany({
        where: {
            order: {
                shopId
            }
        },
        select: {
            price: true,
            quantity: true
        }
    });
    // Define price bands (clean, unformatted)
    const bands = [
        {
            name: '0-25',
            min: 0,
            max: 25,
            label: 'Budget'
        },
        {
            name: '25-50',
            min: 25,
            max: 50,
            label: 'Mid'
        },
        {
            name: '50-75',
            min: 50,
            max: 75,
            label: 'Standard'
        },
        {
            name: '75-100',
            min: 75,
            max: 100,
            label: 'Premium'
        },
        {
            name: '100-150',
            min: 100,
            max: 150,
            label: 'Elite'
        },
        {
            name: '150-200',
            min: 150,
            max: 200,
            label: 'Luxury'
        },
        {
            name: '200+',
            min: 200,
            max: Infinity,
            label: 'Ultra'
        }
    ];
    // Count products and sales per band
    const bandData = bands.map((band)=>{
        const productCount = variants.filter((v)=>{
            const price = toNumber(v.price);
            return price >= band.min && price < band.max;
        }).length;
        const sales = lineItems.filter((li)=>{
            const price = toNumber(li.price);
            return price >= band.min && price < band.max;
        }).reduce((sum, li)=>sum + li.quantity, 0);
        return {
            ...band,
            productCount,
            sales
        };
    });
    // Detect gaps (low product count but adjacent bands have high sales)
    for(let i = 0; i < bandData.length; i++){
        const current = bandData[i];
        const prev = bandData[i - 1];
        const next = bandData[i + 1];
        const adjacentSales = (prev?.sales || 0) + (next?.sales || 0);
        if (current.productCount < 5 && adjacentSales > 50) {
            const gapScore = Math.min(1, adjacentSales / 100 * (1 - current.productCount / 10));
            if (gapScore > 0.3) {
                const avgAdjacentRevenue = adjacentSales * ((current.min + (current.max === Infinity ? current.min * 1.5 : current.max)) / 2);
                gaps.push({
                    gapType: 'price_gap',
                    gapScore: Math.round(gapScore * 100) / 100,
                    gapData: {
                        band: current.name,
                        priceRange: {
                            min: current.min,
                            max: current.max === Infinity ? 500 : current.max
                        },
                        currentProducts: current.productCount,
                        adjacentDemand: adjacentSales
                    },
                    description: `Price Void Detected: ${current.name} range`,
                    suggestedAction: `Expand catalog into the ${current.name} band. Regional demand is high with ${adjacentSales} units sold in adjacent price points.`,
                    potentialRevenue: Math.round(avgAdjacentRevenue * 0.3),
                    confidence: Math.min(0.9, gapScore + 0.2)
                });
            }
        }
    }
    return gaps;
}
async function detectCategoryGaps(shopId) {
    const gaps = [];
    // Define category adjacencies (what should exist together)
    const categoryAdjacencies = {
        'Shoes': [
            'Socks',
            'Shoe Care',
            'Insoles',
            'Laces'
        ],
        'Dresses': [
            'Accessories',
            'Jewelry',
            'Bags',
            'Belts'
        ],
        'Coffee': [
            'Mugs',
            'Coffee Accessories',
            'Filters'
        ],
        'Electronics': [
            'Cables',
            'Cases',
            'Accessories'
        ],
        'Clothing': [
            'Accessories',
            'Bags',
            'Jewelry'
        ],
        'Skincare': [
            'Tools',
            'Accessories',
            'Travel Size'
        ],
        'Furniture': [
            'Accessories',
            'Decor',
            'Lighting'
        ]
    };
    // Get existing product types
    const products = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
        where: {
            shopId
        },
        select: {
            productType: true
        }
    });
    const existingTypes = new Set(products.map((p)=>p.productType?.toLowerCase() || ''));
    // Get revenue by type
    const lineItems = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].orderLineItem.findMany({
        where: {
            order: {
                shopId
            }
        },
        include: {
            order: {
                select: {
                    createdAt: true
                }
            }
        }
    });
    const productTypeMap = new Map(products.map((p)=>[
            p.productType,
            p.productType
        ]));
    // Check for missing adjacencies
    for (const [mainCategory, adjacentCategories] of Object.entries(categoryAdjacencies)){
        // Check if main category exists
        const hasMainCategory = Array.from(existingTypes).some((t)=>t.includes(mainCategory.toLowerCase()));
        if (hasMainCategory) {
            // Check for missing adjacent categories
            for (const adjacent of adjacentCategories){
                const hasAdjacent = Array.from(existingTypes).some((t)=>t.includes(adjacent.toLowerCase()));
                if (!hasAdjacent) {
                    gaps.push({
                        gapType: 'category_gap',
                        gapScore: 0.6,
                        gapData: {
                            mainCategory,
                            missingCategory: adjacent,
                            reason: `Customers buying ${mainCategory} often want ${adjacent}`
                        },
                        description: `Category Inconsistency: Missing ${adjacent}`,
                        suggestedAction: `Consider adding ${adjacent} products to complement your existing ${mainCategory} collection. High catalog affinity detected.`,
                        potentialRevenue: null,
                        confidence: 0.7
                    });
                }
            }
        }
    }
    return gaps;
}
async function detectVariantGaps(shopId) {
    const gaps = [];
    // Get all variants with sales
    const variants = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].variant.findMany({
        where: {
            product: {
                shopId
            }
        },
        select: {
            id: true,
            shopifyId: true,
            title: true,
            product: {
                select: {
                    title: true,
                    productType: true
                }
            }
        }
    });
    // Get sales by variant
    const lineItems = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].orderLineItem.findMany({
        where: {
            order: {
                shopId
            }
        },
        select: {
            variantId: true,
            quantity: true
        }
    });
    const salesByVariant = new Map();
    for (const li of lineItems){
        if (li.variantId) {
            salesByVariant.set(li.variantId, (salesByVariant.get(li.variantId) || 0) + li.quantity);
        }
    }
    // Extract common attributes from variant titles
    const colorKeywords = [
        'black',
        'white',
        'red',
        'blue',
        'green',
        'pink',
        'grey',
        'brown',
        'navy',
        'beige'
    ];
    const sizeKeywords = [
        'xs',
        's',
        'm',
        'l',
        'xl',
        'xxl',
        'small',
        'medium',
        'large'
    ];
    // Count sales by color
    const salesByColor = {};
    const productsByColor = {};
    for (const variant of variants){
        const titleLower = variant.title.toLowerCase();
        for (const color of colorKeywords){
            if (titleLower.includes(color)) {
                const sales = salesByVariant.get(variant.shopifyId) || 0;
                salesByColor[color] = (salesByColor[color] || 0) + sales;
                productsByColor[color] = (productsByColor[color] || 0) + 1;
            }
        }
    }
    // Find high-selling colors with low product representation
    const totalProducts = variants.length;
    for (const [color, sales] of Object.entries(salesByColor)){
        const productCount = productsByColor[color] || 0;
        const productShare = productCount / totalProducts;
        const salesShare = sales / lineItems.reduce((sum, li)=>sum + li.quantity, 0);
        // High demand (sales share) but low supply (product share)
        if (salesShare > productShare * 1.5 && productCount < 10) {
            gaps.push({
                gapType: 'variant_gap',
                gapScore: Math.round((salesShare - productShare) * 100) / 100,
                gapData: {
                    attribute: 'color',
                    value: color.charAt(0).toUpperCase() + color.slice(1),
                    currentProducts: productCount,
                    salesShare: Math.round(salesShare * 10000) / 100,
                    productShare: Math.round(productShare * 10000) / 100
                },
                description: `Variant Depletion: ${color.charAt(0).toUpperCase() + color.slice(1)} shortage`,
                suggestedAction: `Increase depth in ${color} variants. This attribute accounts for ${Math.round(salesShare * 100)}% of volume but only ${Math.round(productShare * 100)}% of your assortment.`,
                potentialRevenue: null,
                confidence: 0.75
            });
        }
    }
    return gaps;
}
async function detectSeasonalGaps(shopId) {
    const gaps = [];
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    // Get orders by month
    const orders = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].order.findMany({
        where: {
            shopId
        },
        select: {
            createdAt: true,
            totalPrice: true
        }
    });
    // Group by month
    const revenueByMonth = {};
    for(let i = 0; i < 12; i++)revenueByMonth[i] = 0;
    for (const order of orders){
        const month = order.createdAt.getMonth();
        revenueByMonth[month] += toNumber(order.totalPrice);
    }
    const avgMonthlyRevenue = Object.values(revenueByMonth).reduce((a, b)=>a + b, 0) / 12;
    // Find low-revenue months
    for (const [month, revenue] of Object.entries(revenueByMonth)){
        const monthIndex = parseInt(month);
        const revenueIndex = avgMonthlyRevenue > 0 ? revenue / avgMonthlyRevenue : 0;
        if (revenueIndex < 0.7 && avgMonthlyRevenue > 0) {
            const seasonalSuggestions = {
                0: 'New Year, Winter Sales',
                1: "Valentine's Day",
                2: 'Spring Collection, Easter prep',
                3: 'Easter, Spring cleaning',
                4: "Mother's Day, Spring items",
                5: "Father's Day, Summer prep",
                6: 'Summer Sale, Beach items',
                7: 'Back to School prep',
                8: 'Back to School, Fall collection',
                9: 'Halloween, Fall items',
                10: 'Black Friday, Holiday prep',
                11: 'Christmas, Holiday gifts'
            };
            gaps.push({
                gapType: 'seasonal_gap',
                gapScore: Math.round((1 - revenueIndex) * 100) / 100,
                gapData: {
                    month: monthNames[monthIndex],
                    monthIndex,
                    currentRevenue: Math.round(revenue),
                    averageRevenue: Math.round(avgMonthlyRevenue),
                    revenueIndex: Math.round(revenueIndex * 100) / 100
                },
                description: `Seasonal Exposure: ${monthNames[monthIndex]} dip`,
                suggestedAction: `${monthNames[monthIndex]} performance is ${Math.round((1 - revenueIndex) * 100)}% below your annual baseline. Deploy ${seasonalSuggestions[monthIndex]} collections to bridge the gap.`,
                potentialRevenue: Math.round((avgMonthlyRevenue - revenue) * 0.5),
                confidence: 0.65
            });
        }
    }
    return gaps;
}
async function detectAllGaps(shopId) {
    console.log(`[GapDetector] Detecting gaps for shop: ${shopId}`);
    // Run all detectors
    const [priceGaps, categoryGaps, variantGaps, seasonalGaps] = await Promise.all([
        detectPriceGaps(shopId),
        detectCategoryGaps(shopId),
        detectVariantGaps(shopId),
        detectSeasonalGaps(shopId)
    ]);
    const allGaps = [
        ...priceGaps,
        ...categoryGaps,
        ...variantGaps,
        ...seasonalGaps
    ];
    // Sort by score
    allGaps.sort((a, b)=>b.gapScore - a.gapScore);
    // Save to database
    for (const gap of allGaps){
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].catalogGap.upsert({
            where: {
                id: `${shopId}-${gap.gapType}-${JSON.stringify(gap.gapData).slice(0, 50)}`
            },
            update: {
                gapScore: gap.gapScore,
                gapData: gap.gapData,
                description: gap.description,
                suggestedAction: gap.suggestedAction,
                potentialRevenue: gap.potentialRevenue,
                confidence: gap.confidence,
                detectedAt: new Date()
            },
            create: {
                shopId,
                gapType: gap.gapType,
                gapScore: gap.gapScore,
                gapData: gap.gapData,
                description: gap.description,
                suggestedAction: gap.suggestedAction,
                potentialRevenue: gap.potentialRevenue,
                confidence: gap.confidence
            }
        });
    }
    // Build summary
    const byType = {};
    for (const gap of allGaps){
        byType[gap.gapType] = (byType[gap.gapType] || 0) + 1;
    }
    console.log(`[GapDetector] Found ${allGaps.length} gaps`);
    return {
        gaps: allGaps,
        summary: {
            totalGaps: allGaps.length,
            byType,
            topOpportunity: allGaps[0] || null
        }
    };
}
}),
"[project]/packages/brain/src/intelligence/trends.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchTrendsForStore",
    ()=>fetchTrendsForStore,
    "getTopTrends",
    ()=>getTopTrends,
    "getTrendData",
    ()=>getTrendData
]);
/**
 * Trend Integration Service
 * Provides trend data for product categories
 *
 * Note: External Google Trends scraping is disabled (unreliable).
 * Instead, we use intelligent estimates and let AI provide market knowledge.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
;
// ============================================
// TREND ESTIMATION
// ============================================
/**
 * Generate trend estimates for a keyword
 * Uses keyword characteristics and category knowledge for reasonable estimates
 *
 * Note: For real-time trends, integrate SerpAPI or similar paid service
 */ function generateTrendEstimate(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    // Fashion/apparel category knowledge
    const trendingCategories = {
        'harem': {
            score: 65,
            velocity: 8
        },
        'palazzo': {
            score: 70,
            velocity: 12
        },
        'yoga': {
            score: 75,
            velocity: 15
        },
        'loungewear': {
            score: 80,
            velocity: 20
        },
        'sustainable': {
            score: 72,
            velocity: 18
        },
        'bamboo': {
            score: 68,
            velocity: 14
        },
        'linen': {
            score: 60,
            velocity: 5
        },
        'warm': {
            score: 55,
            velocity: -5
        },
        'kids': {
            score: 58,
            velocity: 6
        },
        'rock': {
            score: 45,
            velocity: 3
        }
    };
    // Check for matching categories
    for (const [cat, data] of Object.entries(trendingCategories)){
        if (lowerKeyword.includes(cat)) {
            return {
                keyword,
                trendScore: data.score,
                velocity: data.velocity,
                acceleration: 0,
                seasonalIndex: getSeasonalIndex(lowerKeyword),
                source: 'category_estimate'
            };
        }
    }
    // Default: generate consistent estimate based on keyword hash
    const hash = keyword.split('').reduce((acc, char)=>acc + char.charCodeAt(0), 0);
    const baseScore = 40 + hash % 30; // 40-70 range
    const velocity = hash * 7 % 20 - 5; // -5 to +15 range
    return {
        keyword,
        trendScore: baseScore,
        velocity,
        acceleration: 0,
        seasonalIndex: 1.0,
        source: 'keyword_estimate'
    };
}
/**
 * Get seasonal index based on current month and product type
 */ function getSeasonalIndex(keyword) {
    const month = new Date().getMonth(); // 0-11
    // Summer items (May-August)
    if (keyword.includes('linen') || keyword.includes('summer') || keyword.includes('light')) {
        return month >= 4 && month <= 7 ? 1.3 : 0.7;
    }
    // Winter items (November-February)
    if (keyword.includes('warm') || keyword.includes('winter') || keyword.includes('fleece')) {
        return month >= 10 || month <= 1 ? 1.3 : 0.7;
    }
    // Loungewear - slight boost in fall/winter
    if (keyword.includes('lounge')) {
        return month >= 9 || month <= 2 ? 1.15 : 1.0;
    }
    return 1.0; // Default: no seasonal adjustment
}
async function getTrendData(keyword, region = 'US') {
    // Check cache first
    const cached = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].trendData.findUnique({
        where: {
            keyword_region_source: {
                keyword,
                region,
                source: 'category_estimate'
            }
        }
    });
    // Return cached if not expired (cache for 7 days)
    if (cached && cached.expiresAt > new Date()) {
        return {
            keyword: cached.keyword,
            trendScore: cached.trendScore,
            velocity: cached.velocity,
            acceleration: cached.acceleration,
            seasonalIndex: cached.seasonalIndex || 1.0,
            source: cached.source
        };
    }
    // Generate fresh estimate
    const fresh = generateTrendEstimate(keyword);
    // Cache it (expires in 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].trendData.upsert({
            where: {
                keyword_region_source: {
                    keyword,
                    region,
                    source: fresh.source
                }
            },
            update: {
                trendScore: fresh.trendScore,
                velocity: fresh.velocity,
                acceleration: fresh.acceleration,
                seasonalIndex: fresh.seasonalIndex,
                fetchedAt: new Date(),
                expiresAt
            },
            create: {
                keyword,
                region,
                source: fresh.source,
                trendScore: fresh.trendScore,
                velocity: fresh.velocity,
                acceleration: fresh.acceleration,
                seasonalIndex: fresh.seasonalIndex,
                expiresAt
            }
        });
    } catch (e) {
        // Cache failure shouldn't break the flow
        console.warn(`[Trends] Failed to cache trend for ${keyword}`);
    }
    return fresh;
}
async function fetchTrendsForStore(shopId) {
    // Get unique product types from store
    const products = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
        where: {
            shopId
        },
        select: {
            productType: true
        },
        distinct: [
            'productType'
        ]
    });
    const keywords = products.map((p)=>p.productType).filter((t)=>!!t && t.length > 2);
    // Fetch trends for each keyword
    const trends = [];
    for (const keyword of keywords.slice(0, 20)){
        try {
            const trend = await getTrendData(keyword);
            trends.push(trend);
        } catch (err) {
            console.error(`[Trends] Failed to fetch for ${keyword}:`, err);
        }
    }
    return trends.sort((a, b)=>b.trendScore - a.trendScore);
}
async function getTopTrends(shopId, limit = 10) {
    const trends = await fetchTrendsForStore(shopId);
    return trends.filter((t)=>t.velocity > 0) // Only positive momentum
    .slice(0, limit);
}
}),
"[project]/packages/brain/src/intelligence/evidence.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EvidenceCollector",
    ()=>EvidenceCollector,
    "calculateConfidence",
    ()=>calculateConfidence,
    "calculateDataQuality",
    ()=>calculateDataQuality,
    "getInsufficientDataResponse",
    ()=>getInsufficientDataResponse,
    "validateClaim",
    ()=>validateClaim
]);
/**
 * Evidence & Grounding System
 * Tracks data sources, builds reasoning chains, and guards against hallucination
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
;
class EvidenceCollector {
    evidence = [];
    shopId;
    constructor(shopId){
        this.shopId = shopId;
    }
    addEvidence(claim, source, dataPoint, strength = 'moderate') {
        this.evidence.push({
            claim,
            source,
            dataPoint,
            timestamp: new Date(),
            strength
        });
    }
    getEvidence() {
        return this.evidence;
    }
    buildReasoningChain(conclusion, reasoning) {
        // Calculate confidence based on evidence strength
        const strengthWeights = {
            strong: 1,
            moderate: 0.7,
            weak: 0.4
        };
        const totalWeight = this.evidence.reduce((sum, e)=>sum + strengthWeights[e.strength], 0);
        const maxWeight = this.evidence.length;
        const confidence = maxWeight > 0 ? Math.min(1, totalWeight / maxWeight) : 0;
        return {
            conclusion,
            evidence: this.evidence,
            confidence: Math.round(confidence * 100) / 100,
            reasoning
        };
    }
}
async function calculateDataQuality(shopId) {
    const issues = [];
    // Check sync freshness
    const syncStates = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].syncState.findMany({
        where: {
            shopId
        },
        orderBy: {
            lastSyncedAt: 'desc'
        }
    });
    let freshness = 0;
    if (syncStates.length > 0) {
        const lastSync = syncStates[0].lastSyncedAt;
        const daysSinceSync = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60 * 24);
        freshness = Math.max(0, 1 - daysSinceSync / 30); // Decays over 30 days
        if (daysSinceSync > 7) {
            issues.push(`Data is ${Math.round(daysSinceSync)} days old`);
        }
    } else {
        issues.push('No sync history found');
    }
    // Check data completeness
    const [products, orders, customers] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.count({
            where: {
                shopId
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].order.count({
            where: {
                shopId
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].customer.count({
            where: {
                shopId
            }
        })
    ]);
    // Check orders with customer links
    const ordersWithCustomers = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].order.count({
        where: {
            shopId,
            customerId: {
                not: null
            }
        }
    });
    const customerLinkRate = orders > 0 ? ordersWithCustomers / orders : 0;
    // Check products with types
    const productsWithTypes = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.count({
        where: {
            shopId,
            productType: {
                not: null
            }
        }
    });
    const productTypeRate = products > 0 ? productsWithTypes / products : 0;
    const completeness = customerLinkRate * 0.5 + productTypeRate * 0.5;
    if (customerLinkRate < 0.5) {
        issues.push(`Only ${Math.round(customerLinkRate * 100)}% of orders have customer data`);
    }
    if (productTypeRate < 0.8) {
        issues.push(`Only ${Math.round(productTypeRate * 100)}% of products have types`);
    }
    // Check volume (normalized against minimums)
    const volumeScore = Math.min(1, Math.min(1, products / 50) * 0.3 + Math.min(1, orders / 100) * 0.5 + Math.min(1, customers / 50) * 0.2);
    if (orders < 50) {
        issues.push(`Limited order history (${orders} orders)`);
    }
    // Overall score
    const overallScore = Math.round(freshness * 30 + completeness * 40 + volumeScore * 30);
    return {
        shopId,
        freshness: Math.round(freshness * 100) / 100,
        completeness: Math.round(completeness * 100) / 100,
        volume: Math.round(volumeScore * 100) / 100,
        overallScore,
        issues
    };
}
async function validateClaim(shopId, claim, type) {
    switch(type){
        case 'product':
            // Check if referenced product exists
            const productMatch = claim.match(/product[:\s]*["']?([^"']+)["']?/i);
            if (productMatch) {
                const product = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.findFirst({
                    where: {
                        shopId,
                        title: {
                            contains: productMatch[1]
                        }
                    }
                });
                if (!product) {
                    return {
                        valid: false,
                        reason: `Product "${productMatch[1]}" not found in database`,
                        suggestion: 'Refer only to products that exist in the catalog'
                    };
                }
            }
            return {
                valid: true,
                reason: 'Product reference validated'
            };
        case 'metric':
            // Check if the metric makes sense
            const numberMatch = claim.match(/(\d+(?:\.\d+)?)\s*%/);
            if (numberMatch) {
                const value = parseFloat(numberMatch[1]);
                if (value > 100 || value < 0) {
                    return {
                        valid: false,
                        reason: `Percentage value ${value}% is out of valid range`,
                        suggestion: 'Percentages should be between 0-100%'
                    };
                }
            }
            return {
                valid: true,
                reason: 'Metric appears valid'
            };
        default:
            return {
                valid: true,
                reason: 'Claim type not specifically validated'
            };
    }
}
async function calculateConfidence(shopId, sampleSize, patternStrength// 0-1
) {
    // Get data quality
    const dataQuality = await calculateDataQuality(shopId);
    // Base confidence from sample size (diminishing returns after 100)
    const sampleConfidence = Math.min(1, Math.log10(sampleSize + 1) / 2);
    // Combine all factors
    const confidence = sampleConfidence * 0.3 + patternStrength * 0.4 + dataQuality.overallScore / 100 * 0.3;
    let explanation = '';
    if (confidence >= 0.8) {
        explanation = 'High confidence based on strong patterns and sufficient data';
    } else if (confidence >= 0.6) {
        explanation = 'Moderate confidence - consider validating with additional data';
    } else if (confidence >= 0.4) {
        explanation = 'Low confidence - treat as hypothesis requiring validation';
    } else {
        explanation = 'Insufficient data for reliable conclusions';
    }
    return {
        confidence: Math.round(confidence * 100) / 100,
        explanation
    };
}
function getInsufficientDataResponse(reason) {
    const suggestions = [
        'Sync more historical data from Shopify',
        'Wait for more orders to accumulate',
        'Ensure products have accurate types and categories'
    ];
    return {
        type: 'insufficient_data',
        message: `Unable to provide reliable analysis: ${reason}`,
        suggestions
    };
}
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/node:assert [external] (node:assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:assert", () => require("node:assert"));

module.exports = mod;
}),
"[externals]/node:net [external] (node:net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:net", () => require("node:net"));

module.exports = mod;
}),
"[externals]/node:http [external] (node:http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:http", () => require("node:http"));

module.exports = mod;
}),
"[externals]/node:querystring [external] (node:querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:querystring", () => require("node:querystring"));

module.exports = mod;
}),
"[externals]/node:events [external] (node:events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:events", () => require("node:events"));

module.exports = mod;
}),
"[externals]/node:diagnostics_channel [external] (node:diagnostics_channel, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:diagnostics_channel", () => require("node:diagnostics_channel"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[externals]/node:tls [external] (node:tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:tls", () => require("node:tls"));

module.exports = mod;
}),
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:zlib [external] (node:zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:zlib", () => require("node:zlib"));

module.exports = mod;
}),
"[externals]/node:perf_hooks [external] (node:perf_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:perf_hooks", () => require("node:perf_hooks"));

module.exports = mod;
}),
"[externals]/node:util/types [external] (node:util/types, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util/types", () => require("node:util/types"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:worker_threads [external] (node:worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:worker_threads", () => require("node:worker_threads"));

module.exports = mod;
}),
"[externals]/node:http2 [external] (node:http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:http2", () => require("node:http2"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/node:console [external] (node:console, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:console", () => require("node:console"));

module.exports = mod;
}),
"[externals]/node:fs/promises [external] (node:fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs/promises", () => require("node:fs/promises"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:timers [external] (node:timers, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:timers", () => require("node:timers"));

module.exports = mod;
}),
"[externals]/node:dns [external] (node:dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:dns", () => require("node:dns"));

module.exports = mod;
}),
"[project]/packages/brain/src/intelligence/public-analyzer.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyzePublicDomain",
    ()=>analyzePublicDomain
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/client.mjs [app-rsc] (ecmascript) <export OpenAI as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cheerio$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/cheerio/dist/esm/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cheerio$2f$dist$2f$esm$2f$load$2d$parse$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cheerio/dist/esm/load-parse.js [app-rsc] (ecmascript)");
;
;
async function analyzePublicDomain(domain) {
    const openai = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
        apiKey: process.env.OPENAI_API_KEY
    });
    console.log(`[PublicAnalyzer] Starting analysis for: ${domain}`);
    // Ensure domain has protocol
    const url = domain.startsWith('http') ? domain : `https://${domain}`;
    try {
        // 1. Scraping Layer
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to access site: ${response.statusText}`);
        }
        const html = await response.text();
        const $ = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cheerio$2f$dist$2f$esm$2f$load$2d$parse$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["load"](html);
        // Extract metadata and basic cues
        const title = $('title').text() || domain;
        const metaDesc = $('meta[name="description"]').attr('content') || '';
        const headings = $('h1, h2').map((_, el)=>$(el).text()).get().slice(0, 5).join(', ');
        // 2. Intelligence Layer
        const prompt = `
            You are BrandMindAI, an AI Executive Business Partner.
            Analyze this public storefront data and provide a strategic executive preview.

            Site Title: ${title}
            Meta Description: ${metaDesc}
            Key Content: ${headings}

            The goal is to wow the merchant with your perception. 
            Identify their likely industry, current market positioning, and a "Next Hit" opportunity.

            Output JSON format:
            {
                "brandName": "string",
                "description": "Short strategic summary (max 20 words)",
                "healthScore": number (1-100),
                "estimatedRevenue": "Estimate string like '$1M - $5M'",
                "topOpportunities": ["Strategic growth lever 1", "Lever 2"],
                "riskSignals": ["Signal 1"],
                "modernityScore": number (1-100)
            }
        `;
        const aiResponse = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: prompt
                }
            ],
            response_format: {
                type: 'json_object'
            },
            temperature: 0.7
        });
        const result = JSON.parse(aiResponse.choices[0].message.content || '{}');
        return {
            brandName: result.brandName || title,
            description: result.description || 'Strategic profile identified.',
            healthScore: result.healthScore || 75,
            estimatedRevenue: result.estimatedRevenue || 'High Velocity',
            topOpportunities: result.topOpportunities || [
                'Optimize catalog architecture'
            ],
            riskSignals: result.riskSignals || [
                'Market saturation trends'
            ],
            modernityScore: result.modernityScore || 80
        };
    } catch (error) {
        console.error(`[PublicAnalyzer] Error: ${error.message}`);
        throw new Error(`Could not analyze ${domain}. Ensure it is a public storefront.`);
    }
}
}),
"[project]/packages/brain/src/intelligence/product-research.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "researchNewProducts",
    ()=>researchNewProducts,
    "runProductResearch",
    ()=>researchNewProducts
]);
/**
 * AI Product Research Module
 *
 * Uses AI to research external market trends and suggest NEW product opportunities
 * that don't exist in the store's catalog yet.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/client.mjs [app-rsc] (ecmascript) <export OpenAI as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$trends$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/trends.ts [app-rsc] (ecmascript)");
;
;
;
async function researchNewProducts(shopId) {
    console.log(`[ProductResearch] Starting AI research for shop ${shopId}`);
    // 1. Build store context
    const context = await buildStoreContext(shopId);
    if (!context) {
        console.log('[ProductResearch] Could not build store context');
        return [];
    }
    // 2. Get trend data for primary categories
    const trendInsights = await gatherTrendInsights(context.primaryCategories);
    // 3. Call AI to research and suggest products
    const aiSuggestions = await callAIForProductResearch(context, trendInsights);
    // 4. Validate and score suggestions
    const validatedResults = await validateAndScoreSuggestions(aiSuggestions, context);
    console.log(`[ProductResearch] Generated ${validatedResults.length} AI-researched product ideas`);
    return validatedResults;
}
// ============================================
// CONTEXT BUILDING
// ============================================
async function buildStoreContext(shopId) {
    const shop = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].shop.findUnique({
        where: {
            id: shopId
        },
        include: {
            products: {
                select: {
                    title: true,
                    productType: true
                },
                take: 100
            }
        }
    });
    if (!shop) return null;
    const storeDNA = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].storeDNA.findUnique({
        where: {
            shopId
        }
    });
    const dnaData = storeDNA;
    const patterns = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].patternMemory.findMany({
        where: {
            shopId
        }
    });
    const colorPattern = patterns.find((p)=>p.patternType === 'color_preference');
    const pricePattern = patterns.find((p)=>p.patternType === 'price_band');
    // Extract top categories
    const primaryCategories = (dnaData?.topPerformingTypes || []).slice(0, 5).map((t)=>t.type);
    // Extract top colors
    const topColors = (colorPattern?.patternData?.winners || []).slice(0, 5).map((c)=>c.value);
    // Extract price sweet spot
    const optimalBand = pricePattern?.patternData?.optimalBand || 'value';
    const priceRanges = {
        'budget': {
            min: 15,
            max: 30
        },
        'value': {
            min: 30,
            max: 60
        },
        'mid': {
            min: 60,
            max: 100
        },
        'premium': {
            min: 100,
            max: 200
        },
        'luxury': {
            min: 200,
            max: 400
        }
    };
    const priceSweetSpot = priceRanges[optimalBand] || priceRanges['value'];
    // Get brand voice for style context
    const brandVoice = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].brandVoice.findUnique({
        where: {
            shopId
        }
    });
    const brandStyle = brandVoice?.toneAttributes?.join(', ') || 'comfortable, stylish, unique';
    // Get existing product titles to avoid suggesting duplicates
    const existingProductTitles = shop.products.map((p)=>p.title);
    return {
        shopId,
        shopDomain: shop.shopDomain,
        primaryCategories,
        topColors,
        priceSweetSpot,
        brandStyle,
        existingProductTitles
    };
}
// ============================================
// TREND GATHERING
// ============================================
async function gatherTrendInsights(categories) {
    const insights = {};
    for (const category of categories.slice(0, 3)){
        try {
            const trendData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$trends$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTrendData"])(category, 'DE'); // German market
            if (trendData && trendData.trendScore > 0) {
                // Determine direction based on velocity
                const direction = trendData.velocity > 5 ? 'rising' : trendData.velocity < -5 ? 'declining' : 'stable';
                insights[category] = {
                    trendScore: trendData.trendScore,
                    velocity: trendData.velocity,
                    direction,
                    seasonalIndex: trendData.seasonalIndex,
                    source: trendData.source
                };
            }
        } catch (e) {
            // Trends are supplementary - don't fail the whole research
            console.log(`[ProductResearch] Could not get trends for ${category}, continuing without`);
        }
    }
    // If no trend data available, provide context to AI
    if (Object.keys(insights).length === 0) {
        console.log('[ProductResearch] No trend data available, AI will use general market knowledge');
    }
    return insights;
}
// ============================================
// AI RESEARCH CALL
// ============================================
async function callAIForProductResearch(context, trendInsights) {
    const openai = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]();
    const prompt = buildResearchPrompt(context, trendInsights);
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: `You are a product research specialist for e-commerce fashion brands. Your job is to identify NEW product opportunities based on market trends, competitor analysis, and the store's existing strengths.

You must suggest SPECIFIC, ACTIONABLE product ideas - not vague categories. Each suggestion should be a product that could realistically be manufactured and sold.

Focus on:
1. Products that leverage the store's existing strengths (colors, price points, style)
2. Gap opportunities - products competitors have but this store doesn't
3. Emerging trends in the fashion/apparel space
4. Seasonal opportunities
5. Cross-category expansion that makes sense for the brand

Be specific: Instead of "comfortable pants", say "Bamboo Fabric Yoga Harem Pants with Elastic Waistband".`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            response_format: {
                type: 'json_object'
            },
            temperature: 0.8,
            max_tokens: 2000
        });
        const content = response.choices[0].message.content || '{}';
        const parsed = JSON.parse(content);
        return parsed.suggestions || [];
    } catch (error) {
        console.error('[ProductResearch] AI call failed:', error);
        return [];
    }
}
function buildResearchPrompt(context, trendInsights) {
    const existingProductsSample = context.existingProductTitles.slice(0, 20).join('\n- ');
    const trendSummary = Object.keys(trendInsights).length > 0 ? Object.entries(trendInsights).map(([cat, data])=>`${cat}: trend score ${data.trendScore}/100, velocity ${data.velocity > 0 ? '+' : ''}${data.velocity}%, direction: ${data.direction}`).join('\n') : 'External trend data unavailable - use your knowledge of current fashion/apparel market trends';
    return `Research NEW product opportunities for this e-commerce store:

## STORE PROFILE
- Domain: ${context.shopDomain}
- Primary Categories: ${context.primaryCategories.join(', ')}
- Best-Selling Colors: ${context.topColors.join(', ')}
- Price Sweet Spot: €${context.priceSweetSpot.min}-${context.priceSweetSpot.max}
- Brand Style: ${context.brandStyle}

## EXISTING PRODUCTS (sample - DO NOT suggest these)
- ${existingProductsSample}

## CURRENT MARKET TRENDS
${trendSummary || 'No trend data available'}

## YOUR TASK
Suggest 5 SPECIFIC new product ideas that:
1. Don't exist in the store yet
2. Fit the brand's style and price range
3. Leverage winning colors (${context.topColors.slice(0, 3).join(', ')})
4. Address market gaps or trends
5. Are realistic to manufacture and sell

Return JSON with this structure:
{
  "suggestions": [
    {
      "productIdea": "Specific product name (e.g., 'Bamboo Yoga Harem Pants with Mandala Print')",
      "productType": "Category (e.g., 'Haremshosen')",
      "suggestedPrice": 45,
      "marketEvidence": {
        "trendIndicator": "Description of why this is trending",
        "competitorInsight": "What competitors are doing in this space",
        "searchDemand": "Estimated demand level (high/medium/low)",
        "seasonalFit": "When this would sell best"
      },
      "reasoning": "2-3 sentences explaining why this is a good opportunity",
      "differentiators": ["Feature 1", "Feature 2", "Feature 3"],
      "riskLevel": "low|medium|high"
    }
  ]
}`;
}
// ============================================
// VALIDATION & SCORING
// ============================================
async function validateAndScoreSuggestions(aiSuggestions, context) {
    const results = [];
    for (const suggestion of aiSuggestions){
        // Skip if too similar to existing product
        const isDuplicate = context.existingProductTitles.some((existing)=>calculateSimilarity(existing.toLowerCase(), suggestion.productIdea?.toLowerCase() || '') > 0.7);
        if (isDuplicate) {
            console.log(`[ProductResearch] Skipping duplicate: ${suggestion.productIdea}`);
            continue;
        }
        // Calculate confidence score
        let confidence = 0.6; // Base confidence
        // Boost if uses winning color
        const usesWinningColor = context.topColors.some((color)=>suggestion.productIdea?.toLowerCase().includes(color.toLowerCase()));
        if (usesWinningColor) confidence += 0.1;
        // Boost if in primary category
        const inPrimaryCategory = context.primaryCategories.some((cat)=>suggestion.productType?.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(suggestion.productType?.toLowerCase() || ''));
        if (inPrimaryCategory) confidence += 0.1;
        // Boost based on market evidence quality
        if (suggestion.marketEvidence?.searchDemand === 'high') confidence += 0.1;
        if (suggestion.riskLevel === 'low') confidence += 0.05;
        // Map to result structure
        results.push({
            productIdea: suggestion.productIdea || 'Unknown Product',
            productType: suggestion.productType || 'General',
            targetPrice: suggestion.suggestedPrice || context.priceSweetSpot.min,
            marketEvidence: {
                trendScore: suggestion.marketEvidence?.searchDemand === 'high' ? 0.8 : suggestion.marketEvidence?.searchDemand === 'medium' ? 0.5 : 0.3,
                searchVolume: suggestion.marketEvidence?.searchDemand || 'unknown',
                competitorGap: suggestion.marketEvidence?.competitorInsight || 'No data',
                seasonalRelevance: suggestion.marketEvidence?.seasonalFit || 'Year-round'
            },
            reasoning: suggestion.reasoning || 'AI-generated product suggestion',
            differentiators: suggestion.differentiators || [],
            riskLevel: suggestion.riskLevel || 'medium',
            confidence: Math.min(0.95, confidence),
            source: 'ai_research'
        });
    }
    // Sort by confidence
    results.sort((a, b)=>b.confidence - a.confidence);
    return results.slice(0, 5); // Return top 5
}
/**
 * Simple similarity check using word overlap
 */ function calculateSimilarity(str1, str2) {
    const words1 = new Set(str1.split(/\s+/).filter((w)=>w.length > 3));
    const words2 = new Set(str2.split(/\s+/).filter((w)=>w.length > 3));
    if (words1.size === 0 || words2.size === 0) return 0;
    const intersection = [
        ...words1
    ].filter((w)=>words2.has(w)).length;
    const union = new Set([
        ...words1,
        ...words2
    ]).size;
    return intersection / union;
}
;
}),
"[project]/packages/brain/src/intelligence/data-sufficiency.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "canUseFeature",
    ()=>canUseFeature,
    "checkDataSufficiency",
    ()=>checkDataSufficiency,
    "getDataSufficiency",
    ()=>getDataSufficiency
]);
/**
 * Data Sufficiency Checker
 * Validates whether a store has enough data for various features
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
;
// ============================================
// THRESHOLDS
// ============================================
const THRESHOLDS = {
    storeAge: {
        minimum: 7,
        recommended: 30
    },
    orders: {
        minimum: 1,
        forPredictions: 20,
        forCategoryExpansion: 50,
        forSeasonality: 100
    },
    products: {
        minimum: 5,
        recommended: 20
    },
    customers: {
        minimum: 15,
        forSegmentation: 50,
        forRepeatAnalysis: 100
    },
    multiItemOrders: {
        forBasketAffinity: 30
    },
    monthsOfData: {
        forSeasonality: 6
    },
    repeatCustomers: {
        minimum: 10
    }
};
async function checkDataSufficiency(shopId) {
    const blockers = [];
    const warnings = [];
    const estimates = [];
    // ═══════════════════════════════════════════════════════════════
    // GATHER CURRENT DATA STATS
    // ═══════════════════════════════════════════════════════════════
    const [orderStats, productStats, customerStats] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].order.aggregate({
            where: {
                shopId
            },
            _count: true,
            _min: {
                createdAt: true
            },
            _max: {
                createdAt: true
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.aggregate({
            where: {
                shopId
            },
            _count: true
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].customer.aggregate({
            where: {
                shopId
            },
            _count: true
        })
    ]);
    const orderCount = orderStats._count;
    const productCount = productStats._count;
    const customerCount = customerStats._count;
    const firstOrderDate = orderStats._min.createdAt;
    const lastOrderDate = orderStats._max.createdAt;
    const storeAgeDays = firstOrderDate ? Math.floor((Date.now() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const dataSpanDays = firstOrderDate && lastOrderDate ? Math.floor((lastOrderDate.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    // Get multi-item orders count
    const ordersWithMultipleItems = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].order.findMany({
        where: {
            shopId
        },
        select: {
            id: true,
            _count: {
                select: {
                    lineItems: true
                }
            }
        }
    });
    const multiItemOrderCount = ordersWithMultipleItems.filter((o)=>o._count.lineItems > 1).length;
    // Get distinct categories
    const categories = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.groupBy({
        by: [
            'productType'
        ],
        where: {
            shopId,
            productType: {
                not: null
            }
        }
    });
    const categoryCount = categories.length;
    // Get repeat customers count
    let repeatCustomerCount = 0;
    try {
        const repeatCustomers = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].$queryRaw`
            SELECT COUNT(DISTINCT "customerId") as count
            FROM "Order"
            WHERE "shopId" = ${shopId}
              AND "customerId" IS NOT NULL
            GROUP BY "customerId"
            HAVING COUNT(*) > 1
        `;
        repeatCustomerCount = repeatCustomers.length;
    } catch (e) {
        // Query might fail if no orders exist
        repeatCustomerCount = 0;
    }
    const stats = {
        orderCount,
        productCount,
        customerCount,
        storeAgeDays,
        dataSpanDays,
        multiItemOrderCount,
        categoryCount,
        repeatCustomerCount
    };
    // ═══════════════════════════════════════════════════════════════
    // CHECK GLOBAL MINIMUMS
    // ═══════════════════════════════════════════════════════════════
    // No orders at all
    if (orderCount === 0) {
        blockers.push({
            feature: 'all',
            requirement: 'At least 1 order required',
            current: '0 orders',
            needed: '1+ orders',
            message: 'No orders found. Make your first sale to start building your Brand DNA.'
        });
    }
    // Store too new
    if (orderCount > 0 && storeAgeDays < THRESHOLDS.storeAge.minimum) {
        blockers.push({
            feature: 'all',
            requirement: `Store must be at least ${THRESHOLDS.storeAge.minimum} days old`,
            current: `${storeAgeDays} days`,
            needed: `${THRESHOLDS.storeAge.minimum} days`,
            message: `Your store data is only ${storeAgeDays} days old. We need at least ${THRESHOLDS.storeAge.minimum} days of sales data to begin analysis.`,
            estimatedReadyDate: new Date(Date.now() + (THRESHOLDS.storeAge.minimum - storeAgeDays) * 24 * 60 * 60 * 1000)
        });
    }
    // Too few products
    if (productCount < THRESHOLDS.products.minimum) {
        blockers.push({
            feature: 'catalogAnalysis',
            requirement: `Minimum ${THRESHOLDS.products.minimum} products`,
            current: `${productCount} products`,
            needed: `${THRESHOLDS.products.minimum} products`,
            message: `Only ${productCount} products found. Add more products for meaningful catalog analysis.`
        });
    }
    // ═══════════════════════════════════════════════════════════════
    // CHECK FEATURE-SPECIFIC THRESHOLDS
    // ═══════════════════════════════════════════════════════════════
    // NEXT HIT PREDICTIONS
    if (orderCount > 0 && orderCount < THRESHOLDS.orders.forPredictions) {
        blockers.push({
            feature: 'nextHitPredictions',
            requirement: `Minimum ${THRESHOLDS.orders.forPredictions} orders for predictions`,
            current: `${orderCount} orders`,
            needed: `${THRESHOLDS.orders.forPredictions} orders`,
            message: `You have ${orderCount} orders. We need at least ${THRESHOLDS.orders.forPredictions} to identify reliable patterns for product predictions.`,
            estimatedReadyDate: estimateWhenReady(orderCount, THRESHOLDS.orders.forPredictions, storeAgeDays)
        });
        estimates.push({
            feature: 'nextHitPredictions',
            currentProgress: Math.round(orderCount / THRESHOLDS.orders.forPredictions * 100),
            estimatedDaysUntilReady: estimateDaysUntilOrders(orderCount, THRESHOLDS.orders.forPredictions, storeAgeDays),
            message: `${THRESHOLDS.orders.forPredictions - orderCount} more orders needed`
        });
    }
    if (orderCount >= THRESHOLDS.orders.forPredictions && storeAgeDays < THRESHOLDS.storeAge.recommended) {
        warnings.push({
            feature: 'nextHitPredictions',
            message: `Only ${storeAgeDays} days of data (${THRESHOLDS.storeAge.recommended} recommended)`,
            impact: 'Predictions may be less accurate with limited historical data'
        });
    }
    // SEASONALITY ANALYSIS
    const monthsOfData = Math.floor(dataSpanDays / 30);
    if (monthsOfData < THRESHOLDS.monthsOfData.forSeasonality) {
        blockers.push({
            feature: 'seasonalityAnalysis',
            requirement: `${THRESHOLDS.monthsOfData.forSeasonality} months of order data`,
            current: `${monthsOfData} months`,
            needed: `${THRESHOLDS.monthsOfData.forSeasonality} months`,
            message: `Seasonality analysis requires ${THRESHOLDS.monthsOfData.forSeasonality}+ months of data. You have ${monthsOfData} months.`,
            estimatedReadyDate: new Date(Date.now() + (THRESHOLDS.monthsOfData.forSeasonality - monthsOfData) * 30 * 24 * 60 * 60 * 1000)
        });
        estimates.push({
            feature: 'seasonalityAnalysis',
            currentProgress: Math.round(monthsOfData / THRESHOLDS.monthsOfData.forSeasonality * 100),
            estimatedDaysUntilReady: (THRESHOLDS.monthsOfData.forSeasonality - monthsOfData) * 30,
            message: `${THRESHOLDS.monthsOfData.forSeasonality - monthsOfData} more months of data needed`
        });
    }
    // CUSTOMER SEGMENTATION (RFM)
    if (customerCount < THRESHOLDS.customers.forSegmentation) {
        blockers.push({
            feature: 'customerSegmentation',
            requirement: `${THRESHOLDS.customers.forSegmentation} customers minimum`,
            current: `${customerCount} customers`,
            needed: `${THRESHOLDS.customers.forSegmentation} customers`,
            message: `Customer segmentation requires at least ${THRESHOLDS.customers.forSegmentation} unique customers.`
        });
    } else if (repeatCustomerCount < THRESHOLDS.repeatCustomers.minimum) {
        warnings.push({
            feature: 'customerSegmentation',
            message: `Only ${repeatCustomerCount} repeat customers (${THRESHOLDS.repeatCustomers.minimum} recommended)`,
            impact: 'Repeat purchase patterns may not be statistically reliable'
        });
    }
    // BASKET AFFINITY / CROSS-PURCHASE
    if (multiItemOrderCount < THRESHOLDS.multiItemOrders.forBasketAffinity) {
        blockers.push({
            feature: 'basketAffinity',
            requirement: `${THRESHOLDS.multiItemOrders.forBasketAffinity} multi-item orders`,
            current: `${multiItemOrderCount} multi-item orders`,
            needed: `${THRESHOLDS.multiItemOrders.forBasketAffinity} multi-item orders`,
            message: 'Cross-purchase analysis needs orders with multiple products to identify buying patterns.'
        });
        estimates.push({
            feature: 'basketAffinity',
            currentProgress: Math.round(multiItemOrderCount / THRESHOLDS.multiItemOrders.forBasketAffinity * 100),
            estimatedDaysUntilReady: estimateDaysUntilOrders(multiItemOrderCount, THRESHOLDS.multiItemOrders.forBasketAffinity, storeAgeDays),
            message: `${THRESHOLDS.multiItemOrders.forBasketAffinity - multiItemOrderCount} more multi-item orders needed`
        });
    }
    // CATEGORY EXPANSION
    if (orderCount < THRESHOLDS.orders.forCategoryExpansion) {
        blockers.push({
            feature: 'categoryExpansion',
            requirement: `${THRESHOLDS.orders.forCategoryExpansion} orders for category expansion`,
            current: `${orderCount} orders`,
            needed: `${THRESHOLDS.orders.forCategoryExpansion} orders`,
            message: 'Category expansion recommendations require established sales patterns.'
        });
    }
    if (categoryCount < 2) {
        warnings.push({
            feature: 'categoryExpansion',
            message: `Only ${categoryCount} product category detected`,
            impact: 'Category expansion suggestions will be based on market research only'
        });
    }
    // ═══════════════════════════════════════════════════════════════
    // CALCULATE OVERALL SCORE
    // ═══════════════════════════════════════════════════════════════
    const criticalBlockers = blockers.filter((b)=>b.feature === 'all' || b.feature === 'nextHitPredictions');
    const sufficient = criticalBlockers.length === 0;
    // Score based on how much data we have vs ideal
    const orderScore = Math.min(100, orderCount / 100 * 100);
    const ageScore = Math.min(100, storeAgeDays / 90 * 100);
    const productScore = Math.min(100, productCount / 20 * 100);
    const customerScore = Math.min(100, customerCount / 50 * 100);
    const score = Math.round((orderScore + ageScore + productScore + customerScore) / 4);
    // ═══════════════════════════════════════════════════════════════
    // SAVE TO DATABASE
    // ═══════════════════════════════════════════════════════════════
    await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dataSufficiency.upsert({
        where: {
            shopId
        },
        update: {
            orderCount,
            productCount,
            customerCount,
            storeAgeDays,
            dataSpanDays,
            multiItemOrderCount,
            categoryCount,
            repeatCustomerCount,
            overallScore: score,
            isSufficient: sufficient,
            nextHitReady: !blockers.some((b)=>b.feature === 'nextHitPredictions' || b.feature === 'all'),
            seasonalityReady: !blockers.some((b)=>b.feature === 'seasonalityAnalysis'),
            customerSegmentReady: !blockers.some((b)=>b.feature === 'customerSegmentation'),
            basketAffinityReady: !blockers.some((b)=>b.feature === 'basketAffinity'),
            categoryExpansionReady: !blockers.some((b)=>b.feature === 'categoryExpansion'),
            blockers: blockers,
            warnings: warnings,
            estimates: estimates,
            checkedAt: new Date()
        },
        create: {
            shopId,
            orderCount,
            productCount,
            customerCount,
            storeAgeDays,
            dataSpanDays,
            multiItemOrderCount,
            categoryCount,
            repeatCustomerCount,
            overallScore: score,
            isSufficient: sufficient,
            nextHitReady: !blockers.some((b)=>b.feature === 'nextHitPredictions' || b.feature === 'all'),
            seasonalityReady: !blockers.some((b)=>b.feature === 'seasonalityAnalysis'),
            customerSegmentReady: !blockers.some((b)=>b.feature === 'customerSegmentation'),
            basketAffinityReady: !blockers.some((b)=>b.feature === 'basketAffinity'),
            categoryExpansionReady: !blockers.some((b)=>b.feature === 'categoryExpansion'),
            blockers: blockers,
            warnings: warnings,
            estimates: estimates
        }
    });
    console.log(`[DataSufficiency] Shop ${shopId}: Score ${score}%, Sufficient: ${sufficient}, Blockers: ${blockers.length}`);
    return {
        sufficient,
        score,
        blockers,
        warnings,
        estimates,
        stats
    };
}
// ============================================
// HELPER FUNCTIONS
// ============================================
function estimateDaysUntilOrders(current, needed, storeAgeDays) {
    if (storeAgeDays === 0 || current === 0) return 30; // Default estimate
    const ordersPerDay = current / Math.max(1, storeAgeDays);
    if (ordersPerDay === 0) return 30;
    return Math.ceil((needed - current) / ordersPerDay);
}
function estimateWhenReady(current, needed, storeAgeDays) {
    const daysUntil = estimateDaysUntilOrders(current, needed, storeAgeDays);
    return new Date(Date.now() + daysUntil * 24 * 60 * 60 * 1000);
}
async function getDataSufficiency(shopId) {
    const cached = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dataSufficiency.findUnique({
        where: {
            shopId
        }
    });
    if (!cached) {
        return checkDataSufficiency(shopId);
    }
    // If cached data is older than 1 hour, recompute
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (cached.checkedAt < oneHourAgo) {
        return checkDataSufficiency(shopId);
    }
    return {
        sufficient: cached.isSufficient,
        score: cached.overallScore,
        blockers: cached.blockers || [],
        warnings: cached.warnings || [],
        estimates: cached.estimates || [],
        stats: {
            orderCount: cached.orderCount,
            productCount: cached.productCount,
            customerCount: cached.customerCount,
            storeAgeDays: cached.storeAgeDays,
            dataSpanDays: cached.dataSpanDays,
            multiItemOrderCount: cached.multiItemOrderCount,
            categoryCount: cached.categoryCount,
            repeatCustomerCount: cached.repeatCustomerCount
        }
    };
}
async function canUseFeature(shopId, feature) {
    const sufficiency = await getDataSufficiency(shopId);
    if (!sufficiency) {
        return {
            allowed: false,
            blocker: {
                feature: 'all',
                requirement: 'Data check failed',
                current: 'Unknown',
                needed: 'Unknown',
                message: 'Unable to check data sufficiency'
            }
        };
    }
    const blocker = sufficiency.blockers.find((b)=>b.feature === feature || b.feature === 'all');
    return {
        allowed: !blocker,
        blocker
    };
}
}),
"[project]/packages/brain/src/intelligence/dna-completeness.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkDNACompleteness",
    ()=>checkDNACompleteness,
    "updateDNAField",
    ()=>updateDNAField
]);
/**
 * DNA Completeness Checker
 * Identifies missing fields in Brand DNA and prompts users to fill them
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
;
// ============================================
// FIELD DEFINITIONS
// ============================================
const IDENTITY_FIELDS = [
    {
        field: 'brandName',
        importance: 'critical',
        question: 'What is your brand name?',
        inputType: 'text',
        placeholder: 'e.g., Nike, Glossier, Allbirds'
    },
    {
        field: 'mission',
        importance: 'important',
        question: 'What is your brand mission?',
        inputType: 'textarea',
        placeholder: 'e.g., To bring sustainable fashion to everyone',
        helpText: 'This helps us suggest products aligned with your values'
    },
    {
        field: 'coreValues',
        importance: 'important',
        question: "What are your brand's core values?",
        inputType: 'multiselect',
        options: [
            'Quality',
            'Sustainability',
            'Innovation',
            'Affordability',
            'Luxury',
            'Authenticity',
            'Community',
            'Simplicity',
            'Craftsmanship',
            'Transparency',
            'Inclusivity',
            'Wellness',
            'Creativity'
        ],
        helpText: 'Select 3-5 values that define your brand'
    },
    {
        field: 'targetAudience',
        importance: 'critical',
        question: 'Who is your primary customer?',
        inputType: 'select',
        options: [
            {
                label: 'Women 18-24',
                value: 'women_18_24'
            },
            {
                label: 'Women 25-34',
                value: 'women_25_34'
            },
            {
                label: 'Women 35-44',
                value: 'women_35_44'
            },
            {
                label: 'Women 45+',
                value: 'women_45_plus'
            },
            {
                label: 'Men 18-24',
                value: 'men_18_24'
            },
            {
                label: 'Men 25-34',
                value: 'men_25_34'
            },
            {
                label: 'Men 35-44',
                value: 'men_35_44'
            },
            {
                label: 'Men 45+',
                value: 'men_45_plus'
            },
            {
                label: 'All genders 18-34',
                value: 'all_18_34'
            },
            {
                label: 'All genders 35+',
                value: 'all_35_plus'
            },
            {
                label: 'Families',
                value: 'families'
            },
            {
                label: 'Businesses (B2B)',
                value: 'b2b'
            }
        ],
        helpText: 'This shapes what products we recommend'
    },
    {
        field: 'brandPersonality',
        importance: 'nice_to_have',
        question: 'How would you describe your brand personality?',
        inputType: 'multiselect',
        options: [
            'Bold',
            'Minimalist',
            'Playful',
            'Sophisticated',
            'Edgy',
            'Classic',
            'Modern',
            'Warm',
            'Professional',
            'Adventurous'
        ],
        helpText: 'Select 2-4 traits that describe your brand'
    }
];
const MARKET_POSITION_FIELDS = [
    {
        field: 'industry',
        importance: 'critical',
        question: 'What industry are you in?',
        inputType: 'select',
        options: [
            {
                label: 'Fashion & Apparel',
                value: 'fashion'
            },
            {
                label: 'Beauty & Cosmetics',
                value: 'beauty'
            },
            {
                label: 'Home & Living',
                value: 'home'
            },
            {
                label: 'Food & Beverage',
                value: 'food'
            },
            {
                label: 'Health & Wellness',
                value: 'health'
            },
            {
                label: 'Electronics & Tech',
                value: 'electronics'
            },
            {
                label: 'Sports & Outdoors',
                value: 'sports'
            },
            {
                label: 'Kids & Baby',
                value: 'kids'
            },
            {
                label: 'Pets',
                value: 'pets'
            },
            {
                label: 'Jewelry & Accessories',
                value: 'jewelry'
            },
            {
                label: 'Art & Crafts',
                value: 'art'
            },
            {
                label: 'Other',
                value: 'other'
            }
        ]
    },
    {
        field: 'niche',
        importance: 'important',
        question: 'What is your specific niche?',
        inputType: 'text',
        placeholder: 'e.g., Sustainable yoga wear, Minimalist home decor',
        helpText: 'Be specific - this helps us find your unique opportunities'
    },
    {
        field: 'pricePositioning',
        importance: 'critical',
        question: 'How would you describe your price positioning?',
        inputType: 'select',
        options: [
            {
                label: 'Budget - Lowest prices in market',
                value: 'budget'
            },
            {
                label: 'Mid-Market - Competitive pricing',
                value: 'mid-market'
            },
            {
                label: 'Premium - Higher quality, higher price',
                value: 'premium'
            },
            {
                label: 'Luxury - Highest tier',
                value: 'luxury'
            }
        ]
    },
    {
        field: 'competitiveDifferentiator',
        importance: 'important',
        question: 'What makes you different from competitors?',
        inputType: 'textarea',
        placeholder: 'e.g., We use 100% recycled materials and donate 5% to ocean cleanup',
        helpText: 'Your unique selling proposition'
    },
    {
        field: 'directCompetitors',
        importance: 'nice_to_have',
        question: 'Who are your top 3 competitors?',
        inputType: 'text',
        placeholder: 'e.g., Lululemon, Athleta, Outdoor Voices',
        helpText: 'Helps us understand your competitive landscape'
    }
];
async function checkDNACompleteness(shopId) {
    const dna = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].storeDNA.findUnique({
        where: {
            shopId
        }
    });
    const userActionRequired = [];
    const dataRequired = [];
    // ═══════════════════════════════════════════════════════════════
    // CHECK IDENTITY FIELDS
    // ═══════════════════════════════════════════════════════════════
    const identityMissingCritical = [];
    const identityMissingImportant = [];
    const identityMissingOptional = [];
    let identityFilled = 0;
    for (const fieldDef of IDENTITY_FIELDS){
        const value = dna?.[fieldDef.field];
        const isEmpty = !value || Array.isArray(value) && value.length === 0 || typeof value === 'string' && value.trim() === '';
        if (isEmpty) {
            userActionRequired.push({
                field: fieldDef.field,
                section: 'identity',
                importance: fieldDef.importance,
                question: fieldDef.question,
                inputType: fieldDef.inputType,
                options: fieldDef.options,
                placeholder: fieldDef.placeholder,
                helpText: fieldDef.helpText
            });
            if (fieldDef.importance === 'critical') identityMissingCritical.push(fieldDef.field);
            else if (fieldDef.importance === 'important') identityMissingImportant.push(fieldDef.field);
            else identityMissingOptional.push(fieldDef.field);
        } else {
            identityFilled++;
        }
    }
    // ═══════════════════════════════════════════════════════════════
    // CHECK MARKET POSITION FIELDS
    // ═══════════════════════════════════════════════════════════════
    const marketMissingCritical = [];
    const marketMissingImportant = [];
    const marketMissingOptional = [];
    let marketFilled = 0;
    for (const fieldDef of MARKET_POSITION_FIELDS){
        const value = dna?.[fieldDef.field];
        const isEmpty = !value || Array.isArray(value) && value.length === 0 || typeof value === 'string' && value.trim() === '';
        if (isEmpty) {
            userActionRequired.push({
                field: fieldDef.field,
                section: 'marketPosition',
                importance: fieldDef.importance,
                question: fieldDef.question,
                inputType: fieldDef.inputType,
                options: fieldDef.options,
                placeholder: fieldDef.placeholder,
                helpText: fieldDef.helpText
            });
            if (fieldDef.importance === 'critical') marketMissingCritical.push(fieldDef.field);
            else if (fieldDef.importance === 'important') marketMissingImportant.push(fieldDef.field);
            else marketMissingOptional.push(fieldDef.field);
        } else {
            marketFilled++;
        }
    }
    // ═══════════════════════════════════════════════════════════════
    // CHECK OPERATIONAL DNA (From Shopify - can't be manually filled)
    // ═══════════════════════════════════════════════════════════════
    const operationalMissingCritical = [];
    let operationalFilled = 0;
    const operationalTotal = 5; // Key operational metrics
    if (!dna?.avgOrderValue) {
        operationalMissingCritical.push('avgOrderValue');
        dataRequired.push({
            field: 'avgOrderValue',
            section: 'operationalDNA',
            source: 'shopify_orders',
            message: 'Average order value requires order data',
            action: 'Ensure your store has at least 10 orders for accurate analysis'
        });
    } else {
        operationalFilled++;
    }
    if (!dna?.priceBands) {
        operationalMissingCritical.push('priceBands');
        dataRequired.push({
            field: 'priceBands',
            section: 'operationalDNA',
            source: 'shopify_orders',
            message: 'Price band analysis requires order history',
            action: 'More orders will improve price intelligence'
        });
    } else {
        operationalFilled++;
    }
    if (!dna?.totalProducts || dna.totalProducts < 5) {
        operationalMissingCritical.push('catalogStructure');
        dataRequired.push({
            field: 'catalogStructure',
            section: 'operationalDNA',
            source: 'shopify_products',
            message: 'Catalog analysis requires more products',
            action: 'Add at least 5 products for meaningful catalog insights'
        });
    } else {
        operationalFilled++;
    }
    if (!dna?.seasonalityCurve) {
        dataRequired.push({
            field: 'seasonality',
            section: 'operationalDNA',
            source: 'shopify_orders',
            message: 'Seasonality requires 6+ months of data',
            action: 'Seasonality patterns will emerge over time'
        });
    } else {
        operationalFilled++;
    }
    if (!dna?.heroProductShare) {
        dataRequired.push({
            field: 'revenueConcentration',
            section: 'operationalDNA',
            source: 'shopify_orders',
            message: 'Revenue concentration requires sales data',
            action: 'More orders will reveal product performance patterns'
        });
    } else {
        operationalFilled++;
    }
    // ═══════════════════════════════════════════════════════════════
    // CHECK CUSTOMER DNA (From Shopify - can't be manually filled)
    // ═══════════════════════════════════════════════════════════════
    const customerMissingCritical = [];
    let customerFilled = 0;
    const customerTotal = 4;
    if (!dna?.repeatPurchaseRate) {
        customerMissingCritical.push('repeatPurchaseRate');
        dataRequired.push({
            field: 'repeatPurchaseRate',
            section: 'customerDNA',
            source: 'shopify_orders',
            message: 'Repeat purchase analysis requires order history',
            action: 'Need at least 50 orders to calculate repeat patterns'
        });
    } else {
        customerFilled++;
    }
    if (!dna?.basketAffinities) {
        dataRequired.push({
            field: 'basketAffinities',
            section: 'customerDNA',
            source: 'shopify_orders',
            message: 'Basket affinity requires multi-item orders',
            action: 'Need orders with multiple products to identify buying patterns'
        });
    } else {
        customerFilled++;
    }
    if (!dna?.segmentDistribution) {
        dataRequired.push({
            field: 'customerSegments',
            section: 'customerDNA',
            source: 'shopify_customers',
            message: 'Customer segmentation requires customer data',
            action: 'Need at least 50 customers for meaningful segments'
        });
    } else {
        customerFilled++;
    }
    if (!dna?.entryProducts) {
        dataRequired.push({
            field: 'entryProducts',
            section: 'customerDNA',
            source: 'shopify_orders',
            message: 'Entry product analysis requires first-purchase data',
            action: 'More customer purchase data will reveal entry points'
        });
    } else {
        customerFilled++;
    }
    // ═══════════════════════════════════════════════════════════════
    // CALCULATE SCORES
    // ═══════════════════════════════════════════════════════════════
    const identityTotal = IDENTITY_FIELDS.length;
    const marketTotal = MARKET_POSITION_FIELDS.length;
    const identityScore = Math.round(identityFilled / identityTotal * 100);
    const marketScore = Math.round(marketFilled / marketTotal * 100);
    const operationalScore = Math.round(operationalFilled / operationalTotal * 100);
    const customerScore = Math.round(customerFilled / customerTotal * 100);
    // Overall score weighted: Identity & Market more important for user input
    const overallScore = Math.round(identityScore * 0.30 + marketScore * 0.25 + operationalScore * 0.30 + customerScore * 0.15);
    // Can make predictions if critical identity + market + some operational data
    const hasCriticalIdentity = identityMissingCritical.length === 0;
    const hasCriticalMarket = marketMissingCritical.length === 0;
    const hasMinimalOperational = operationalFilled >= 2;
    const isActionable = hasCriticalIdentity && hasCriticalMarket && hasMinimalOperational;
    // Sort user actions by importance
    userActionRequired.sort((a, b)=>{
        const order = {
            critical: 0,
            important: 1,
            nice_to_have: 2
        };
        return order[a.importance] - order[b.importance];
    });
    const result = {
        overallScore,
        isActionable,
        sections: {
            identity: {
                score: identityScore,
                filledFields: identityFilled,
                totalFields: identityTotal,
                missingCritical: identityMissingCritical,
                missingImportant: identityMissingImportant,
                missingOptional: identityMissingOptional
            },
            marketPosition: {
                score: marketScore,
                filledFields: marketFilled,
                totalFields: marketTotal,
                missingCritical: marketMissingCritical,
                missingImportant: marketMissingImportant,
                missingOptional: marketMissingOptional
            },
            operationalDNA: {
                score: operationalScore,
                filledFields: operationalFilled,
                totalFields: operationalTotal,
                missingCritical: operationalMissingCritical,
                missingImportant: [],
                missingOptional: []
            },
            customerDNA: {
                score: customerScore,
                filledFields: customerFilled,
                totalFields: customerTotal,
                missingCritical: customerMissingCritical,
                missingImportant: [],
                missingOptional: []
            }
        },
        userActionRequired,
        dataRequired
    };
    // ═══════════════════════════════════════════════════════════════
    // SAVE TO DNA
    // ═══════════════════════════════════════════════════════════════
    if (dna) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].storeDNA.update({
            where: {
                shopId
            },
            data: {
                completenessScore: overallScore,
                isActionable,
                missingFields: userActionRequired,
                dataBlockers: dataRequired
            }
        });
    }
    console.log(`[DNACompleteness] Shop ${shopId}: ${overallScore}% complete, Actionable: ${isActionable}, Missing fields: ${userActionRequired.length}`);
    return result;
}
async function updateDNAField(shopId, field, value) {
    const updateData = {};
    // Handle special cases for JSON fields
    if (field === 'targetAudience' && typeof value === 'string') {
        updateData[field] = {
            primaryDemographic: value
        };
    } else if (field === 'coreValues' || field === 'brandPersonality' || field === 'directCompetitors') {
        // Convert comma-separated string to array if needed
        updateData[field] = Array.isArray(value) ? value : value.split(',').map((s)=>s.trim()).filter(Boolean);
    } else {
        updateData[field] = value;
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].storeDNA.upsert({
        where: {
            shopId
        },
        update: updateData,
        create: {
            shopId,
            ...updateData
        }
    });
    console.log(`[DNACompleteness] Updated ${field} for shop ${shopId}`);
    // Recheck completeness
    await checkDNACompleteness(shopId);
}
}),
"[project]/packages/brain/src/intelligence/strategy-router.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "STRATEGY_INFO",
    ()=>STRATEGY_INFO,
    "determineExpansionStrategy",
    ()=>determineExpansionStrategy,
    "getStrategyRecommendation",
    ()=>getStrategyRecommendation
]);
/**
 * Strategy Router
 * Determines which product expansion strategy to recommend based on Brand DNA signals
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
;
function determineExpansionStrategy(signals) {
    const alternatives = [];
    // ═══════════════════════════════════════════════════════════════
    // RULE 1: If margins are stressed, don't add products
    // ═══════════════════════════════════════════════════════════════
    if (signals.marginHealthStatus === 'stressed') {
        return {
            primaryStrategy: 'OPTIMIZE_EXISTING',
            reasoning: [
                'Margin health indicates financial stress',
                'Focus on improving existing product profitability before expansion',
                'New products would add complexity without solving core margin issues'
            ],
            confidence: 0.9,
            alternativeStrategies: [],
            launchTiming: {
                recommended: 'After margin recovery',
                reasoning: 'Stabilize margins before investing in new products'
            }
        };
    }
    // ═══════════════════════════════════════════════════════════════
    // RULE 2: If highly dependent on hero + hero is accelerating
    // → Diversify with variants (reduce risk while it's hot)
    // ═══════════════════════════════════════════════════════════════
    if (signals.heroProductShare > 40 && signals.orderVelocityTrend === 'accelerating') {
        alternatives.push({
            strategy: 'HORIZONTAL_EXTENSION',
            reasoning: 'Could also introduce a complementary product in same category'
        });
        return {
            primaryStrategy: 'VARIANT_EXTENSION',
            reasoning: [
                `Hero product drives ${signals.heroProductShare.toFixed(0)}% of revenue - high concentration risk`,
                'Velocity is accelerating - capitalize on momentum while it lasts',
                'Adding variants reduces dependency risk while leveraging the winner'
            ],
            confidence: 0.85,
            alternativeStrategies: alternatives,
            launchTiming: {
                recommended: 'Now',
                reasoning: 'Strike while momentum is strong'
            }
        };
    }
    // ═══════════════════════════════════════════════════════════════
    // RULE 3: If highly dependent on hero + hero is declining
    // → Horizontal extension (same category, new product)
    // ═══════════════════════════════════════════════════════════════
    if (signals.heroProductShare > 40 && signals.orderVelocityTrend === 'declining') {
        alternatives.push({
            strategy: 'VARIANT_EXTENSION',
            reasoning: 'Could refresh the hero with new variants to revive interest'
        });
        return {
            primaryStrategy: 'HORIZONTAL_EXTENSION',
            reasoning: [
                `Hero product (${signals.heroProductShare.toFixed(0)}% of revenue) is losing momentum`,
                'Need a new flagship product in the same category',
                'Customers already trust your category expertise - give them something fresh'
            ],
            confidence: 0.8,
            alternativeStrategies: alternatives,
            launchTiming: {
                recommended: 'Within 30 days',
                reasoning: 'Urgently need to replace declining hero'
            }
        };
    }
    // ═══════════════════════════════════════════════════════════════
    // RULE 4: If cash-rich + diversified + good margins
    // → Category expansion (you can afford to experiment)
    // ═══════════════════════════════════════════════════════════════
    if (signals.inferredCashPosition === 'cash_rich' && signals.concentrationRisk === 'low' && signals.marginHealthStatus === 'healthy') {
        alternatives.push({
            strategy: 'NEW_DOMAIN_ENTRY',
            reasoning: 'Strong position could support entering completely new market'
        });
        alternatives.push({
            strategy: 'VERTICAL_EXTENSION',
            reasoning: 'Could introduce premium tier to capture higher-value segment'
        });
        return {
            primaryStrategy: 'CATEGORY_EXPANSION',
            reasoning: [
                'Strong financial position allows for strategic category bets',
                'Revenue is well diversified - experimentation risk is manageable',
                'Time to expand market reach with an adjacent category'
            ],
            confidence: 0.75,
            alternativeStrategies: alternatives,
            launchTiming: {
                recommended: signals.seasonalPosition === 'pre_peak' ? 'Before peak season' : 'When ready',
                reasoning: 'Financial runway supports thoughtful planning'
            }
        };
    }
    // ═══════════════════════════════════════════════════════════════
    // RULE 5: If category depth is shallow + winners exist
    // → Variant extension (fill out the line)
    // ═══════════════════════════════════════════════════════════════
    if (signals.categoryDepth === 'shallow' && signals.starProductCount > 0) {
        alternatives.push({
            strategy: 'HORIZONTAL_EXTENSION',
            reasoning: 'Could add complementary products instead of variants'
        });
        return {
            primaryStrategy: 'VARIANT_EXTENSION',
            reasoning: [
                'Catalog depth is shallow - clear opportunity to fill out variants',
                `${signals.starProductCount} star product(s) can be extended with more options`,
                'Lower risk than new product development - proven demand exists'
            ],
            confidence: 0.8,
            alternativeStrategies: alternatives,
            launchTiming: {
                recommended: 'Now',
                reasoning: 'Quick wins available from variant additions'
            }
        };
    }
    // ═══════════════════════════════════════════════════════════════
    // RULE 6: If breadth is narrow + margins are good
    // → Category expansion (broaden your reach)
    // Note: marginHealthStatus already checked for 'stressed' in RULE 1
    // ═══════════════════════════════════════════════════════════════
    if (signals.categoryBreadth === 'narrow') {
        alternatives.push({
            strategy: 'HORIZONTAL_EXTENSION',
            reasoning: 'Could deepen existing category before expanding'
        });
        return {
            primaryStrategy: 'CATEGORY_EXPANSION',
            reasoning: [
                'Category breadth is narrow - vulnerability to market shifts in single category',
                'Margins can support investment in new categories',
                'Basket affinity data can guide which adjacent category to enter'
            ],
            confidence: 0.7,
            alternativeStrategies: alternatives,
            launchTiming: {
                recommended: 'Within 60 days',
                reasoning: 'Diversification reduces long-term risk'
            }
        };
    }
    // ═══════════════════════════════════════════════════════════════
    // RULE 7: If approaching peak season + have cash
    // → Horizontal extension (quick wins for the season)
    // ═══════════════════════════════════════════════════════════════
    if (signals.seasonalPosition === 'pre_peak' && signals.inferredCashPosition !== 'tight' && signals.monthsUntilPeak <= 3) {
        alternatives.push({
            strategy: 'VARIANT_EXTENSION',
            reasoning: 'Variants of existing products are faster to launch'
        });
        return {
            primaryStrategy: 'HORIZONTAL_EXTENSION',
            reasoning: [
                `Peak season approaching in ${signals.monthsUntilPeak} month(s)`,
                'Time to launch complementary products for seasonal demand',
                'Lower risk than category expansion, faster time to market'
            ],
            confidence: 0.75,
            alternativeStrategies: alternatives,
            launchTiming: {
                recommended: `Within ${signals.monthsUntilPeak * 4} weeks`,
                reasoning: 'Must launch before peak to capture seasonal demand'
            }
        };
    }
    // ═══════════════════════════════════════════════════════════════
    // DEFAULT: Horizontal extension (safest growth move)
    // ═══════════════════════════════════════════════════════════════
    alternatives.push({
        strategy: 'VARIANT_EXTENSION',
        reasoning: 'Could focus on extending existing products first'
    });
    return {
        primaryStrategy: 'HORIZONTAL_EXTENSION',
        reasoning: [
            'Standard growth path: extend within known category',
            'Leverage existing brand equity and customer trust',
            'Moderate risk with moderate reward potential'
        ],
        confidence: 0.6,
        alternativeStrategies: alternatives,
        launchTiming: {
            recommended: 'When ready',
            reasoning: 'No urgent timing pressure detected'
        }
    };
}
async function getStrategyRecommendation(shopId) {
    const dna = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].storeDNA.findUnique({
        where: {
            shopId
        }
    });
    if (!dna) {
        console.log(`[StrategyRouter] No StoreDNA found for shop ${shopId}`);
        return null;
    }
    // Extract signals from DNA
    const signals = {
        heroProductShare: dna.heroProductShare ?? 0,
        top5ProductShare: dna.top5ProductShare ?? 0,
        concentrationRisk: dna.concentrationRisk ?? 'medium',
        orderVelocityTrend: dna.orderVelocityTrend ?? 'stable',
        revenueGrowth30d: dna.revenueGrowth30d ?? 0,
        marginHealthStatus: dna.marginHealthStatus ?? 'moderate',
        inferredCashPosition: dna.inferredCashPosition ?? 'balanced',
        cashCowProductCount: dna.cashCowProductCount ?? 0,
        starProductCount: dna.starProductCount ?? 0,
        categoryDepth: dna.categoryDepth ?? 'moderate',
        categoryBreadth: dna.categoryBreadth ?? 'moderate',
        seasonalPosition: dna.seasonalPosition ?? 'off_season',
        monthsUntilPeak: dna.monthsUntilPeak ?? 6
    };
    const recommendation = determineExpansionStrategy(signals);
    // Save recommendation to DNA
    await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].storeDNA.update({
        where: {
            shopId
        },
        data: {
            recommendedStrategy: recommendation.primaryStrategy,
            strategyReasons: recommendation.reasoning,
            strategyConfidence: recommendation.confidence,
            alternativeStrategies: recommendation.alternativeStrategies,
            recommendedLaunchTiming: recommendation.launchTiming.recommended,
            launchTimingReason: recommendation.launchTiming.reasoning
        }
    });
    console.log(`[StrategyRouter] Recommended ${recommendation.primaryStrategy} for shop ${shopId} (confidence: ${recommendation.confidence})`);
    return recommendation;
}
const STRATEGY_INFO = {
    VARIANT_EXTENSION: {
        name: 'Variant Extension',
        description: 'Add new sizes, colors, or materials to your existing winning products',
        riskLevel: 'low',
        timeToMarket: '2-4 weeks',
        examples: [
            'Adding new colors to your best-selling dress',
            'Introducing size XXL for popular items',
            'Offering a leather version of a canvas bag'
        ]
    },
    HORIZONTAL_EXTENSION: {
        name: 'Horizontal Extension',
        description: 'Launch a new product in the same category as your current offerings',
        riskLevel: 'medium',
        timeToMarket: '4-8 weeks',
        examples: [
            'Adding pants to complement your tops collection',
            'Launching a new serum alongside existing skincare',
            'Introducing a new flavor of your popular snack'
        ]
    },
    VERTICAL_EXTENSION: {
        name: 'Vertical Extension',
        description: 'Create a premium or budget version of existing products',
        riskLevel: 'medium',
        timeToMarket: '6-10 weeks',
        examples: [
            'Premium organic version of your bestseller',
            'Budget-friendly line for price-sensitive customers',
            'Luxury limited edition collection'
        ]
    },
    CATEGORY_EXPANSION: {
        name: 'Category Expansion',
        description: 'Enter an adjacent category that complements your current offerings',
        riskLevel: 'medium',
        timeToMarket: '8-12 weeks',
        examples: [
            'Clothing brand adding accessories',
            'Skincare brand launching makeup',
            'Coffee company adding tea products'
        ]
    },
    NEW_DOMAIN_ENTRY: {
        name: 'New Domain Entry',
        description: 'Enter a completely new product category or market',
        riskLevel: 'high',
        timeToMarket: '12-16 weeks',
        examples: [
            'Fashion brand launching home goods',
            'Food company entering wellness supplements',
            'Beauty brand creating lifestyle products'
        ]
    },
    OPTIMIZE_EXISTING: {
        name: 'Optimize Existing',
        description: 'Focus on improving current product performance before adding new products',
        riskLevel: 'low',
        timeToMarket: 'Ongoing',
        examples: [
            'Improve margins on existing products',
            'Reduce refund rates',
            'Optimize pricing strategy'
        ]
    }
};
}),
"[project]/packages/brain/src/intelligence/dna-seeder.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "seedDNAFromDomainAnalysis",
    ()=>seedDNAFromDomainAnalysis,
    "seedDNAFromShopify",
    ()=>seedDNAFromShopify
]);
/**
 * DNA Seeder
 * Auto-populates Brand DNA from Shopify data and domain analysis
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
;
async function seedDNAFromShopify(shopId) {
    console.log(`[DNASeeder] Starting DNA seed for shop ${shopId}`);
    const metrics = await gatherShopifyMetrics(shopId);
    if (!metrics) {
        console.log(`[DNASeeder] No metrics available for shop ${shopId}`);
        return;
    }
    // Calculate derived signals
    const heroProductShare = calculateHeroProductShare(metrics);
    const top5ProductShare = calculateTop5ProductShare(metrics);
    const concentrationRisk = determineConcentrationRisk(heroProductShare);
    const orderVelocityTrend = calculateVelocityTrend(metrics);
    const pricePositioning = determinePricePositioning(metrics);
    const categoryDepth = determineCategoryDepth(metrics);
    const categoryBreadth = determineCategoryBreadth(metrics);
    const priceBands = calculatePriceBands(metrics);
    const bcgMatrix = calculateBCGMatrix(metrics);
    const revenueGrowth = calculateRevenueGrowth(metrics);
    const repeatPurchaseRate = metrics.repeatCustomerCount / Math.max(1, metrics.totalCustomers);
    // Calculate topPerformingTypes from topProducts grouped by productType
    const typeRevenue = {};
    // Filter out products with unknown/missing titles
    const validProducts = metrics.topProducts.filter((p)=>p.title && p.title !== 'Unknown');
    for (const product of validProducts){
        // Use productType if set, otherwise derive from title
        let type = product.productType || '';
        if (!type || type === 'Other' || type === 'Uncategorized') {
            type = deriveProductTypeFromTitle(product.title);
        }
        if (!typeRevenue[type]) {
            typeRevenue[type] = {
                revenue: 0,
                quantity: 0
            };
        }
        typeRevenue[type].revenue += product.revenue;
        typeRevenue[type].quantity += product.quantity;
    }
    const topPerformingTypes = Object.entries(typeRevenue)// Filter out generic/fallback types
    .filter(([type])=>type && type !== 'General' && type !== 'Unknown' && type !== 'Other').map(([type, data])=>({
            type,
            revenue: data.revenue,
            revenueShare: metrics.totalRevenue > 0 ? data.revenue / metrics.totalRevenue * 100 : 0,
            growthRate: 0,
            avgOrderValue: data.quantity > 0 ? data.revenue / data.quantity : 0
        })).sort((a, b)=>b.revenue - a.revenue).slice(0, 10);
    // Build update data object
    const dnaData = {
        totalProducts: metrics.totalProducts,
        avgOrderValue: metrics.avgOrderValue,
        priceBands: priceBands,
        categoryDepth,
        categoryBreadth,
        heroProductShare,
        top5ProductShare,
        concentrationRisk,
        orderVelocityTrend,
        revenueGrowth30d: revenueGrowth,
        starProductCount: bcgMatrix.stars.length,
        cashCowProductCount: bcgMatrix.cashCows.length,
        questionMarkProductCount: bcgMatrix.questionMarks.length,
        inferredCashPosition: inferCashPosition(bcgMatrix),
        pricePositioning,
        repeatPurchaseRate,
        entryProducts: metrics.topProducts.slice(0, 3).map((p)=>p.title),
        topPerformingTypes,
        hasShopifyData: true,
        lastShopifySync: new Date()
    };
    // Upsert StoreDNA using raw query to avoid type issues
    const existingDna = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].storeDNA.findUnique({
        where: {
            shopId
        }
    });
    if (existingDna) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].storeDNA.update({
            where: {
                shopId
            },
            data: dnaData
        });
    } else {
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].storeDNA.create({
            data: {
                shopId,
                ...dnaData
            }
        });
    }
    console.log(`[DNASeeder] DNA seeded for shop ${shopId}`);
}
// ============================================
// GATHER SHOPIFY METRICS
// ============================================
async function gatherShopifyMetrics(shopId) {
    const [orderAgg, productAgg, customerAgg, products, recentOrdersCount] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].order.aggregate({
            where: {
                shopId
            },
            _count: true,
            _sum: {
                totalPrice: true
            },
            _avg: {
                totalPrice: true
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.aggregate({
            where: {
                shopId
            },
            _count: true
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].customer.aggregate({
            where: {
                shopId
            },
            _count: true
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
            where: {
                shopId
            },
            select: {
                id: true,
                title: true,
                productType: true,
                variants: {
                    select: {
                        price: true
                    }
                }
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].order.count({
            where: {
                shopId,
                createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
            }
        })
    ]);
    if (orderAgg._count === 0) {
        return null;
    }
    // Get top products by revenue using line items
    const lineItemsWithRevenue = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].orderLineItem.groupBy({
        by: [
            'productId'
        ],
        where: {
            order: {
                shopId
            },
            productId: {
                not: null
            }
        },
        _sum: {
            price: true,
            quantity: true
        },
        orderBy: {
            _sum: {
                price: 'desc'
            }
        },
        take: 20
    });
    const topProductIds = lineItemsWithRevenue.map((li)=>li.productId).filter(Boolean);
    const topProductDetails = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
        where: {
            id: {
                in: topProductIds
            }
        },
        select: {
            id: true,
            title: true,
            productType: true
        }
    });
    const topProducts = lineItemsWithRevenue.map((li)=>{
        const product = topProductDetails.find((p)=>p.id === li.productId);
        return {
            id: li.productId || '',
            title: product?.title || '',
            revenue: Number(li._sum.price || 0),
            quantity: Number(li._sum.quantity || 0),
            productType: product?.productType || undefined
        };
    }).filter((p)=>p.title && p.title.length > 0); // Filter out products without titles
    // Get distinct product types
    const productTypes = [
        ...new Set(products.map((p)=>p.productType).filter(Boolean))
    ];
    // Calculate price range
    const allPrices = products.flatMap((p)=>p.variants.map((v)=>Number(v.price))).filter((p)=>p > 0);
    const priceRange = {
        min: allPrices.length > 0 ? Math.min(...allPrices) : 0,
        max: allPrices.length > 0 ? Math.max(...allPrices) : 0,
        avg: allPrices.length > 0 ? allPrices.reduce((a, b)=>a + b, 0) / allPrices.length : 0
    };
    // Get repeat customers
    let repeatCustomerCount = 0;
    try {
        const repeatCustomers = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].$queryRaw`
      SELECT COUNT(*) as count FROM (
        SELECT "customerId"
        FROM "Order"
        WHERE "shopId" = ${shopId}
          AND "customerId" IS NOT NULL
        GROUP BY "customerId"
        HAVING COUNT(*) > 1
      ) as repeat_customers
    `;
        repeatCustomerCount = Number(repeatCustomers[0]?.count || 0);
    } catch (e) {
        repeatCustomerCount = 0;
    }
    // Get monthly revenue for trend analysis
    const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
    const orders = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].order.findMany({
        where: {
            shopId,
            createdAt: {
                gte: sixMonthsAgo
            }
        },
        select: {
            createdAt: true,
            totalPrice: true
        }
    });
    const monthlyRevenue = {};
    orders.forEach((order)=>{
        const month = order.createdAt.toISOString().slice(0, 7);
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(order.totalPrice);
    });
    return {
        totalOrders: orderAgg._count,
        totalRevenue: Number(orderAgg._sum.totalPrice || 0),
        avgOrderValue: Number(orderAgg._avg.totalPrice || 0),
        totalProducts: productAgg._count,
        totalCustomers: customerAgg._count,
        repeatCustomerCount,
        topProducts,
        productTypes,
        priceRange,
        recentOrders: recentOrdersCount,
        monthlyRevenue: Object.entries(monthlyRevenue).map(([month, revenue])=>({
                month,
                revenue
            })).sort((a, b)=>a.month.localeCompare(b.month))
    };
}
// ============================================
// CALCULATION HELPERS
// ============================================
function calculateHeroProductShare(metrics) {
    if (metrics.topProducts.length === 0 || metrics.totalRevenue === 0) return 0;
    return metrics.topProducts[0].revenue / metrics.totalRevenue * 100;
}
function calculateTop5ProductShare(metrics) {
    if (metrics.topProducts.length === 0 || metrics.totalRevenue === 0) return 0;
    const top5Revenue = metrics.topProducts.slice(0, 5).reduce((sum, p)=>sum + p.revenue, 0);
    return top5Revenue / metrics.totalRevenue * 100;
}
function determineConcentrationRisk(heroShare) {
    if (heroShare > 50) return 'high';
    if (heroShare > 30) return 'medium';
    return 'low';
}
function calculateVelocityTrend(metrics) {
    if (metrics.monthlyRevenue.length < 2) return 'stable';
    const recent = metrics.monthlyRevenue.slice(-3);
    if (recent.length < 2) return 'stable';
    const firstHalf = recent.slice(0, Math.ceil(recent.length / 2));
    const secondHalf = recent.slice(Math.ceil(recent.length / 2));
    const firstAvg = firstHalf.reduce((sum, m)=>sum + m.revenue, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, m)=>sum + m.revenue, 0) / secondHalf.length;
    const changePercent = (secondAvg - firstAvg) / Math.max(1, firstAvg) * 100;
    if (changePercent > 15) return 'accelerating';
    if (changePercent < -15) return 'declining';
    return 'stable';
}
function calculateRevenueGrowth(metrics) {
    if (metrics.monthlyRevenue.length < 2) return 0;
    const lastMonth = metrics.monthlyRevenue[metrics.monthlyRevenue.length - 1]?.revenue || 0;
    const prevMonth = metrics.monthlyRevenue[metrics.monthlyRevenue.length - 2]?.revenue || 0;
    if (prevMonth === 0) return 0;
    return (lastMonth - prevMonth) / prevMonth * 100;
}
function determinePricePositioning(metrics) {
    const avg = metrics.priceRange.avg;
    if (avg < 25) return 'budget';
    if (avg < 75) return 'mid-market';
    if (avg < 200) return 'premium';
    return 'luxury';
}
function determineCategoryDepth(metrics) {
    const avgProductsPerType = metrics.totalProducts / Math.max(1, metrics.productTypes.length);
    if (avgProductsPerType < 5) return 'shallow';
    if (avgProductsPerType < 15) return 'moderate';
    return 'deep';
}
function determineCategoryBreadth(metrics) {
    const typeCount = metrics.productTypes.length;
    if (typeCount <= 2) return 'narrow';
    if (typeCount <= 5) return 'moderate';
    return 'broad';
}
function calculatePriceBands(metrics) {
    const { min, max } = metrics.priceRange;
    const range = max - min;
    return {
        low: min + range * 0.33,
        mid: min + range * 0.66,
        high: max
    };
}
function calculateBCGMatrix(metrics) {
    const totalRevenue = metrics.totalRevenue;
    const avgShare = 100 / Math.max(1, metrics.topProducts.length);
    const stars = [];
    const cashCows = [];
    const questionMarks = [];
    const dogs = [];
    metrics.topProducts.forEach((product, idx)=>{
        const share = product.revenue / Math.max(1, totalRevenue) * 100;
        const isHighShare = share > avgShare;
        const isHighGrowth = idx < 5;
        if (isHighShare && isHighGrowth) {
            stars.push(product.title);
        } else if (isHighShare && !isHighGrowth) {
            cashCows.push(product.title);
        } else if (!isHighShare && isHighGrowth) {
            questionMarks.push(product.title);
        } else {
            dogs.push(product.title);
        }
    });
    return {
        stars,
        cashCows,
        questionMarks,
        dogs
    };
}
function inferCashPosition(bcg) {
    const hasCashCows = bcg.cashCows.length > 0;
    const hasStars = bcg.stars.length > 0;
    const manyDogs = bcg.dogs.length > 5;
    if (hasCashCows && hasStars) return 'cash_rich';
    if (manyDogs && !hasCashCows) return 'tight';
    return 'balanced';
}
function deriveProductTypeFromTitle(title) {
    if (!title || title === 'Unknown') return 'General';
    const lowerTitle = title.toLowerCase();
    // Common product type keywords - extend based on your catalog
    const typeKeywords = {
        'Haremshose': [
            'haremshose',
            'harem pants',
            'harem'
        ],
        'Palazzo': [
            'palazzo',
            'wide leg'
        ],
        'Jumpsuit': [
            'jumpsuit',
            'overall',
            'einteiler'
        ],
        'Kleid': [
            'kleid',
            'dress'
        ],
        'Top': [
            'top',
            'shirt',
            'bluse',
            'blouse'
        ],
        'Hose': [
            'hose',
            'pants',
            'trousers'
        ],
        'Rock': [
            'rock',
            'skirt'
        ],
        'Jacke': [
            'jacke',
            'jacket',
            'cardigan'
        ],
        'Loungewear': [
            'loungewear',
            'lounge'
        ],
        'Set': [
            'set',
            'combo',
            'bundle'
        ]
    };
    for (const [type, keywords] of Object.entries(typeKeywords)){
        for (const keyword of keywords){
            if (lowerTitle.includes(keyword)) {
                return type;
            }
        }
    }
    // Words to skip when extracting type from title
    const skipWords = [
        'warme',
        'warm',
        'mystery',
        'long',
        'short',
        'version',
        'new',
        'sale',
        'special'
    ];
    // Extract first significant word from title as fallback
    const words = title.split(/[\s\-–]+/).filter((w)=>w.length > 3 && !skipWords.includes(w.toLowerCase()));
    if (words.length > 0) {
        // Capitalize first letter
        return words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
    }
    return 'General';
}
async function seedDNAFromDomainAnalysis(shopId, analysis) {
    const existingDna = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].storeDNA.findUnique({
        where: {
            shopId
        }
    });
    const dnaData = {
        brandName: analysis.brandName,
        industry: analysis.industry,
        hasPublicDemoData: true
    };
    if (existingDna) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].storeDNA.update({
            where: {
                shopId
            },
            data: dnaData
        });
    } else {
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].storeDNA.create({
            data: {
                shopId,
                ...dnaData
            }
        });
    }
    console.log(`[DNASeeder] Seeded DNA from domain analysis for shop ${shopId}`);
}
}),
"[project]/packages/brain/src/intelligence/insights-engine.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyzeCustomerCohorts",
    ()=>analyzeCustomerCohorts,
    "calculateCatalogHealth",
    ()=>calculateCatalogHealth,
    "detectCannibalization",
    ()=>detectCannibalization,
    "findMarketingMoments",
    ()=>findMarketingMoments,
    "getPatternInsights",
    ()=>getPatternInsights,
    "getPriceAlerts",
    ()=>getPriceAlerts,
    "getSeasonalCalendar",
    ()=>getSeasonalCalendar,
    "gradeProducts",
    ()=>gradeProducts,
    "predictRestocks",
    ()=>predictRestocks,
    "suggestBundles",
    ()=>suggestBundles
]);
/**
 * Insights Engine
 * Unified intelligence layer for all store insights
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
;
async function calculateCatalogHealth(shopId) {
    const dnaRaw = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].storeDNA.findUnique({
        where: {
            shopId
        }
    });
    const patterns = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].patternMemory.findMany({
        where: {
            shopId
        }
    });
    if (!dnaRaw) {
        return getDefaultCatalogHealth();
    }
    // Cast to any to access dynamic fields
    const dna = dnaRaw;
    // Diversification score based on concentration risk
    const concentrationRisk = dna.concentrationRisk || 'medium';
    const heroShare = dna.heroProductShare || 0;
    const diversification = {
        score: concentrationRisk === 'low' ? 90 : concentrationRisk === 'medium' ? 65 : 35,
        label: concentrationRisk === 'low' ? 'Well Diversified' : concentrationRisk === 'medium' ? 'Moderate Risk' : 'High Concentration',
        detail: `Hero product is ${heroShare.toFixed(1)}% of revenue`
    };
    // Price coverage
    const pricePattern = patterns.find((p)=>p.patternType === 'price_band');
    const priceBands = pricePattern?.patternData?.winners || [];
    const priceCoverage = {
        score: Math.min(100, priceBands.length * 25),
        label: priceBands.length >= 4 ? 'Full Coverage' : priceBands.length >= 2 ? 'Partial Coverage' : 'Limited',
        detail: `Active in ${priceBands.length} price bands`
    };
    // Category depth
    const catDepth = dna.categoryDepth || 'moderate';
    const catBreadth = dna.categoryBreadth || 'moderate';
    const categoryDepth = {
        score: catDepth === 'deep' ? 90 : catDepth === 'moderate' ? 65 : 40,
        label: catDepth === 'deep' ? 'Deep Catalog' : catDepth === 'moderate' ? 'Moderate Depth' : 'Shallow',
        detail: `${catBreadth} category breadth`
    };
    // Velocity - use revenueGrowth30d to determine trend
    const revenueGrowth = dna.revenueGrowth30d || 0;
    const velocityTrend = revenueGrowth > 15 ? 'accelerating' : revenueGrowth > -5 ? 'stable' : 'declining';
    const velocity = {
        score: velocityTrend === 'accelerating' ? 95 : velocityTrend === 'stable' ? 70 : 40,
        label: velocityTrend === 'accelerating' ? 'Growing Fast' : velocityTrend === 'stable' ? 'Stable' : 'Slowing',
        detail: `${revenueGrowth.toFixed(1)}% growth last 30d`
    };
    // Customer loyalty
    const repeatRate = dna.repeatPurchaseRate || 0;
    const customerLoyalty = {
        score: Math.min(100, repeatRate * 200),
        label: repeatRate > 0.3 ? 'Strong Loyalty' : repeatRate > 0.15 ? 'Moderate' : 'Needs Work',
        detail: `${(repeatRate * 100).toFixed(1)}% repeat purchase rate`
    };
    const overallScore = Math.round(diversification.score * 0.2 + priceCoverage.score * 0.15 + categoryDepth.score * 0.15 + velocity.score * 0.3 + customerLoyalty.score * 0.2);
    const grade = overallScore >= 85 ? 'A' : overallScore >= 70 ? 'B' : overallScore >= 55 ? 'C' : overallScore >= 40 ? 'D' : 'F';
    const recommendations = [];
    if (diversification.score < 60) recommendations.push('Reduce dependency on hero product');
    if (priceCoverage.score < 50) recommendations.push('Expand into more price bands');
    if (velocity.score < 60) recommendations.push('Focus on marketing to boost velocity');
    if (customerLoyalty.score < 50) recommendations.push('Implement loyalty program');
    return {
        overallScore,
        grade,
        metrics: {
            diversification,
            priceCoverage,
            categoryDepth,
            velocity,
            customerLoyalty
        },
        recommendations
    };
}
function getDefaultCatalogHealth() {
    return {
        overallScore: 0,
        grade: 'F',
        metrics: {
            diversification: {
                score: 0,
                label: 'No Data',
                detail: 'Sync your store first'
            },
            priceCoverage: {
                score: 0,
                label: 'No Data',
                detail: 'Sync your store first'
            },
            categoryDepth: {
                score: 0,
                label: 'No Data',
                detail: 'Sync your store first'
            },
            velocity: {
                score: 0,
                label: 'No Data',
                detail: 'Sync your store first'
            },
            customerLoyalty: {
                score: 0,
                label: 'No Data',
                detail: 'Sync your store first'
            }
        },
        recommendations: [
            'Connect your Shopify store to get insights'
        ]
    };
}
async function getPatternInsights(shopId) {
    const patterns = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].patternMemory.findMany({
        where: {
            shopId
        }
    });
    const insights = [];
    for (const pattern of patterns){
        const data = pattern.patternData;
        if (pattern.patternType === 'color_preference' && data?.winners?.length > 0) {
            const winner = data.winners[0];
            insights.push({
                id: `color-${winner.value}`,
                type: 'color_winner',
                title: `${capitalize(winner.value)} is your champion color`,
                detail: `${(winner.successRate * 100).toFixed(0)}% success rate across ${winner.sampleSize} orders`,
                action: 'Expand this color to more product types',
                confidence: pattern.confidence,
                impact: winner.successRate > 0.8 ? 'high' : 'medium',
                icon: 'palette'
            });
        }
        if (pattern.patternType === 'cross_purchase' && data?.topPairs?.length > 0) {
            const pair = data.topPairs[0];
            insights.push({
                id: `bundle-${pair.products[0].slice(0, 10)}`,
                type: 'bundle_opportunity',
                title: 'Bundle opportunity detected',
                detail: `${pair.count} customers buy these together`,
                action: `Create bundle: ${shortenName(pair.products[0])} + ${shortenName(pair.products[1])}`,
                confidence: pattern.confidence,
                impact: pair.count > 20 ? 'high' : 'medium',
                icon: 'package'
            });
        }
        if (pattern.patternType === 'price_band' && data?.optimalBand) {
            insights.push({
                id: 'price-sweet-spot',
                type: 'price_sweet_spot',
                title: `${capitalize(data.optimalBand)} is your sweet spot`,
                detail: 'Customers convert best at this price point',
                action: 'Focus new products in this price range',
                confidence: pattern.confidence,
                impact: 'high',
                icon: 'dollar-sign'
            });
        }
        if (pattern.patternType === 'seasonal' && data?.peakMonths?.length > 0) {
            const peak = data.peakMonths[0];
            insights.push({
                id: `seasonal-${peak.month}`,
                type: 'seasonal_peak',
                title: `${peak.month} is your peak season`,
                detail: `Revenue ${(peak.avgRevenue / (data.monthlyData?.reduce((s, m)=>s + m.avgRevenue, 0) / 12 || 1) * 100 - 100).toFixed(0)}% above average`,
                action: 'Plan inventory and launches for this period',
                confidence: pattern.confidence,
                impact: 'high',
                icon: 'trending-up'
            });
        }
        if (pattern.patternType === 'category_affinity' && data?.winners?.length > 0) {
            const top = data.winners[0];
            if (top.velocityPerProduct > 5) {
                insights.push({
                    id: `category-${top.value}`,
                    type: 'growth_category',
                    title: `${top.value} has high velocity`,
                    detail: `${top.velocityPerProduct.toFixed(1)} units/product in 90 days`,
                    action: 'Consider expanding this category',
                    confidence: pattern.confidence,
                    impact: 'medium',
                    icon: 'zap'
                });
            }
        }
    }
    return insights.sort((a, b)=>{
        const impactOrder = {
            high: 0,
            medium: 1,
            low: 2
        };
        return impactOrder[a.impact] - impactOrder[b.impact];
    });
}
async function gradeProducts(shopId) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const products = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
        where: {
            shopId
        },
        include: {
            variants: {
                include: {
                    metrics: {
                        where: {
                            date: {
                                gte: sixtyDaysAgo
                            }
                        },
                        orderBy: {
                            date: 'desc'
                        }
                    }
                }
            }
        }
    });
    const grades = [];
    for (const product of products){
        const recentMetrics = product.variants.flatMap((v)=>v.metrics.filter((m)=>m.date >= thirtyDaysAgo));
        const olderMetrics = product.variants.flatMap((v)=>v.metrics.filter((m)=>m.date < thirtyDaysAgo && m.date >= sixtyDaysAgo));
        const recentRevenue = recentMetrics.reduce((s, m)=>s + Number(m.revenue), 0);
        const olderRevenue = olderMetrics.reduce((s, m)=>s + Number(m.revenue), 0);
        const recentUnits = recentMetrics.reduce((s, m)=>s + m.unitsSold, 0);
        const velocity = recentUnits / 30;
        const refundRate = 0.05; // Would calculate from actual refund data
        // Score: 40% velocity, 40% revenue, 20% low refund
        const velocityScore = Math.min(100, velocity * 10);
        const revenueScore = Math.min(100, recentRevenue / 50);
        const refundScore = (1 - refundRate) * 100;
        const score = velocityScore * 0.4 + revenueScore * 0.4 + refundScore * 0.2;
        const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : score >= 20 ? 'D' : 'F';
        let trend = 'stable';
        if (olderRevenue > 0) {
            const change = (recentRevenue - olderRevenue) / olderRevenue;
            trend = change > 0.1 ? 'up' : change < -0.1 ? 'down' : 'stable';
        }
        let recommendation = 'Keep stocked';
        if (grade === 'F') recommendation = 'Consider discontinuing';
        else if (grade === 'D') recommendation = 'Needs marketing boost';
        else if (grade === 'A') recommendation = 'Expand variants';
        grades.push({
            productId: product.id,
            title: product.title,
            grade,
            score: Math.round(score),
            metrics: {
                velocity,
                revenue: recentRevenue,
                refundRate
            },
            trend,
            recommendation
        });
    }
    return grades.sort((a, b)=>b.score - a.score);
}
async function suggestBundles(shopId) {
    const crossPurchase = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].patternMemory.findUnique({
        where: {
            shopId_patternType: {
                shopId,
                patternType: 'cross_purchase'
            }
        }
    });
    const topPairs = crossPurchase?.patternData?.topPairs || [];
    const suggestions = [];
    for(let i = 0; i < Math.min(5, topPairs.length); i++){
        const pair = topPairs[i];
        if (!pair.products || pair.products.length < 2) continue;
        suggestions.push({
            id: `bundle-${i}`,
            products: pair.products,
            productIds: [],
            coOccurrences: pair.count,
            suggestedDiscount: pair.count > 20 ? 10 : 15,
            estimatedUplift: pair.count * 15,
            bundleName: `${shortenName(pair.products[0])} + ${shortenName(pair.products[1])} Set`,
            confidence: Math.min(0.9, 0.5 + pair.count / 50)
        });
    }
    return suggestions;
}
async function getPriceAlerts(shopId) {
    const pricePattern = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].patternMemory.findUnique({
        where: {
            shopId_patternType: {
                shopId,
                patternType: 'price_band'
            }
        }
    });
    const optimalBand = pricePattern?.patternData?.optimalBand || 'value';
    const products = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
        where: {
            shopId
        },
        include: {
            variants: {
                take: 1
            }
        }
    });
    const alerts = [];
    const priceRanges = {
        'budget': [
            0,
            30
        ],
        'value': [
            30,
            60
        ],
        'mid': [
            60,
            100
        ],
        'premium': [
            100,
            200
        ],
        'luxury': [
            200,
            1000
        ]
    };
    for (const product of products){
        const price = Number(product.variants[0]?.price || 0);
        if (price === 0) continue;
        let currentBand = 'value';
        for (const [band, [min, max]] of Object.entries(priceRanges)){
            if (price >= min && price < max) {
                currentBand = band;
                break;
            }
        }
        if (currentBand !== optimalBand) {
            const [optMin, optMax] = priceRanges[optimalBand];
            alerts.push({
                productId: product.id,
                productTitle: product.title,
                currentPrice: price,
                currentBand,
                optimalBand,
                suggestion: `Consider a variant at €${optMin}-${optMax}`,
                potentialUplift: '+15-25% conversion'
            });
        }
    }
    return alerts.slice(0, 10);
}
async function getSeasonalCalendar(shopId) {
    const seasonal = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].patternMemory.findUnique({
        where: {
            shopId_patternType: {
                shopId,
                patternType: 'seasonal'
            }
        }
    });
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    const data = seasonal?.patternData;
    const monthlyData = data?.monthlyData || [];
    const peakMonths = data?.peakMonths || [];
    const slowMonths = data?.slowMonths || [];
    const avgRevenue = monthlyData.length > 0 ? monthlyData.reduce((s, m)=>s + m.avgRevenue, 0) / monthlyData.length : 1;
    return monthNames.map((month, idx)=>{
        const monthData = monthlyData.find((m)=>m.month === month);
        const revenue = monthData?.avgRevenue || 0;
        const isPeak = peakMonths.some((p)=>p.month === month);
        const isSlow = slowMonths.some((s)=>s.month === month);
        let recommendation = 'Maintain steady operations';
        let icon = 'minus';
        if (isPeak) {
            recommendation = 'Launch new products, stock up inventory';
            icon = 'rocket';
        } else if (isSlow) {
            recommendation = 'Run promotions, clear old stock';
            icon = 'tag';
        }
        return {
            month,
            monthIndex: idx,
            revenueIndex: avgRevenue > 0 ? revenue / avgRevenue : 1,
            isPeak,
            isSlow,
            recommendation,
            icon
        };
    });
}
async function detectCannibalization(shopId) {
    const products = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
        where: {
            shopId
        },
        include: {
            variants: {
                take: 1
            }
        }
    });
    const pairs = [];
    for(let i = 0; i < products.length && pairs.length < 10; i++){
        for(let j = i + 1; j < products.length && pairs.length < 10; j++){
            const p1 = products[i];
            const p2 = products[j];
            const sharedAttributes = [];
            let similarity = 0;
            // Same product type
            if (p1.productType && p1.productType === p2.productType) {
                similarity += 0.4;
                sharedAttributes.push(`Same type: ${p1.productType}`);
            }
            // Similar price
            const price1 = Number(p1.variants[0]?.price || 0);
            const price2 = Number(p2.variants[0]?.price || 0);
            if (price1 > 0 && price2 > 0 && Math.abs(price1 - price2) < 15) {
                similarity += 0.3;
                sharedAttributes.push(`Similar price: €${price1.toFixed(0)} vs €${price2.toFixed(0)}`);
            }
            // Title word overlap
            const words1 = new Set(p1.title.toLowerCase().split(/\s+/).filter((w)=>w.length > 3));
            const words2 = new Set(p2.title.toLowerCase().split(/\s+/).filter((w)=>w.length > 3));
            const overlap = [
                ...words1
            ].filter((w)=>words2.has(w)).length;
            if (overlap >= 2) {
                similarity += 0.3 * Math.min(1, overlap / 3);
                sharedAttributes.push(`${overlap} shared keywords`);
            }
            if (similarity >= 0.6) {
                pairs.push({
                    product1: {
                        id: p1.id,
                        title: p1.title
                    },
                    product2: {
                        id: p2.id,
                        title: p2.title
                    },
                    similarity: Math.round(similarity * 100),
                    sharedAttributes,
                    recommendation: similarity > 0.8 ? 'Consider consolidating' : 'Differentiate positioning'
                });
            }
        }
    }
    return pairs.sort((a, b)=>b.similarity - a.similarity);
}
async function analyzeCustomerCohorts(shopId) {
    // Get orders grouped by customer
    const orders = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].order.findMany({
        where: {
            shopId,
            customerId: {
                not: null
            }
        },
        select: {
            customerId: true,
            totalPrice: true,
            createdAt: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    // Group orders by customer
    const customerOrders = {};
    for (const order of orders){
        if (!order.customerId) continue;
        if (!customerOrders[order.customerId]) {
            customerOrders[order.customerId] = {
                orders: []
            };
        }
        customerOrders[order.customerId].orders.push({
            totalPrice: order.totalPrice,
            createdAt: order.createdAt
        });
    }
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cohorts = {
        vip: {
            count: 0,
            revenue: 0
        },
        loyal: {
            count: 0,
            revenue: 0
        },
        atRisk: {
            count: 0,
            revenue: 0
        },
        oneTime: {
            count: 0,
            revenue: 0
        },
        new: {
            count: 0,
            revenue: 0
        }
    };
    for (const customerId of Object.keys(customerOrders)){
        const customerData = customerOrders[customerId];
        const orderCount = customerData.orders.length;
        const totalRevenue = customerData.orders.reduce((s, o)=>s + Number(o.totalPrice), 0);
        const lastOrder = customerData.orders[0]?.createdAt;
        const daysSince = lastOrder ? Math.floor((Date.now() - lastOrder.getTime()) / (1000 * 60 * 60 * 24)) : 999;
        if (orderCount >= 3 && totalRevenue > 300) {
            cohorts.vip.count++;
            cohorts.vip.revenue += totalRevenue;
        } else if (orderCount >= 2) {
            cohorts.loyal.count++;
            cohorts.loyal.revenue += totalRevenue;
        } else if (orderCount === 1 && daysSince > 90) {
            cohorts.atRisk.count++;
            cohorts.atRisk.revenue += totalRevenue;
        } else if (orderCount === 1 && daysSince <= 30) {
            cohorts.new.count++;
            cohorts.new.revenue += totalRevenue;
        } else {
            cohorts.oneTime.count++;
            cohorts.oneTime.revenue += totalRevenue;
        }
    }
    const total = Object.keys(customerOrders).length || 1;
    return [
        {
            name: 'VIP',
            count: cohorts.vip.count,
            percentage: cohorts.vip.count / total * 100,
            totalRevenue: cohorts.vip.revenue,
            avgOrderValue: cohorts.vip.count > 0 ? cohorts.vip.revenue / cohorts.vip.count : 0,
            color: '#f59e0b',
            action: 'Exclusive early access & perks'
        },
        {
            name: 'Loyal',
            count: cohorts.loyal.count,
            percentage: cohorts.loyal.count / total * 100,
            totalRevenue: cohorts.loyal.revenue,
            avgOrderValue: cohorts.loyal.count > 0 ? cohorts.loyal.revenue / cohorts.loyal.count : 0,
            color: '#10b981',
            action: 'Loyalty rewards program'
        },
        {
            name: 'New',
            count: cohorts.new.count,
            percentage: cohorts.new.count / total * 100,
            totalRevenue: cohorts.new.revenue,
            avgOrderValue: cohorts.new.count > 0 ? cohorts.new.revenue / cohorts.new.count : 0,
            color: '#3b82f6',
            action: 'Welcome series & second purchase incentive'
        },
        {
            name: 'One-Time',
            count: cohorts.oneTime.count,
            percentage: cohorts.oneTime.count / total * 100,
            totalRevenue: cohorts.oneTime.revenue,
            avgOrderValue: cohorts.oneTime.count > 0 ? cohorts.oneTime.revenue / cohorts.oneTime.count : 0,
            color: '#6b7280',
            action: 'Re-engagement campaign'
        },
        {
            name: 'At Risk',
            count: cohorts.atRisk.count,
            percentage: cohorts.atRisk.count / total * 100,
            totalRevenue: cohorts.atRisk.revenue,
            avgOrderValue: cohorts.atRisk.count > 0 ? cohorts.atRisk.revenue / cohorts.atRisk.count : 0,
            color: '#ef4444',
            action: 'Win-back campaign with discount'
        }
    ];
}
async function predictRestocks(shopId) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const products = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
        where: {
            shopId
        },
        include: {
            variants: {
                include: {
                    metrics: {
                        where: {
                            date: {
                                gte: thirtyDaysAgo
                            }
                        }
                    }
                }
            }
        }
    });
    const alerts = [];
    for (const product of products){
        const totalUnits = product.variants.reduce((s, v)=>s + v.metrics.reduce((ss, m)=>ss + m.unitsSold, 0), 0);
        const dailyVelocity = totalUnits / 30;
        const currentStock = product.variants.reduce((s, v)=>s + (v.inventoryQuantity || 0), 0);
        const daysUntilStockout = dailyVelocity > 0 ? currentStock / dailyVelocity : 999;
        let urgency = 'ok';
        if (daysUntilStockout < 7) urgency = 'critical';
        else if (daysUntilStockout < 14) urgency = 'warning';
        if (urgency !== 'ok' || dailyVelocity > 0.5) {
            alerts.push({
                productId: product.id,
                productTitle: product.title,
                currentStock,
                dailyVelocity: Math.round(dailyVelocity * 10) / 10,
                daysUntilStockout: Math.round(daysUntilStockout),
                urgency,
                suggestedReorder: Math.round(dailyVelocity * 45) // 45 day supply
            });
        }
    }
    return alerts.sort((a, b)=>a.daysUntilStockout - b.daysUntilStockout).slice(0, 15);
}
async function findMarketingMoments(shopId) {
    const seasonal = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].patternMemory.findUnique({
        where: {
            shopId_patternType: {
                shopId,
                patternType: 'seasonal'
            }
        }
    });
    const crossPurchase = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].patternMemory.findUnique({
        where: {
            shopId_patternType: {
                shopId,
                patternType: 'cross_purchase'
            }
        }
    });
    const cohorts = await analyzeCustomerCohorts(shopId);
    const moments = [];
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleString('en', {
        month: 'short'
    });
    const seasonalData = seasonal?.patternData;
    const peakMonths = seasonalData?.peakMonths || [];
    const slowMonths = seasonalData?.slowMonths || [];
    // Peak month coming - product launch
    if (peakMonths.some((p)=>p.month === nextMonth)) {
        moments.push({
            id: 'launch-peak',
            type: 'product_launch',
            timing: `Early ${nextMonth}`,
            title: 'Peak Season Launch Window',
            description: `${nextMonth} is historically your best month. Launch new products now.`,
            targetAudience: 'All customers',
            expectedImpact: '+20-40% revenue vs off-peak',
            priority: 'high'
        });
    }
    // Slow month coming - flash sale
    if (slowMonths.some((s)=>s.month === nextMonth)) {
        moments.push({
            id: 'flash-slow',
            type: 'flash_sale',
            timing: `Start of ${nextMonth}`,
            title: 'Pre-emptive Flash Sale',
            description: `${nextMonth} typically underperforms. Run a flash sale to boost traffic.`,
            targetAudience: 'Email subscribers',
            expectedImpact: 'Mitigate 15-25% revenue dip',
            priority: 'high'
        });
    }
    // Bundle promo from cross-purchase
    const topPairs = crossPurchase?.patternData?.topPairs || [];
    if (topPairs.length > 0) {
        moments.push({
            id: 'bundle-promo',
            type: 'bundle_promo',
            timing: 'This week',
            title: 'Bundle Campaign',
            description: `Promote top bundle: ${shortenName(topPairs[0].products[0])} + ${shortenName(topPairs[0].products[1])}`,
            targetAudience: 'Past purchasers of either product',
            expectedImpact: `+€${(topPairs[0].count * 15).toFixed(0)}/month potential`,
            priority: 'medium'
        });
    }
    // Win-back for at-risk
    const atRisk = cohorts.find((c)=>c.name === 'At Risk');
    if (atRisk && atRisk.count > 10) {
        moments.push({
            id: 'winback',
            type: 'winback',
            timing: 'Next 7 days',
            title: 'Win-Back Campaign',
            description: `${atRisk.count} customers haven't ordered in 90+ days`,
            targetAudience: 'At-risk segment',
            expectedImpact: `Recover €${(atRisk.count * 50).toFixed(0)} potential revenue`,
            priority: 'medium'
        });
    }
    // VIP appreciation
    const vip = cohorts.find((c)=>c.name === 'VIP');
    if (vip && vip.count > 5) {
        moments.push({
            id: 'vip-love',
            type: 'loyalty',
            timing: 'Ongoing',
            title: 'VIP Appreciation',
            description: `${vip.count} VIPs drive significant revenue. Show them love.`,
            targetAudience: 'VIP segment',
            expectedImpact: 'Increase LTV by 20%+',
            priority: 'low'
        });
    }
    return moments.sort((a, b)=>{
        const priorityOrder = {
            high: 0,
            medium: 1,
            low: 2
        };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
}
// ============================================
// HELPERS
// ============================================
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function shortenName(name) {
    const shortened = name.replace(/^(Warme Loungewear |Warme |Mystery )/i, '').replace(/ Long Version$/i, '').replace(/ Short Version$/i, '');
    return shortened.length > 25 ? shortened.substring(0, 22) + '...' : shortened;
}
}),
"[project]/packages/brain/src/agents/launch-kit-agent.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateLaunchKit",
    ()=>generateLaunchKit,
    "getLaunchKit",
    ()=>getLaunchKit,
    "getLaunchKits",
    ()=>getLaunchKits
]);
/**
 * Launch Kit Agent
 * Product launch strategy, copy generation, and success planning
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/client.mjs [app-rsc] (ecmascript) <export OpenAI as default>");
;
;
// ============================================
// LAUNCH STRATEGY GENERATOR
// ============================================
async function generateLaunchStrategy(input) {
    // Get store DNA for context
    const storeDNA = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].storeDNA.findUnique({
        where: {
            shopId: input.shopId
        }
    });
    const seasonality = storeDNA?.seasonalityCurve || [];
    const currentMonth = new Date().getMonth();
    // Find peak month
    const peakMonth = seasonality.reduce((best, current)=>{
        if (!best || current.revenueIndex > best.revenueIndex) return current;
        return best;
    }, null);
    // Determine launch timing
    const monthsUntilPeak = peakMonth ? (peakMonth.month - currentMonth + 12) % 12 : 1;
    const timing = {
        recommendedLaunch: monthsUntilPeak <= 2 ? 'Launch now to catch upcoming peak' : `Launch in ${monthsUntilPeak - 1} months, 1 month before peak`,
        peakMonth: peakMonth?.monthName || 'Unknown',
        reasoning: peakMonth ? `${peakMonth.monthName} shows ${Math.round(peakMonth.revenueIndex * 100)}% of average revenue` : 'Insufficient data for seasonality analysis'
    };
    // Channel prioritization based on price point
    const channels = {
        primary: input.targetPrice > 100 ? 'Email to existing customers' : 'Social media',
        secondary: input.targetPrice > 100 ? [
            'Instagram stories',
            'SMS',
            'Influencer seeding'
        ] : [
            'Email newsletter',
            'Google Shopping',
            'TikTok'
        ],
        prioritization: input.targetPrice > 100 ? 'Focus on existing customers and premium positioning' : 'Maximize reach with social and paid acquisition'
    };
    // Budget suggestion (roughly 10-15% of target first month revenue)
    const estimatedFirstMonthUnits = input.targetPrice > 100 ? 20 : 50;
    const estimatedRevenue = estimatedFirstMonthUnits * input.targetPrice;
    const suggestedBudget = Math.round(estimatedRevenue * 0.12);
    const budget = {
        suggested: suggestedBudget,
        breakdown: {
            'Paid Social': Math.round(suggestedBudget * 0.4),
            'Email/SMS': Math.round(suggestedBudget * 0.1),
            'Influencer': Math.round(suggestedBudget * 0.3),
            'Creative': Math.round(suggestedBudget * 0.2)
        }
    };
    return {
        timing,
        channels,
        budget
    };
}
// ============================================
// COPY ASSETS GENERATOR (LLM)
// ============================================
async function generateCopyAssets(input) {
    // Get brand voice for context
    const brandVoice = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].brandVoice.findUnique({
        where: {
            shopId: input.shopId
        }
    });
    const toneDescription = brandVoice?.toneAttributes?.join(', ') || 'professional, friendly';
    const prompt = `Generate marketing copy for a new product launch.

Product: ${input.productName}
Type: ${input.productType}
Price: €${input.targetPrice}
Description: ${input.description || 'A new addition to our collection'}
Brand Voice: ${toneDescription}

Generate:
1. A compelling headline (max 8 words)
2. A tagline (max 12 words)
3. Product description (2-3 sentences)
4. Email subject line (max 50 chars)
5. Three social media posts (Instagram-style, with emojis)

Return as JSON with keys: headline, tagline, description, emailSubject, socialPosts (array)`;
    try {
        const openai = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]();
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            response_format: {
                type: 'json_object'
            },
            temperature: 0.8
        });
        const content = response.choices[0].message.content || '{}';
        const parsed = JSON.parse(content);
        return {
            headline: parsed.headline || `Introducing ${input.productName}`,
            tagline: parsed.tagline || 'Your new favorite is here',
            description: parsed.description || input.description || '',
            emailSubject: parsed.emailSubject || `New Arrival: ${input.productName}`,
            socialPosts: parsed.socialPosts || [
                `✨ New drop alert! ${input.productName} is here`,
                `Just launched: ${input.productName} 🚀`,
                `The wait is over! Shop ${input.productName} now 🛒`
            ]
        };
    } catch (error) {
        console.error('[LaunchKit] Copy generation failed:', error);
        return {
            headline: `Introducing ${input.productName}`,
            tagline: 'Your new favorite is here',
            description: input.description || '',
            emailSubject: `New: ${input.productName}`,
            socialPosts: [
                `✨ Just launched: ${input.productName}`,
                `New arrival alert! 🚀`,
                `Shop our newest addition 🛒`
            ]
        };
    }
}
// ============================================
// PRICING STRATEGY
// ============================================
async function generatePricingStrategy(input) {
    const storeDNA = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].storeDNA.findUnique({
        where: {
            shopId: input.shopId
        }
    });
    const priceBands = storeDNA?.priceBands;
    // Find the best performing band near target price
    let nearestBand = null;
    if (Array.isArray(priceBands) && priceBands.length > 0) {
        nearestBand = priceBands.reduce((best, band)=>{
            const bandMid = (band.min + band.max) / 2;
            const distance = Math.abs(bandMid - input.targetPrice);
            if (!best || distance < best.distance) {
                return {
                    ...band,
                    distance
                };
            }
            return best;
        }, null);
    } else if (priceBands && typeof priceBands === 'object') {
        // Object format: { low, mid, high } - use thresholds to find nearest band
        const bands = [
            {
                band: 'budget',
                min: 0,
                max: priceBands.low || 30
            },
            {
                band: 'mid',
                min: priceBands.low || 30,
                max: priceBands.mid || 100
            },
            {
                band: 'premium',
                min: priceBands.mid || 100,
                max: priceBands.high || 200
            }
        ];
        nearestBand = bands.reduce((best, band)=>{
            const bandMid = (band.min + band.max) / 2;
            const distance = Math.abs(bandMid - input.targetPrice);
            if (!best || distance < best.distance) {
                return {
                    ...band,
                    distance
                };
            }
            return best;
        }, null);
    }
    // Intro pricing (10-15% off for launch)
    const introDiscountPercent = nearestBand?.refundRate > 10 ? 10 : 15;
    const introPrice = Math.round(input.targetPrice * (1 - introDiscountPercent / 100) * 100) / 100;
    // Get potential bundle products
    const topProducts = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
        where: {
            shopId: input.shopId
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 5,
        select: {
            title: true
        }
    });
    const bundleOptions = topProducts.slice(0, 2).map((p, i)=>({
            name: `${input.productName} + ${p.title}`,
            products: [
                input.productName,
                p.title
            ],
            bundlePrice: Math.round(input.targetPrice * 1.6 * 100) / 100,
            savings: Math.round(input.targetPrice * 0.15 * 100) / 100
        }));
    return {
        msrp: input.targetPrice,
        introPrice,
        introDiscountPercent,
        bundleOptions
    };
}
// ============================================
// SUCCESS METRICS
// ============================================
function generateSuccessMetrics(input, strategy) {
    const estimatedFirstWeekUnits = input.targetPrice > 100 ? 5 : 15;
    const estimatedFirstMonthUnits = estimatedFirstWeekUnits * 3;
    return {
        day7Target: {
            units: estimatedFirstWeekUnits,
            revenue: Math.round(estimatedFirstWeekUnits * input.targetPrice)
        },
        day30Target: {
            units: estimatedFirstMonthUnits,
            revenue: Math.round(estimatedFirstMonthUnits * input.targetPrice)
        },
        breakeven: {
            units: Math.ceil(strategy.budget.suggested / (input.targetPrice * 0.4)),
            days: 30
        }
    };
}
async function generateLaunchKit(input) {
    console.log(`[LaunchKit] Generating kit for: ${input.productName}`);
    // Generate all components
    const [strategy, copyAssets, pricing] = await Promise.all([
        generateLaunchStrategy(input),
        generateCopyAssets(input),
        generatePricingStrategy(input)
    ]);
    const successMetrics = generateSuccessMetrics(input, strategy);
    // Build risk mitigation
    const riskMitigation = {
        topRisks: [
            {
                risk: 'Low initial traction',
                mitigation: 'Prepare retargeting campaign',
                severity: 'medium'
            },
            {
                risk: 'Price sensitivity',
                mitigation: 'A/B test with different intro discounts',
                severity: 'low'
            },
            {
                risk: 'Supply issues',
                mitigation: 'Start with limited quantity messaging',
                severity: 'low'
            }
        ],
        mitigationSteps: [
            'Monitor first 48 hours closely',
            'Prepare backup creative assets',
            'Have customer support briefed'
        ]
    };
    // Pre-launch checklist
    const prelaunchChecklist = [
        {
            task: 'Product photography ready',
            status: 'pending',
            owner: 'Marketing',
            dueDate: '-7 days'
        },
        {
            task: 'Email campaign drafted',
            status: 'pending',
            owner: 'Marketing',
            dueDate: '-5 days'
        },
        {
            task: 'Social posts scheduled',
            status: 'pending',
            owner: 'Social',
            dueDate: '-3 days'
        },
        {
            task: 'Inventory confirmed',
            status: 'pending',
            owner: 'Operations',
            dueDate: '-2 days'
        },
        {
            task: 'Team briefed',
            status: 'pending',
            owner: 'All',
            dueDate: '-1 day'
        }
    ];
    // Save to database
    const launchKit = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].launchKit.create({
        data: {
            shopId: input.shopId,
            candidateId: input.candidateId || null,
            productName: input.productName,
            productType: input.productType,
            targetPrice: input.targetPrice,
            launchStrategy: strategy,
            copyAssets: copyAssets,
            pricingStrategy: pricing,
            targetAudience: {
                primaryPersona: 'Existing customers',
                secondaryPersona: 'Social followers',
                messaging: copyAssets.tagline
            },
            successMetrics: successMetrics,
            riskMitigation: riskMitigation,
            prelaunchChecklist: prelaunchChecklist,
            status: 'draft'
        }
    });
    console.log(`[LaunchKit] Created kit ID: ${launchKit.id}`);
    return launchKit;
}
async function getLaunchKits(shopId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].launchKit.findMany({
        where: {
            shopId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}
async function getLaunchKit(id) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].launchKit.findUnique({
        where: {
            id
        }
    });
}
}),
"[project]/packages/brain/src/agents/retention-agent.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateRFM",
    ()=>calculateRFM,
    "generateRetentionInsights",
    ()=>generateRetentionInsights,
    "getRetentionSummary",
    ()=>getRetentionSummary
]);
/**
 * Retention Agent
 * RFM analysis, churn prediction, and retention insights
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
;
// ============================================
// HELPERS
// ============================================
function toNumber(val) {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;
    return Number(val);
}
function calculateRFMScore(value, thresholds) {
    // Higher value = higher score for Frequency and Monetary
    if (value >= thresholds[0]) return 5;
    if (value >= thresholds[1]) return 4;
    if (value >= thresholds[2]) return 3;
    if (value >= thresholds[3]) return 2;
    return 1;
}
function calculateRecencyScore(daysSince, thresholds) {
    // Lower days = higher score for Recency
    if (daysSince <= thresholds[0]) return 5;
    if (daysSince <= thresholds[1]) return 4;
    if (daysSince <= thresholds[2]) return 3;
    if (daysSince <= thresholds[3]) return 2;
    return 1;
}
function determineSegment(r, f, m) {
    const rfm = `${r}${f}${m}`;
    // Champions: High in all dimensions
    if (r >= 4 && f >= 4 && m >= 4) return 'champions';
    // Loyal: High frequency and monetary
    if (f >= 4 && m >= 4) return 'loyal';
    // Potential Loyal: Recent with medium frequency
    if (r >= 4 && (f === 3 || f === 4) && m >= 3) return 'potential_loyal';
    // New: Very recent, low frequency
    if (r >= 4 && f === 1) return 'new';
    // Promising: Recent with low to medium frequency
    if (r >= 3 && f <= 2 && m <= 2) return 'promising';
    // Need Attention: Above average in all
    if (r === 3 && f === 3 && m === 3) return 'need_attention';
    // About to Sleep: Below average recency
    if (r === 2 && f >= 2 && m >= 2) return 'about_to_sleep';
    // At Risk: High value but haven't purchased recently
    if (r <= 2 && f >= 3 && m >= 3) return 'at_risk';
    // Hibernating: Low recency, low frequency
    if (r <= 2 && f <= 2) return 'hibernating';
    // Lost: Lowest in all
    if (r === 1 && f === 1) return 'lost';
    return 'need_attention';
}
function calculateChurnRisk(r, f, daysSince, avgFrequency) {
    // Base risk from RFM scores
    let risk = 0;
    // Recency is the strongest predictor
    risk += (5 - r) * 0.15;
    // Low frequency increases risk
    risk += (5 - f) * 0.05;
    // If days since last order exceeds average by 2x, high risk
    if (avgFrequency > 0 && daysSince > avgFrequency * 2) {
        risk += 0.3;
    }
    return Math.min(1, Math.max(0, risk));
}
async function calculateRFM(shopId) {
    console.log(`[RetentionAgent] Calculating RFM for shop: ${shopId}`);
    // Get all customers with orders
    const customers = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].customer.findMany({
        where: {
            shopId
        },
        select: {
            id: true,
            shopifyId: true
        }
    });
    // Get all orders grouped by customer
    const orders = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].order.findMany({
        where: {
            shopId,
            customerId: {
                not: null
            }
        },
        select: {
            customerId: true,
            totalPrice: true,
            createdAt: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    // Group orders by customer
    const customerOrders = new Map();
    for (const order of orders){
        if (!order.customerId) continue;
        const existing = customerOrders.get(order.customerId) || [];
        existing.push(order);
        customerOrders.set(order.customerId, existing);
    }
    // Calculate RFM values for each customer
    const now = new Date();
    const rfmValues = [];
    for (const [customerId, custOrders] of customerOrders.entries()){
        if (custOrders.length === 0) continue;
        const lastOrder = custOrders[0];
        const daysSince = Math.floor((now.getTime() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        const totalSpent = custOrders.reduce((sum, o)=>sum + toNumber(o.totalPrice), 0);
        rfmValues.push({
            customerId,
            daysSince,
            orderCount: custOrders.length,
            totalSpent
        });
    }
    if (rfmValues.length === 0) {
        return [];
    }
    // Calculate percentile thresholds
    const recencyValues = rfmValues.map((r)=>r.daysSince).sort((a, b)=>a - b);
    const frequencyValues = rfmValues.map((r)=>r.orderCount).sort((a, b)=>b - a);
    const monetaryValues = rfmValues.map((r)=>r.totalSpent).sort((a, b)=>b - a);
    const getPercentile = (arr, p)=>arr[Math.floor(arr.length * p)] || arr[0];
    const recencyThresholds = [
        getPercentile(recencyValues, 0.2),
        getPercentile(recencyValues, 0.4),
        getPercentile(recencyValues, 0.6),
        getPercentile(recencyValues, 0.8)
    ];
    const frequencyThresholds = [
        getPercentile(frequencyValues, 0.2),
        getPercentile(frequencyValues, 0.4),
        getPercentile(frequencyValues, 0.6),
        getPercentile(frequencyValues, 0.8)
    ];
    const monetaryThresholds = [
        getPercentile(monetaryValues, 0.2),
        getPercentile(monetaryValues, 0.4),
        getPercentile(monetaryValues, 0.6),
        getPercentile(monetaryValues, 0.8)
    ];
    // Calculate average order frequency
    const avgFrequency = rfmValues.reduce((sum, r)=>sum + r.daysSince, 0) / rfmValues.length;
    // Generate RFM data
    const rfmData = [];
    for (const customer of rfmValues){
        const r = calculateRecencyScore(customer.daysSince, recencyThresholds);
        const f = calculateRFMScore(customer.orderCount, frequencyThresholds);
        const m = calculateRFMScore(customer.totalSpent, monetaryThresholds);
        const segment = determineSegment(r, f, m);
        const churnRisk = calculateChurnRisk(r, f, customer.daysSince, avgFrequency);
        // Predict next order based on average frequency
        const avgDaysBetweenOrders = customer.orderCount > 1 ? customer.daysSince / (customer.orderCount - 1) : null;
        const predictedNextOrderDays = avgDaysBetweenOrders ? Math.max(0, Math.round(avgDaysBetweenOrders - customer.daysSince)) : null;
        rfmData.push({
            customerId: customer.customerId,
            recencyScore: r,
            frequencyScore: f,
            monetaryScore: m,
            rfmSegment: segment,
            daysSinceLastOrder: customer.daysSince,
            totalOrders: customer.orderCount,
            totalSpent: Math.round(customer.totalSpent * 100) / 100,
            avgOrderValue: Math.round(customer.totalSpent / customer.orderCount * 100) / 100,
            churnRisk: Math.round(churnRisk * 100) / 100,
            predictedNextOrderDays
        });
    }
    // Save to database
    for (const data of rfmData){
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].customerRFM.upsert({
            where: {
                id: `${shopId}-${data.customerId}`
            },
            update: {
                recencyScore: data.recencyScore,
                frequencyScore: data.frequencyScore,
                monetaryScore: data.monetaryScore,
                rfmSegment: data.rfmSegment,
                daysSinceLastOrder: data.daysSinceLastOrder,
                totalOrders: data.totalOrders,
                totalSpent: data.totalSpent,
                avgOrderValue: data.avgOrderValue,
                churnRisk: data.churnRisk,
                predictedNextOrderDays: data.predictedNextOrderDays,
                computedAt: new Date()
            },
            create: {
                id: `${shopId}-${data.customerId}`,
                shopId,
                customerId: data.customerId,
                recencyScore: data.recencyScore,
                frequencyScore: data.frequencyScore,
                monetaryScore: data.monetaryScore,
                rfmSegment: data.rfmSegment,
                daysSinceLastOrder: data.daysSinceLastOrder,
                totalOrders: data.totalOrders,
                totalSpent: data.totalSpent,
                avgOrderValue: data.avgOrderValue,
                churnRisk: data.churnRisk,
                predictedNextOrderDays: data.predictedNextOrderDays
            }
        });
    }
    console.log(`[RetentionAgent] Calculated RFM for ${rfmData.length} customers`);
    return rfmData;
}
async function generateRetentionInsights(shopId) {
    // First calculate RFM
    const rfmData = await calculateRFM(shopId);
    if (rfmData.length === 0) return [];
    // Group by segment
    const segmentGroups = new Map();
    for (const data of rfmData){
        const existing = segmentGroups.get(data.rfmSegment) || [];
        existing.push(data);
        segmentGroups.set(data.rfmSegment, existing);
    }
    const insights = [];
    // At-Risk Segment
    const atRisk = segmentGroups.get('at_risk') || [];
    if (atRisk.length > 0) {
        const revenueAtRisk = atRisk.reduce((sum, c)=>sum + c.totalSpent, 0);
        insights.push({
            segmentType: 'at_risk',
            customerCount: atRisk.length,
            revenueAtRisk,
            avgChurnProbability: atRisk.reduce((sum, c)=>sum + c.churnRisk, 0) / atRisk.length,
            recommendedAction: 'Send win-back email campaign with personalized discount',
            actionType: 'win_back',
            campaignSuggestion: {
                channel: 'email',
                timing: 'within 7 days',
                offer: '15% off next purchase',
                messaging: 'We miss you! Come back for an exclusive offer'
            },
            expectedLift: 0.15,
            confidence: 0.75
        });
    }
    // Champions
    const champions = segmentGroups.get('champions') || [];
    if (champions.length > 0) {
        insights.push({
            segmentType: 'vip',
            customerCount: champions.length,
            revenueAtRisk: 0,
            recommendedAction: 'Invite to VIP program or early access',
            actionType: 'loyalty_reward',
            campaignSuggestion: {
                channel: 'email',
                timing: 'this week',
                offer: 'Early access to new arrivals',
                messaging: 'As a valued VIP customer, you get first look'
            },
            expectedLift: 0.2,
            confidence: 0.85
        });
    }
    // Hibernating
    const hibernating = segmentGroups.get('hibernating') || [];
    if (hibernating.length > 0) {
        insights.push({
            segmentType: 'dormant',
            customerCount: hibernating.length,
            revenueAtRisk: hibernating.reduce((sum, c)=>sum + c.totalSpent * 0.3, 0),
            avgReactivationProbability: 0.1,
            recommendedAction: 'Deep discount reactivation campaign',
            actionType: 'win_back',
            campaignSuggestion: {
                channel: 'email',
                timing: 'within 14 days',
                offer: '25% off or free shipping',
                messaging: 'It\'s been a while! Here\'s something special.'
            },
            expectedLift: 0.08,
            confidence: 0.6
        });
    }
    // Save insights to database
    for (const insight of insights){
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].retentionInsight.create({
            data: {
                shopId,
                segmentType: insight.segmentType,
                customerCount: insight.customerCount,
                revenueAtRisk: insight.revenueAtRisk || 0,
                churnProbability: insight.avgChurnProbability,
                reactivationProbability: insight.avgReactivationProbability,
                recommendedAction: insight.recommendedAction,
                actionType: insight.actionType,
                campaignSuggestion: insight.campaignSuggestion,
                expectedLift: insight.expectedLift,
                confidence: insight.confidence
            }
        });
    }
    return insights;
}
async function getRetentionSummary(shopId) {
    const rfm = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].customerRFM.findMany({
        where: {
            shopId
        }
    });
    const segmentBreakdown = {};
    let atRiskCount = 0;
    let revenueAtRisk = 0;
    for (const customer of rfm){
        segmentBreakdown[customer.rfmSegment] = (segmentBreakdown[customer.rfmSegment] || 0) + 1;
        if (customer.rfmSegment === 'at_risk' || customer.rfmSegment === 'hibernating') {
            atRiskCount++;
            revenueAtRisk += toNumber(customer.totalSpent) * 0.3;
        }
    }
    const insights = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].retentionInsight.findMany({
        where: {
            shopId,
            status: 'active'
        },
        orderBy: {
            revenueAtRisk: 'desc'
        },
        take: 5
    });
    return {
        totalCustomers: rfm.length,
        segmentBreakdown,
        atRiskCount,
        revenueAtRisk: Math.round(revenueAtRisk),
        topInsights: insights
    };
}
}),
"[project]/packages/brain/src/nexthit/candidate-scorer.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SCORING_VERSION",
    ()=>SCORING_VERSION,
    "SCORING_WEIGHTS",
    ()=>SCORING_WEIGHTS,
    "scoreAndFilterCandidates",
    ()=>scoreAndFilterCandidates
]);
/**
 * Unified Candidate Scorer
 * Single scoring pipeline that uses the deterministic formula v1.0.0
 *
 * SCORING FORMULA v1.0.0:
 * SCORE = (0.25×store_fit + 0.20×gap_fill + 0.20×trend + 0.15×margin + 0.10×competition + 0.10×seasonality)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$trends$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/trends.ts [app-rsc] (ecmascript)");
;
;
;
const SCORING_VERSION = '1.0.0';
const SCORING_WEIGHTS = {
    storeFit: 0.25,
    gapFill: 0.20,
    trendMomentum: 0.20,
    marginPotential: 0.15,
    competition: 0.10,
    seasonalityMatch: 0.10
};
async function scoreAndFilterCandidates(shopId, candidates) {
    console.log(`[CandidateScorer] Scoring ${candidates.length} candidates with unified formula v${SCORING_VERSION}`);
    // Load all context data once
    const context = await loadScoringContext(shopId, candidates);
    const scoredCandidates = [];
    for (const candidate of candidates){
        const scores = {
            storeFit: calculateStoreFitScore(candidate, context),
            gapFill: calculateGapFillScore(candidate, context),
            trendMomentum: calculateTrendMomentum(candidate, context),
            marginPotential: calculateMarginPotential(candidate, context),
            competition: calculateCompetitionScore(candidate, context),
            seasonalityMatch: calculateSeasonalityMatch(candidate, context)
        };
        // Calculate weighted total score using unified formula
        const totalScore = scores.storeFit * SCORING_WEIGHTS.storeFit + scores.gapFill * SCORING_WEIGHTS.gapFill + scores.trendMomentum * SCORING_WEIGHTS.trendMomentum + scores.marginPotential * SCORING_WEIGHTS.marginPotential + scores.competition * SCORING_WEIGHTS.competition + scores.seasonalityMatch * SCORING_WEIGHTS.seasonalityMatch;
        const inputHash = computeInputHash(candidate, context, shopId);
        const scoreExplanation = generateExplanation(scores, candidate);
        scoredCandidates.push({
            ...candidate,
            scores,
            totalScore: Math.round(totalScore * 100) / 100,
            rank: 0,
            scoreExplanation,
            inputHash
        });
    }
    // Sort by total score and assign ranks
    scoredCandidates.sort((a, b)=>b.totalScore - a.totalScore);
    scoredCandidates.forEach((c, i)=>c.rank = i + 1);
    // Return top 10
    const top10 = scoredCandidates.slice(0, 10);
    // Persist top 10 to database
    await persistCandidates(shopId, top10);
    console.log(`[CandidateScorer] Returning top 10 candidates`);
    return top10;
}
// ============================================
// CONTEXT LOADING
// ============================================
async function loadScoringContext(shopId, candidates) {
    const [storeDNA, catalogGaps, patterns, existingProducts] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].storeDNA.findUnique({
            where: {
                shopId
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].catalogGap.findMany({
            where: {
                shopId,
                status: 'active'
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].patternMemory.findMany({
            where: {
                shopId
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
            where: {
                shopId
            },
            select: {
                title: true,
                productType: true
            }
        })
    ]);
    const seasonalityData = storeDNA?.seasonalityCurve || [];
    // Fetch trend data for candidate keywords
    const trendData = new Map();
    const keywords = new Set();
    for (const candidate of candidates){
        // Extract keywords from title and evidence
        const words = candidate.title.toLowerCase().split(/\s+/).filter((w)=>w.length > 3);
        words.forEach((w)=>keywords.add(w));
        if (candidate.patternEvidence?.category) {
            keywords.add(candidate.patternEvidence.category.toLowerCase());
        }
        if (candidate.patternEvidence?.suggestedLine) {
            keywords.add(candidate.patternEvidence.suggestedLine.toLowerCase());
        }
    }
    // Fetch trends for keywords (limit to 10 to avoid rate limiting)
    const keywordsArray = Array.from(keywords).slice(0, 10);
    for (const keyword of keywordsArray){
        try {
            const trend = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$trends$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTrendData"])(keyword);
            trendData.set(keyword, trend);
        } catch (err) {
        // Silently continue if trend fetch fails
        }
    }
    return {
        storeDNA: storeDNA,
        catalogGaps,
        patterns,
        existingProducts,
        seasonalityData,
        trendData
    };
}
// ============================================
// INDIVIDUAL SCORERS
// ============================================
/**
 * Store Fit Score - How well does this match the store's DNA patterns?
 */ function calculateStoreFitScore(candidate, context) {
    const { storeDNA, patterns } = context;
    if (!storeDNA) return 0.5;
    let score = 0.5;
    const titleLower = candidate.title.toLowerCase();
    const source = candidate.patternSource;
    // Check if candidate matches top performing types
    const topTypes = storeDNA.topPerformingTypes || [];
    for (const t of topTypes){
        const typeName = (t.type || '').toLowerCase();
        if (titleLower.includes(typeName) || source.includes(typeName)) {
            score += 0.25;
            break;
        }
    }
    // Check category affinity pattern
    const categoryPattern = patterns.find((p)=>p.patternType === 'category_affinity');
    if (categoryPattern) {
        const topCategory = categoryPattern.patternData?.topCategory?.toLowerCase() || '';
        if (titleLower.includes(topCategory) || source.includes(topCategory)) {
            score += 0.15;
        }
    }
    // Check if it matches the price sweet spot
    const priceSweetSpot = storeDNA.priceSweetSpot?.sweetSpot || '';
    if (priceSweetSpot) {
        const evidence = candidate.patternEvidence;
        if (evidence.suggestedPrice || evidence.priceRange) {
            score += 0.1;
        }
    }
    return Math.min(1, score);
}
/**
 * Gap Fill Score - Does this address a detected CatalogGap?
 */ function calculateGapFillScore(candidate, context) {
    const { catalogGaps } = context;
    if (!catalogGaps || catalogGaps.length === 0) return 0.3;
    let maxScore = 0.3;
    const titleLower = candidate.title.toLowerCase();
    const source = candidate.patternSource;
    for (const gap of catalogGaps){
        const gapData = gap.gapData || {};
        // Price gap match
        if (gap.gapType === 'price_gap') {
            const band = (gapData.band || '').toLowerCase();
            if (source === 'market_gap' && candidate.patternEvidence?.gapType === 'Price Void') {
                maxScore = Math.max(maxScore, gap.gapScore * 1.2);
            } else if (titleLower.includes('budget') && band.includes('0-25')) {
                maxScore = Math.max(maxScore, gap.gapScore);
            } else if (titleLower.includes('premium') && band.includes('100')) {
                maxScore = Math.max(maxScore, gap.gapScore);
            }
        }
        // Category gap match
        if (gap.gapType === 'category_gap') {
            const missingCategory = (gapData.missingCategory || '').toLowerCase();
            if (source === 'market_gap' || source === 'category_expansion') {
                if (titleLower.includes(missingCategory)) {
                    maxScore = Math.max(maxScore, gap.gapScore * 1.3);
                }
            }
        }
        // Variant gap match
        if (gap.gapType === 'variant_gap') {
            const colorValue = (gapData.value || '').toLowerCase();
            if (source === 'color_extension' && titleLower.includes(colorValue)) {
                maxScore = Math.max(maxScore, gap.gapScore);
            }
        }
    }
    return Math.min(1, maxScore);
}
/**
 * Trend Momentum Score - External trend data integration
 */ function calculateTrendMomentum(candidate, context) {
    const { trendData } = context;
    // Find matching trend data
    const titleWords = candidate.title.toLowerCase().split(/\s+/);
    let bestTrend = null;
    for (const word of titleWords){
        const trend = trendData.get(word);
        if (trend && (!bestTrend || trend.trendScore > bestTrend.trendScore)) {
            bestTrend = trend;
        }
    }
    // Also check evidence keywords
    if (candidate.patternEvidence?.category) {
        const trend = trendData.get(candidate.patternEvidence.category.toLowerCase());
        if (trend && (!bestTrend || trend.trendScore > bestTrend.trendScore)) {
            bestTrend = trend;
        }
    }
    if (!bestTrend || bestTrend.source === 'error') {
        // Fallback to pattern-based scoring if no external trend data
        const source = candidate.patternSource;
        if (source === 'market_gap') return 0.7; // Market gaps indicate demand
        if (source === 'category_expansion') return 0.6;
        if (source === 'color_extension') return 0.55;
        return 0.5;
    }
    // Calculate score from trend data
    const velocity = bestTrend.velocity;
    const trendScore = bestTrend.trendScore;
    // High trend score + positive velocity = strong momentum
    if (trendScore > 70 && velocity > 0) {
        return Math.min(1, 0.7 + trendScore / 100 * 0.2 + velocity / 50 * 0.1);
    }
    // Moderate trend score
    if (trendScore > 40) {
        return 0.5 + trendScore / 100 * 0.3;
    }
    // Low or declining trend
    if (velocity < 0) {
        return Math.max(0.2, 0.5 + velocity / 100);
    }
    return 0.5;
}
/**
 * Margin Potential Score - Estimated profitability
 */ function calculateMarginPotential(candidate, context) {
    const { storeDNA } = context;
    const source = candidate.patternSource;
    const titleLower = candidate.title.toLowerCase();
    // Premium products typically have higher margins
    if (titleLower.includes('premium') || titleLower.includes('luxury') || titleLower.includes('elite')) {
        return 0.85;
    }
    // Bundles have good margin due to perceived value
    if (source === 'bundle_merge') {
        return 0.75;
    }
    // Check price band pattern for refund rates (proxy for quality/margin)
    if (storeDNA?.priceBands) {
        const priceBands = storeDNA.priceBands;
        // Handle both array format (from PatternMemory) and object format (from DNA seeder)
        if (Array.isArray(priceBands)) {
            const lowestRefundBand = priceBands.reduce((best, band)=>{
                if (!best || band.refundRate !== undefined && band.refundRate < best.refundRate) return band;
                return best;
            }, null);
            if (lowestRefundBand && candidate.patternEvidence?.priceRange?.includes(lowestRefundBand.band)) {
                return 0.7;
            }
        } else if (typeof priceBands === 'object') {
            // Object format: { low: number, mid: number, high: number }
            // Use price positioning instead
            const positioning = storeDNA.pricePositioning;
            if (positioning === 'premium' || positioning === 'luxury') {
                return 0.75;
            }
        }
    }
    // Category expansions have uncertain margins
    if (source === 'category_expansion') {
        return 0.5;
    }
    return 0.6;
}
/**
 * Competition Score - Market saturation estimate (higher = less competition = better)
 */ function calculateCompetitionScore(candidate, context) {
    const { storeDNA, existingProducts } = context;
    const titleLower = candidate.title.toLowerCase();
    const source = candidate.patternSource;
    // Check for cannibalization with existing products
    let highestOverlap = 0;
    for (const product of existingProducts){
        const existingTitle = product.title.toLowerCase();
        const candidateWords = new Set(titleLower.split(/\s+/).filter((w)=>w.length > 3));
        const existingWords = new Set(existingTitle.split(/\s+/).filter((w)=>w.length > 3));
        const overlap = [
            ...candidateWords
        ].filter((w)=>existingWords.has(w)).length;
        highestOverlap = Math.max(highestOverlap, overlap);
    }
    // High overlap = competing with existing products
    if (highestOverlap >= 3) {
        return 0.3;
    }
    // Bundles don't compete - they complement
    if (source === 'bundle_merge') {
        return 0.85;
    }
    // Category expansions open new space
    if (source === 'category_expansion' || source === 'market_gap') {
        return 0.8;
    }
    // Check if category is growing or declining
    if (storeDNA) {
        const decliningTypes = storeDNA.decliningTypes || [];
        const growingTypes = storeDNA.growingTypes || [];
        for (const t of decliningTypes){
            if (titleLower.includes((t.type || '').toLowerCase())) {
                return 0.35;
            }
        }
        for (const t of growingTypes){
            if (titleLower.includes((t.type || '').toLowerCase())) {
                return 0.75;
            }
        }
    }
    return 0.6;
}
/**
 * Seasonality Match Score - Timing alignment
 */ function calculateSeasonalityMatch(candidate, context) {
    const { seasonalityData } = context;
    const currentMonth = new Date().getMonth();
    if (!seasonalityData || seasonalityData.length === 0) return 0.5;
    const currentMonthData = seasonalityData.find((s)=>s.month === currentMonth);
    if (!currentMonthData) return 0.5;
    const revenueIndex = currentMonthData.revenueIndex || 1.0;
    // Peak month - great time to launch
    if (revenueIndex > 1.2) {
        return 0.9;
    }
    // Above average month
    if (revenueIndex > 1.0) {
        return 0.7;
    }
    // Slow month - launching now is riskier
    if (revenueIndex < 0.7) {
        return 0.4;
    }
    return 0.6;
}
// ============================================
// HELPERS
// ============================================
function computeInputHash(candidate, context, shopId) {
    const serialized = JSON.stringify({
        title: candidate.title,
        source: candidate.patternSource,
        shopId,
        gapsCount: context.catalogGaps.length,
        hasStoreDNA: !!context.storeDNA,
        patternsCount: context.patterns.length
    });
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["createHash"])('sha256').update(serialized).digest('hex').slice(0, 16);
}
function generateExplanation(scores, candidate) {
    const parts = [];
    if (scores.storeFit > 0.7) parts.push('Strong DNA match');
    else if (scores.storeFit < 0.4) parts.push('Limited store fit');
    if (scores.gapFill > 0.6) parts.push('fills catalog gap');
    if (scores.trendMomentum > 0.7) parts.push('positive trend momentum');
    else if (scores.trendMomentum < 0.4) parts.push('low market trend');
    if (scores.marginPotential > 0.7) parts.push('high margin potential');
    if (scores.competition > 0.7) parts.push('low competition');
    else if (scores.competition < 0.4) parts.push('may overlap existing products');
    if (scores.seasonalityMatch > 0.7) parts.push('good timing');
    else if (scores.seasonalityMatch < 0.5) parts.push('off-peak timing');
    return parts.length > 0 ? parts.join(', ') : 'Balanced opportunity';
}
async function persistCandidates(shopId, candidates) {
    // Clear old generated candidates (keep shortlisted, analyzing, etc.)
    await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].nextHitCandidate.deleteMany({
        where: {
            shopId,
            status: 'generated'
        }
    });
    // Insert new top 10
    for (const candidate of candidates){
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].nextHitCandidate.create({
            data: {
                shopId,
                title: candidate.title,
                description: candidate.description,
                patternSource: candidate.patternSource,
                patternEvidence: candidate.patternEvidence,
                confidence: candidate.totalScore,
                hitType: candidate.hitType,
                status: 'generated',
                scores: candidate.scores,
                rank: candidate.rank
            }
        });
    }
}
}),
"[project]/packages/brain/src/nexthit/deterministic-scorer.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "scoreCandidate",
    ()=>scoreCandidate,
    "scoreCandidateWithAudit",
    ()=>scoreCandidateWithAudit,
    "scoreCandidates",
    ()=>scoreCandidates
]);
/**
 * Deterministic Candidate Scorer
 * Enhanced scoring with SHA256 hashing, version tracking, and full audit trail
 * 
 * SCORING FORMULA v1.0.0:
 * SCORE = (0.25×store_fit + 0.20×gap_fill + 0.20×trend + 0.15×margin + 0.10×competition + 0.10×seasonality)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
// ============================================
// VERSION & WEIGHTS
// ============================================
// Use weights from candidate-scorer as single source of truth
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$candidate$2d$scorer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/nexthit/candidate-scorer.ts [app-rsc] (ecmascript)");
;
;
;
;
// ============================================
// HASH FUNCTION
// ============================================
function computeInputHash(input) {
    const serialized = JSON.stringify({
        candidateId: input.candidateId,
        candidateTitle: input.candidateTitle,
        candidateType: input.candidateType,
        shopId: input.shopId,
        storeDNAHash: input.storeDNA ? JSON.stringify(input.storeDNA).slice(0, 500) : null,
        gapsCount: input.catalogGaps.length,
        hasTrend: !!input.trendData,
        seasonalityCount: input.seasonalityData.length
    });
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["createHash"])('sha256').update(serialized).digest('hex');
}
// ============================================
// INDIVIDUAL SCORERS
// ============================================
/**
 * Store Fit Score - How well does this match the store's DNA patterns?
 */ function calculateStoreFitScore(input) {
    const { storeDNA, candidateType } = input;
    if (!storeDNA) return 0.5;
    let score = 0.5;
    const dna = storeDNA;
    // Check if candidate matches top performing types
    const topTypes = dna.topPerformingTypes || [];
    if (topTypes.some((t)=>t.type?.toLowerCase().includes(candidateType.toLowerCase()))) {
        score += 0.3;
    }
    // Check if it matches the price sweet spot
    const priceSweetSpot = dna.priceSweetSpot?.sweetSpot || '';
    if (priceSweetSpot && candidateType.includes('Premium')) {
        score += 0.1;
    }
    // Check vendor concentration - if low, new vendors are encouraged
    const vendorConcentration = dna.vendorConcentration || 0;
    if (vendorConcentration > 0.5) {
        score += 0.1; // Encourage diversification
    }
    return Math.min(1, score);
}
/**
 * Gap Fill Score - Does this address a detected CatalogGap?
 */ function calculateGapFillScore(input) {
    const { catalogGaps, candidateTitle, candidateType } = input;
    if (!catalogGaps || catalogGaps.length === 0) return 0.3;
    let maxScore = 0.3;
    const titleLower = candidateTitle.toLowerCase();
    const typeLower = candidateType.toLowerCase();
    for (const gap of catalogGaps){
        const gapData = gap.gapData || {};
        // Price gap match
        if (gap.gapType === 'price_gap') {
            const band = gapData.band?.toLowerCase() || '';
            if (titleLower.includes('budget') && band.includes('0-25')) {
                maxScore = Math.max(maxScore, gap.gapScore);
            } else if (titleLower.includes('premium') && band.includes('100')) {
                maxScore = Math.max(maxScore, gap.gapScore);
            }
        }
        // Category gap match
        if (gap.gapType === 'category_gap') {
            const missingCategory = gapData.missingCategory?.toLowerCase() || '';
            if (typeLower.includes(missingCategory)) {
                maxScore = Math.max(maxScore, gap.gapScore * 1.2);
            }
        }
        // Variant gap match
        if (gap.gapType === 'variant_gap') {
            const colorValue = gapData.value?.toLowerCase() || '';
            if (titleLower.includes(colorValue)) {
                maxScore = Math.max(maxScore, gap.gapScore);
            }
        }
    }
    return Math.min(1, maxScore);
}
/**
 * Trend Momentum Score - External trend data if available
 */ function calculateTrendMomentum(input) {
    const { trendData } = input;
    if (!trendData) return 0.5; // Neutral if no trend data
    const velocity = trendData.velocity || 0;
    const acceleration = trendData.acceleration || 0;
    // Positive velocity with positive acceleration = strong momentum
    if (velocity > 0 && acceleration > 0) {
        return Math.min(1, 0.6 + velocity * 0.3 + acceleration * 0.1);
    }
    // Positive velocity but slowing
    if (velocity > 0 && acceleration <= 0) {
        return 0.5 + velocity * 0.2;
    }
    // Negative velocity = declining trend
    if (velocity < 0) {
        return Math.max(0.1, 0.5 + velocity * 0.3);
    }
    return 0.5;
}
/**
 * Margin Potential Score - Estimated profitability
 */ function calculateMarginPotential(input) {
    const { storeDNA, candidateType } = input;
    if (!storeDNA) return 0.5;
    const priceBands = storeDNA.priceBands;
    // Premium products typically have higher margins
    if (candidateType.toLowerCase().includes('premium')) {
        return 0.8;
    }
    // Find the band with lowest refund rate (indicates quality)
    if (Array.isArray(priceBands) && priceBands.length > 0) {
        const lowestRefundBand = priceBands.reduce((best, band)=>{
            if (!best || band.refundRate !== undefined && band.refundRate < best.refundRate) return band;
            return best;
        }, null);
        if (lowestRefundBand && candidateType.includes(lowestRefundBand.band)) {
            return 0.7;
        }
    } else if (priceBands && typeof priceBands === 'object') {
        // Object format from dna-seeder: { low, mid, high }
        const positioning = storeDNA.pricePositioning;
        if (positioning === 'premium' || positioning === 'luxury') {
            return 0.7;
        }
    }
    return 0.5;
}
/**
 * Competition Score - Market saturation estimate (higher = less competition = better)
 */ function calculateCompetitionScore(input) {
    const { storeDNA, candidateType } = input;
    if (!storeDNA) return 0.5;
    const topTypes = storeDNA.topPerformingTypes || [];
    const decliningTypes = storeDNA.decliningTypes || [];
    // If the category is declining, there might be over-saturation
    if (decliningTypes.some((t)=>t.type?.toLowerCase().includes(candidateType.toLowerCase()))) {
        return 0.3;
    }
    // If category is growing, good opportunity
    const growingTypes = storeDNA.growingTypes || [];
    if (growingTypes.some((t)=>t.type?.toLowerCase().includes(candidateType.toLowerCase()))) {
        return 0.8;
    }
    // Check catalog health - higher health = more competitive market
    const catalogHealth = storeDNA.catalogHealthScore || 50;
    return catalogHealth > 70 ? 0.4 : 0.6;
}
/**
 * Seasonality Match Score - Timing alignment
 */ function calculateSeasonalityMatch(input) {
    const { seasonalityData, candidateType } = input;
    const currentMonth = new Date().getMonth();
    if (!seasonalityData || seasonalityData.length === 0) return 0.5;
    const currentMonthData = seasonalityData.find((s)=>s.month === currentMonth);
    if (!currentMonthData) return 0.5;
    // If current month is a peak month, launching now is good
    if (currentMonthData.revenueIndex > 1.2) {
        return 0.9;
    }
    // If current month is slow, might want to wait
    if (currentMonthData.revenueIndex < 0.7) {
        return 0.4;
    }
    return 0.6;
}
async function scoreCandidate(input) {
    // Calculate input hash for reproducibility
    const inputHash = computeInputHash(input);
    // Calculate all individual scores
    const storeFitScore = calculateStoreFitScore(input);
    const gapFillScore = calculateGapFillScore(input);
    const trendMomentum = calculateTrendMomentum(input);
    const marginPotential = calculateMarginPotential(input);
    const competitionScore = calculateCompetitionScore(input);
    const seasonalityMatch = calculateSeasonalityMatch(input);
    // Calculate weighted final score
    const finalScore = storeFitScore * __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$candidate$2d$scorer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SCORING_WEIGHTS"].storeFit + gapFillScore * __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$candidate$2d$scorer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SCORING_WEIGHTS"].gapFill + trendMomentum * __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$candidate$2d$scorer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SCORING_WEIGHTS"].trendMomentum + marginPotential * __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$candidate$2d$scorer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SCORING_WEIGHTS"].marginPotential + competitionScore * __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$candidate$2d$scorer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SCORING_WEIGHTS"].competition + seasonalityMatch * __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$candidate$2d$scorer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SCORING_WEIGHTS"].seasonalityMatch;
    const scores = {
        storeFitScore: Math.round(storeFitScore * 100) / 100,
        gapFillScore: Math.round(gapFillScore * 100) / 100,
        trendMomentum: Math.round(trendMomentum * 100) / 100,
        marginPotential: Math.round(marginPotential * 100) / 100,
        competitionScore: Math.round(competitionScore * 100) / 100,
        seasonalityMatch: Math.round(seasonalityMatch * 100) / 100,
        finalScore: Math.round(finalScore * 100) / 100
    };
    // Generate explanation
    const explanation = generateScoringExplanation(scores);
    return {
        candidateId: input.candidateId,
        inputHash,
        scores,
        weights: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$candidate$2d$scorer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SCORING_WEIGHTS"],
        version: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$candidate$2d$scorer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SCORING_VERSION"],
        explanation
    };
}
async function scoreCandidateWithAudit(input) {
    const result = await scoreCandidate(input);
    // Persist to ScoringAudit table
    await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].scoringAudit.create({
        data: {
            candidateId: input.candidateId,
            inputHash: result.inputHash,
            storeFitScore: result.scores.storeFitScore,
            gapFillScore: result.scores.gapFillScore,
            trendMomentum: result.scores.trendMomentum,
            marginPotential: result.scores.marginPotential,
            competitionScore: result.scores.competitionScore,
            seasonalityMatch: result.scores.seasonalityMatch,
            weights: result.weights,
            finalScore: result.scores.finalScore,
            version: result.version,
            inputSnapshot: {
                candidateTitle: input.candidateTitle,
                candidateType: input.candidateType,
                shopId: input.shopId,
                gapsCount: input.catalogGaps.length,
                hasTrend: !!input.trendData
            }
        }
    });
    return result;
}
async function scoreCandidates(shopId, candidates) {
    // Load shared context once
    const [storeDNA, catalogGaps] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].storeDNA.findUnique({
            where: {
                shopId
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].catalogGap.findMany({
            where: {
                shopId,
                status: 'active'
            }
        })
    ]);
    const seasonalityData = storeDNA?.seasonalityCurve || [];
    const results = [];
    for (const candidate of candidates){
        const input = {
            candidateId: candidate.id,
            candidateTitle: candidate.title,
            candidateType: candidate.productType || 'Unknown',
            shopId,
            storeDNA: storeDNA,
            catalogGaps,
            trendData: null,
            seasonalityData
        };
        const result = await scoreCandidateWithAudit(input);
        results.push(result);
    }
    // Sort by final score
    results.sort((a, b)=>b.scores.finalScore - a.scores.finalScore);
    return results;
}
// ============================================
// HELPERS
// ============================================
function generateScoringExplanation(scores) {
    const parts = [];
    if (scores.storeFitScore > 0.7) parts.push('Strong store DNA match');
    else if (scores.storeFitScore < 0.4) parts.push('Limited store fit');
    if (scores.gapFillScore > 0.6) parts.push('fills catalog gap');
    if (scores.trendMomentum > 0.7) parts.push('positive trend momentum');
    if (scores.marginPotential > 0.7) parts.push('high margin potential');
    if (scores.competitionScore > 0.7) parts.push('low competition');
    if (scores.seasonalityMatch > 0.7) parts.push('good timing');
    return parts.length > 0 ? parts.join(', ') : 'Balanced opportunity';
}
}),
"[project]/packages/brain/src/nexthit/candidate-generator.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateCandidates",
    ()=>generateCandidates
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$product$2d$research$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/product-research.ts [app-rsc] (ecmascript)");
;
;
async function generateCandidates(shopId) {
    console.log(`[CandidateGenerator] Generating candidates for shop ${shopId}`);
    const candidates = [];
    // Load StoreDNA for context
    const storeDNA = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].storeDNA.findUnique({
        where: {
            shopId
        }
    });
    const dnaData = storeDNA;
    // Load all pattern memories
    const patterns = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].patternMemory.findMany({
        where: {
            shopId
        }
    });
    const patternMap = new Map(patterns.map((p)=>[
            p.patternType,
            p
        ]));
    // Load top-performing products for reference
    const topProducts = await getTopProducts(shopId);
    // Strategy 1: Color + Product Type Combinations (Highest confidence - data-driven)
    const colorProductCandidates = generateColorProductCombinations(dnaData, patternMap);
    candidates.push(...colorProductCandidates);
    // Strategy 2: Price-Optimized Products (specific price points for specific products)
    const priceOptimizedCandidates = generatePriceOptimizedCandidates(dnaData, patternMap);
    candidates.push(...priceOptimizedCandidates);
    // Strategy 3: Cross-Purchase Bundle Opportunities
    const bundleCandidates = generateBundleCandidates(patternMap);
    candidates.push(...bundleCandidates);
    // Strategy 4: Growth Category Expansion
    const growthCandidates = generateGrowthCategoryCandidates(dnaData);
    candidates.push(...growthCandidates);
    // Strategy 5: Gap Fillers (price gaps, seasonal gaps)
    const gapCandidates = await generateGapCandidates(shopId, dnaData);
    candidates.push(...gapCandidates);
    // Strategy 6: Variant Expansion based on top sellers
    const variantCandidates = generateVariantExpansionCandidates(topProducts, patternMap);
    candidates.push(...variantCandidates);
    // Strategy 7: AI-Researched NEW Product Ideas (External Market Intelligence)
    try {
        const aiResearchCandidates = await generateAIResearchedCandidates(shopId);
        candidates.push(...aiResearchCandidates);
    } catch (error) {
        console.error('[CandidateGenerator] AI research failed, continuing with internal data:', error);
    }
    console.log(`[CandidateGenerator] Generated ${candidates.length} raw candidates`);
    return candidates;
}
/**
 * Strategy 1: Combine winning colors with top product types
 * e.g., "Launch Palazzo Pants in Olive" or "Launch Haremshosen in Gold"
 */ function generateColorProductCombinations(dnaData, patternMap) {
    const candidates = [];
    if (!dnaData?.topPerformingTypes?.length) return candidates;
    const colorPattern = patternMap.get('color_preference');
    if (!colorPattern) return candidates;
    const winningColors = colorPattern.patternData?.winners || [];
    // Filter out generic "Other" type - only use actual product types
    const topTypes = dnaData.topPerformingTypes.filter((t)=>t.type && t.type !== 'Other' && t.type !== 'Uncategorized').slice(0, 3);
    // Combine top 2 colors with top 2 product types
    for (const color of winningColors.slice(0, 2)){
        for (const productType of topTypes.slice(0, 2)){
            const title = `Launch ${productType.type} in ${capitalizeFirst(color.value)}`;
            candidates.push({
                title,
                description: `Combine your best-performing product type (${productType.type}, ${productType.revenueShare.toFixed(1)}% of revenue) with your winning color (${color.value}, ${(color.successRate * 100).toFixed(0)}% success rate). This is a data-backed safe bet.`,
                patternSource: 'color_product_combination',
                patternEvidence: {
                    productType: productType.type,
                    productTypeRevenue: productType.revenue,
                    productTypeShare: productType.revenueShare,
                    color: color.value,
                    colorSuccessRate: (color.successRate * 100).toFixed(1) + '%',
                    colorRevenue: color.revenue,
                    colorSampleSize: color.sampleSize,
                    combinedConfidence: (color.successRate * 0.5 + productType.revenueShare / 100 * 0.5).toFixed(2)
                },
                confidence: Math.min(0.92, color.successRate * 0.5 + productType.revenueShare / 100 * 0.5),
                hitType: 'safe'
            });
        }
    }
    return candidates;
}
/**
 * Strategy 2: Price-optimized product suggestions
 * e.g., "Launch Premium Haremshosen at €85-95" targeting optimal price bands
 */ function generatePriceOptimizedCandidates(dnaData, patternMap) {
    const candidates = [];
    const pricePattern = patternMap.get('price_band');
    if (!pricePattern) return candidates;
    const priceData = pricePattern.patternData;
    const optimalBand = priceData?.optimalBand;
    const winners = priceData?.winners || [];
    const priceRanges = {
        'budget': {
            min: 15,
            max: 30,
            tier: 'Entry-Level'
        },
        'value': {
            min: 30,
            max: 60,
            tier: 'Value'
        },
        'mid': {
            min: 60,
            max: 100,
            tier: 'Mid-Range'
        },
        'premium': {
            min: 100,
            max: 200,
            tier: 'Premium'
        },
        'luxury': {
            min: 200,
            max: 400,
            tier: 'Luxury'
        }
    };
    const range = priceRanges[optimalBand] || priceRanges['value'];
    // Filter out generic types - only use actual product types
    const validTypes = (dnaData?.topPerformingTypes || []).filter((t)=>t.type && t.type !== 'Other' && t.type !== 'Uncategorized');
    // If no valid product types, skip this strategy
    if (!validTypes.length) return candidates;
    const topType = validTypes[0];
    const secondType = validTypes[1];
    // Suggest optimal price point for top product type
    candidates.push({
        title: `Launch ${range.tier} ${topType.type} at €${range.min}-${range.max}`,
        description: `Your customers convert best in the ${optimalBand} price band (${range.min}-${range.max}€). Launch a ${topType.type} specifically designed for this sweet spot to maximize conversion.`,
        patternSource: 'price_optimization',
        patternEvidence: {
            optimalBand,
            priceRange: `€${range.min}-${range.max}`,
            targetProductType: topType.type,
            bandSuccessRate: winners.find((w)=>w.value === optimalBand)?.successRate || 0.85,
            sampleSize: pricePattern.sampleSize
        },
        confidence: (pricePattern.confidence || 0.7) * 0.9,
        hitType: 'safe'
    });
    // If there's a second product type with good growth, suggest for that too
    if (secondType && secondType.growthRate > 10) {
        candidates.push({
            title: `Launch ${range.tier} ${secondType.type} at €${range.min}-${range.max}`,
            description: `${secondType.type} is growing at ${secondType.growthRate.toFixed(0)}% and would benefit from a product at your optimal ${optimalBand} price point.`,
            patternSource: 'price_optimization',
            patternEvidence: {
                optimalBand,
                priceRange: `€${range.min}-${range.max}`,
                targetProductType: secondType.type,
                growthRate: secondType.growthRate
            },
            confidence: (pricePattern.confidence || 0.7) * 0.75,
            hitType: 'moderate'
        });
    }
    return candidates;
}
/**
 * Strategy 3: Bundle candidates based on cross-purchase patterns
 * e.g., "Create Bundle: Haremshose Tiefsee + Haremshose Schwarz"
 */ function generateBundleCandidates(patternMap) {
    const candidates = [];
    const crossPurchase = patternMap.get('cross_purchase');
    if (!crossPurchase) return candidates;
    const topPairs = crossPurchase.patternData?.topPairs || [];
    for (const pair of topPairs.slice(0, 3)){
        if (pair.products.length < 2) continue;
        const product1 = shortenProductName(pair.products[0]);
        const product2 = shortenProductName(pair.products[1]);
        candidates.push({
            title: `Create Bundle: ${product1} + ${product2}`,
            description: `${pair.count} customers already buy these together. A pre-made bundle captures this demand with higher AOV and no new inventory risk.`,
            patternSource: 'bundle_opportunity',
            patternEvidence: {
                product1: pair.products[0],
                product2: pair.products[1],
                coOccurrenceCount: pair.count,
                bundleType: 'duo',
                inventoryRisk: 'none'
            },
            confidence: Math.min(0.9, 0.6 + pair.count / 100),
            hitType: 'safe'
        });
    }
    return candidates;
}
/**
 * Strategy 4: Growth category expansion
 * e.g., "Expand Rock Collection" (264% growth rate)
 */ function generateGrowthCategoryCandidates(dnaData) {
    const candidates = [];
    if (!dnaData?.topPerformingTypes?.length) return candidates;
    // Find categories with high growth but lower revenue share (expansion opportunity)
    // Filter out generic "Other" type
    const growthOpportunities = dnaData.topPerformingTypes.filter((t)=>t.type && t.type !== 'Other' && t.type !== 'Uncategorized').filter((t)=>t.growthRate > 20 && t.revenueShare < 15).sort((a, b)=>b.growthRate - a.growthRate);
    for (const category of growthOpportunities.slice(0, 2)){
        candidates.push({
            title: `Expand ${category.type} Collection`,
            description: `${category.type} is growing at ${category.growthRate.toFixed(0)}% but only represents ${category.revenueShare.toFixed(1)}% of revenue. Expanding this line captures growing demand.`,
            patternSource: 'growth_expansion',
            patternEvidence: {
                category: category.type,
                growthRate: category.growthRate,
                currentRevenueShare: category.revenueShare,
                currentRevenue: category.revenue,
                avgOrderValue: category.avgOrderValue,
                potential: 'high_growth_underserved'
            },
            confidence: Math.min(0.85, 0.5 + category.growthRate / 200),
            hitType: 'moderate'
        });
    }
    return candidates;
}
/**
 * Strategy 5: Gap-based candidates (price gaps, seasonal gaps)
 */ async function generateGapCandidates(shopId, dnaData) {
    const candidates = [];
    const gaps = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].catalogGap.findMany({
        where: {
            shopId,
            status: 'active'
        },
        orderBy: {
            gapScore: 'desc'
        },
        take: 5
    });
    // Get first valid product type (not "Other")
    const validTypes = (dnaData?.topPerformingTypes || []).filter((t)=>t.type && t.type !== 'Other' && t.type !== 'Uncategorized');
    const topType = validTypes[0]?.type || 'Product';
    for (const gap of gaps){
        const data = gap.gapData;
        if (gap.gapType === 'price_gap') {
            candidates.push({
                title: `Launch ${topType} in ${data.band} Price Range`,
                description: `You have only ${data.currentProducts} products in the ${data.band} range, but ${data.adjacentDemand} orders came from adjacent price bands. There's unmet demand here.`,
                patternSource: 'price_gap',
                patternEvidence: {
                    gapType: 'price_void',
                    priceRange: data.band,
                    currentProducts: data.currentProducts,
                    adjacentDemand: data.adjacentDemand,
                    suggestedProductType: topType
                },
                confidence: gap.confidence,
                hitType: 'moderate'
            });
        } else if (gap.gapType === 'seasonal_gap') {
            candidates.push({
                title: `Launch ${data.month} Seasonal ${topType}`,
                description: `${data.month} underperforms at ${(data.revenueIndex * 100).toFixed(0)}% of average. A seasonal collection or promotion could lift this period.`,
                patternSource: 'seasonal_gap',
                patternEvidence: {
                    gapType: 'seasonal_weakness',
                    month: data.month,
                    revenueIndex: data.revenueIndex,
                    currentRevenue: data.currentRevenue,
                    averageRevenue: data.averageRevenue
                },
                confidence: gap.confidence * 0.8,
                hitType: 'bold'
            });
        }
    }
    return candidates;
}
/**
 * Strategy 6: Variant expansion based on top sellers
 * e.g., "Launch Long Version of top-selling Haremshose"
 */ function generateVariantExpansionCandidates(topProducts, patternMap) {
    const candidates = [];
    if (!topProducts.length) return candidates;
    // Get color preferences
    const colorPattern = patternMap.get('color_preference');
    const winningColors = colorPattern?.patternData?.winners || [];
    const topColor = winningColors[0]?.value;
    // Find top seller that could have variants
    const topSeller = topProducts[0];
    if (topSeller && topSeller.revenue > 1000) {
        // Check if it's a "Long Version" or regular
        const isLongVersion = topSeller.title.toLowerCase().includes('long');
        const variantSuggestion = isLongVersion ? 'Short Version' : 'Long Version';
        candidates.push({
            title: `Launch ${variantSuggestion} of ${shortenProductName(topSeller.title)}`,
            description: `Your top seller "${shortenProductName(topSeller.title)}" (€${topSeller.revenue.toFixed(0)} revenue) could have a ${variantSuggestion} to capture different customer preferences.`,
            patternSource: 'variant_expansion',
            patternEvidence: {
                baseProduct: topSeller.title,
                baseRevenue: topSeller.revenue,
                baseUnits: topSeller.unitsSold,
                suggestedVariant: variantSuggestion
            },
            confidence: 0.75,
            hitType: 'safe'
        });
        // If we have a winning color, suggest that color for a different top product
        if (topColor && topProducts[1]) {
            const secondProduct = topProducts[1];
            if (!secondProduct.title.toLowerCase().includes(topColor.toLowerCase())) {
                candidates.push({
                    title: `Launch ${shortenProductName(secondProduct.title)} in ${capitalizeFirst(topColor)}`,
                    description: `${capitalizeFirst(topColor)} has a ${(winningColors[0].successRate * 100).toFixed(0)}% success rate. Apply this winning color to "${shortenProductName(secondProduct.title)}" for a low-risk variant.`,
                    patternSource: 'color_variant',
                    patternEvidence: {
                        baseProduct: secondProduct.title,
                        suggestedColor: topColor,
                        colorSuccessRate: winningColors[0].successRate
                    },
                    confidence: winningColors[0].successRate * 0.8,
                    hitType: 'safe'
                });
            }
        }
    }
    return candidates;
}
/**
 * Strategy 7: AI-Researched NEW Product Ideas
 * Uses external market intelligence + AI to suggest genuinely new products
 */ async function generateAIResearchedCandidates(shopId) {
    console.log('[CandidateGenerator] Running AI product research...');
    const researchResults = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$product$2d$research$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["researchNewProducts"])(shopId);
    const candidates = [];
    for (const result of researchResults){
        // Determine hit type based on risk level
        const hitType = result.riskLevel === 'low' ? 'safe' : result.riskLevel === 'high' ? 'bold' : 'moderate';
        candidates.push({
            title: `NEW: ${result.productIdea}`,
            description: result.reasoning,
            patternSource: 'ai_market_research',
            patternEvidence: {
                source: 'AI Market Research',
                productType: result.productType,
                targetPrice: `€${result.targetPrice}`,
                trendScore: result.marketEvidence.trendScore,
                searchVolume: result.marketEvidence.searchVolume,
                competitorGap: result.marketEvidence.competitorGap,
                seasonalRelevance: result.marketEvidence.seasonalRelevance,
                differentiators: result.differentiators,
                riskLevel: result.riskLevel
            },
            confidence: result.confidence,
            hitType
        });
    }
    console.log(`[CandidateGenerator] AI research generated ${candidates.length} new product ideas`);
    return candidates;
}
// ============================================
// HELPER FUNCTIONS
// ============================================
async function getTopProducts(shopId) {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].productMetric.groupBy({
        by: [
            'variantId'
        ],
        where: {
            date: {
                gte: last30Days
            },
            variant: {
                product: {
                    shopId
                }
            }
        },
        _sum: {
            revenue: true,
            unitsSold: true
        },
        orderBy: {
            _sum: {
                revenue: 'desc'
            }
        },
        take: 20
    });
    const products = await Promise.all(metrics.map(async (m)=>{
        const variant = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].variant.findUnique({
            where: {
                id: m.variantId
            },
            include: {
                product: true
            }
        });
        return {
            variantId: m.variantId,
            title: variant?.product.title || 'Unknown',
            variantTitle: variant?.title || '',
            productType: variant?.product.productType || 'General',
            price: Number(variant?.price || 0),
            revenue: Number(m._sum.revenue || 0),
            unitsSold: m._sum.unitsSold || 0
        };
    }));
    return products;
}
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function shortenProductName(name) {
    // Remove common prefixes and shorten for readability
    const shortened = name.replace(/^(Warme Loungewear |Warme |Mystery )/i, '').replace(/ Long Version$/i, ' (Long)').replace(/ Short Version$/i, ' (Short)');
    // Truncate if still too long
    if (shortened.length > 40) {
        return shortened.substring(0, 37) + '...';
    }
    return shortened;
}
}),
"[project]/packages/brain/src/nexthit/deep-analyzer.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runDeepAnalysis",
    ()=>runDeepAnalysis
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
;
async function runDeepAnalysis(candidateId) {
    const candidate = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].nextHitCandidate.findUnique({
        where: {
            id: candidateId
        },
        include: {
            shop: {
                include: {
                    products: {
                        include: {
                            variants: true
                        }
                    },
                    goals: {
                        orderBy: {
                            createdAt: 'desc'
                        },
                        take: 1
                    }
                }
            }
        }
    });
    if (!candidate) throw new Error('Candidate not found');
    const shopId = candidate.shopId;
    const patterns = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].patternMemory.findMany({
        where: {
            shopId
        }
    });
    const goal = candidate.shop.goals[0];
    // 1. Multi-dimensional risk decomposition
    const demandRisk = assessDemandRisk(candidate, patterns);
    const refundRisk = assessRefundRisk(candidate, patterns);
    const brandRisk = assessBrandRisk(candidate, patterns);
    const operationalRisk = assessOperationalRisk(candidate);
    const cannibalizationRisk = assessCannibalizationRisk(candidate, candidate.shop.products);
    // 2. Revenue scenarios
    const revenueScenarios = generateRevenueScenarios(candidate, patterns);
    // 3. Test path recommendation
    const testPath = recommendTestPath(candidate, revenueScenarios);
    // Persist the analysis
    const analysis = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].nextHitAnalysis.upsert({
        where: {
            candidateId
        },
        update: {
            demandRisk: demandRisk,
            refundRisk: refundRisk,
            brandRisk: brandRisk,
            operationalRisk: operationalRisk,
            cannibalizationRisk: cannibalizationRisk,
            revenueScenarios: revenueScenarios,
            testPath: testPath
        },
        create: {
            candidateId,
            demandRisk: demandRisk,
            refundRisk: refundRisk,
            brandRisk: brandRisk,
            operationalRisk: operationalRisk,
            cannibalizationRisk: cannibalizationRisk,
            revenueScenarios: revenueScenarios,
            testPath: testPath
        }
    });
    // Update candidate status
    await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].nextHitCandidate.update({
        where: {
            id: candidateId
        },
        data: {
            status: 'analyzing'
        }
    });
    return analysis;
}
function assessDemandRisk(candidate, patterns) {
    const evidence = candidate.patternEvidence || {};
    const source = candidate.patternSource;
    // Bundle opportunities - use actual evidence
    if (source === 'bundle_opportunity' || source === 'bundle_merge') {
        const count = evidence.coOccurrenceCount || 0;
        return {
            level: count > 10 ? 'low' : 'moderate',
            score: count > 10 ? 0.2 : 0.4,
            evidence: count > 0 ? `${count} customers already buy these together` : 'Bundle based on product affinity',
            confidence: 0.85,
            category: 'internal'
        };
    }
    // Color + product combinations
    if (source === 'color_product_combination' || source === 'color_extension' || source === 'color_variant') {
        const successRate = parseFloat(String(evidence.colorSuccessRate || '0').replace('%', ''));
        const productShare = evidence.productTypeShare || 0;
        return {
            level: successRate > 70 ? 'low' : 'moderate',
            score: successRate > 70 ? 0.2 : 0.4,
            evidence: `${evidence.color || 'Color'} has ${successRate}% success rate, ${evidence.productType || 'Product'} is ${productShare.toFixed(1)}% of revenue`,
            confidence: 0.8,
            category: 'internal'
        };
    }
    // Price optimization
    if (source === 'price_optimization') {
        return {
            level: 'low',
            score: 0.25,
            evidence: `${evidence.optimalBand || 'Optimal'} price band (${evidence.priceRange || ''}) converts best for your customers`,
            confidence: 0.75,
            category: 'internal'
        };
    }
    // Growth expansion
    if (source === 'growth_expansion') {
        const growth = evidence.growthRate || 0;
        return {
            level: growth > 50 ? 'low' : 'moderate',
            score: growth > 50 ? 0.3 : 0.5,
            evidence: `${evidence.category || 'Category'} growing at ${growth.toFixed(0)}% with ${(evidence.currentRevenueShare || 0).toFixed(1)}% current share`,
            confidence: 0.7,
            category: 'internal'
        };
    }
    // Gap fillers
    if (source === 'price_gap' || source === 'seasonal_gap') {
        return {
            level: 'moderate',
            score: 0.45,
            evidence: source === 'price_gap' ? `Price gap in ${evidence.priceRange || 'range'} with ${evidence.adjacentDemand || 0} adjacent orders` : `${evidence.month || 'Seasonal'} underperforms at ${((evidence.revenueIndex || 1) * 100).toFixed(0)}%`,
            confidence: 0.65,
            category: 'internal'
        };
    }
    // Variant expansion
    if (source === 'variant_expansion') {
        return {
            level: 'low',
            score: 0.25,
            evidence: `Based on top seller "${evidence.baseProduct || 'product'}" with €${(evidence.baseRevenue || 0).toFixed(0)} revenue`,
            confidence: 0.75,
            category: 'internal'
        };
    }
    // AI research
    if (source === 'ai_market_research') {
        return {
            level: evidence.riskLevel === 'low' ? 'low' : evidence.riskLevel === 'high' ? 'high' : 'moderate',
            score: evidence.riskLevel === 'low' ? 0.3 : evidence.riskLevel === 'high' ? 0.7 : 0.5,
            evidence: `Trend score ${evidence.trendScore || 'N/A'}, search volume ${evidence.searchVolume || 'N/A'}`,
            confidence: 0.6,
            category: 'external'
        };
    }
    // Default with actual pattern source
    return {
        level: 'moderate',
        score: 0.4,
        evidence: `Based on ${source.replace(/_/g, ' ')} pattern analysis`,
        confidence: 0.65,
        category: 'internal'
    };
}
function assessRefundRisk(candidate, patterns) {
    const evidence = candidate.patternEvidence || {};
    const source = candidate.patternSource;
    // Bundles typically have lower refund risk
    if (source === 'bundle_opportunity' || source === 'bundle_merge') {
        return {
            level: 'low',
            score: 0.15,
            evidence: 'Bundles use existing products - no quality uncertainty',
            confidence: 0.85,
            category: 'internal'
        };
    }
    // Color/variant extensions from proven products
    if (source === 'color_product_combination' || source === 'color_extension' || source === 'color_variant' || source === 'variant_expansion') {
        return {
            level: 'low',
            score: 0.2,
            evidence: `Extending proven ${evidence.productType || evidence.baseProduct || 'product'} with known quality profile`,
            confidence: 0.75,
            category: 'internal'
        };
    }
    // Price optimization targets proven bands
    if (source === 'price_optimization') {
        return {
            level: 'low',
            score: 0.25,
            evidence: `${evidence.optimalBand || 'Target'} price band has established refund benchmarks`,
            confidence: 0.7,
            category: 'internal'
        };
    }
    // Growth expansion - slightly higher risk
    if (source === 'growth_expansion') {
        return {
            level: 'moderate',
            score: 0.35,
            evidence: `${evidence.category || 'Category'} expansion may have varying quality expectations`,
            confidence: 0.65,
            category: 'internal'
        };
    }
    // AI research - external, less predictable
    if (source === 'ai_market_research') {
        return {
            level: 'moderate',
            score: 0.4,
            evidence: 'New product concept requires quality validation',
            confidence: 0.55,
            category: 'external'
        };
    }
    return {
        level: 'moderate',
        score: 0.35,
        evidence: 'Standard quality verification recommended',
        confidence: 0.6,
        category: 'internal'
    };
}
function assessBrandRisk(candidate, _patterns) {
    const evidence = candidate.patternEvidence || {};
    const source = candidate.patternSource;
    // Extensions of existing products have low brand risk
    if ([
        'color_product_combination',
        'color_extension',
        'color_variant',
        'variant_expansion',
        'bundle_opportunity',
        'bundle_merge',
        'price_optimization'
    ].includes(source)) {
        return {
            level: 'low',
            score: 0.15,
            evidence: `Natural extension of ${evidence.productType || evidence.category || 'existing'} catalog`,
            confidence: 0.8,
            category: 'internal'
        };
    }
    // Growth expansion - moderate brand consideration
    if (source === 'growth_expansion') {
        return {
            level: 'low',
            score: 0.25,
            evidence: `${evidence.category || 'Category'} already part of brand identity`,
            confidence: 0.75,
            category: 'internal'
        };
    }
    // Gap fillers
    if (source === 'price_gap' || source === 'seasonal_gap') {
        return {
            level: 'low',
            score: 0.2,
            evidence: 'Fills gap in existing catalog structure',
            confidence: 0.7,
            category: 'internal'
        };
    }
    // AI research - new concepts need brand alignment check
    if (source === 'ai_market_research') {
        return {
            level: evidence.riskLevel === 'low' ? 'low' : 'moderate',
            score: evidence.riskLevel === 'low' ? 0.25 : 0.45,
            evidence: `New concept based on ${evidence.productType || 'market'} trends - verify brand fit`,
            confidence: 0.6,
            category: 'external'
        };
    }
    return {
        level: 'low',
        score: 0.2,
        evidence: 'Fits within current catalog style',
        confidence: 0.7,
        category: 'internal'
    };
}
function assessOperationalRisk(candidate) {
    const evidence = candidate.patternEvidence || {};
    const source = candidate.patternSource;
    // Bundles are operationally simple
    if (source === 'bundle_opportunity' || source === 'bundle_merge') {
        return {
            level: 'low',
            score: 0.1,
            evidence: 'Uses existing inventory - no new SKUs or suppliers needed',
            confidence: 0.9,
            category: 'internal'
        };
    }
    // Price optimization - existing product types
    if (source === 'price_optimization') {
        return {
            level: 'moderate',
            score: 0.35,
            evidence: `New ${evidence.targetProductType || 'product'} at ${evidence.priceRange || 'target'} price point`,
            confidence: 0.7,
            category: 'internal'
        };
    }
    // Color/variant extensions
    if ([
        'color_product_combination',
        'color_extension',
        'color_variant',
        'variant_expansion'
    ].includes(source)) {
        return {
            level: 'moderate',
            score: 0.4,
            evidence: `Production run for ${evidence.color || evidence.suggestedVariant || 'new'} variant`,
            confidence: 0.7,
            category: 'internal'
        };
    }
    // Growth expansion - scaling existing category
    if (source === 'growth_expansion') {
        return {
            level: 'moderate',
            score: 0.45,
            evidence: `Expand ${evidence.category || 'category'} with existing supplier relationships`,
            confidence: 0.65,
            category: 'internal'
        };
    }
    // Gap fillers
    if (source === 'price_gap' || source === 'seasonal_gap') {
        return {
            level: 'moderate',
            score: 0.4,
            evidence: source === 'price_gap' ? 'New product at underserved price point' : 'Seasonal product requires timing coordination',
            confidence: 0.65,
            category: 'internal'
        };
    }
    // AI research - may need new suppliers
    if (source === 'ai_market_research') {
        return {
            level: evidence.riskLevel === 'high' ? 'high' : 'moderate',
            score: evidence.riskLevel === 'high' ? 0.65 : 0.5,
            evidence: 'New concept may require supplier discovery and validation',
            confidence: 0.55,
            category: 'external'
        };
    }
    return {
        level: 'moderate',
        score: 0.45,
        evidence: 'Standard operational requirements',
        confidence: 0.6,
        category: 'internal'
    };
}
function assessCannibalizationRisk(candidate, products) {
    const title = candidate.title.toLowerCase();
    // Check for similar products
    let highestOverlap = 0;
    let overlappingProduct = '';
    for (const product of products){
        const existingTitle = product.title.toLowerCase();
        const candidateWords = new Set(title.split(/\s+/).filter((w)=>w.length > 3));
        const existingWords = new Set(existingTitle.split(/\s+/).filter((w)=>w.length > 3));
        const overlap = Array.from(candidateWords).filter((w)=>existingWords.has(w)).length;
        if (overlap > highestOverlap) {
            highestOverlap = overlap;
            overlappingProduct = product.title;
        }
    }
    if (highestOverlap >= 3) {
        return {
            level: 'high',
            score: 0.7,
            evidence: `May compete with "${overlappingProduct}"`,
            confidence: 0.75,
            category: 'internal'
        };
    }
    if (candidate.patternSource === 'bundle_merge') {
        return {
            level: 'low',
            score: 0.1,
            evidence: 'Bundles complement rather than compete',
            confidence: 0.85,
            category: 'internal'
        };
    }
    return {
        level: 'low',
        score: 0.2,
        evidence: 'Distinct enough from existing catalog',
        confidence: 0.7,
        category: 'internal'
    };
}
function generateRevenueScenarios(candidate, _patterns) {
    const evidence = candidate.patternEvidence || {};
    const source = candidate.patternSource;
    // Extract base price from evidence
    let basePrice = 50;
    if (evidence.priceRange) {
        const match = evidence.priceRange.match(/(\d+)/);
        if (match) basePrice = parseFloat(match[1]);
    } else if (evidence.targetPrice) {
        basePrice = parseFloat(String(evidence.targetPrice).replace(/[€$]/g, ''));
    } else if (evidence.productTypeRevenue && evidence.productTypeShare) {
        // Estimate from category data
        basePrice = evidence.productTypeRevenue / Math.max(1, evidence.productTypeShare) * 0.01;
    }
    // Estimate units based on pattern source and confidence
    const confidenceMultiplier = candidate.confidence || 0.7;
    let baseUnits = candidate.hitType === 'bold' ? 50 : candidate.hitType === 'moderate' ? 30 : 20;
    // Adjust based on evidence
    if (evidence.coOccurrenceCount) {
        baseUnits = Math.max(baseUnits, evidence.coOccurrenceCount * 2);
    }
    // Source-specific assumptions
    const getAssumptions = (level)=>{
        const base = {
            conservative: [
                'Limited marketing reach',
                'Competition response',
                'Seasonal headwinds'
            ],
            expected: [
                'Pattern continues as observed',
                'Standard marketing support',
                'Stable competitive landscape'
            ],
            aggressive: [
                'Strong word of mouth',
                'Cross-sell to existing customers',
                'Favorable market timing'
            ]
        };
        if (source === 'bundle_opportunity') {
            return level === 'expected' ? [
                'Bundle promoted in checkout',
                'Email to past purchasers',
                'No new inventory risk'
            ] : base[level];
        }
        if (source === 'color_product_combination') {
            return level === 'expected' ? [
                `${evidence.color || 'Color'} proven with ${evidence.colorSuccessRate || '80%'} success`,
                `${evidence.productType || 'Product'} is top category`,
                'Loyal customer base'
            ] : base[level];
        }
        return base[level];
    };
    return {
        conservative: {
            label: 'Conservative',
            revenue: Math.round(basePrice * baseUnits * 0.5),
            units: Math.round(baseUnits * 0.5),
            assumptions: getAssumptions('conservative'),
            probability: 0.25
        },
        expected: {
            label: 'Expected',
            revenue: Math.round(basePrice * baseUnits * confidenceMultiplier),
            units: Math.round(baseUnits * confidenceMultiplier),
            assumptions: getAssumptions('expected'),
            probability: 0.5
        },
        aggressive: {
            label: 'Aggressive',
            revenue: Math.round(basePrice * baseUnits * 1.5),
            units: Math.round(baseUnits * 1.5),
            assumptions: getAssumptions('aggressive'),
            probability: 0.25
        }
    };
}
function recommendTestPath(candidate, scenarios) {
    const source = candidate.patternSource;
    const evidence = candidate.patternEvidence || {};
    if (source === 'bundle_opportunity' || source === 'bundle_merge') {
        return {
            type: 'Soft Bundle Test',
            description: 'Create bundle listing with existing inventory',
            successCriteria: '10+ bundle sales in first 14 days',
            stopConditions: 'Less than 3 sales after 7 days',
            dataLearned: 'Whether customers perceive value in the combined offering',
            investmentRequired: 'Low - no new inventory needed'
        };
    }
    if ([
        'color_product_combination',
        'color_extension',
        'color_variant',
        'variant_expansion'
    ].includes(source)) {
        const units = Math.round(scenarios.conservative.units * 1.2);
        return {
            type: 'Limited Batch Launch',
            description: `Produce ${units} units of ${evidence.color || evidence.suggestedVariant || 'new variant'}`,
            successCriteria: `${Math.round(units * 0.5)}+ units sold in 21 days (50% sell-through)`,
            stopConditions: 'Less than 20% sell-through after 14 days',
            dataLearned: 'Actual demand vs predicted, refund rate, customer feedback',
            investmentRequired: `€${Math.round(units * 20)}-€${Math.round(units * 50)} production cost`
        };
    }
    if (source === 'price_optimization') {
        return {
            type: 'Price Point Validation',
            description: `Launch at ${evidence.priceRange || 'optimal'} price point with limited inventory`,
            successCriteria: 'Conversion rate matches or exceeds band average',
            stopConditions: 'Conversion significantly below average after 7 days',
            dataLearned: 'Price elasticity and margin potential at this point',
            investmentRequired: 'Moderate - limited inventory at target price'
        };
    }
    if (source === 'growth_expansion') {
        return {
            type: 'Category Expansion Test',
            description: `Add 3-5 new SKUs in ${evidence.category || 'growth category'}`,
            successCriteria: 'Maintain category growth rate with new additions',
            stopConditions: 'New SKUs underperform existing by >50%',
            dataLearned: 'Which sub-styles resonate in expanding category',
            investmentRequired: 'Moderate - diversified inventory across new SKUs'
        };
    }
    if (source === 'price_gap' || source === 'seasonal_gap') {
        return {
            type: source === 'price_gap' ? 'Gap Fill Test' : 'Seasonal Pre-Launch',
            description: source === 'price_gap' ? `Launch product in ${evidence.priceRange || 'underserved'} range` : `Time launch for ${evidence.month || 'seasonal'} demand`,
            successCriteria: 'Capture adjacent demand without cannibalization',
            stopConditions: 'Returns from adjacent bands without net gain',
            dataLearned: 'Whether gap represents real demand or price sensitivity',
            investmentRequired: 'Moderate - targeted inventory'
        };
    }
    if (source === 'ai_market_research') {
        return {
            type: 'Pre-order Campaign',
            description: 'Validate market demand before production commitment',
            successCriteria: '25+ pre-orders in 14 days',
            stopConditions: 'Less than 10 pre-orders after 7 days',
            dataLearned: 'Real demand signal for new concept',
            investmentRequired: 'Low - marketing only until validated'
        };
    }
    return {
        type: 'Minimum Viable Launch',
        description: 'Small batch with focused marketing',
        successCriteria: '30% sell-through in first month',
        stopConditions: 'Less than 15% sell-through after 2 weeks',
        dataLearned: 'Market response, pricing sensitivity, customer profile',
        investmentRequired: 'Moderate - limited inventory + marketing'
    };
}
}),
"[project]/packages/brain/src/nexthit/background-analyzer.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runBackgroundAnalysis",
    ()=>runBackgroundAnalysis
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
;
async function runBackgroundAnalysis(shopId) {
    console.log(`[BackgroundAnalyzer] Running analysis for shop ${shopId}`);
    // Analyze and store patterns
    await analyzeColorPatterns(shopId);
    await analyzePriceBandPatterns(shopId);
    await analyzeCategoryPatterns(shopId);
    await analyzeSeasonalPatterns(shopId);
    await analyzeCrossPurchasePatterns(shopId);
    console.log(`[BackgroundAnalyzer] Pattern memory updated for shop ${shopId}`);
}
async function analyzeColorPatterns(shopId) {
    const last90Days = new Date();
    last90Days.setDate(last90Days.getDate() - 90);
    // Get all line items with product info
    const lineItems = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].orderLineItem.findMany({
        where: {
            order: {
                shopId,
                createdAt: {
                    gte: last90Days
                }
            }
        },
        include: {
            order: {
                include: {
                    refunds: true
                }
            }
        }
    });
    const colors = [
        'maroon',
        'black',
        'white',
        'navy',
        'red',
        'blue',
        'green',
        'gold',
        'brown',
        'grey',
        'pink',
        'beige',
        'cream',
        'olive'
    ];
    const colorStats = {};
    for (const item of lineItems){
        const title = item.title.toLowerCase();
        for (const color of colors){
            if (title.includes(color)) {
                if (!colorStats[color]) {
                    colorStats[color] = {
                        sales: 0,
                        refunds: 0,
                        revenue: 0
                    };
                }
                colorStats[color].sales += item.quantity;
                colorStats[color].revenue += Number(item.price) * item.quantity;
                if (item.order.refunds.length > 0) {
                    colorStats[color].refunds++;
                }
                break;
            }
        }
    }
    // Find winning colors (high sales, low refund rate)
    const winners = Object.entries(colorStats).filter(([_, stats])=>stats.sales >= 5).map(([color, stats])=>({
            attribute: 'color',
            value: color,
            successRate: stats.sales > 0 ? 1 - stats.refunds / stats.sales : 0,
            sampleSize: stats.sales,
            revenue: stats.revenue
        })).sort((a, b)=>b.successRate * b.sampleSize - a.successRate * a.sampleSize);
    if (winners.length > 0) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].patternMemory.upsert({
            where: {
                shopId_patternType: {
                    shopId,
                    patternType: 'color_preference'
                }
            },
            update: {
                patternData: {
                    winners: winners.slice(0, 5)
                },
                confidence: Math.min(0.9, winners[0].sampleSize / 50),
                sampleSize: winners.reduce((sum, w)=>sum + w.sampleSize, 0),
                lastUpdated: new Date()
            },
            create: {
                shopId,
                patternType: 'color_preference',
                patternData: {
                    winners: winners.slice(0, 5)
                },
                confidence: Math.min(0.9, winners[0].sampleSize / 50),
                sampleSize: winners.reduce((sum, w)=>sum + w.sampleSize, 0)
            }
        });
    }
}
async function analyzePriceBandPatterns(shopId) {
    const last90Days = new Date();
    last90Days.setDate(last90Days.getDate() - 90);
    const lineItems = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].orderLineItem.findMany({
        where: {
            order: {
                shopId,
                createdAt: {
                    gte: last90Days
                }
            }
        },
        include: {
            order: {
                include: {
                    refunds: true
                }
            }
        }
    });
    // Define price bands
    const bands = {
        'budget': {
            min: 0,
            max: 30,
            sales: 0,
            refunds: 0
        },
        'value': {
            min: 30,
            max: 60,
            sales: 0,
            refunds: 0
        },
        'mid': {
            min: 60,
            max: 100,
            sales: 0,
            refunds: 0
        },
        'premium': {
            min: 100,
            max: 200,
            sales: 0,
            refunds: 0
        },
        'luxury': {
            min: 200,
            max: 10000,
            sales: 0,
            refunds: 0
        }
    };
    for (const item of lineItems){
        const price = Number(item.price);
        for (const [band, range] of Object.entries(bands)){
            if (price >= range.min && price < range.max) {
                bands[band].sales += item.quantity;
                if (item.order.refunds.length > 0) {
                    bands[band].refunds++;
                }
                break;
            }
        }
    }
    const winners = Object.entries(bands).filter(([_, stats])=>stats.sales >= 3).map(([band, stats])=>({
            attribute: 'price_band',
            value: band,
            successRate: stats.sales > 0 ? 1 - stats.refunds / stats.sales : 0,
            sampleSize: stats.sales
        })).sort((a, b)=>b.successRate * b.sampleSize - a.successRate * a.sampleSize);
    if (winners.length > 0) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].patternMemory.upsert({
            where: {
                shopId_patternType: {
                    shopId,
                    patternType: 'price_band'
                }
            },
            update: {
                patternData: {
                    winners,
                    optimalBand: winners[0].value
                },
                confidence: Math.min(0.9, winners[0].sampleSize / 30),
                sampleSize: winners.reduce((sum, w)=>sum + w.sampleSize, 0),
                lastUpdated: new Date()
            },
            create: {
                shopId,
                patternType: 'price_band',
                patternData: {
                    winners,
                    optimalBand: winners[0].value
                },
                confidence: Math.min(0.9, winners[0].sampleSize / 30),
                sampleSize: winners.reduce((sum, w)=>sum + w.sampleSize, 0)
            }
        });
    }
}
async function analyzeCategoryPatterns(shopId) {
    const last90Days = new Date();
    last90Days.setDate(last90Days.getDate() - 90);
    const products = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
        where: {
            shopId
        },
        include: {
            variants: {
                include: {
                    metrics: {
                        where: {
                            date: {
                                gte: last90Days
                            }
                        }
                    }
                }
            }
        }
    });
    const categoryStats = {};
    for (const product of products){
        const category = product.productType || 'Uncategorized';
        if (!categoryStats[category]) {
            categoryStats[category] = {
                sales: 0,
                revenue: 0,
                products: 0
            };
        }
        categoryStats[category].products++;
        for (const variant of product.variants){
            for (const metric of variant.metrics){
                categoryStats[category].sales += metric.unitsSold;
                categoryStats[category].revenue += Number(metric.revenue);
            }
        }
    }
    const winners = Object.entries(categoryStats).filter(([_, stats])=>stats.sales >= 5).map(([category, stats])=>({
            attribute: 'category',
            value: category,
            velocityPerProduct: stats.products > 0 ? stats.sales / stats.products : 0,
            sampleSize: stats.sales,
            revenue: stats.revenue
        })).sort((a, b)=>b.velocityPerProduct - a.velocityPerProduct);
    if (winners.length > 0) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].patternMemory.upsert({
            where: {
                shopId_patternType: {
                    shopId,
                    patternType: 'category_affinity'
                }
            },
            update: {
                patternData: {
                    winners: winners.slice(0, 5),
                    topCategory: winners[0].value
                },
                confidence: Math.min(0.9, winners[0].sampleSize / 40),
                sampleSize: winners.reduce((sum, w)=>sum + w.sampleSize, 0),
                lastUpdated: new Date()
            },
            create: {
                shopId,
                patternType: 'category_affinity',
                patternData: {
                    winners: winners.slice(0, 5),
                    topCategory: winners[0].value
                },
                confidence: Math.min(0.9, winners[0].sampleSize / 40),
                sampleSize: winners.reduce((sum, w)=>sum + w.sampleSize, 0)
            }
        });
    }
}
async function analyzeSeasonalPatterns(shopId) {
    // Analyze last 12 months for seasonal patterns
    const last12Months = new Date();
    last12Months.setFullYear(last12Months.getFullYear() - 1);
    const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyMetric.findMany({
        where: {
            shopId,
            date: {
                gte: last12Months
            }
        },
        orderBy: {
            date: 'asc'
        }
    });
    const monthlyRevenue = {};
    for (const m of metrics){
        const month = m.date.getMonth();
        if (!monthlyRevenue[month]) {
            monthlyRevenue[month] = {
                total: 0,
                count: 0
            };
        }
        monthlyRevenue[month].total += Number(m.netRevenue);
        monthlyRevenue[month].count++;
    }
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    const seasonality = Object.entries(monthlyRevenue).map(([month, data])=>({
            month: monthNames[parseInt(month)],
            avgRevenue: data.count > 0 ? data.total / data.count : 0
        }));
    const avgAllMonths = seasonality.reduce((sum, s)=>sum + s.avgRevenue, 0) / (seasonality.length || 1);
    const peakMonths = seasonality.filter((s)=>s.avgRevenue > avgAllMonths * 1.2);
    const slowMonths = seasonality.filter((s)=>s.avgRevenue < avgAllMonths * 0.8);
    await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].patternMemory.upsert({
        where: {
            shopId_patternType: {
                shopId,
                patternType: 'seasonal'
            }
        },
        update: {
            patternData: {
                peakMonths,
                slowMonths,
                monthlyData: seasonality
            },
            confidence: metrics.length > 60 ? 0.8 : 0.5,
            sampleSize: metrics.length,
            lastUpdated: new Date()
        },
        create: {
            shopId,
            patternType: 'seasonal',
            patternData: {
                peakMonths,
                slowMonths,
                monthlyData: seasonality
            },
            confidence: metrics.length > 60 ? 0.8 : 0.5,
            sampleSize: metrics.length
        }
    });
}
async function analyzeCrossPurchasePatterns(shopId) {
    const last90Days = new Date();
    last90Days.setDate(last90Days.getDate() - 90);
    const orders = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].order.findMany({
        where: {
            shopId,
            createdAt: {
                gte: last90Days
            }
        },
        include: {
            lineItems: true
        }
    });
    // Track which products are bought together
    const pairCounts = {};
    for (const order of orders){
        const productTitles = [
            ...new Set(order.lineItems.map((li)=>li.title))
        ];
        if (productTitles.length < 2) continue;
        for(let i = 0; i < productTitles.length; i++){
            for(let j = i + 1; j < productTitles.length; j++){
                const key = [
                    productTitles[i],
                    productTitles[j]
                ].sort().join('|||');
                if (!pairCounts[key]) {
                    pairCounts[key] = {
                        count: 0,
                        products: [
                            productTitles[i],
                            productTitles[j]
                        ]
                    };
                }
                pairCounts[key].count++;
            }
        }
    }
    const topPairs = Object.values(pairCounts).filter((p)=>p.count >= 3).sort((a, b)=>b.count - a.count).slice(0, 10);
    await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].patternMemory.upsert({
        where: {
            shopId_patternType: {
                shopId,
                patternType: 'cross_purchase'
            }
        },
        update: {
            patternData: {
                topPairs
            },
            confidence: topPairs.length > 0 ? Math.min(0.85, topPairs[0].count / 15) : 0.3,
            sampleSize: orders.length,
            lastUpdated: new Date()
        },
        create: {
            shopId,
            patternType: 'cross_purchase',
            patternData: {
                topPairs
            },
            confidence: topPairs.length > 0 ? Math.min(0.85, topPairs[0].count / 15) : 0.3,
            sampleSize: orders.length
        }
    });
}
}),
"[project]/packages/brain/src/nexthit/outcome-tracker.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyzeOutcomes",
    ()=>analyzeOutcomes,
    "getLaunchHistory",
    ()=>getLaunchHistory,
    "recordLaunchDecision",
    ()=>recordLaunchDecision,
    "recordLaunchPerformance",
    ()=>recordLaunchPerformance,
    "recordLessonsLearned",
    ()=>recordLessonsLearned,
    "suggestWeightAdjustments",
    ()=>suggestWeightAdjustments
]);
/**
 * NextHit Outcome Tracker
 * Tracks the outcomes of launched candidates to enable learning and feedback loops
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
;
async function recordLaunchDecision(candidateId, decision, reason, launchDate) {
    // Update candidate status
    await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].nextHitCandidate.update({
        where: {
            id: candidateId
        },
        data: {
            status: decision === 'launched' ? 'launched' : decision === 'rejected' ? 'rejected' : 'shortlisted'
        }
    });
    // Create or update outcome record
    await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].nextHitOutcome.upsert({
        where: {
            candidateId
        },
        update: {
            decision,
            decisionReason: reason,
            launchDate: launchDate || null
        },
        create: {
            candidateId,
            decision,
            decisionReason: reason,
            launchDate: launchDate || null
        }
    });
    console.log(`[OutcomeTracker] Recorded ${decision} decision for candidate ${candidateId}`);
}
async function recordLaunchPerformance(candidateId, metrics) {
    // Get the candidate and its analysis for comparison
    const candidate = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].nextHitCandidate.findUnique({
        where: {
            id: candidateId
        },
        include: {
            analysis: true
        }
    });
    if (!candidate) {
        throw new Error(`Candidate ${candidateId} not found`);
    }
    // Calculate performance vs prediction
    let performanceVsPrediction = 'met';
    if (candidate.analysis?.revenueScenarios) {
        const scenarios = candidate.analysis.revenueScenarios;
        const expectedRevenue = scenarios.expected?.revenue || 0;
        if (metrics.actualRevenue > expectedRevenue * 1.2) {
            performanceVsPrediction = 'exceeded';
        } else if (metrics.actualRevenue < expectedRevenue * 0.7) {
            performanceVsPrediction = 'missed';
        }
    }
    // Update outcome record
    await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].nextHitOutcome.update({
        where: {
            candidateId
        },
        data: {
            actualRevenue: new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Prisma"].Decimal(metrics.actualRevenue),
            actualUnits: metrics.actualUnits,
            refundRate: metrics.refundRate,
            performanceVsPrediction
        }
    });
    console.log(`[OutcomeTracker] Recorded performance for ${candidateId}: ${performanceVsPrediction}`);
}
async function recordLessonsLearned(candidateId, lessons) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].nextHitOutcome.update({
        where: {
            candidateId
        },
        data: {
            lessonsLearned: lessons
        }
    });
}
async function analyzeOutcomes(shopId) {
    const outcomes = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].nextHitOutcome.findMany({
        where: {
            candidate: {
                shopId
            },
            decision: 'launched',
            actualRevenue: {
                not: null
            }
        },
        include: {
            candidate: {
                include: {
                    analysis: true
                }
            }
        }
    });
    let exceeded = 0;
    let met = 0;
    let missed = 0;
    let totalAccuracy = 0;
    const insights = [];
    for (const outcome of outcomes){
        if (outcome.performanceVsPrediction === 'exceeded') exceeded++;
        else if (outcome.performanceVsPrediction === 'met') met++;
        else missed++;
        // Calculate accuracy
        if (outcome.candidate.analysis?.revenueScenarios && outcome.actualRevenue) {
            const scenarios = outcome.candidate.analysis.revenueScenarios;
            const expectedRevenue = scenarios.expected?.revenue || 1;
            const accuracy = Math.min(1, Number(outcome.actualRevenue) / expectedRevenue);
            totalAccuracy += accuracy;
        }
    }
    const totalLaunched = outcomes.length;
    const averageAccuracy = totalLaunched > 0 ? totalAccuracy / totalLaunched : 0;
    // Generate insights
    if (exceeded > met + missed) {
        insights.push('Your predictions tend to be conservative. Consider raising confidence thresholds.');
    }
    if (missed > exceeded + met) {
        insights.push('Several launches underperformed. Review market trend data quality.');
    }
    if (averageAccuracy > 0.8) {
        insights.push('High prediction accuracy indicates strong pattern recognition.');
    }
    // Check for pattern-specific insights
    const patternPerformance = {};
    for (const outcome of outcomes){
        const source = outcome.candidate.patternSource;
        if (!patternPerformance[source]) {
            patternPerformance[source] = {
                succeeded: 0,
                total: 0
            };
        }
        patternPerformance[source].total++;
        if (outcome.performanceVsPrediction !== 'missed') {
            patternPerformance[source].succeeded++;
        }
    }
    for (const [source, perf] of Object.entries(patternPerformance)){
        const successRate = perf.succeeded / perf.total;
        if (successRate < 0.5 && perf.total >= 3) {
            insights.push(`${source} candidates have low success rate (${Math.round(successRate * 100)}%). Consider de-prioritizing.`);
        } else if (successRate > 0.8 && perf.total >= 3) {
            insights.push(`${source} candidates perform well (${Math.round(successRate * 100)}% success). Prioritize this pattern.`);
        }
    }
    return {
        totalLaunched,
        exceeded,
        met,
        missed,
        averageAccuracy: Math.round(averageAccuracy * 100) / 100,
        insights
    };
}
async function getLaunchHistory(shopId, limit = 20) {
    const outcomes = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].nextHitOutcome.findMany({
        where: {
            candidate: {
                shopId
            }
        },
        include: {
            candidate: {
                select: {
                    title: true,
                    patternSource: true,
                    hitType: true,
                    confidence: true,
                    scores: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: limit
    });
    return outcomes.map((o)=>({
            candidateTitle: o.candidate.title,
            patternSource: o.candidate.patternSource,
            hitType: o.candidate.hitType,
            predictedConfidence: o.candidate.confidence,
            decision: o.decision,
            decisionReason: o.decisionReason,
            launchDate: o.launchDate,
            actualRevenue: o.actualRevenue ? Number(o.actualRevenue) : null,
            actualUnits: o.actualUnits,
            refundRate: o.refundRate ? Number(o.refundRate) : null,
            performanceVsPrediction: o.performanceVsPrediction,
            lessonsLearned: o.lessonsLearned
        }));
}
async function suggestWeightAdjustments(shopId) {
    const outcomes = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].nextHitOutcome.findMany({
        where: {
            candidate: {
                shopId
            },
            decision: 'launched',
            actualRevenue: {
                not: null
            }
        },
        include: {
            candidate: {
                include: {
                    analysis: true
                }
            }
        }
    });
    if (outcomes.length < 5) {
        return {
            suggestions: [
                {
                    weight: 'N/A',
                    currentValue: 0,
                    suggestedValue: 0,
                    reason: 'Not enough launch data to suggest adjustments. Need at least 5 completed launches.'
                }
            ]
        };
    }
    const suggestions = [];
    // Analyze which score components correlated with success
    let trendSuccessCorrelation = 0;
    let seasonalitySuccessCorrelation = 0;
    let gapFillSuccessCorrelation = 0;
    for (const outcome of outcomes){
        const scores = outcome.candidate.scores;
        const succeeded = outcome.performanceVsPrediction !== 'missed';
        if (scores?.trendMomentum > 0.6 && succeeded) trendSuccessCorrelation++;
        if (scores?.trendMomentum > 0.6 && !succeeded) trendSuccessCorrelation--;
        if (scores?.seasonalityMatch > 0.6 && succeeded) seasonalitySuccessCorrelation++;
        if (scores?.seasonalityMatch > 0.6 && !succeeded) seasonalitySuccessCorrelation--;
        if (scores?.gapFill > 0.6 && succeeded) gapFillSuccessCorrelation++;
        if (scores?.gapFill > 0.6 && !succeeded) gapFillSuccessCorrelation--;
    }
    // Suggest adjustments based on correlations
    if (trendSuccessCorrelation < -2) {
        suggestions.push({
            weight: 'trendMomentum',
            currentValue: 0.20,
            suggestedValue: 0.15,
            reason: 'Trend momentum has weak correlation with actual success. Consider reducing weight.'
        });
    } else if (trendSuccessCorrelation > 2) {
        suggestions.push({
            weight: 'trendMomentum',
            currentValue: 0.20,
            suggestedValue: 0.25,
            reason: 'Trend momentum strongly predicts success. Consider increasing weight.'
        });
    }
    if (gapFillSuccessCorrelation > 2) {
        suggestions.push({
            weight: 'gapFill',
            currentValue: 0.20,
            suggestedValue: 0.25,
            reason: 'Gap-filling candidates outperform. Consider increasing weight.'
        });
    }
    if (suggestions.length === 0) {
        suggestions.push({
            weight: 'all',
            currentValue: 0,
            suggestedValue: 0,
            reason: 'Current weights appear well-calibrated based on historical performance.'
        });
    }
    return {
        suggestions
    };
}
}),
"[project]/packages/brain/src/engine/metrics.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "aggregateDailyMetrics",
    ()=>aggregateDailyMetrics,
    "aggregateProductMetrics",
    ()=>aggregateProductMetrics,
    "backfillDailyMetrics",
    ()=>backfillDailyMetrics,
    "getTopProducts",
    ()=>getTopProducts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client/runtime/library [external] (@prisma/client/runtime/library, esm_import, [project]/node_modules/@prisma/client)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function aggregateDailyMetrics(shopId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const orders = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].order.findMany({
        where: {
            shopId,
            createdAt: {
                gte: startOfDay,
                lte: endOfDay
            }
        },
        include: {
            refunds: true,
            lineItems: true
        }
    });
    const orderCount = orders.length;
    const grossRevenue = orders.reduce((acc, order)=>acc.plus(order.totalPrice), new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Decimal"](0));
    const refundAmount = orders.reduce((acc, order)=>{
        const orderRefunds = order.refunds.reduce((rAcc, r)=>rAcc.plus(r.amount), new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Decimal"](0));
        return acc.plus(orderRefunds);
    }, new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Decimal"](0));
    const netRevenue = grossRevenue.minus(refundAmount);
    const aov = orderCount > 0 ? grossRevenue.dividedBy(orderCount) : new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Decimal"](0);
    // FIXED: Proper customer segmentation using actual order-customer links
    const { newCustomersCount, returningCustomersCount } = await calculateCustomerSegmentation(shopId, orders, startOfDay);
    // v1.1 Executive Dashboard simulation engine
    // Values are simulated based on revenue volume to provide context until 3rd party APIs are connected
    const noise = ()=>Math.random() * 0.4 + 0.8; // +/- 20% variance
    const marketingSpend = netRevenue.mul(0.25 * noise()); // Dynamic spend simulation
    const sessions = Math.floor(netRevenue.toNumber() / (2.5 * noise())); // Simulation based on avg $2.50 RPC
    const fulfillmentTime = 1.2 + Math.random() * 2.5; // Simulated cleanup
    await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyMetric.upsert({
        where: {
            shopId_date: {
                shopId,
                date: startOfDay
            }
        },
        update: {
            grossRevenue,
            netRevenue,
            orderCount,
            aov,
            refundAmount,
            newCustomersCount,
            returningCustomersCount,
            marketingSpend,
            sessions,
            fulfillmentTime
        },
        create: {
            shopId,
            date: startOfDay,
            grossRevenue,
            netRevenue,
            orderCount,
            aov,
            refundAmount,
            newCustomersCount,
            returningCustomersCount,
            marketingSpend,
            sessions,
            fulfillmentTime
        }
    });
}
async function backfillDailyMetrics(shopId, days = 30) {
    console.log(`[Metrics] Starting backfill for shop ${shopId} over ${days} days...`);
    const now = new Date();
    for(let i = 0; i < days; i++){
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        try {
            await aggregateDailyMetrics(shopId, date);
            await aggregateProductMetrics(shopId, date);
        } catch (err) {
            console.error(`[Metrics] Failed to aggregate for ${date.toISOString().split('T')[0]}:`, err.message);
        }
    }
    console.log(`[Metrics] Completed backfill for ${shopId}`);
}
/**
 * Calculate new vs returning customers based on actual order history
 */ async function calculateCustomerSegmentation(shopId, todaysOrders, beforeDate) {
    let newCustomersCount = 0;
    let returningCustomersCount = 0;
    // Get unique customer IDs from today's orders
    const customerIds = [
        ...new Set(todaysOrders.map((o)=>o.customerId).filter(Boolean))
    ];
    if (customerIds.length === 0) {
        // No customer links - all orders are "guest" orders, count as new
        return {
            newCustomersCount: todaysOrders.length,
            returningCustomersCount: 0
        };
    }
    // For each customer, check if they had orders before today
    for (const customerId of customerIds){
        const previousOrderCount = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].order.count({
            where: {
                shopId,
                customerId,
                createdAt: {
                    lt: beforeDate
                }
            }
        });
        if (previousOrderCount > 0) {
            returningCustomersCount++;
        } else {
            newCustomersCount++;
        }
    }
    // Count orders without customer links as new customers
    const ordersWithoutCustomer = todaysOrders.filter((o)=>!o.customerId).length;
    newCustomersCount += ordersWithoutCustomer;
    return {
        newCustomersCount,
        returningCustomersCount
    };
}
async function aggregateProductMetrics(shopId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const lineItems = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].orderLineItem.findMany({
        where: {
            order: {
                shopId,
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        },
        include: {
            order: {
                include: {
                    refunds: true
                }
            }
        }
    });
    // Group by variantId with refund tracking
    const variantStats = {};
    for (const item of lineItems){
        if (!item.variantId) continue;
        if (!variantStats[item.variantId]) {
            variantStats[item.variantId] = {
                revenue: new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Decimal"](0),
                unitsSold: 0,
                refundCount: 0
            };
        }
        const itemTotal = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Decimal"](item.price).mul(item.quantity);
        variantStats[item.variantId].revenue = variantStats[item.variantId].revenue.plus(itemTotal);
        variantStats[item.variantId].unitsSold += item.quantity;
        // Check if this order has refunds
        if (item.order.refunds.length > 0) {
            variantStats[item.variantId].refundCount++;
        }
    }
    for (const [variantId, stats] of Object.entries(variantStats)){
        const variant = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].variant.findUnique({
            where: {
                shopifyId: variantId
            }
        });
        if (!variant) continue;
        // Calculate refund rate as percentage of units sold
        const refundRate = stats.unitsSold > 0 ? stats.refundCount / stats.unitsSold * 100 : 0;
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].productMetric.upsert({
            where: {
                variantId_date: {
                    variantId: variant.id,
                    date: startOfDay
                }
            },
            update: {
                revenue: stats.revenue,
                unitsSold: stats.unitsSold,
                refundRate
            },
            create: {
                variantId: variant.id,
                date: startOfDay,
                revenue: stats.revenue,
                unitsSold: stats.unitsSold,
                refundRate
            }
        });
    }
}
async function getTopProducts(shopId, limit = 10) {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].productMetric.groupBy({
        by: [
            'variantId'
        ],
        where: {
            date: {
                gte: last30Days
            },
            variant: {
                product: {
                    shopId
                }
            }
        },
        _sum: {
            revenue: true,
            unitsSold: true
        },
        orderBy: {
            _sum: {
                revenue: 'desc'
            }
        },
        take: limit
    });
    const products = await Promise.all(metrics.map(async (m)=>{
        const variant = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].variant.findUnique({
            where: {
                id: m.variantId
            },
            include: {
                product: true
            }
        });
        return {
            productTitle: variant?.product.title || 'Unknown',
            variantTitle: variant?.title || '',
            revenue: Number(m._sum.revenue || 0),
            unitsSold: m._sum.unitsSold || 0
        };
    }));
    return products;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/packages/brain/src/compiler.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compileBrandDNA",
    ()=>compileBrandDNA,
    "generateBrandSystemPrompt",
    ()=>generateBrandSystemPrompt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
;
async function compileBrandDNA(shopId) {
    const [identity, governance, voice, kpi, persona] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].brandIdentity.findUnique({
            where: {
                shopId
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].decisionGovernance.findUnique({
            where: {
                shopId
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].brandVoice.findUnique({
            where: {
                shopId
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].kPIModel.findUnique({
            where: {
                shopId
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].customerPersona.findFirst({
            where: {
                shopId,
                isPrimary: true
            }
        })
    ]);
    if (!identity) {
        return null; // Onboarding not complete
    }
    return {
        brandName: identity.brandName,
        mission: identity.mission,
        promise: identity.promise,
        positioning: identity.positioning,
        coreValues: identity.coreValues,
        antiValues: identity.antiValues,
        toneAttributes: voice?.toneAttributes || [],
        neverLanguage: voice?.neverLanguage || [],
        primaryPersona: persona ? {
            name: persona.name,
            jobToBeDone: persona.jobToBeDone,
            triggers: persona.triggers,
            objections: persona.objections
        } : null,
        riskTolerance: governance?.riskTolerance || 'medium',
        priorityAreas: governance?.priorityAreas || [],
        northStarMetric: kpi?.northStarMetric || 'Revenue'
    };
}
function generateBrandSystemPrompt(dna) {
    const personaSection = dna.primaryPersona ? `
PRIMARY PERSONA: ${dna.primaryPersona.name}
- Job to be Done: ${dna.primaryPersona.jobToBeDone}
- Purchase Triggers: ${dna.primaryPersona.triggers.join(', ')}
- Common Objections: ${dna.primaryPersona.objections.join(', ')}` : '';
    return `You are the strategic brain for ${dna.brandName}.

BRAND IDENTITY:
- Mission: ${dna.mission}
- Promise: ${dna.promise}
- Core Values: ${dna.coreValues.join(', ')}
- We are NOT: ${dna.antiValues.join(', ')}

POSITIONING:
For ${dna.positioning.target} who need ${dna.positioning.category},
we are the only ${dna.positioning.differentiator} because ${dna.positioning.proof}.

VOICE & TONE:
- Tone: ${dna.toneAttributes.join(', ')}
- NEVER use these words: ${dna.neverLanguage.join(', ')}
${personaSection}

DECISION CONTEXT:
- Risk Tolerance: ${dna.riskTolerance}
- Priority Areas: ${dna.priorityAreas.join(', ')}
- North Star Metric: ${dna.northStarMetric}

INSTRUCTIONS:
Always reason like the brand's CEO. Protect brand identity above short-term gains.
Every recommendation must align with the brand's values and speak to the primary persona.
When in doubt, default to the brand's stated positioning and voice guidelines.`;
}
}),
"[project]/packages/brain/src/engine/orchestrator.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "askTheBusiness",
    ()=>askTheBusiness,
    "explainRecommendation",
    ()=>explainRecommendation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/client.mjs [app-rsc] (ecmascript) <export OpenAI as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/engine/metrics.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$compiler$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/compiler.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
async function explainRecommendation(shopId, candidate) {
    const openai = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]();
    const memory = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].businessMemorySnapshot.findFirst({
        where: {
            shopId
        },
        orderBy: {
            date: 'desc'
        }
    });
    const activeGoal = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].goal.findFirst({
        where: {
            shopId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    const prompt = `
    You are BrandMindAI, a business decision OS. 
    Explain this ${candidate.type} to a merchant.
    
    Candidate Data:
    ${JSON.stringify(candidate, null, 2)}
    
    Business Profile:
    ${JSON.stringify(memory?.snapshot || {}, null, 2)}
    
    Current Goal:
    ${JSON.stringify(activeGoal || {}, null, 2)}
    
    Response format:
    - Why this matters (1-2 sentences)
    - Evidence highlights (bullet points)
    - Recommended test/next step
    - Assumptions made
  `;
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: prompt
            }
        ],
        temperature: 0.7
    });
    return response.choices[0].message.content;
}
async function askTheBusiness(shopId, question) {
    const openai = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]();
    // Get Brand DNA for system prompt
    const brandDNA = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$compiler$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["compileBrandDNA"])(shopId);
    const brandSystemPrompt = brandDNA ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$compiler$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateBrandSystemPrompt"])(brandDNA) : 'You are BrandMindAI, an AI assistant for Shopify merchants.';
    // Enhanced RAG: pull latest metrics, memory, top products, and recent alerts
    const memory = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].businessMemorySnapshot.findFirst({
        where: {
            shopId
        },
        orderBy: {
            date: 'desc'
        }
    });
    const metrics = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyMetric.findMany({
        where: {
            shopId
        },
        orderBy: {
            date: 'desc'
        },
        take: 7
    });
    // Get top-selling products for product-specific questions
    const topProducts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTopProducts"])(shopId, 10);
    // Get recent refunds for quality-related questions
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const recentRefunds = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].refund.findMany({
        where: {
            order: {
                shopId
            },
            createdAt: {
                gte: last7Days
            }
        },
        include: {
            order: {
                include: {
                    lineItems: true
                }
            }
        },
        take: 20
    });
    const refundSummary = recentRefunds.map((r)=>({
            amount: Number(r.amount),
            date: r.createdAt.toISOString().split('T')[0],
            products: r.order.lineItems.map((li)=>li.title).join(', ')
        }));
    // Get active goal for context
    const activeGoal = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].goal.findFirst({
        where: {
            shopId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    const userPrompt = `
=== RECENT DAILY METRICS (Last 7 Days) ===
${metrics.map((m)=>`${m.date.toISOString().split('T')[0]}: Revenue $${Number(m.netRevenue).toFixed(2)}, Orders: ${m.orderCount}, AOV: $${Number(m.aov).toFixed(2)}, Refunds: $${Number(m.refundAmount).toFixed(2)}`).join('\n')}

=== TOP SELLING PRODUCTS (Last 30 Days) ===
${topProducts.map((p, i)=>`${i + 1}. ${p.productTitle} ${p.variantTitle ? `(${p.variantTitle})` : ''}: $${p.revenue.toFixed(2)} revenue, ${p.unitsSold} units`).join('\n')}

=== RECENT REFUNDS (Last 7 Days) ===
${refundSummary.length > 0 ? refundSummary.map((r)=>`${r.date}: $${r.amount.toFixed(2)} - Products: ${r.products}`).join('\n') : 'No refunds in the last 7 days'}

=== CURRENT BUSINESS GOAL ===
${activeGoal ? `${activeGoal.type} - Priority: ${activeGoal.priority}` : 'No goal set'}

=== MERCHANT QUESTION ===
${question}

=== RULES ===
- Only use the data provided above.
- If you don't have the data to answer, say so clearly.
- Cite specific numbers when possible.
- Keep responses concise and actionable.
- Align your response with the brand's identity and voice.
  `;
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: brandSystemPrompt
            },
            {
                role: 'user',
                content: userPrompt
            }
        ],
        temperature: 0.7
    });
    return response.choices[0].message.content;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/packages/brain/src/engine/goals.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GoalType",
    ()=>GoalType,
    "getGoalWeights",
    ()=>getGoalWeights,
    "setGoal",
    ()=>setGoal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
;
var GoalType = /*#__PURE__*/ function(GoalType) {
    GoalType["REVENUE_GROWTH"] = "REVENUE_GROWTH";
    GoalType["REFUND_REDUCTION"] = "REFUND_REDUCTION";
    GoalType["AOV_GROWTH"] = "AOV_GROWTH";
    GoalType["ACQUISITION"] = "ACQUISITION";
    return GoalType;
}({});
async function getGoalWeights(shopId) {
    const activeGoal = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].goal.findFirst({
        where: {
            shopId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    if (!activeGoal) {
        return {
            revenueWeight: 1,
            refundWeight: 1,
            aovWeight: 1,
            riskWeight: 1
        };
    }
    switch(activeGoal.type){
        case "REVENUE_GROWTH":
            return {
                revenueWeight: 2.0,
                refundWeight: 0.8,
                aovWeight: 1.5,
                riskWeight: 1.0
            };
        case "REFUND_REDUCTION":
            return {
                revenueWeight: 0.8,
                refundWeight: 2.5,
                aovWeight: 1.0,
                riskWeight: 1.5
            };
        case "AOV_GROWTH":
            return {
                revenueWeight: 1.2,
                refundWeight: 1.0,
                aovWeight: 2.5,
                riskWeight: 1.0
            };
        default:
            return {
                revenueWeight: 1,
                refundWeight: 1,
                aovWeight: 1,
                riskWeight: 1
            };
    }
}
async function setGoal(shopId, type, params) {
    return await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].goal.create({
        data: {
            shopId,
            type,
            targetValue: params.targetValue,
            timeHorizonDays: params.timeHorizonDays,
            constraints: params.constraints || {},
            priority: params.priority || 3
        }
    });
}
}),
"[project]/packages/brain/src/engine/decision.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DecisionEngine",
    ()=>DecisionEngine,
    "EngineModule",
    ()=>EngineModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$goals$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/engine/goals.ts [app-rsc] (ecmascript)");
;
class EngineModule {
}
class DecisionEngine {
    modules = [];
    registerModule(module) {
        this.modules.push(module);
    }
    async run(shopId) {
        const candidates = [];
        for (const module of this.modules){
            try {
                const results = await module.run(shopId);
                candidates.push(...results);
            } catch (error) {
                console.error(`Module ${module.constructor.name} failed:`, error);
            }
        }
        return await this.rankCandidates(shopId, candidates);
    }
    async rankCandidates(shopId, candidates) {
        const weights = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$goals$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGoalWeights"])(shopId);
        return candidates.map((c)=>{
            // Determine category weight based on candidate type and title
            let categoryWeight = 1.0;
            const category = this.inferCategory(c);
            switch(category){
                case 'revenue':
                    categoryWeight = weights.revenueWeight;
                    break;
                case 'refund':
                    categoryWeight = weights.refundWeight;
                    break;
                case 'aov':
                    categoryWeight = weights.aovWeight;
                    break;
                case 'risk':
                    categoryWeight = weights.riskWeight;
                    break;
            }
            // Priority boost for dangers
            const priorityBoost = c.type === 'danger' ? 1.2 : 1.0;
            // Final score: (Alignment * Category Weight * Priority Boost) * Confidence
            const score = c.goal_alignment * categoryWeight * priorityBoost * c.confidence;
            return {
                ...c,
                category,
                score: Math.round(score * 100) / 100,
                priorityBoost
            };
        }).sort((a, b)=>{
            // Dangers always come first, then sort by score
            if (a.type === 'danger' && b.type !== 'danger') return -1;
            if (a.type !== 'danger' && b.type === 'danger') return 1;
            return b.score - a.score;
        });
    }
    inferCategory(candidate) {
        const title = candidate.title.toLowerCase();
        if (title.includes('refund') || title.includes('return')) return 'refund';
        if (title.includes('revenue') || title.includes('sales') || title.includes('restock')) return 'revenue';
        if (title.includes('bundle') || title.includes('aov') || title.includes('upsell')) return 'aov';
        if (title.includes('stock') || title.includes('risk') || title.includes('drop')) return 'risk';
        return 'general';
    }
}
}),
"[project]/packages/brain/src/engine/executive-dashboard.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "calculateExecutiveKPIs",
    ()=>calculateExecutiveKPIs,
    "generateExecutiveBrief",
    ()=>generateExecutiveBrief
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client/runtime/library [external] (@prisma/client/runtime/library, esm_import, [project]/node_modules/@prisma/client)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function calculateExecutiveKPIs(shopId) {
    const now = new Date();
    // Align to midnight to ensure clean windows
    const todayMidnight = new Date(now);
    todayMidnight.setHours(0, 0, 0, 0);
    const last7Days = new Date(todayMidnight.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prev7Days = new Date(todayMidnight.getTime() - 14 * 24 * 60 * 60 * 1000);
    // Fetch current and previous period metrics
    const currentMetrics = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyMetric.findMany({
        where: {
            shopId,
            date: {
                gte: last7Days
            }
        },
        orderBy: {
            date: 'desc'
        }
    });
    const previousMetrics = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].dailyMetric.findMany({
        where: {
            shopId,
            date: {
                gte: prev7Days,
                lt: last7Days
            }
        },
        orderBy: {
            date: 'desc'
        }
    });
    const currentRevenue = currentMetrics.reduce((sum, m)=>sum.plus(m.netRevenue), new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Decimal"](0));
    const previousRevenue = previousMetrics.reduce((sum, m)=>sum.plus(m.netRevenue), new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Decimal"](0));
    const currentMarketing = currentMetrics.reduce((sum, m)=>sum.plus(m.marketingSpend || 0), new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Decimal"](0));
    const currentSessions = currentMetrics.reduce((sum, m)=>sum + (m.sessions || 0), 0);
    const currentRefunds = currentMetrics.reduce((sum, m)=>sum.plus(m.refundAmount), new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Decimal"](0));
    // 1. Revenue Momentum
    let momentum = 0;
    if (previousRevenue.gt(0)) {
        momentum = currentRevenue.minus(previousRevenue).dividedBy(previousRevenue).toNumber() * 100;
    } else if (currentRevenue.gt(0)) {
        momentum = 100; // 100% growth if starting from zero
    }
    const revenueMomentum = {
        value: Math.round(momentum * 10) / 10,
        trend: momentum > 2 ? 'up' : momentum < -2 ? 'down' : 'flat',
        comparison: 'WoW'
    };
    // 2. Profitability Health Score (0-100)
    // formula: 0.45 * Gross Margin + 0.35 * Marketing Efficiency + 0.20 * Discount Pressure (inv)
    // Attempt to calculate real Gross Margin if variants have cost data
    const variantsWithCost = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].variant.findMany({
        where: {
            cost: {
                not: null
            }
        },
        select: {
            shopifyId: true,
            cost: true,
            price: true
        }
    });
    let grossMetric = 0.6; // Baseline 60%
    if (variantsWithCost.length > 0) {
        // Simple aggregate margin for now
        const avgMargin = variantsWithCost.reduce((sum, v)=>{
            const price = v.price.toNumber();
            const cost = v.cost?.toNumber() || 0;
            return sum + (price > 0 ? (price - cost) / price : 0);
        }, 0) / variantsWithCost.length;
        grossMetric = Math.max(0.1, Math.min(0.9, avgMargin));
    }
    const roas = currentMarketing.gt(0) ? currentRevenue.dividedBy(currentMarketing).toNumber() : 5; // Default 5x if no spend
    const marketingEfficiency = Math.min(1, roas / 10); // Normalize to 10x ROAS
    const discountPressureVal = currentRevenue.gt(0) ? currentRefunds.dividedBy(currentRevenue).toNumber() : 0;
    const invDiscountPressure = 1 - discountPressureVal;
    const profitabilityScoreRaw = (0.45 * grossMetric + 0.35 * marketingEfficiency + 0.20 * invDiscountPressure) * 100;
    const profitabilityScore = Math.min(100, Math.max(0, Math.round(profitabilityScoreRaw)));
    const profitabilityHealth = {
        score: profitabilityScore,
        status: profitabilityScore >= 75 ? 'healthy' : profitabilityScore >= 55 ? 'fragile' : 'critical'
    };
    // 3. Growth Quality Score (0-100)
    // Sustainable growth index: combines momentum (volume) and efficiency (profitability)
    const momentumBonus = momentum > 10 ? 20 : momentum > 0 ? 10 : -10;
    const growthQualityScoreRaw = marketingEfficiency * 70 + momentumBonus + 10;
    const growthQualityScore = Math.min(100, Math.max(0, Math.round(growthQualityScoreRaw)));
    // 4. Customer Health Indicator (0-100)
    const newCustomers = currentMetrics.reduce((sum, m)=>sum + m.newCustomersCount, 0);
    const returningCustomers = currentMetrics.reduce((sum, m)=>sum + m.returningCustomersCount, 0);
    const totalCustomers = newCustomers + returningCustomers;
    const repeatRate = totalCustomers > 0 ? returningCustomers / totalCustomers : 0;
    // Logic: NEW stores shouldn't be penalized for 0 repeats. 
    // If we have high new customer acquisition, we start healthy.
    const acquisitionStrength = Math.min(1, newCustomers / 10); // 10 new customers/week is decent for simulation
    const customerHealthScoreRaw = repeatRate * 60 + acquisitionStrength * 40;
    const customerHealthScore = Math.min(100, Math.max(20, Math.round(customerHealthScoreRaw)));
    // 5. Pricing & Discount Pressure Index
    const discountPressure = {
        value: Math.round(discountPressureVal * 100),
        trend: discountPressureVal > 0.15 ? 'rising' : 'stable'
    };
    // 6. Operational Risk Signal
    const currentFulfillmentTime = currentMetrics.length > 0 ? currentMetrics.reduce((sum, m)=>sum + (m.fulfillmentTime || 0), 0) / currentMetrics.length : 0;
    const refundRate = currentRevenue.gt(0) ? currentRefunds.dividedBy(currentRevenue).toNumber() : 0;
    let riskLevel = 'LOW';
    let riskSignal = 'Operational metrics are stable across all departments.';
    if (refundRate > 0.2 || discountPressureVal > 0.3) {
        riskLevel = 'HIGH';
        riskSignal = refundRate > 0.2 ? 'Critical refund spike detected. Audit product quality and fulfillment accuracy immediately.' : 'Extreme discounting is destroying margin profile.';
    } else if (currentFulfillmentTime > 4 || momentum < -15) {
        riskLevel = 'MEDIUM';
        riskSignal = currentFulfillmentTime > 4 ? 'Fulfillment latency detected. Scale up logistics capacity.' : 'Significant revenue contraction. Investigate demand drop-off.';
    }
    return {
        revenueMomentum,
        profitabilityHealth,
        growthQuality: {
            score: growthQualityScore
        },
        customerHealth: {
            score: customerHealthScore
        },
        discountPressure,
        operationalRisk: {
            level: riskLevel,
            signal: riskSignal
        }
    };
}
async function generateExecutiveBrief(shopId, kpis) {
    // FALLBACK GENERATOR: If API key is missing or AI fails, we use a deterministic rule-based brief
    const getFallbackBrief = ()=>{
        const health = kpis.profitabilityHealth.status;
        const trend = kpis.revenueMomentum.trend === 'up' ? 'positive' : 'concerning';
        const risk = kpis.operationalRisk.level === 'HIGH' ? 'Critical' : 'Moderate';
        return `Current performance is ${health} with a ${trend} revenue trajectory. ${kpis.operationalRisk.signal} ${risk} operational risks detected in the supply chain. Prioritize margin protection in the next 72 hours.`;
    };
    if (!process.env.OPENAI_API_KEY) {
        console.warn('OPENAI_API_KEY missing - using rule-based fallback for Executive Brief');
        return getFallbackBrief();
    }
    try {
        const { OpenAI } = await __turbopack_context__.A("[project]/node_modules/openai/index.mjs [app-rsc] (ecmascript, async loader)");
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        const prompt = `
        You are BrandMindAI, an AI Executive Business Partner for a Shopify brand.
        Analyze the following 6 Executive KPIs and provide a concise "Executive Brief" (3-4 sentences).
        
        KPIs:
        1. Revenue Momentum: ${kpis.revenueMomentum.value}% (${kpis.revenueMomentum.trend})
        2. Profitability Health: ${kpis.profitabilityHealth.score}/100 (${kpis.profitabilityHealth.status})
        3. Growth Quality: ${kpis.growthQuality.score}/100
        4. Customer Health: ${kpis.customerHealth.score}/100
        5. Discount Pressure: ${kpis.discountPressure.value}% (${kpis.discountPressure.trend})
        6. Operational Risk: ${kpis.operationalRisk.level} - ${kpis.operationalRisk.signal}

        Rules:
        - Answer: Is the business healthy? Where is risk? Where is opportunity?
        - Keep it under 100 words.
        - Be direct, executive, and non-generic.
        - Format as a single paragraph or clean bullet points.
      `;
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 200
        });
        return response.choices[0].message.content || getFallbackBrief();
    } catch (error) {
        console.error('LLM Brief generation failed:', error);
        return getFallbackBrief();
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/packages/brain/src/rag/context.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildStoreContext",
    ()=>buildStoreContext,
    "formatContextForPrompt",
    ()=>formatContextForPrompt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
;
async function buildStoreContext(shopId) {
    // Get product stats
    const productCount = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.count({
        where: {
            shopId
        }
    });
    const products = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
        where: {
            shopId
        },
        include: {
            variants: true
        },
        take: 50,
        orderBy: {
            createdAt: 'desc'
        }
    });
    // Get order stats
    const orderCount = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].order.count({
        where: {
            shopId
        }
    });
    const orderStats = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].order.aggregate({
        where: {
            shopId
        },
        _sum: {
            totalPrice: true
        },
        _avg: {
            totalPrice: true
        }
    });
    const customerCount = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].customer.count({
        where: {
            shopId
        }
    });
    const refundCount = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].refund.count({
        where: {
            order: {
                shopId
            }
        }
    });
    // Get recent orders for activity
    const recentOrders = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].order.findMany({
        where: {
            shopId
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 10,
        include: {
            lineItems: true
        }
    });
    // Build context strings
    const summary = `
Store Overview:
- Total Products: ${productCount}
- Total Variants: ${products.reduce((sum, p)=>sum + p.variants.length, 0)}
- Total Orders: ${orderCount}
- Total Revenue: $${orderStats._sum.totalPrice?.toFixed(2) || '0'}
- Average Order Value: $${orderStats._avg.totalPrice?.toFixed(2) || '0'}
- Total Customers: ${customerCount}
- Total Refunds: ${refundCount}
- Refund Rate: ${orderCount > 0 ? (refundCount / orderCount * 100).toFixed(1) : 0}%
    `.trim();
    const productList = products.slice(0, 20).map((p)=>{
        const variantInfo = p.variants.map((v)=>`${v.title}: $${v.price}, ${v.inventoryQuantity || 0} in stock`).join('; ');
        return `- ${p.title} (${p.productType || 'No category'}): ${variantInfo}`;
    }).join('\n');
    const productContext = `
Top Products (${Math.min(20, products.length)} of ${productCount}):
${productList}
    `.trim();
    // Calculate top sellers from order line items
    const lineItems = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].orderLineItem.groupBy({
        by: [
            'title'
        ],
        where: {
            order: {
                shopId
            }
        },
        _count: {
            id: true
        },
        _sum: {
            quantity: true
        },
        orderBy: {
            _sum: {
                quantity: 'desc'
            }
        },
        take: 10
    });
    const topSellers = `
Top 10 Best-Selling Products:
${lineItems.map((item, i)=>`${i + 1}. ${item.title}: ${item._sum.quantity || 0} units sold`).join('\n')}
    `.trim();
    // Recent activity
    const recentActivityText = `
Recent Orders (Last 10):
${recentOrders.map((o)=>{
        const items = o.lineItems.map((li)=>li.title).join(', ');
        return `- Order #${o.orderNumber}: $${o.totalPrice} (${items.substring(0, 50)}${items.length > 50 ? '...' : ''})`;
    }).join('\n')}
    `.trim();
    // Aggregate order patterns by month
    const orderPatterns = `
Order Trends:
- Currency: ${recentOrders[0]?.currency || 'USD'}
- Most recent order: ${recentOrders[0]?.createdAt?.toISOString().split('T')[0] || 'N/A'}
- Oldest order in sample: ${recentOrders[recentOrders.length - 1]?.createdAt?.toISOString().split('T')[0] || 'N/A'}
    `.trim();
    return {
        summary,
        products: productContext,
        orderPatterns,
        topSellers,
        recentActivity: recentActivityText
    };
}
function formatContextForPrompt(context) {
    return `
=== STORE DATA CONTEXT ===

${context.summary}

${context.topSellers}

${context.products}

${context.orderPatterns}

${context.recentActivity}

=== END CONTEXT ===
    `.trim();
}
}),
"[project]/packages/brain/src/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
// BrandMindAI Brain - Core Intelligence Layer
// This package contains all AI/ML logic, analysis engines, and agents
// Intelligence modules
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$store$2d$dna$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/store-dna.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$gap$2d$detector$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/gap-detector.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$trends$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/trends.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$evidence$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/evidence.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$public$2d$analyzer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/public-analyzer.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$product$2d$research$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/product-research.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$data$2d$sufficiency$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/data-sufficiency.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$dna$2d$completeness$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/dna-completeness.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$strategy$2d$router$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/strategy-router.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$dna$2d$seeder$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/dna-seeder.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$insights$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/insights-engine.ts [app-rsc] (ecmascript)");
// Agents
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$agents$2f$launch$2d$kit$2d$agent$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/agents/launch-kit-agent.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$agents$2f$retention$2d$agent$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/agents/retention-agent.ts [app-rsc] (ecmascript)");
// NextHit Engine
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$deterministic$2d$scorer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/brain/src/nexthit/deterministic-scorer.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$candidate$2d$generator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/nexthit/candidate-generator.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$candidate$2d$scorer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/nexthit/candidate-scorer.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$deep$2d$analyzer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/nexthit/deep-analyzer.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$background$2d$analyzer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/nexthit/background-analyzer.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$outcome$2d$tracker$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/nexthit/outcome-tracker.ts [app-rsc] (ecmascript)");
// Engine modules
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/engine/metrics.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$orchestrator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/engine/orchestrator.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$decision$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/engine/decision.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$executive$2d$dashboard$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/engine/executive-dashboard.ts [app-rsc] (ecmascript)");
// RAG
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$rag$2f$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/rag/context.ts [app-rsc] (ecmascript)");
// Compiler
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$compiler$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/compiler.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$orchestrator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$executive$2d$dashboard$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$orchestrator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$executive$2d$dashboard$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/packages/backend/src/sync/auto-sync.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "triggerAutoSync",
    ()=>triggerAutoSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$auth$2f$crypto$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/src/auth/crypto.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$shopify$2d$sync$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/src/sync/shopify-sync.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/brain/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/engine/metrics.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$sync$2d$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/src/sync/sync-audit.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const SYNC_THRESHOLD_MINUTES = 240; // 4 hours instead of 30 minutes
const activeSyncs = new Set();
async function triggerAutoSync(shopId) {
    if (activeSyncs.has(shopId)) {
        return; // Already triggering in this process
    }
    try {
        // 1. Check for active sync in DB
        const activeSync = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].syncEvent.findFirst({
            where: {
                shopId,
                status: 'running',
                startedAt: {
                    gte: new Date(Date.now() - 60 * 60 * 1000)
                } // Only count last hour as "active" to prevent deadlocks
            }
        });
        if (activeSync) {
            console.log(`[Auto-Sync] Sync already in progress for shop ${shopId}. Skipping trigger.`);
            return;
        }
        // 1b. Cooldown Check (e.g., don't try again if we just tried in the last 5 minutes)
        const lastSyncEvent = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].syncEvent.findFirst({
            where: {
                shopId
            },
            orderBy: {
                startedAt: 'desc'
            }
        });
        if (lastSyncEvent && Date.now() - new Date(lastSyncEvent.startedAt).getTime() < 5 * 60 * 1000) {
            // Already tried or completed very recently
            return;
        }
        // 2. Check sync states for staleness
        const syncStates = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].syncState.findMany({
            where: {
                shopId
            }
        });
        const now = new Date();
        const threshold = SYNC_THRESHOLD_MINUTES * 60 * 1000;
        // Check if any resource is stale
        const needsSync = syncStates.length === 0 || syncStates.some((state)=>{
            const lastSynced = new Date(state.lastSyncedAt).getTime();
            return now.getTime() - lastSynced > threshold;
        });
        if (needsSync) {
            activeSyncs.add(shopId);
            console.log(`[Auto-Sync] Data stale for shop ${shopId}. Triggering background update...`);
            // Fire and forget background sync
            (async ()=>{
                let logId = '';
                try {
                    const log = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$sync$2d$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createSyncLog"])(shopId, 'incremental');
                    logId = log.id;
                    const shop = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].shop.findUnique({
                        where: {
                            id: shopId
                        }
                    });
                    if (!shop) return;
                    const accessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$auth$2f$crypto$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decrypt"])(shop.accessToken);
                    const shopDomain = shop.shopDomain;
                    const [products, orders, customers] = await Promise.all([
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$shopify$2d$sync$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["syncProducts"])(shopId, shopDomain, accessToken),
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$shopify$2d$sync$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["syncOrders"])(shopId, shopDomain, accessToken),
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$shopify$2d$sync$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["syncCustomers"])(shopId, shopDomain, accessToken)
                    ]);
                    console.log(`[Auto-Sync] Completed background update for ${shopDomain}. Running metrics backfill...`);
                    // After data is fresh, backfill the metrics for the dashboard
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["backfillDailyMetrics"])(shopId, 30);
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$sync$2d$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateSyncLog"])(logId, {
                        status: 'success',
                        stats: {
                            products,
                            orders,
                            customers
                        }
                    });
                    console.log(`[Auto-Sync] Completed background update and metrics backfill for ${shopDomain}`);
                } catch (err) {
                    console.error('[Auto-Sync] Background sync failed:', err.message);
                    if (logId) {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$sync$2d$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateSyncLog"])(logId, {
                            status: 'failed',
                            error: err.message
                        });
                    }
                } finally{
                    activeSyncs.delete(shopId);
                }
            })();
        }
    } catch (error) {
        console.error('[Auto-Sync] Error checking sync status:', error);
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>CustomerIntelligencePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$auth$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/src/auth/session.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/shared/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$auto$2d$sync$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/src/sync/auto-sync.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-rsc] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-rsc] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/crown.js [app-rsc] (ecmascript) <export default as Crown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-down.js [app-rsc] (ecmascript) <export default as TrendingDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-check.js [app-rsc] (ecmascript) <export default as UserCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-rsc] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-rsc] (ecmascript) <export default as Activity>");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$auto$2d$sync$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$auto$2d$sync$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
async function CustomerIntelligencePage() {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$auth$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    const shopDomain = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$auth$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getConnectedShop"])();
    if (!user) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/auth/login");
    if (!shopDomain) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/onboarding");
    const shop = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].shop.findUnique({
        where: {
            shopDomain
        }
    });
    if (!shop) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/onboarding");
    // Trigger auto-sync in background
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$src$2f$sync$2f$auto$2d$sync$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["triggerAutoSync"])(shop.id);
    // Get customer stats
    const customerCount = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].customer.count({
        where: {
            shopId: shop.id
        }
    });
    const rfmSegments = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].customerRFM.groupBy({
        by: [
            "rfmSegment"
        ],
        where: {
            shopId: shop.id
        },
        _count: {
            _all: true
        }
    });
    const retentionInsights = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].retentionInsight.count({
        where: {
            shopId: shop.id
        }
    });
    const atRiskCount = rfmSegments.filter((s)=>[
            "at_risk",
            "hibernating",
            "about_to_sleep"
        ].includes(s.rfmSegment)).reduce((sum, s)=>sum + s._count._all, 0);
    const champCount = rfmSegments.filter((s)=>[
            "champions",
            "loyal_customers"
        ].includes(s.rfmSegment)).reduce((sum, s)=>sum + s._count._all, 0);
    const subModules = [
        {
            title: "Retention Radar",
            description: "RFM segmentation dashboard with churn probability scores and AI-powered retention strategies.",
            href: "/customer-intelligence/retention",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"],
            color: "text-purple-400",
            bgColor: "bg-purple-400/10",
            borderColor: "border-purple-400/20",
            stat: `${retentionInsights} insights`,
            status: "Active"
        },
        {
            title: "Churn Predictor",
            description: "Machine learning-powered churn detection with recommended prevention actions.",
            href: "/customer-intelligence/churn",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__["TrendingDown"],
            color: "text-rose-400",
            bgColor: "bg-rose-400/10",
            borderColor: "border-rose-400/20",
            stat: `${atRiskCount} at risk`,
            status: atRiskCount > 0 ? "Alert" : "Healthy"
        },
        {
            title: "VIP Tracker",
            description: "Identify and nurture your highest-value customers with personalized engagement strategies.",
            href: "/customer-intelligence/retention",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__["Crown"],
            color: "text-amber-400",
            bgColor: "bg-amber-400/10",
            borderColor: "border-amber-400/20",
            stat: `${champCount} VIPs`,
            status: "Tracking"
        },
        {
            title: "Segment Discovery",
            description: "AI-powered clustering to discover hidden customer segments you didn't know existed.",
            href: "/customer-intelligence/retention",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__["UserCheck"],
            color: "text-emerald-400",
            bgColor: "bg-emerald-400/10",
            borderColor: "border-emerald-400/20",
            stat: `${rfmSegments.length} segments`,
            status: "Active"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                className: "w-3 h-3"
                            }, void 0, false, {
                                fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                                lineNumber: 97,
                                columnNumber: 21
                            }, this),
                            "Module 4 — Customer Intelligence"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                        lineNumber: 96,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-5xl lg:text-6xl font-clash font-bold tracking-tight",
                        children: [
                            "Customer ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-purple-400",
                                children: "Intelligence"
                            }, void 0, false, {
                                fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                                lineNumber: 101,
                                columnNumber: 30
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                        lineNumber: 100,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[var(--muted-foreground)] max-w-xl text-lg leading-relaxed",
                        children: "Know your customers deeply — prevent churn, unlock upsells, and discover new segments. AI-driven behavioral analysis for smarter engagement."
                    }, void 0, false, {
                        fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                        lineNumber: 103,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                lineNumber: 95,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 md:grid-cols-4 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        label: "Total Customers",
                        value: customerCount.toString(),
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                            className: "w-5 h-5 text-purple-400"
                        }, void 0, false, {
                            fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                            lineNumber: 110,
                            columnNumber: 90
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                        lineNumber: 110,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        label: "RFM Segments",
                        value: rfmSegments.length.toString(),
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                            className: "w-5 h-5 text-blue-400"
                        }, void 0, false, {
                            fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                            lineNumber: 111,
                            columnNumber: 92
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                        lineNumber: 111,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        label: "At Risk",
                        value: atRiskCount.toString(),
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__["TrendingDown"], {
                            className: "w-5 h-5 text-rose-400"
                        }, void 0, false, {
                            fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                            lineNumber: 112,
                            columnNumber: 80
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                        lineNumber: 112,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        label: "VIP Customers",
                        value: champCount.toString(),
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__["Crown"], {
                            className: "w-5 h-5 text-amber-400"
                        }, void 0, false, {
                            fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                            lineNumber: 113,
                            columnNumber: 85
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                        lineNumber: 113,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                lineNumber: 109,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-8",
                children: subModules.map((mod)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: mod.href,
                        className: "group relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"
                            }, void 0, false, {
                                fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                                lineNumber: 120,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-8 hover:border-[var(--foreground)]/10 transition-all duration-300 h-full flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start justify-between mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `p-3 rounded-xl ${mod.bgColor} border ${mod.borderColor}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(mod.icon, {
                                                    className: `w-6 h-6 ${mod.color}`
                                                }, void 0, false, {
                                                    fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                                                    lineNumber: 124,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                                                lineNumber: 123,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${mod.bgColor} ${mod.color} border ${mod.borderColor}`,
                                                children: mod.status
                                            }, void 0, false, {
                                                fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                                                lineNumber: 126,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                                        lineNumber: 122,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-clash font-bold mb-2 group-hover:text-purple-400 transition-colors",
                                        children: mod.title
                                    }, void 0, false, {
                                        fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                                        lineNumber: 130,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[var(--muted-foreground)] text-sm leading-relaxed mb-6 flex-1",
                                        children: mod.description
                                    }, void 0, false, {
                                        fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                                        lineNumber: 131,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between pt-6 border-t border-[var(--border)]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium text-[var(--muted-foreground)]",
                                                children: mod.stat
                                            }, void 0, false, {
                                                fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                                                lineNumber: 133,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors",
                                                children: [
                                                    "Open ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                        className: "w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                                                    }, void 0, false, {
                                                        fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                                                        lineNumber: 135,
                                                        columnNumber: 42
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                                                lineNumber: 134,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                                        lineNumber: 132,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                                lineNumber: 121,
                                columnNumber: 25
                            }, this)
                        ]
                    }, mod.title, true, {
                        fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                        lineNumber: 119,
                        columnNumber: 21
                    }, this))
            }, void 0, false, {
                fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                lineNumber: 117,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
        lineNumber: 93,
        columnNumber: 9
    }, this);
}
function StatCard({ label, value, icon }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-6 space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    icon,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                        lineNumber: 151,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                lineNumber: 149,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-3xl font-clash font-bold",
                children: value
            }, void 0, false, {
                fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
                lineNumber: 153,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx",
        lineNumber: 148,
        columnNumber: 9
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/packages/frontend/src/app/(app)/customer-intelligence/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__85d37c4c._.js.map