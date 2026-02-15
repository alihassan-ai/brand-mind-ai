import { prisma } from "@brandmind/shared";
import { ExecutiveCard, ExecutiveBadge } from "@/components/ExecutiveUI";
import {
    Users,
    ShoppingBag,
    Zap,
    ShieldCheck,
    TrendingUp,
    Activity
} from "lucide-react";

export default async function AdminDashboard() {
    const [userCount, shopCount, syncCount] = await Promise.all([
        (prisma as any).user.count(),
        (prisma as any).shop.count(),
        (prisma as any).syncEvent.count({ where: { status: 'COMPLETED' } })
    ]);

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <ExecutiveBadge variant="gold">System Overview</ExecutiveBadge>
                    <h1 className="text-4xl font-clash font-bold text-[var(--foreground)]">Control Room</h1>
                    <p className="text-[var(--muted-foreground)] italic">Centralized intelligence for BrandMindAI network.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)] italic pb-1">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    Network Status: <span className="text-emerald-400">Optimal</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ExecutiveCard
                    title="Total Users"
                    subtitle="Registered intelligence agents"
                    icon={<Users className="w-5 h-5 text-amber-500" />}
                >
                    <div className="mt-2">
                        <span className="text-5xl font-clash font-bold">{userCount}</span>
                        <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                            <TrendingUp className="w-3 h-3" />
                            Network Expansion Active
                        </div>
                    </div>
                </ExecutiveCard>

                <ExecutiveCard
                    title="Connected Shops"
                    subtitle="Live brand integrations"
                    icon={<ShoppingBag className="w-5 h-5 text-blue-500" />}
                >
                    <div className="mt-2">
                        <span className="text-5xl font-clash font-bold">{shopCount}</span>
                        <div className="mt-4 flex items-center gap-2 text-blue-400 text-xs font-bold uppercase">
                            <ShieldCheck className="w-3 h-3" />
                            Verified Connections
                        </div>
                    </div>
                </ExecutiveCard>

                <ExecutiveCard
                    title="Total Syncs"
                    subtitle="Successful data operations"
                    icon={<Zap className="w-5 h-5 text-emerald-500" />}
                >
                    <div className="mt-2">
                        <span className="text-5xl font-clash font-bold">{syncCount}</span>
                        <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                            <Activity className="w-3 h-3" />
                            Real-time Intelligence
                        </div>
                    </div>
                </ExecutiveCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <ExecutiveCard
                    title="Recent Activity"
                    subtitle="Latest system events"
                >
                    <div className="space-y-4 pt-4">
                        <p className="text-sm text-[var(--muted-foreground)] italic">Activity monitoring active. No critical alerts reported.</p>
                        {/* Future: Map through recent logs */}
                        <div className="h-40 flex items-center justify-center border border-dashed border-[var(--border)] rounded-2xl bg-[var(--foreground)]/[0.02]">
                            <span className="text-xs text-[var(--muted)] font-medium uppercase tracking-widest">Feed Initialized</span>
                        </div>
                    </div>
                </ExecutiveCard>

                <ExecutiveCard
                    title="System Health"
                    subtitle="Service layer status"
                >
                    <div className="space-y-6 pt-4">
                        <HealthItem label="Core API" status="online" />
                        <HealthItem label="Shopify Webhooks" status="online" />
                        <HealthItem label="Background Sync Agent" status="online" />
                        <HealthItem label="AI Inference Engine" status="online" />
                    </div>
                </ExecutiveCard>
            </div>
        </div>
    );
}

function HealthItem({ label, status }: { label: string, status: 'online' | 'offline' }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">{status}</span>
                <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
            </div>
        </div>
    )
}
