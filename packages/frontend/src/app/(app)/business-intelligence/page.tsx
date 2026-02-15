import { getCurrentUser, getConnectedShop } from "@brandmind/backend/auth/session";
import { prisma } from "@brandmind/shared";
import { redirect } from "next/navigation";
import { triggerAutoSync } from "@brandmind/backend/sync/auto-sync";
import {
    BarChart3,
    DollarSign,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    PieChart,
    Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatter";

export default async function BusinessIntelligencePage() {
    const user = await getCurrentUser();
    const shopDomain = await getConnectedShop();

    if (!user) redirect("/auth/login");
    if (!shopDomain) redirect("/onboarding");

    const shop = await prisma.shop.findUnique({ where: { shopDomain } });
    if (!shop) redirect("/onboarding");

    // Trigger auto-sync in background
    await triggerAutoSync(shop.id);

    const currencyCode = (shop as any).currencyCode || "USD";

    // Calculate real business metrics from order data
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Current period revenue
    const currentPeriod = await prisma.order.aggregate({
        where: { shopId: shop.id, createdAt: { gte: thirtyDaysAgo } },
        _sum: { totalPrice: true },
        _count: { _all: true },
    });

    // Previous period revenue (for comparison)
    const prevPeriod = await prisma.order.aggregate({
        where: { shopId: shop.id, createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
        _sum: { totalPrice: true },
        _count: { _all: true },
    });

    // All time
    const allTime = await prisma.order.aggregate({
        where: { shopId: shop.id },
        _sum: { totalPrice: true },
        _count: { _all: true },
    });

    // Refunds
    const refunds = await prisma.refund.aggregate({
        where: { order: { shopId: shop.id }, createdAt: { gte: thirtyDaysAgo } },
        _sum: { amount: true },
        _count: { _all: true },
    });

    // Products and customers
    const productCount = await prisma.product.count({ where: { shopId: shop.id } });
    const customerCount = await prisma.customer.count({ where: { shopId: shop.id } });

    // Monthly revenue trend (last 6 months)
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    const orders = await prisma.order.findMany({
        where: { shopId: shop.id, createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true, totalPrice: true },
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenue: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`;
        monthlyRevenue[key] = 0;
    }
    for (const order of orders) {
        const d = order.createdAt;
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`;
        if (key in monthlyRevenue) {
            monthlyRevenue[key] += Number(order.totalPrice || 0);
        }
    }

    const revenueData = Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue: Math.round(revenue) }));
    const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1);

    const currentRev = Number(currentPeriod._sum.totalPrice || 0);
    const prevRev = Number(prevPeriod._sum.totalPrice || 0);
    const revGrowth = prevRev > 0 ? ((currentRev - prevRev) / prevRev * 100) : 0;
    const totalRev = Number(allTime._sum.totalPrice || 0);
    const totalOrders = allTime._count._all;
    const aov = totalOrders > 0 ? totalRev / totalOrders : 0;
    const refundTotal = Number(refunds._sum.amount || 0);
    const refundRate = currentRev > 0 ? (refundTotal / currentRev * 100) : 0;

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-bold uppercase tracking-wider">
                    <BarChart3 className="w-3 h-3" />
                    Module 5 — Business Intelligence
                </div>
                <h1 className="text-5xl lg:text-6xl font-clash font-bold tracking-tight">
                    Business <span className="text-pink-400">Intelligence</span>
                </h1>
                <p className="text-[var(--muted-foreground)] max-w-xl text-lg leading-relaxed">
                    See the true health of your business and know exactly where you&apos;re heading. Revenue analytics, margin tracking, and financial forecasting.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    label="Revenue (30d)"
                    value={formatCurrency(currentRev, currencyCode)}
                    change={revGrowth}
                    icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
                />
                <KPICard
                    label="Orders (30d)"
                    value={currentPeriod._count._all.toString()}
                    change={prevPeriod._count._all > 0 ? ((currentPeriod._count._all - prevPeriod._count._all) / prevPeriod._count._all * 100) : 0}
                    icon={<TrendingUp className="w-5 h-5 text-blue-400" />}
                />
                <KPICard
                    label="Avg Order Value"
                    value={formatCurrency(aov, currencyCode)}
                    icon={<PieChart className="w-5 h-5 text-purple-400" />}
                />
                <KPICard
                    label="Refund Rate (30d)"
                    value={`${refundRate.toFixed(1)}%`}
                    icon={<TrendingDown className="w-5 h-5 text-rose-400" />}
                    invertColor
                />
            </div>

            {/* Revenue Trend Chart */}
            <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-clash font-bold">Revenue Trend</h2>
                        <p className="text-[var(--muted-foreground)] text-sm">Last 6 months performance</p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-[10px] font-bold uppercase tracking-wider border border-pink-500/20">
                        <Calendar className="w-3 h-3" />
                        6 Month View
                    </div>
                </div>

                <div className="grid grid-cols-6 gap-4 h-64 items-end pt-8">
                    {revenueData.map((d, i) => (
                        <div key={i} className="space-y-3 group">
                            <div className="text-center text-xs font-bold text-[var(--foreground)]">
                                {formatCurrency(d.revenue, currencyCode)}
                            </div>
                            <div
                                className="w-full bg-gradient-to-t from-pink-500/40 to-pink-500/20 group-hover:from-pink-500/60 group-hover:to-pink-500/30 border border-pink-500/30 rounded-t-xl transition-all duration-500"
                                style={{ height: `${Math.max(8, (d.revenue / maxRevenue) * 100)}%` }}
                            />
                            <div className="text-[10px] font-bold text-[var(--muted-foreground)] text-center uppercase tracking-tight">
                                {d.month}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Business Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-8 space-y-6">
                    <h3 className="text-lg font-clash font-bold flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        Lifetime Revenue
                    </h3>
                    <p className="text-4xl font-clash font-bold text-emerald-400">
                        {formatCurrency(totalRev, currencyCode)}
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        Across {totalOrders.toLocaleString()} orders
                    </p>
                </div>

                <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-8 space-y-6">
                    <h3 className="text-lg font-clash font-bold flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-purple-400" />
                        Catalog Size
                    </h3>
                    <p className="text-4xl font-clash font-bold text-purple-400">
                        {productCount.toLocaleString()}
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        Active products tracked
                    </p>
                </div>

                <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-8 space-y-6">
                    <h3 className="text-lg font-clash font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        Customer Base
                    </h3>
                    <p className="text-4xl font-clash font-bold text-amber-400">
                        {customerCount.toLocaleString()}
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        Total unique customers
                    </p>
                </div>
            </div>

            {/* Coming Soon Features */}
            <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-8 space-y-6">
                <h2 className="text-xl font-clash font-bold">Coming in Next Release</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["Revenue Forecaster", "Profit Optimizer", "Scenario Modeler"].map((feature) => (
                        <div key={feature} className="p-4 rounded-xl bg-[var(--foreground)]/5 border border-[var(--border)] flex items-center gap-3 opacity-60">
                            <Sparkles className="w-4 h-4 text-pink-400" />
                            <span className="text-sm font-medium">{feature}</span>
                            <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Soon</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function KPICard({
    label,
    value,
    change,
    icon,
    invertColor,
}: {
    label: string;
    value: string;
    change?: number;
    icon: React.ReactNode;
    invertColor?: boolean;
}) {
    const isPositive = change !== undefined ? change >= 0 : true;
    const displayColor = invertColor ? !isPositive : isPositive;

    return (
        <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">{label}</span>
                </div>
                {change !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-bold ${displayColor ? "text-emerald-400" : "text-rose-400"}`}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(change).toFixed(1)}%
                    </div>
                )}
            </div>
            <p className="text-2xl font-clash font-bold">{value}</p>
        </div>
    );
}
