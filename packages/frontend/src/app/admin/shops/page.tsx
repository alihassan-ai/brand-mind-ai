import { prisma } from "@brandmind/shared";
import { ExecutiveBadge, ExecutiveCard } from "@/components/ExecutiveUI";
import { ShoppingBag, Store, Activity, Calendar, ExternalLink, User } from "lucide-react";

export default async function ShopManagement() {
    const shops = await prisma.shop.findMany({
        orderBy: { installedAt: 'desc' },
        include: { user: true }
    });

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="space-y-1">
                <ExecutiveBadge variant="gold">Asset Oversight</ExecutiveBadge>
                <h1 className="text-4xl font-clash font-bold text-[var(--foreground)]">Shop Intelligence</h1>
                <p className="text-[var(--muted-foreground)] italic">Monitoring integrated Shopify storefronts.</p>
            </div>

            <ExecutiveCard title="All Connected Stores" subtitle={`${shops.length} operational assets`}>
                <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--foreground)]/5 border-b border-[var(--border)]">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Storefront</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Owner</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Intelligence</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] text-right">Integrated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {shops.map((shop) => (
                                <tr key={shop.id} className="hover:bg-[var(--foreground)]/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[var(--foreground)]/5 border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--muted)] group-hover:border-[var(--primary)]/30 group-hover:text-[var(--primary)] transition-all">
                                                <Store className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[var(--foreground)]">{shop.shopDomain}</p>
                                                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-[var(--muted-foreground)] mt-0.5">
                                                    {shop.currencyCode} • Shopify
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <User className="w-3.5 h-3.5 text-[var(--muted)]" />
                                            <span className="text-sm font-medium text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">
                                                {shop.user?.name || shop.user?.email || "Unassigned"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {shop.onboardingComplete ? (
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase">
                                                    Operational
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-bold uppercase">
                                                    Onboarding
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <p className="text-xs text-[var(--muted-foreground)] font-medium">
                                            {shop.installedAt.toLocaleDateString()}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ExecutiveCard>
        </div>
    );
}
