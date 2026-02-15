import { getCurrentUser, getConnectedShop } from "@brandmind/backend/auth/session";
import { prisma } from "@brandmind/shared";
import { redirect } from "next/navigation";
import Link from "next/link";
import { triggerAutoSync } from "@brandmind/backend/sync/auto-sync";
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
} from "lucide-react";

export default async function GrowthEnginePage() {
    const user = await getCurrentUser();
    const shopDomain = await getConnectedShop();

    if (!user) redirect("/auth/login");
    if (!shopDomain) redirect("/onboarding");

    const shop = await prisma.shop.findUnique({ where: { shopDomain } });
    if (!shop) redirect("/onboarding");

    // Trigger auto-sync in background
    await triggerAutoSync(shop.id);

    const features = [
        {
            title: "Campaign Analysis",
            description: "Deep-dive into campaign performance: what worked, what failed, and why. Learn from historical patterns.",
            icon: TrendingUp,
            color: "text-emerald-400",
            bgColor: "bg-emerald-400/10",
            borderColor: "border-emerald-400/20",
            status: "Coming Soon",
            layer: "PAST",
        },
        {
            title: "Creative Fatigue Monitor",
            description: "AI anomaly detection identifies declining ad performance before it impacts your ROAS.",
            icon: Eye,
            color: "text-rose-400",
            bgColor: "bg-rose-400/10",
            borderColor: "border-rose-400/20",
            status: "Coming Soon",
            layer: "PRESENT",
        },
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
                    Run smarter campaigns and discover untapped audiences hungry for your products. Campaign analytics, creative intelligence, and AI-powered ad generation.
                </p>
            </div>

            {/* Connect Meta CTA */}
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
                    <button className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-clash font-bold text-sm transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] whitespace-nowrap">
                        <ExternalLink className="w-4 h-4" />
                        Connect Meta Ads
                    </button>
                </div>
            </div>

            {/* Feature Preview Cards */}
            <div className="space-y-6">
                <h2 className="text-2xl font-clash font-bold">Feature Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feat) => (
                        <div key={feat.title} className="relative bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-8 opacity-75">
                            <div className="flex items-start justify-between mb-6">
                                <div className={`p-3 rounded-xl ${feat.bgColor} border ${feat.borderColor}`}>
                                    <feat.icon className={`w-6 h-6 ${feat.color}`} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[var(--foreground)]/5 text-[var(--muted-foreground)] border border-[var(--border)]">
                                        {feat.layer}
                                    </span>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${feat.bgColor} ${feat.color} border ${feat.borderColor}`}>
                                        {feat.status}
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-xl font-clash font-bold mb-2">{feat.title}</h3>
                            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">{feat.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
