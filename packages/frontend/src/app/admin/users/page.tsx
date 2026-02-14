import { prisma } from "@brandmind/shared";
import { ExecutiveBadge, ExecutiveCard } from "@/components/ExecutiveUI";
import { Users, Mail, Calendar, Shield, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function UserManagement() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: { shops: true }
    });

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="space-y-1">
                <ExecutiveBadge variant="gold">Network Oversight</ExecutiveBadge>
                <h1 className="text-4xl font-clash font-bold text-[var(--foreground)]">User Intelligence</h1>
                <p className="text-[var(--muted-foreground)] italic">Managing administrative and brand accounts.</p>
            </div>

            <ExecutiveCard title="All Registered Users" subtitle={`${users.length} unique identities identified`}>
                <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--foreground)]/5 border-b border-[var(--border)]">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Identity</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Connections</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] text-right">Registered</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-[var(--foreground)]/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[var(--foreground)]/5 border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--muted)] group-hover:border-[var(--primary)]/30 group-hover:text-[var(--primary)] transition-all">
                                                {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[var(--foreground)]">{user.name || "Anonymous Agent"}</p>
                                                <p className="text-xs text-[var(--muted-foreground)]">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {user.role === 'admin' ? (
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 text-[9px] font-bold uppercase">
                                                    <Shield className="w-2.5 h-2.5" />
                                                    System Admin
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-bold uppercase">
                                                    User
                                                </div>
                                            )}
                                            {(user as any).emailVerified && (
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase">
                                                    Verified
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-[var(--foreground)]">{user.shops.length} Shops</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <p className="text-xs text-[var(--muted-foreground)] font-medium">
                                            {user.createdAt.toLocaleDateString()}
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
