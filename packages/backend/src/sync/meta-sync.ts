import { prisma } from "@brandmind/shared";
import { decrypt } from "../auth/crypto";

const META_API_VERSION = "v19.0";

interface MetaSyncResult {
    success: boolean;
    campaigns: number;
    insights: number;
    error?: string;
}

export async function syncMetaAds(shopId: String): Promise<MetaSyncResult> {
    try {
        const metaAccount = await prisma.metaAccount.findUnique({
            where: { shopId: String(shopId) }
        });

        if (!metaAccount || !metaAccount.accessToken || metaAccount.status !== 'active') {
            return { success: false, campaigns: 0, insights: 0, error: "No active Meta account found" };
        }

        const accessToken = decrypt(metaAccount.accessToken);
        const adAccountId = metaAccount.adAccountId.startsWith('act_') ? metaAccount.adAccountId : `act_${metaAccount.adAccountId}`;

        // 1. Sync Campaigns
        const campaignsUrl = `https://graph.facebook.com/${META_API_VERSION}/${adAccountId}/campaigns?fields=id,name,status,objective,buying_type,spend_cap&limit=100&access_token=${accessToken}`;
        const campaignsRes = await fetch(campaignsUrl);
        const campaignsData = await campaignsRes.json();

        if (campaignsData.error) throw new Error(campaignsData.error.message);

        let campaignCount = 0;
        for (const camp of campaignsData.data) {
            await prisma.metaCampaign.upsert({
                where: { campaignId: camp.id },
                update: {
                    name: camp.name,
                    status: camp.status,
                    objective: camp.objective,
                    buyingType: camp.buying_type,
                    spendCap: camp.spend_cap,
                    updatedAt: new Date()
                },
                create: {
                    metaAccountId: metaAccount.id,
                    campaignId: camp.id,
                    name: camp.name,
                    status: camp.status,
                    objective: camp.objective,
                    buyingType: camp.buying_type,
                    spendCap: camp.spend_cap
                }
            });
            campaignCount++;

            // Sync AdSets for this Campaign
            await syncAdSets(camp.id, accessToken);
        }

        // 2. Sync Daily Account Insights (Last 30 Days)
        const datePreset = 'last_30d';
        const insightsUrl = `https://graph.facebook.com/${META_API_VERSION}/${adAccountId}/insights?level=account&date_preset=${datePreset}&time_increment=1&fields=date_start,spend,impressions,clicks,cpc,cpm,ctr,reach,frequency,actions,action_values,purchase_roas&access_token=${accessToken}`;
        const insightsRes = await fetch(insightsUrl);
        const insightsData = await insightsRes.json();

        if (insightsData.error) throw new Error(insightsData.error.message);

        let insightCount = 0;
        for (const row of insightsData.data) {
            // Parse actions (purchases) and action_values (revenue)
            // actions: [{action_type: 'purchase', value: '10'}]
            // action_values: [{action_type: 'purchase', value: '500.00'}]

            let purchases = 0;
            let purchaseValue = 0;
            let roas = 0;

            if (row.actions) {
                const purchaseAction = row.actions.find((a: any) => a.action_type === 'purchase' || a.action_type === 'offsite_conversion.fb_pixel_purchase');
                if (purchaseAction) purchases = parseInt(purchaseAction.value);
            }

            if (row.action_values) {
                const purchaseVal = row.action_values.find((a: any) => a.action_type === 'purchase' || a.action_type === 'offsite_conversion.fb_pixel_purchase');
                if (purchaseVal) purchaseValue = parseFloat(purchaseVal.value);
            }

            if (row.purchase_roas) {
                const roasVal = row.purchase_roas.find((a: any) => a.action_type === 'purchase_roas' || a.action_type === 'omni_purchase');
                if (roasVal) roas = parseFloat(roasVal.value);
            }

            // Fallback ROAS calc
            if (roas === 0 && parseFloat(row.spend) > 0) {
                roas = purchaseValue / parseFloat(row.spend);
            }

            await prisma.metaInsight.create({
                data: {
                    metaAccountId: metaAccount.id,
                    date: new Date(row.date_start),
                    spend: parseFloat(row.spend || 0),
                    impressions: parseInt(row.impressions || 0),
                    clicks: parseInt(row.clicks || 0),
                    cpc: parseFloat(row.cpc || 0),
                    cpm: parseFloat(row.cpm || 0),
                    ctr: parseFloat(row.ctr || 0),
                    reach: parseInt(row.reach || 0),
                    frequency: parseFloat(row.frequency || 0),
                    purchases: purchases,
                    purchaseValue: purchaseValue,
                    roas: roas
                }
            });
            insightCount++;
        }

        // Update account last synced
        await prisma.metaAccount.update({
            where: { id: metaAccount.id },
            data: { lastSyncedAt: new Date() }
        });

        return { success: true, campaigns: campaignCount, insights: insightCount };

    } catch (error: any) {
        console.error("Meta Sync Error:", error);
        return { success: false, campaigns: 0, insights: 0, error: error.message };
    }
}

async function syncAdSets(campaignMetaId: string, accessToken: string) {
    // Helpers to sync AdSets and Ads...
    // Implementation can be expanded. For now, ensure basic dashboard data.
    // We need to look up the internal campaign ID first? 
    // Actually we only need to link if we are storing Insights at AdSet level. 
    // The current dashboard focuses on Account Level Insights for the "Growth Engine" overview. 
    // We will implement AdSet/Ad sync in the next pass for "Creative Fatigue".
    return;
}
