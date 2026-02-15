import shopify from '../shopify';
import { prisma } from '@brandmind/shared';
import { Session } from '@shopify/shopify-api';

export async function runBackfill(session: Session) {
    const shopDomain = session.shop;
    console.log(`Starting backfill for ${shopDomain}`);

    try {
        const shop = await prisma.shop.findUnique({ where: { shopDomain } });
        if (!shop) throw new Error('Shop not found');

        // 1. Backfill Products
        await backfillProducts(session, shop.id);

        // 2. Backfill Orders (Last 12 months)
        await backfillOrders(session, shop.id);

        // 3. Backfill Customers
        await backfillCustomers(session, shop.id);

        console.log(`Backfill completed for ${shopDomain}`);
    } catch (error) {
        console.error(`Backfill failed for ${shopDomain}:`, error);
    }
}

async function backfillProducts(session: Session, shopId: string) {
    let sinceId = 0;
    let totalProducts = 0;

    console.log('[Backfill] Starting products backfill...');

    while (true) {
        const response: any = await new (shopify.clients.Rest as any)({ session }).get({
            path: 'products',
            query: { limit: 250, since_id: sinceId },
        });

        const products = response.body.products;
        if (!products || products.length === 0) break;

        for (const prod of products) {
            await prisma.product.upsert({
                where: { shopifyId: String(prod.id) },
                update: {
                    title: prod.title,
                    handle: prod.handle,
                    vendor: prod.vendor,
                    productType: prod.product_type,
                    updatedAt: new Date(prod.updated_at),
                },
                create: {
                    shopId,
                    shopifyId: String(prod.id),
                    title: prod.title,
                    handle: prod.handle,
                    vendor: prod.vendor,
                    productType: prod.product_type,
                    createdAt: new Date(prod.created_at),
                    updatedAt: new Date(prod.updated_at),
                },
            });

            // Backfill Variants
            const dbProduct = await prisma.product.findUnique({ where: { shopifyId: String(prod.id) } });
            for (const variant of prod.variants) {
                await prisma.variant.upsert({
                    where: { shopifyId: String(variant.id) },
                    update: {
                        title: variant.title,
                        sku: variant.sku,
                        price: variant.price,
                        inventoryQuantity: variant.inventory_quantity,
                    },
                    create: {
                        productId: dbProduct!.id,
                        shopifyId: String(variant.id),
                        title: variant.title,
                        sku: variant.sku,
                        price: variant.price,
                        inventoryQuantity: variant.inventory_quantity,
                    },
                });
            }

            sinceId = prod.id;
            totalProducts++;
        }

        console.log(`[Backfill] Processed ${totalProducts} products...`);
    }

    console.log(`[Backfill] Finished backfilling ${totalProducts} products`);
    return totalProducts;
}


async function backfillOrders(session: Session, shopId: string, monthsBack: number = 12) {
    let sinceId = 0;
    let totalOrders = 0;

    // Calculate date range (default: last 12 months)
    const createdAtMin = new Date();
    createdAtMin.setMonth(createdAtMin.getMonth() - monthsBack);
    const createdAtMinISO = createdAtMin.toISOString();

    console.log(`[Backfill] Starting orders backfill (since ${createdAtMinISO})...`);

    while (true) {
        const response: any = await new (shopify.clients.Rest as any)({ session }).get({
            path: 'orders',
            query: {
                limit: 250,
                since_id: sinceId,
                status: 'any',
                created_at_min: createdAtMinISO,
            },
        });

        const orders = response.body.orders;
        if (!orders || orders.length === 0) break;

        for (const order of orders) {
            // Link customer if exists
            let customerId: string | null = null;
            if (order.customer?.id) {
                const customer = await prisma.customer.findUnique({
                    where: { shopifyId: String(order.customer.id) },
                });
                customerId = customer?.id || null;
            }

            const createdOrder = await prisma.order.upsert({
                where: { shopifyId: String(order.id) },
                update: {
                    customerId,
                    totalPrice: order.total_price,
                    subtotalPrice: order.subtotal_price,
                    totalTax: order.total_tax,
                    totalDiscounts: order.total_discounts,
                    financialStatus: order.financial_status || null,
                    fulfillmentStatus: order.fulfillment_status || null,
                    updatedAt: new Date(order.updated_at),
                },
                create: {
                    shopId,
                    shopifyId: String(order.id),
                    customerId,
                    orderNumber: String(order.order_number),
                    totalPrice: order.total_price,
                    subtotalPrice: order.subtotal_price,
                    totalTax: order.total_tax,
                    totalDiscounts: order.total_discounts,
                    financialStatus: order.financial_status || null,
                    fulfillmentStatus: order.fulfillment_status || null,
                    currency: order.currency,
                    createdAt: new Date(order.created_at),
                    updatedAt: new Date(order.updated_at),
                },
            });

            // Backfill line items
            for (const item of order.line_items) {
                await prisma.orderLineItem.upsert({
                    where: { shopifyId: String(item.id) },
                    update: {
                        quantity: item.quantity,
                        price: item.price,
                        totalDiscount: item.total_discount,
                    },
                    create: {
                        orderId: createdOrder.id,
                        shopifyId: String(item.id),
                        productId: item.product_id ? String(item.product_id) : null,
                        variantId: item.variant_id ? String(item.variant_id) : null,
                        title: item.title,
                        quantity: item.quantity,
                        price: item.price,
                        totalDiscount: item.total_discount,
                    },
                });
            }

            // Backfill refunds
            if (order.refunds) {
                for (const refund of order.refunds) {
                    const refundAmount = refund.transactions?.reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0)
                        || refund.refund_line_items?.reduce((acc: number, ri: any) => acc + Number(ri.subtotal), 0)
                        || 0;
                    await prisma.refund.upsert({
                        where: { shopifyId: String(refund.id) },
                        update: { amount: refundAmount },
                        create: {
                            orderId: createdOrder.id,
                            shopifyId: String(refund.id),
                            amount: refundAmount,
                            createdAt: new Date(refund.created_at),
                        },
                    });
                }
            }

            sinceId = order.id;
            totalOrders++;
        }

        console.log(`[Backfill] Processed ${totalOrders} orders...`);
    }

    console.log(`[Backfill] Finished backfilling ${totalOrders} orders`);
    return totalOrders;
}


async function backfillCustomers(session: Session, shopId: string) {
    let sinceId = 0;
    let totalCustomers = 0;

    console.log('[Backfill] Starting customers backfill...');

    while (true) {
        const response: any = await new (shopify.clients.Rest as any)({ session }).get({
            path: 'customers',
            query: { limit: 250, since_id: sinceId },
        });

        const customers = response.body.customers;
        if (!customers || customers.length === 0) break;

        for (const customer of customers) {
            await prisma.customer.upsert({
                where: { shopifyId: String(customer.id) },
                update: {
                    email: customer.email,
                    firstName: customer.first_name,
                    lastName: customer.last_name,
                },
                create: {
                    shopId,
                    shopifyId: String(customer.id),
                    email: customer.email,
                    firstName: customer.first_name,
                    lastName: customer.last_name,
                    createdAt: new Date(customer.created_at),
                },
            });

            sinceId = customer.id;
            totalCustomers++;
        }

        console.log(`[Backfill] Processed ${totalCustomers} customers...`);
    }

    console.log(`[Backfill] Finished backfilling ${totalCustomers} customers`);
    return totalCustomers;
}

