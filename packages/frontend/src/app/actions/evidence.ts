'use server';

import { prisma } from "@brandmind/shared";
import { getConnectedShop } from "@brandmind/backend/auth/session";

export async function getAtRiskCustomers() {
    const shopDomain = await getConnectedShop();
    if (!shopDomain) throw new Error("No shop connected");

    const shop = await prisma.shop.findUnique({ where: { shopDomain } });
    if (!shop) throw new Error("Shop not found");

    // Fetch customers in at-risk segments
    const customers = await prisma.customerRFM.findMany({
        where: {
            shopId: shop.id,
            rfmSegment: { in: ["at_risk", "hibernating", "about_to_sleep"] }
        },
        include: {
            customer: true
        },
        orderBy: {
            totalSpent: 'desc'
        },
        take: 50 // Limit to top 50 for now
    });

    return customers.map(record => ({
        id: record.customerId,
        name: `${record.customer.firstName || ''} ${record.customer.lastName || ''}`.trim() || 'Unknown',
        email: record.customer.email,
        totalSpent: record.totalSpent?.toNumber() || 0,
        segment: record.rfmSegment,
        lastOrderDate: new Date(Date.now() - (record.daysSinceLastOrder * 24 * 60 * 60 * 1000)),
    }));
}

export async function getRevenueExposureCustomers() {
    // Similar to at-risk but strictly focused on high value
    // For now, it maps to the same "at risk" pool but we can refine logic later
    return getAtRiskCustomers();
}
