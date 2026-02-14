import { prisma } from '@brandmind/shared';

interface StoreContext {
    summary: string;
    products: string;
    orderPatterns: string;
    topSellers: string;
    recentActivity: string;
}

export async function buildStoreContext(shopId: string): Promise<StoreContext> {
    // Get product stats
    const productCount = await prisma.product.count({ where: { shopId } });
    const products = await prisma.product.findMany({
        where: { shopId },
        include: { variants: true },
        take: 50, // Top 50 products
        orderBy: { createdAt: 'desc' }
    });

    // Get order stats
    const orderCount = await prisma.order.count({ where: { shopId } });
    const orderStats = await prisma.order.aggregate({
        where: { shopId },
        _sum: { totalPrice: true },
        _avg: { totalPrice: true },
    });

    const customerCount = await prisma.customer.count({ where: { shopId } });
    const refundCount = await prisma.refund.count({ where: { order: { shopId } } });

    // Get recent orders for activity
    const recentOrders = await prisma.order.findMany({
        where: { shopId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { lineItems: true }
    });

    // Build context strings
    const summary = `
Store Overview:
- Total Products: ${productCount}
- Total Variants: ${products.reduce((sum, p) => sum + p.variants.length, 0)}
- Total Orders: ${orderCount}
- Total Revenue: $${orderStats._sum.totalPrice?.toFixed(2) || '0'}
- Average Order Value: $${orderStats._avg.totalPrice?.toFixed(2) || '0'}
- Total Customers: ${customerCount}
- Total Refunds: ${refundCount}
- Refund Rate: ${orderCount > 0 ? ((refundCount / orderCount) * 100).toFixed(1) : 0}%
    `.trim();

    const productList = products.slice(0, 20).map(p => {
        const variantInfo = p.variants.map(v =>
            `${v.title}: $${v.price}, ${v.inventoryQuantity || 0} in stock`
        ).join('; ');
        return `- ${p.title} (${p.productType || 'No category'}): ${variantInfo}`;
    }).join('\n');

    const productContext = `
Top Products (${Math.min(20, products.length)} of ${productCount}):
${productList}
    `.trim();

    // Calculate top sellers from order line items
    const lineItems = await prisma.orderLineItem.groupBy({
        by: ['title'],
        where: { order: { shopId } },
        _count: { id: true },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10
    });

    const topSellers = `
Top 10 Best-Selling Products:
${lineItems.map((item, i) =>
        `${i + 1}. ${item.title}: ${item._sum.quantity || 0} units sold`
    ).join('\n')}
    `.trim();

    // Recent activity
    const recentActivityText = `
Recent Orders (Last 10):
${recentOrders.map(o => {
        const items = o.lineItems.map(li => li.title).join(', ');
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

export function formatContextForPrompt(context: StoreContext): string {
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
