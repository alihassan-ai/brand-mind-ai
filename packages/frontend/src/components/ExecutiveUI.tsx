import React from 'react';

interface ExecutiveCardProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    badge?: string;
}

export function ExecutiveCard({ title, subtitle, icon, children, className = "", badge }: ExecutiveCardProps) {
    return (
        <div className={`relative group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--background-card)] hover:border-[var(--primary)]/30 transition-all duration-500 h-full flex flex-col shadow-[var(--shadow-card)] ${className}`}>
            {/* Gradient glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            {/* Top edge highlight */}
            <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/6 to-transparent pointer-events-none" />

            <div className="p-8 relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        {icon && (
                            <div className="p-3 rounded-2xl bg-[var(--foreground)]/5 border border-[var(--border)] group-hover:bg-[var(--primary)]/10 group-hover:border-[var(--primary)]/25 transition-all duration-300">
                                {icon}
                            </div>
                        )}
                        <div>
                            <h3 className="text-xl font-clash font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors duration-300">{title}</h3>
                            {subtitle && <p className="text-[var(--muted-foreground)] text-sm font-medium italic mt-0.5">{subtitle}</p>}
                        </div>
                    </div>
                    {badge && (
                        <span className="px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-[10px] font-bold uppercase tracking-widest">
                            {badge}
                        </span>
                    )}
                </div>

                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}

interface DistributionItem {
    label: string;
    value: number;
    color?: string;
    total?: number;
}

export function DistributionChart({ items, unit = "" }: { items: DistributionItem[], unit?: string }) {
    const maxValue = Math.max(...items.map(i => i.value));

    return (
        <div className="space-y-4">
            {items.map((item, i) => {
                const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                return (
                    <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                            <span>{item.label}</span>
                            <span className="text-[var(--foreground)]">{unit}{item.value.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 w-full bg-[var(--foreground)]/5 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${item.color || 'bg-[var(--primary)]'}`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export function ExecutiveBadge({
    children,
    variant = "gold"
}: {
    children: React.ReactNode;
    variant?: "gold" | "violet" | "blue" | "rose" | "emerald";
}) {
    const styles: Record<string, string> = {
        gold: "bg-amber-500/10 border-amber-500/20 text-amber-400",
        violet: "bg-violet-500/10 border-violet-500/20 text-violet-400",
        blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
        rose: "bg-rose-500/10 border-rose-500/20 text-rose-400",
        emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${styles[variant] || styles.violet}`}>
            {children}
        </span>
    );
}
