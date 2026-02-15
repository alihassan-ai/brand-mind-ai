import { getCurrentUser, getConnectedShop } from "@brandmind/backend/auth/session";
import { prisma } from "@brandmind/shared";
import { redirect } from "next/navigation";
import Link from "next/link";
import { triggerAutoSync } from "@brandmind/backend/sync/auto-sync";
import {
    Users,
    Shield,
    Heart,
    Crown,
    TrendingDown,
    UserCheck,
    ChevronRight,
    Activity,
} from "lucide-react";

export default async function CustomerIntelligencePage() {
    const user = await getCurrentUser();
    const shopDomain = await getConnectedShop();

    if (!user) redirect("/auth/login");
    if (!shopDomain) redirect("/onboarding");

    const shop = await prisma.shop.findUnique({ where: { shopDomain } });
    if (!shop) redirect("/onboarding");

    // Trigger auto-sync in background
    await triggerAutoSync(shop.id);

    // Get customer stats
    const customerCount = await prisma.customer.count({ where: { shopId: shop.id } });
    const rfmSegments = await prisma.customerRFM.groupBy({
        by: ["rfmSegment"],
        where: { shopId: shop.id },
        _count: { _all: true },
    });
    const retentionInsights = await prisma.retentionInsight.count({ where: { shopId: shop.id } });
    const atRiskCount = rfmSegments
        .filter(s => ["at_risk", "hibernating", "about_to_sleep"].includes(s.rfmSegment))
        .reduce((sum, s) => sum + s._count._all, 0);
    const champCount = rfmSegments
        .filter(s => ["champions", "loyal_customers"].includes(s.rfmSegment))
        .reduce((sum, s) => sum + s._count._all, 0);

    const subModules = [
        {
            title: "Retention Radar",
            description: "RFM segmentation dashboard with churn probability scores and AI-powered retention strategies.",
            href: "/customer-intelligence/retention",
            icon: Shield,
            color: "text-purple-400",
            bgColor: "bg-purple-400/10",
            borderColor: "border-purple-400/20",
            stat: `${retentionInsights} insights`,
            status: "Active",
        },
        {
            title: "Churn Predictor",
            description: "Machine learning-powered churn detection with recommended prevention actions.",
            href: "/customer-intelligence/churn",
            icon: TrendingDown,
            color: "text-rose-400",
            bgColor: "bg-rose-400/10",
            borderColor: "border-rose-400/20",
            stat: `${atRiskCount} at risk`,
            status: atRiskCount > 0 ? "Alert" : "Healthy",
        },
        {
            title: "VIP Tracker",
            description: "Identify and nurture your highest-value customers with personalized engagement strategies.",
            href: "/customer-intelligence/retention",
            icon: Crown,
            color: "text-amber-400",
            bgColor: "bg-amber-400/10",
            borderColor: "border-amber-400/20",
            stat: `${champCount} VIPs`,
            status: "Tracking",
        },
        {
            title: "Segment Discovery",
            description: "AI-powered clustering to discover hidden customer segments you didn't know existed.",
            href: "/customer-intelligence/retention",
            icon: UserCheck,
            color: "text-emerald-400",
            bgColor: "bg-emerald-400/10",
            borderColor: "border-emerald-400/20",
            stat: `${rfmSegments.length} segments`,
            status: "Active",
        },
    ];

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
                    <Users className="w-3 h-3" />
                    Module 4 — Customer Intelligence
                </div>
                <h1 className="text-5xl lg:text-6xl font-clash font-bold tracking-tight">
                    Customer <span className="text-purple-400">Intelligence</span>
                </h1>
                <p className="text-[var(--muted-foreground)] max-w-xl text-lg leading-relaxed">
                    Know your customers deeply — prevent churn, unlock upsells, and discover new segments. AI-driven behavioral analysis for smarter engagement.
                </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard label="Total Customers" value={customerCount.toString()} icon={<Users className="w-5 h-5 text-purple-400" />} />
                <StatCard label="RFM Segments" value={rfmSegments.length.toString()} icon={<Activity className="w-5 h-5 text-blue-400" />} />
                <StatCard label="At Risk" value={atRiskCount.toString()} icon={<TrendingDown className="w-5 h-5 text-rose-400" />} />
                <StatCard label="VIP Customers" value={champCount.toString()} icon={<Crown className="w-5 h-5 text-amber-400" />} />
            </div>

            {/* Sub-Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {subModules.map((mod) => (
                    <Link key={mod.title} href={mod.href} className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                        <div className="relative bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-8 hover:border-[var(--foreground)]/10 transition-all duration-300 h-full flex flex-col">
                            <div className="flex items-start justify-between mb-6">
                                <div className={`p-3 rounded-xl ${mod.bgColor} border ${mod.borderColor}`}>
                                    <mod.icon className={`w-6 h-6 ${mod.color}`} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${mod.bgColor} ${mod.color} border ${mod.borderColor}`}>
                                    {mod.status}
                                </span>
                            </div>
                            <h3 className="text-xl font-clash font-bold mb-2 group-hover:text-purple-400 transition-colors">{mod.title}</h3>
                            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-6 flex-1">{mod.description}</p>
                            <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
                                <span className="text-sm font-medium text-[var(--muted-foreground)]">{mod.stat}</span>
                                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">
                                    Open <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">{label}</span>
            </div>
            <p className="text-3xl font-clash font-bold">{value}</p>
        </div>
    );
}
