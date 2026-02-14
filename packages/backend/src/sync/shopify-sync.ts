import { prisma } from '@brandmind/shared';
import { decrypt } from '../auth/crypto';
import { createSyncLog, updateSyncLog } from './sync-audit';

interface ShopifyProduct {
    id: number;
    title: string;
    handle: string;
    vendor: string;
    product_type: string;
    created_at: string;
    updated_at: string;
    variants: ShopifyVariant[];
}

interface ShopifyVariant {
    id: number;
    title: string;
    sku: string;
    price: string;
    inventory_quantity: number;
}

interface ShopifyOrder {
    id: number;
    order_number: number;
    total_price: string;
    subtotal_price: string;
    total_tax: string;
    total_discounts: string;
    currency: string;
    financial_status: string;
    fulfillment_status: string | null;
    created_at: string;
    updated_at: string;
    customer?: { id: number };
    line_items: ShopifyLineItem[];
    refunds: ShopifyRefund[];
}

interface ShopifyLineItem {
    id: number;
    product_id: number;
    variant_id: number;
    title: string;
    quantity: number;
    price: string;
    total_discount: string;
}

interface ShopifyRefund {
    id: number;
    created_at: string;
    transactions: { amount: string }[];
}

interface ShopifyCustomer {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
}

async function shopifyRequest(shop: string, accessToken: string, endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`https://${shop}/admin/api/2024-10/${endpoint}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    const response = await fetch(url.toString(), {
        headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Shopify API error (${response.status}): ${text}`);
    }

    return response.json();
}

async function getOrInitSyncState(shopId: string, resource: string) {
    let state = await prisma.syncState.findUnique({
        where: {
            shopId_resource: {
                shopId,
                resource,
            },
        },
    });

    if (!state) {
        state = await prisma.syncState.create({
            data: {
                shopId,
                resource,
                lastId: '0',
            },
        });
    }

    return state;
}

async function updateSyncState(shopId: string, resource: string, lastId: string) {
    await prisma.syncState.update({
        where: {
            shopId_resource: {
                shopId,
                resource,
            },
        },
        data: {
            lastId,
            lastSyncedAt: new Date(),
        },
    });
}

