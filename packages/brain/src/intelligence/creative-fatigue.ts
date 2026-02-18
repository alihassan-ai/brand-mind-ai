/**
 * Creative Fatigue Detection Engine
 * 
 * Identifies ads that are "dying" by comparing current performance 
 * against a 7-day moving average.
 * 
 * Signals:
 * 1. CTR Decay: Click-through rate drops > 20% below average
 * 2. ROAS Decay: Return on ad spend drops > 20% below average
 * 3. Frequency Spike: Frequency > 2.5 (for prospecting) indicates saturation
 */

import { prisma } from '@brandmind/shared';

export interface FatigueResult {
    adId: string;
    adName: string;
    campaignName: string;
    metrics: {
        currentCTR: number;
        avgCTR: number;
        currentROAS: number;
        avgROAS: number;
        frequency: number;
    };
    signals: string[];
    status: 'fatigued' | 'healthy' | 'learning';
    recommendation: string;
}

export async function detectCreativeFatigue(shopId: string): Promise<FatigueResult[]> {
    // 1. Get Active Ads with Insights for last 14 days
    const today = new Date();
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(today.getDate() - 14);

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
                                where: { date: { gte: fourteenDaysAgo } },
                                orderBy: { date: 'asc' }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!metaAccount) return [];

    const results: FatigueResult[] = [];

    // 2. Analyze each Ad
    for (const campaign of metaAccount.campaigns) {
        for (const ad of campaign.ads) {
            const insights = ad.insights;
            if (insights.length < 4) {
                // Not enough data
                results.push({
                    adId: ad.adId,
                    adName: ad.name,
                    campaignName: campaign.name,
                    metrics: { currentCTR: 0, avgCTR: 0, currentROAS: 0, avgROAS: 0, frequency: 0 },
                    signals: [],
                    status: 'learning',
                    recommendation: 'Allow more time for optimization'
                });
                continue;
            }

            // Split into "Recent" (last 3 days) and "Baseline" (previous 7 days)
            const recentDays = insights.slice(-3);
            const baselineDays = insights.slice(0, insights.length - 3);

            if (baselineDays.length === 0) continue;

            const avg = (arr: any[], key: string) => arr.reduce((s, i) => s + (Number(i[key]) || 0), 0) / arr.length;

            // Calculate Baseline
            const baselineCTR = avg(baselineDays, 'ctr');
            const baselineROAS = avg(baselineDays, 'roas');

            // Calculate Recent
            const recentCTR = avg(recentDays, 'ctr');
            const recentROAS = avg(recentDays, 'roas');
            const currentFrequency = Number(recentDays[recentDays.length - 1].frequency || 0);

            // 3. Check for Fatigue Signals
            const signals: string[] = [];

            // CTR Drop > 20%
            if (baselineCTR > 0 && recentCTR < (baselineCTR * 0.8)) {
                signals.push(`CTR dropped ${(100 - (recentCTR / baselineCTR) * 100).toFixed(0)}% below avg`);
            }

            // ROAS Drop > 20%
            if (baselineROAS > 0 && recentROAS < (baselineROAS * 0.8)) {
                signals.push(`ROAS dropped ${(100 - (recentROAS / baselineROAS) * 100).toFixed(0)}% below avg`);
            }

            // High Frequency (Market Saturation)
            if (currentFrequency > 2.5) {
                signals.push(`Frequency ${currentFrequency.toFixed(1)} indicates saturation`);
            }

            let status: 'fatigued' | 'healthy' = 'healthy';
            let recommendation = 'Keep running';

            if (signals.length > 0) {
                status = 'fatigued';
                if (signals.some(s => s.includes('Frequency'))) {
                    recommendation = 'Expand audience or rotate creative';
                } else {
                    recommendation = 'Refresh creative assets immediately';
                }
            }

            results.push({
                adId: ad.adId,
                adName: ad.name,
                campaignName: campaign.name,
                metrics: {
                    currentCTR: recentCTR,
                    avgCTR: baselineCTR,
                    currentROAS: recentROAS,
                    avgROAS: baselineROAS,
                    frequency: currentFrequency
                },
                signals,
                status,
                recommendation
            });
        }
    }

    // Return fatigued ones first
    return results.sort((a, b) => (
        (a.status === 'fatigued' ? 0 : 1) - (b.status === 'fatigued' ? 0 : 1)
    ));
}
