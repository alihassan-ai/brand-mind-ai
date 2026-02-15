import { getCurrentUser, getConnectedShop } from "@brandmind/backend/auth/session";
import { prisma } from "@brandmind/shared";
import { redirect } from "next/navigation";
import {
    TrendingDown,
    AlertCircle,
    Shield,
    Users,
    Clock,
    Mail,
    Sparkles,
} from "lucide-react";
import {
    ExecutiveCard,
    ExecutiveBadge,
} from "@/components/ExecutiveUI";

export default async function ChurnPage() {
    const user = await getCurrentUser();
    const shopDomain = await getConnectedShop();

    if (!user) redirect("/auth/login");
    if (!shopDomain) redirect("/onboarding");

    const shop = await prisma.shop.findUnique({ where: { shopDomain } });
    if (!shop) redirect("/onboarding");

    // Get churn-related retention insights
    const churnInsights = await prisma.retentionInsight.findMany({
        where: {
            shopId: shop.id,
            segmentType: { in: ["at_risk", "hibernating", "about_to_sleep", "lost"] },
        },
        orderBy: { revenueAtRisk: "desc" },
    });

    // Get at-risk RFM segments
    const atRiskSegments = await prisma.customerRFM.groupBy({
        by: ["rfmSegment"],
        where: {
            shopId: shop.id,
            rfmSegment: { in: ["at_risk", "hibernating", "about_to_sleep"] },
        },
        _count: { _all: true },
        _sum: { totalSpent: true },
    });

    const totalAtRisk = atRiskSegments.reduce((s, seg) => s + seg._count._all, 0);
    const totalRevAtRisk = atRiskSegments.reduce((s, seg) => s + Number(seg._sum.totalSpent || 0), 0);
    const currencyCode = (shop as any).currencyCode || "USD";

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider">
                    <TrendingDown className="w-3 h-3" />
                    Customer Intelligence / Churn Predictor
                </div>
                <h1 className="text-5xl lg:text-6xl font-clash font-bold tracking-tight">
                    Churn <span className="text-rose-400">Radar</span>
                </h1>
                <p className="text-[var(--muted-foreground)] max-w-xl text-lg leading-relaxed">
                    Identify at-risk customers before they leave. AI-powered churn detection with recommended prevention actions and reactivation strategies.
                </p>
            </div>

            {/* Alert Banner */}
            {totalAtRisk > 0 && (
                <div className="flex items-center gap-4 p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                    <AlertCircle className="w-8 h-8 text-rose-400 flex-shrink-0" />
                    <div>
                        <p className="font-clash font-bold text-lg">
                            {totalAtRisk} customers at risk of churning
                        </p>
                        <p className="text-[var(--muted-foreground)] text-sm">
                            Representing {new Intl.NumberFormat('en', { style: 'currency', currency: currencyCode }).format(totalRevAtRisk)} in historical revenue
                        </p>
                    </div>
                </div>
            )}

            {/* At Risk Segments */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {atRiskSegments.map((seg) => (
                    <ExecutiveCard
                        key={seg.rfmSegment}
                        title={seg.rfmSegment.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                        subtitle={`${seg._count._all} customers`}
                        icon={<Shield className="w-6 h-6 text-rose-400" />}
                        badge={seg.rfmSegment === "at_risk" ? "High Priority" : "Monitor"}
                    >
                        <div className="space-y-4 py-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--muted-foreground)]">Customers</span>
                                <span className="text-lg font-clash font-bold">{seg._count._all}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--muted-foreground)]">Historical Revenue</span>
                                <span className="text-lg font-clash font-bold text-rose-400">
                                    {new Intl.NumberFormat('en', { style: 'currency', currency: currencyCode }).format(Number(seg._sum.totalSpent || 0))}
                                </span>
                            </div>
                        </div>
                    </ExecutiveCard>
                ))}
            </div>

            {/* Churn Insights */}
            {churnInsights.length > 0 ? (
                <div className="space-y-6">
                    <h2 className="text-2xl font-clash font-bold">AI Retention Strategies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {churnInsights.slice(0, 6).map((insight) => (
                            <div
                                key={insight.id}
                                className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-6 space-y-4"
                            >
                                <div className="flex items-start justify-between">
                                    <ExecutiveBadge variant={(insight.churnProbability ?? 0) > 0.7 ? "rose" : "gold"}>
                                        {Math.round((insight.churnProbability ?? 0) * 100)}% Churn Risk
                                    </ExecutiveBadge>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                                        {insight.actionType}
                                    </span>
                                </div>
                                <p className="text-sm font-medium">{insight.recommendedAction}</p>
                                {insight.campaignSuggestion && (
                                    <div className="p-3 rounded-xl bg-[var(--foreground)]/5 border border-[var(--border)]">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] block mb-1">
                                            Campaign Suggestion
                                        </span>
                                        <p className="text-sm text-[var(--muted-foreground)] italic">{String(insight.campaignSuggestion)}</p>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {insight.customerCount} customers
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        {Math.round(insight.confidence * 100)}% confidence
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-[2.5rem] p-24 text-center space-y-6">
                    <Shield className="w-16 h-16 text-[var(--muted-foreground)]/30 mx-auto" />
                    <div className="space-y-2">
                        <p className="text-xl font-clash font-bold">No Churn Insights Yet</p>
                        <p className="text-[var(--muted-foreground)] max-w-sm mx-auto">
                            Run the retention analysis from the Customer Intelligence module to generate churn predictions and prevention strategies.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