export async function syncProducts(shopId: string, shopDomain: string, accessToken: string) {
    console.log(`[Sync] Fetching products for ${shopDomain}`);

    // incremental sync logic
    const syncState = await getOrInitSyncState(shopId, 'products');
    let sinceId = parseInt(syncState.lastId);
    console.log(`[Sync] Resuming products from ID: ${sinceId}`);

    let totalProducts = 0;
    let maxId = sinceId;

    while (true) {
        const data = await shopifyRequest(shopDomain, accessToken, 'products.json', {
            limit: '250',
            since_id: sinceId.toString(),
        }) as { products: ShopifyProduct[] };

        const products: ShopifyProduct[] = data.products || [];
        if (products.length === 0) break;

        for (const product of products) {
            // Upsert product
            const dbProduct = await prisma.product.upsert({
                where: { shopifyId: product.id.toString() },
                update: {
                    title: product.title,
                    handle: product.handle,
                    vendor: product.vendor,
                    productType: product.product_type,
                    updatedAt: new Date(product.updated_at),
                },
                create: {
                    shopId,
                    shopifyId: product.id.toString(),
                    title: product.title,
                    handle: product.handle,
                    vendor: product.vendor,
                    productType: product.product_type,
                    createdAt: new Date(product.created_at),
                    updatedAt: new Date(product.updated_at),
                },
            });

            // Upsert variants
            for (const variant of product.variants) {
                await prisma.variant.upsert({
                    where: { shopifyId: variant.id.toString() },
                    update: {
                        title: variant.title,
                        sku: variant.sku,
                        price: parseFloat(variant.price),
                        inventoryQuantity: variant.inventory_quantity,
                    },
                    create: {
                        productId: dbProduct.id,
                        shopifyId: variant.id.toString(),
                        title: variant.title,
                        sku: variant.sku,
                        price: parseFloat(variant.price),
                        inventoryQuantity: variant.inventory_quantity,
                    },
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

export async function syncOrders(shopId: string, shopDomain: string, accessToken: string) {
    console.log(`[Sync] Fetching orders for ${shopDomain}`);

    const syncState = await getOrInitSyncState(shopId, 'orders');
    let sinceId = parseInt(syncState.lastId);
    console.log(`[Sync] Resuming orders from ID: ${sinceId}`);

    let totalOrders = 0;
    let maxId = sinceId;

    while (true) {
        const params: Record<string, string> = {
            limit: '250',
            since_id: sinceId.toString(),
            status: 'any',
        };

        // If a start date is provided, we use it to filter
        if (params.created_at_min) {
            // Wait, shopify API for orders using since_id and created_at_min together can be tricky
            // Better to use created_at_min for the initial high-priority sync
        }

        const data = await shopifyRequest(shopDomain, accessToken, 'orders.json', params) as { orders: ShopifyOrder[] };

        const orders: ShopifyOrder[] = data.orders || [];
        if (orders.length === 0) break;

        for (const order of orders) {
            // Get customer ID if exists
            let customerId: string | null = null;
            if (order.customer?.id) {
                const customer = await prisma.customer.findUnique({
                    where: { shopifyId: order.customer.id.toString() },
                });
                customerId = customer?.id || null;
            }

            // Upsert order with customer linking
            const dbOrder = await prisma.order.upsert({
                where: { shopifyId: order.id.toString() },
                update: {
                    customerId,
                    totalPrice: parseFloat(order.total_price),
                    subtotalPrice: parseFloat(order.subtotal_price),
                    totalTax: parseFloat(order.total_tax),
                    totalDiscounts: parseFloat(order.total_discounts),
                    financialStatus: order.financial_status || null,
                    fulfillmentStatus: order.fulfillment_status || null,
                    updatedAt: new Date(order.updated_at),
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
                    updatedAt: new Date(order.updated_at),
                },
            });

            // Update shop currency if not set or different
            if (order.currency) {
                await prisma.shop.update({
                    where: { id: shopId },
                    data: { currencyCode: order.currency }
                }).catch(() => { }); // ignore errors during catch-all sync
            }

            // Upsert line items
            for (const item of order.line_items) {
                await prisma.orderLineItem.upsert({
                    where: { shopifyId: item.id.toString() },
                    update: {
                        quantity: item.quantity,
                        price: parseFloat(item.price),
                        totalDiscount: parseFloat(item.total_discount),
                    },
                    create: {
                        orderId: dbOrder.id,
                        shopifyId: item.id.toString(),
                        productId: item.product_id?.toString() || null,
                        variantId: item.variant_id?.toString() || null,
                        title: item.title,
                        quantity: item.quantity,
                        price: parseFloat(item.price),
                        totalDiscount: parseFloat(item.total_discount),
                    },
                });
            }

            // Upsert refunds
            for (const refund of order.refunds || []) {
                const refundAmount = refund.transactions?.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0) || 0;
                await prisma.refund.upsert({
                    where: { shopifyId: refund.id.toString() },
                    update: {
                        amount: refundAmount,
                    },
                    create: {
                        orderId: dbOrder.id,
                        shopifyId: refund.id.toString(),
                        amount: refundAmount,
                        createdAt: new Date(refund.created_at),
                    },
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

/**
 * Prioritized sync for the last 6 months
 */
export async function syncRecentData(shopId: string, shopDomain: string, accessToken: string) {
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

async function syncOrdersWithFilter(shopId: string, shopDomain: string, accessToken: string, startDate?: string) {
    let totalOrders = 0;
    let sinceId = 0;

    while (true) {
        const params: Record<string, string> = {
            limit: '250',
            since_id: sinceId.toString(),
            status: 'any',
        };
        if (startDate) params.created_at_min = startDate;

        const data = await shopifyRequest(shopDomain, accessToken, 'orders.json', params) as { orders: ShopifyOrder[] };
        const orders: ShopifyOrder[] = data.orders || [];
        if (orders.length === 0) break;

        for (const order of orders) {
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
async function processOrder(shopId: string, order: ShopifyOrder) {
    // Get customer ID if exists
    let customerId: string | null = null;
    if (order.customer?.id) {
        const customer = await prisma.customer.findUnique({
            where: { shopifyId: order.customer.id.toString() },
        });
        customerId = customer?.id || null;
    }

    // Upsert order
    const dbOrder = await prisma.order.upsert({
        where: { shopifyId: order.id.toString() },
        update: {
            customerId,
            totalPrice: parseFloat(order.total_price),
            subtotalPrice: parseFloat(order.subtotal_price),
            totalTax: parseFloat(order.total_tax),
            totalDiscounts: parseFloat(order.total_discounts),
            financialStatus: order.financial_status || null,
            fulfillmentStatus: order.fulfillment_status || null,
            updatedAt: new Date(order.updated_at),
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
            updatedAt: new Date(order.updated_at),
        },
    });

    // Update shop currency
    if (order.currency) {
        await prisma.shop.update({
            where: { id: shopId },
            data: { currencyCode: order.currency }
        }).catch(() => { });
    }

    // Upsert line items
    for (const item of order.line_items) {
        await prisma.orderLineItem.upsert({
            where: { shopifyId: item.id.toString() },
            update: {
                quantity: item.quantity,
                price: parseFloat(item.price),
                totalDiscount: parseFloat(item.total_discount),
            },
            create: {
                orderId: dbOrder.id,
                shopifyId: item.id.toString(),
                productId: item.product_id?.toString() || null,
                variantId: item.variant_id?.toString() || null,
                title: item.title,
                quantity: item.quantity,
                price: parseFloat(item.price),
                totalDiscount: parseFloat(item.total_discount),
            },
        });
    }

    // Upsert refunds
    for (const refund of order.refunds || []) {
        const refundAmount = refund.transactions?.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0) || 0;
        await prisma.refund.upsert({
            where: { shopifyId: refund.id.toString() },
            update: { amount: refundAmount },
            create: {
                orderId: dbOrder.id,
                shopifyId: refund.id.toString(),
                amount: refundAmount,
                createdAt: new Date(refund.created_at),
            },
        });
    }
}

export async function syncCustomers(shopId: string, shopDomain: string, accessToken: string) {
    console.log(`[Sync] Fetching customers for ${shopDomain}`);

    const syncState = await getOrInitSyncState(shopId, 'customers');
    let sinceId = parseInt(syncState.lastId);
    console.log(`[Sync] Resuming customers from ID: ${sinceId}`);

    let totalCustomers = 0;
    let maxId = sinceId;

    while (true) {
        const data = await shopifyRequest(shopDomain, accessToken, 'customers.json', {
            limit: '250',
            since_id: sinceId.toString(),
        }) as { customers: ShopifyCustomer[] };

        const customers: ShopifyCustomer[] = data.customers || [];
        if (customers.length === 0) break;

        for (const customer of customers) {
            await prisma.customer.upsert({
                where: { shopifyId: customer.id.toString() },
                update: {
                    email: customer.email,
                    firstName: customer.first_name,
                    lastName: customer.last_name,
                },
                create: {
                    shopId,
                    shopifyId: customer.id.toString(),
                    email: customer.email,
                    firstName: customer.first_name,
                    lastName: customer.last_name,
                    createdAt: new Date(customer.created_at),
                },
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

export async function runFullSync(shopId: string) {
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) throw new Error('Shop not found');

    const accessToken = decrypt(shop.accessToken);
    const shopDomain = shop.shopDomain;

    console.log(`[Sync] Starting Smart Sync for ${shopDomain}`);

    const results = {
        products: 0,
        orders: 0,
        customers: 0,
    };

    let logId = '';
    try {
        const log = await createSyncLog(shopId, 'full');
        logId = log.id;

        // PHASE 1: Prioritized Sync (Last 6 Months)
        console.log(`[Sync] Phase 1: Prioritized Sync (6 Months)`);
        results.products = await syncProducts(shopId, shopDomain, accessToken);
        results.orders = await syncRecentData(shopId, shopDomain, accessToken);
        results.customers = await syncCustomers(shopId, shopDomain, accessToken);

        console.log(`[Sync] Phase 1 Complete. Triggering Phase 2 (Historical) in background...`);

        await updateSyncLog(logId, {
            status: 'success',
            stats: results
        });

        // PHASE 2: Historical Sync (Background)
        (async () => {
            let histLogId = '';
            try {
                const histLog = await createSyncLog(shopId, 'historical');
                histLogId = histLog.id;

                console.log(`[Sync] Phase 2: Starting historical sync for ${shopDomain}`);
                // syncOrders without startDate will fetch all remaining history using since_id
                const orders = await syncOrders(shopId, shopDomain, accessToken);

                await updateSyncLog(histLogId, {
                    status: 'success',
                    stats: { orders }
                });

                console.log(`[Sync] Phase 2 Complete for ${shopDomain}`);
            } catch (err: any) {
                console.error('[Sync] Historical sync failed:', err.message);
                if (histLogId) {
                    await updateSyncLog(histLogId, {
                        status: 'failed',
                        error: err.message
                    });
                }
            }
        })();

    } catch (err: any) {
        console.error('[Sync] Smart Sync failed:', err.message);
    }

    console.log(`[Sync] Prioritized sync results:`, results);
    return results;
}
