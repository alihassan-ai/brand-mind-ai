import { getCurrentUser, getConnectedShop } from "@brandmind/backend/auth/session";
import { prisma } from "@brandmind/shared";
import { redirect } from "next/navigation";
import Link from "next/link";
import { triggerAutoSync } from "@brandmind/backend/sync/auto-sync";
import {
    TrendingUp,
    Dna,
    Target,
    Rocket,
    ChevronRight,
    Sparkles,
    ShoppingBag,
    Package,
    BarChart3,
} from "lucide-react";

export default async function ProductIntelligencePage() {
    const user = await getCurrentUser();
    const shopDomain = await getConnectedShop();

    if (!user) redirect("/auth/login");
    if (!shopDomain) redirect("/onboarding");

    const shop = await prisma.shop.findUnique({ where: { shopDomain } });
    if (!shop) redirect("/onboarding");

    // Trigger auto-sync in background
    await triggerAutoSync(shop.id);

    const productCount = await prisma.product.count({ where: { shopId: shop.id } });
    const gapCount = await prisma.catalogGap.count({ where: { shopId: shop.id, status: "active" } });
    const candidateCount = await prisma.nextHitCandidate.count({ where: { shopId: shop.id } });
    const dna = await prisma.storeDNA.findUnique({ where: { shopId: shop.id } });

    const subModules = [
        {
            title: "Next Hit Predictor",
            description: "AI-powered product opportunity scoring based on market gaps, trends, and your store DNA.",
            href: "/product-intelligence/next-hit",
            icon: TrendingUp,
            color: "text-emerald-400",
            bgColor: "bg-emerald-400/10",
            borderColor: "border-emerald-400/20",
            stat: `${candidateCount} candidates`,
            status: "Active",
        },
        {
            title: "Store DNA Analysis",
            description: "Deep structural analysis of price bands, product velocity, vendor concentration, and seasonality.",
            href: "/product-intelligence/store-dna",
            icon: Dna,
            color: "text-blue-400",
            bgColor: "bg-blue-400/10",
            borderColor: "border-blue-400/20",
            stat: dna ? `Health: ${dna.catalogHealthScore}%` : "Not computed",
            status: dna ? "Computed" : "Pending",
        },
        {
            title: "Market Gap Finder",
            description: "Identifies underserved pricing bands and category adjacencies in your market.",
            href: "/product-intelligence/gaps",
            icon: Target,
            color: "text-purple-400",
            bgColor: "bg-purple-400/10",
            borderColor: "border-purple-400/20",
            stat: `${gapCount} active gaps`,
            status: gapCount > 0 ? "Gaps Found" : "Clean",
        },
        {
            title: "Launch Kit Generator",
            description: "AI-generated launch strategies with go-to-market plans, pricing, and copy assets.",
            href: "/product-intelligence/launch-kit",
            icon: Rocket,
            color: "text-amber-400",
            bgColor: "bg-amber-400/10",
            borderColor: "border-amber-400/20",
            stat: "AI Powered",
            status: "Ready",
        },
    ];

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                    <ShoppingBag className="w-3 h-3" />
                    Module 2 — Product Intelligence
                </div>
                <h1 className="text-5xl lg:text-6xl font-clash font-bold tracking-tight">
                    Product <span className="text-blue-400">Intelligence</span>
                </h1>
                <p className="text-[var(--muted-foreground)] max-w-xl text-lg leading-relaxed">
                    Manage your inventory intelligently and discover your next winning product. AI-driven analysis of your catalog, market gaps, and growth opportunities.
                </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard label="Products Tracked" value={productCount.toString()} icon={<Package className="w-5 h-5 text-blue-400" />} />
                <StatCard label="Active Gaps" value={gapCount.toString()} icon={<Target className="w-5 h-5 text-purple-400" />} />
                <StatCard label="Next Hit Candidates" value={candidateCount.toString()} icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} />
                <StatCard label="Catalog Health" value={dna ? `${dna.catalogHealthScore}%` : "—"} icon={<BarChart3 className="w-5 h-5 text-amber-400" />} />
            </div>

            {/* Sub-Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {subModules.map((mod) => (
                    <Link key={mod.href} href={mod.href} className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                        <div className="relative bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-8 hover:border-[var(--foreground)]/10 transition-all duration-300 h-full flex flex-col">
                            <div className="flex items-start justify-between mb-6">
                                <div className={`p-3 rounded-xl ${mod.bgColor} border ${mod.borderColor}`}>
                                    <mod.icon className={`w-6 h-6 ${mod.color}`} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${mod.bgColor} ${mod.color} border ${mod.borderColor}`}>
                                    {mod.status}
                                </span>
                            </div>

                            <h3 className="text-xl font-clash font-bold mb-2 group-hover:text-blue-400 transition-colors">
                                {mod.title}
                            </h3>
                            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-6 flex-1">
                                {mod.description}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
                                <span className="text-sm font-medium text-[var(--muted-foreground)]">{mod.stat}</span>
                                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">
                                    Open
                                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
