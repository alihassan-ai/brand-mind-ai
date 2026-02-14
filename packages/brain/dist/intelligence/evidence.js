/**
 * Evidence & Grounding System
 * Tracks data sources, builds reasoning chains, and guards against hallucination
 */
import { prisma } from '@brandmind/shared';
// ============================================
// EVIDENCE COLLECTOR
// ============================================
export class EvidenceCollector {
    constructor(shopId) {
        this.evidence = [];
        this.shopId = shopId;
    }
    addEvidence(claim, source, dataPoint, strength = 'moderate') {
        this.evidence.push({
            claim,
            source,
            dataPoint,
            timestamp: new Date(),
            strength,
        });
    }
    getEvidence() {
        return this.evidence;
    }
    buildReasoningChain(conclusion, reasoning) {
        // Calculate confidence based on evidence strength
        const strengthWeights = { strong: 1, moderate: 0.7, weak: 0.4 };
        const totalWeight = this.evidence.reduce((sum, e) => sum + strengthWeights[e.strength], 0);
        const maxWeight = this.evidence.length;
        const confidence = maxWeight > 0 ? Math.min(1, totalWeight / maxWeight) : 0;
        return {
            conclusion,
            evidence: this.evidence,
            confidence: Math.round(confidence * 100) / 100,
            reasoning,
        };
    }
}
// ============================================
// DATA QUALITY SCORER
// ============================================
export async function calculateDataQuality(shopId) {
    const issues = [];
    // Check sync freshness
    const syncStates = await prisma.syncState.findMany({
        where: { shopId },
        orderBy: { lastSyncedAt: 'desc' },
    });
    let freshness = 0;
    if (syncStates.length > 0) {
        const lastSync = syncStates[0].lastSyncedAt;
        const daysSinceSync = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60 * 24);
        freshness = Math.max(0, 1 - daysSinceSync / 30); // Decays over 30 days
        if (daysSinceSync > 7) {
            issues.push(`Data is ${Math.round(daysSinceSync)} days old`);
        }
    }
    else {
        issues.push('No sync history found');
    }
    // Check data completeness
    const [products, orders, customers] = await Promise.all([
        prisma.product.count({ where: { shopId } }),
        prisma.order.count({ where: { shopId } }),
        prisma.customer.count({ where: { shopId } }),
    ]);
    // Check orders with customer links
    const ordersWithCustomers = await prisma.order.count({
        where: { shopId, customerId: { not: null } },
    });
    const customerLinkRate = orders > 0 ? ordersWithCustomers / orders : 0;
    // Check products with types
    const productsWithTypes = await prisma.product.count({
        where: { shopId, productType: { not: null } },
    });
    const productTypeRate = products > 0 ? productsWithTypes / products : 0;
    const completeness = (customerLinkRate * 0.5 + productTypeRate * 0.5);
    if (customerLinkRate < 0.5) {
        issues.push(`Only ${Math.round(customerLinkRate * 100)}% of orders have customer data`);
    }
    if (productTypeRate < 0.8) {
        issues.push(`Only ${Math.round(productTypeRate * 100)}% of products have types`);
    }
    // Check volume (normalized against minimums)
    const volumeScore = Math.min(1, (Math.min(1, products / 50) * 0.3 +
        Math.min(1, orders / 100) * 0.5 +
        Math.min(1, customers / 50) * 0.2));
    if (orders < 50) {
        issues.push(`Limited order history (${orders} orders)`);
    }
    // Overall score
    const overallScore = Math.round((freshness * 30 + completeness * 40 + volumeScore * 30));
    return {
        shopId,
        freshness: Math.round(freshness * 100) / 100,
        completeness: Math.round(completeness * 100) / 100,
        volume: Math.round(volumeScore * 100) / 100,
        overallScore,
        issues,
    };
}
// ============================================
// HALLUCINATION GUARD
// ============================================
export async function validateClaim(shopId, claim, type) {
    switch (type) {
        case 'product':
            // Check if referenced product exists
            const productMatch = claim.match(/product[:\s]*["']?([^"']+)["']?/i);
            if (productMatch) {
                const product = await prisma.product.findFirst({
                    where: { shopId, title: { contains: productMatch[1] } },
                });
                if (!product) {
                    return {
                        valid: false,
                        reason: `Product "${productMatch[1]}" not found in database`,
                        suggestion: 'Refer only to products that exist in the catalog',
                    };
                }
            }
            return { valid: true, reason: 'Product reference validated' };
        case 'metric':
            // Check if the metric makes sense
            const numberMatch = claim.match(/(\d+(?:\.\d+)?)\s*%/);
            if (numberMatch) {
                const value = parseFloat(numberMatch[1]);
                if (value > 100 || value < 0) {
                    return {
                        valid: false,
                        reason: `Percentage value ${value}% is out of valid range`,
                        suggestion: 'Percentages should be between 0-100%',
                    };
                }
            }
            return { valid: true, reason: 'Metric appears valid' };
        default:
            return { valid: true, reason: 'Claim type not specifically validated' };
    }
}
// ============================================
// CONFIDENCE CALCULATOR
// ============================================
export async function calculateConfidence(shopId, sampleSize, patternStrength // 0-1
) {
    // Get data quality
    const dataQuality = await calculateDataQuality(shopId);
    // Base confidence from sample size (diminishing returns after 100)
    const sampleConfidence = Math.min(1, Math.log10(sampleSize + 1) / 2);
    // Combine all factors
    const confidence = (sampleConfidence * 0.3 +
        patternStrength * 0.4 +
        (dataQuality.overallScore / 100) * 0.3);
    let explanation = '';
    if (confidence >= 0.8) {
        explanation = 'High confidence based on strong patterns and sufficient data';
    }
    else if (confidence >= 0.6) {
        explanation = 'Moderate confidence - consider validating with additional data';
    }
    else if (confidence >= 0.4) {
        explanation = 'Low confidence - treat as hypothesis requiring validation';
    }
    else {
        explanation = 'Insufficient data for reliable conclusions';
    }
    return {
        confidence: Math.round(confidence * 100) / 100,
        explanation,
    };
}
// ============================================
// FALLBACK RESPONSE
// ============================================
export function getInsufficientDataResponse(reason) {
    const suggestions = [
        'Sync more historical data from Shopify',
        'Wait for more orders to accumulate',
        'Ensure products have accurate types and categories',
    ];
    return {
        type: 'insufficient_data',
        message: `Unable to provide reliable analysis: ${reason}`,
        suggestions,
    };
}
