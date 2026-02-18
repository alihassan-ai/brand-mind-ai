import { getCurrentUser, getConnectedShop } from "@brandmind/backend/auth/session";
import { prisma } from "@brandmind/shared";
import { redirect } from "next/navigation";
import Link from "next/link";
import { triggerAutoSync } from "@brandmind/backend/sync/auto-sync";
import { detectCreativeFatigue, checkStockAdConflicts } from "@brandmind/brain/intelligence";
import {
    Megaphone,
    TrendingUp,
    Eye,
    Target,
    Zap,
    PenTool,
    ChevronRight,
    ExternalLink,
    Sparkles,
    BarChart3,
    DollarSign,
    MousePointerClick,
    Activity,
    AlertTriangle,
    CheckCircle2,
    PackageX
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default async function GrowthEnginePage() {
    const user = await getCurrentUser();
    const shopDomain = await getConnectedShop();

    if (!user) redirect("/auth/login");
    if (!shopDomain) redirect("/onboarding");

    const shop = await prisma.shop.findUnique({ where: { shopDomain } });
    if (!shop) redirect("/onboarding");

    // Trigger auto-sync in background
    await triggerAutoSync(shop.id);

    // Fetch Meta Data
    const metaAccount = await prisma.metaAccount.findUnique({
        where: { shopId: shop.id },
        include: {
            campaigns: {
                orderBy: { updatedAt: 'desc' },
                take: 10
            },
            insights: {
                where: {
                    date: {
                        gte: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
                    }
                }
            }
        }
    });

    const isConnected = metaAccount && metaAccount.status === 'active';

    // Calculate Aggregates (Last 30 Days)
    const totalSpend = metaAccount?.insights.reduce((acc, i) => acc + i.spend, 0) || 0;
    const totalRevenue = metaAccount?.insights.reduce((acc, i) => acc + i.purchaseValue, 0) || 0;
    const totalImpressions = metaAccount?.insights.reduce((acc, i) => acc + i.impressions, 0) || 0;
    const totalClicks = metaAccount?.insights.reduce((acc, i) => acc + i.clicks, 0) || 0;
    const overallROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    // Run Intelligence Engines
    const fatigueResults = isConnected ? await detectCreativeFatigue(shop.id) : [];
    const fatiguedAds = fatigueResults.filter(r => r.status === 'fatigued');

    const stockConflicts = isConnected ? await checkStockAdConflicts(shop.id) : [];

    const features = [
        {
            title: "Audience Discovery",
            description: "ML-powered clustering reveals untapped audiences similar to your best-converting customers.",
            icon: Target,
            color: "text-blue-400",
            bgColor: "bg-blue-400/10",
            borderColor: "border-blue-400/20",
            status: "Coming Soon",
            layer: "FUTURE",
        },
        {
            title: "Ad Copy Generator",
            description: "LLM-powered headlines, body copy, and CTAs calibrated to your brand voice and top-performing patterns.",
            icon: PenTool,
            color: "text-amber-400",
            bgColor: "bg-amber-400/10",
            borderColor: "border-amber-400/20",
            status: "Coming Soon",
            layer: "FUTURE",
        },
    ];

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                    <Megaphone className="w-3 h-3" />
                    Module 3 — Growth Engine
                </div>
                <h1 className="text-5xl lg:text-6xl font-clash font-bold tracking-tight">
                    Growth <span className="text-emerald-400">Engine</span>
                </h1>
                <p className="text-[var(--muted-foreground)] max-w-xl text-lg leading-relaxed">
                    Run smarter campaigns with AI-driven insights.
                    {isConnected ? " Analyzing your Meta Ads performance." : " Connect Meta Ads to unlock campaign intelligence."}
                </p>
            </div>

            {!isConnected ? (
                /* Connect Meta CTA */
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-emerald-500/20 p-8 md:p-12">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
                    <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
                        <div className="flex-1 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                <Zap className="w-3 h-3" />
                                Integration Required
                            </div>
                            <h2 className="text-2xl font-clash font-bold">Connect Meta Ads to Unlock Growth Engine</h2>
                            <p className="text-[var(--muted-foreground)] max-w-lg leading-relaxed">
                                Connect your Meta (Facebook/Instagram) Ads account to unlock campaign analytics, creative fatigue detection, audience discovery, and AI-powered ad generation.
                            </p>
                            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                                <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-400" />Campaign performance tracking with health scores</li>
                                <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-400" />ML-powered creative fatigue detection</li>
                                <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-400" />AI audience clustering and lookalike analysis</li>
                                <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-400" />LLM-generated ad copy and creative concepts</li>
                            </ul>
                        </div>
                        <Link href="/api/auth/meta" prefetch={false}>
                            <button className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-clash font-bold text-sm transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] whitespace-nowrap">
                                <ExternalLink className="w-4 h-4" />
                                Connect Meta Ads
                            </button>
                        </Link>
                    </div>
                </div>
            ) : (
                /* Dashboard View */
                <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <KpiCard title="Ad Spend (30d)" value={`$${totalSpend.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} icon={DollarSign} trend="+12%" />
                        <KpiCard title="Revenue (30d)" value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} icon={TrendingUp} trend="+5%" />
                        <KpiCard title="ROAS" value={`${overallROAS.toFixed(2)}x`} icon={BarChart3} trend={overallROAS > 2 ? "Healthy" : "Low"} trendColor={overallROAS > 2 ? "text-emerald-400" : "text-rose-400"} />
                        <KpiCard title="CTR" value={`${ctr.toFixed(2)}%`} icon={MousePointerClick} trend={`${totalClicks} Clicks`} />
                    </div>

                    {/* Stock Conflicts Alert - NEW */}
                    {stockConflicts.length > 0 && (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 animate-pulse">
                            <div className="flex items-center gap-3 mb-4">
                                <PackageX className="w-6 h-6 text-rose-500" />
                                <h3 className="text-lg font-bold text-rose-500">Critical: Ads Running for Out-of-Stock Products</h3>
                            </div>
                            <div className="space-y-3">
                                {stockConflicts.map((conflict) => (
                                    <div key={conflict.adId} className="flex items-center justify-between bg-[var(--background)] p-4 rounded-xl border border-rose-500/20">
                                        <div>
                                            <div className="font-bold text-[var(--foreground)]">{conflict.productTitle}</div>
                                            <div className="text-sm text-[var(--muted-foreground)]">Ad: {conflict.adName} • 0 Stock</div>
                                        </div>
                                        <button className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg transition-colors">
                                            Turn Off Ad
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Creative Fatigue Monitor */}
                    <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-clash font-bold flex items-center gap-3">
                                    <Eye className="w-6 h-6 text-rose-400" />
                                    Creative Fatigue Monitor
                                </h2>
                                <p className="text-[var(--muted-foreground)] mt-1">AI-detected performance decay in your active ads.</p>
                            </div>
                            {fatiguedAds.length > 0 ? (
                                <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 text-sm font-bold flex items-center gap-2 animate-pulse">
                                    <AlertTriangle className="w-4 h-4" />
                                    {fatiguedAds.length} Ads Fatigued
                                </div>
                            ) : (
                                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-bold flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Creatives Healthy
                                </div>
                            )}
                        </div>

                        {fatiguedAds.length > 0 ? (
                            <div className="grid gap-4">
                                {fatiguedAds.map((ad) => (
                                    <div key={ad.adId} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-[var(--background)] border border-rose-500/20 hover:border-rose-500/40 transition-colors">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-[var(--foreground)]">{ad.adName}</span>
                                                <Badge variant="destructive" className="text-[10px]">Fatigued</Badge>
                                            </div>
                                            <p className="text-xs text-[var(--muted-foreground)]">Campaign: {ad.campaignName}</p>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-4 md:gap-8 my-4 md:my-0">
                                            {ad.signals.map((signal, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-rose-400 text-sm">
                                                    <TrendingUp className="w-4 h-4 rotate-180" />
                                                    {signal}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden md:block">
                                                <div className="text-xs font-bold text-[var(--foreground)]">Recommendation</div>
                                                <div className="text-xs text-rose-400">{ad.recommendation}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-[var(--border)] rounded-xl">
                                <div className="p-4 bg-[var(--background)] rounded-full mb-4">
                                    <Sparkles className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-bold text-[var(--foreground)]">No Creative Fatigue Detected</h3>
                                <p className="text-[var(--muted-foreground)] max-w-md mt-2 text-sm">
                                    Your active ads are performing within their 7-day average. We'll alert you if CTR or ROAS begins to decay significantly.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-clash font-bold flex items-center gap-2">
                                <Activity className="w-5 h-5 text-emerald-400" />
                                Active Campaigns
                            </h2>
                            <span className="text-xs text-[var(--muted-foreground)]">Syncing daily from Meta</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-left text-[var(--muted-foreground)] border-b border-[var(--border)]">
                                    <tr>
                                        <th className="pb-3 pl-2 font-medium">Campaign Name</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Objective</th>
                                        <th className="pb-3 font-medium">Buying Type</th>
                                        <th className="pb-3 pr-2 font-medium text-right">Spend Cap</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {metaAccount.campaigns.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-[var(--muted-foreground)]">
                                                No active campaigns found. Try syncing again.
                                            </td>
                                        </tr>
                                    ) : (
                                        metaAccount.campaigns.map((camp) => (
                                            <tr key={camp.id} className="group">
                                                <td className="py-4 pl-2 font-medium text-[var(--foreground)] group-hover:text-emerald-400 transition-colors">
                                                    {camp.name}
                                                </td>
                                                <td className="py-4">
                                                    <Badge variant={camp.status === 'ACTIVE' ? 'emerald' : 'secondary'}>{camp.status}</Badge>
                                                </td>
                                                <td className="py-4 text-[var(--muted-foreground)]">{camp.objective?.replace('OUTCOME_', '')}</td>
                                                <td className="py-4 text-[var(--muted-foreground)]">{camp.buyingType}</td>
                                                <td className="py-4 pr-2 text-right font-mono text-[var(--muted-foreground)]">
                                                    {camp.spendCap ? `$${(parseInt(camp.spendCap) / 100).toLocaleString()}` : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Feature Preview Cards (Advanced) */}
            <div className="space-y-6">
                <h2 className="text-2xl font-clash font-bold">Advanced Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {features.map((feat) => (
                        <div key={feat.title} className="relative bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-6 opacity-75">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-2 rounded-lg ${feat.bgColor} border ${feat.borderColor}`}>
                                    <feat.icon className={`w-5 h-5 ${feat.color}`} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${feat.bgColor} ${feat.color} border ${feat.borderColor}`}>
                                    {feat.status}
                                </span>
                            </div>
                            <h3 className="text-lg font-clash font-bold mb-2">{feat.title}</h3>
                            <p className="text-[var(--muted-foreground)] text-xs leading-relaxed">{feat.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function KpiCard({ title, value, icon: Icon, trend, trendColor = "text-emerald-400" }: { title: string, value: string, icon: any, trend?: string, trendColor?: string }) {
    return (
        <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/30">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-[var(--muted-foreground)]">{title}</span>
                <Icon className="w-5 h-5 text-[var(--muted-foreground)]" />
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-clash font-bold">{value}</span>
                {trend && (
                    <span className={`text-xs font-bold ${trendColor}`}>
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );
}
