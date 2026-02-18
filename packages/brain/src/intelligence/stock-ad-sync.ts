/**
 * Stock-Ad Sync Engine
 * 
 * Prevents wasted ad spend by detecting when actively advertised products 
 * are out of stock.
 * 
 * Logic:
 * 1. Fetch Active Meta Ads
 * 2. Fetch Shopify Products with Inventory
 * 3. Match Ad Names/Creative to Product Titles (Fuzzy Match)
 * 4. Alert if Ad is ACTIVE but Stock is 0
 */

import { prisma } from '@brandmind/shared';

export interface StockConflict {
    adId: string;
    adName: string;
    campaignName: string;
    productTitle: string;
    productId: string;
    currentStock: number;
    spendYesterday: number;
    status: 'CRITICAL_WASTE' | 'WARNING';
    action: string;
}

export async function checkStockAdConflicts(shopId: string): Promise<StockConflict[]> {
    // 1. Get Active Ads
    const metaAccount = await prisma.metaAccount.findUnique({
        where: { shopId },
        include: {
            campaigns: {
                where: { status: 'ACTIVE' },
                include: {
                    ads: {
                        where: { status: 'ACTIVE' },
                        include: {
                            insights: {
                                take: 1,
                                orderBy: { date: 'desc' }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!metaAccount) return [];

    // 2. Get All Products with Inventory
    const products = await prisma.product.findMany({
        where: { shopId },
        include: {
            variants: true
        }
    });

    const conflicts: StockConflict[] = [];

    // 3. Match Ads to Products
    for (const campaign of metaAccount.campaigns) {
        for (const ad of campaign.ads) {
            // Heuristic: Does Ad Name or Creative Name contain Product Title?
            // " Bamboo Yoga Pants - retargeting " -> Matches "Bamboo Yoga Pants"

            let matchedProduct: any = null;
            let bestMatchScore = 0;

            for (const product of products) {
                const score = calculateSimilarity(ad.name, product.title);
                if (score > 0.6 && score > bestMatchScore) { // Threshold 0.6
                    bestMatchScore = score;
                    matchedProduct = product;
                }
            }

            if (matchedProduct) {
                // Check Inventory
                const totalStock = matchedProduct.variants.reduce((acc: number, v: any) => acc + (v.inventoryQuantity || 0), 0);

                if (totalStock === 0) {
                    const spend = ad.insights[0]?.spend || 0;

                    conflicts.push({
                        adId: ad.adId,
                        adName: ad.name,
                        campaignName: campaign.name,
                        productTitle: matchedProduct.title,
                        productId: matchedProduct.id,
                        currentStock: 0,
                        spendYesterday: spend,
                        status: 'CRITICAL_WASTE',
                        action: 'Turn off Ad immediately'
                    });
                }
            }
        }
    }

    return conflicts;
}

/**
 * Simple word overlap similarity
 */
function calculateSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase().replace(/[^a-z0-9 ]/g, "");
    const s2 = str2.toLowerCase().replace(/[^a-z0-9 ]/g, "");

    const words1 = new Set(s1.split(" ").filter(w => w.length > 2));
    const words2 = new Set(s2.split(" ").filter(w => w.length > 2));

    if (words1.size === 0 || words2.size === 0) return 0;

    // Check if all words in shorter string exist in longer string (containment)
    const [shorter, longer] = words1.size < words2.size ? [words1, words2] : [words2, words1];
    let matches = 0;

    shorter.forEach(w => {
        if (longer.has(w)) matches++;
    });

    return matches / shorter.size;
}
