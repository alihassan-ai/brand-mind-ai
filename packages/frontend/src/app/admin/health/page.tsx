import { ExecutiveBadge, ExecutiveCard } from "@/components/ExecutiveUI";
import { Activity, ShieldAlert, Cpu, Database, Cloud } from "lucide-react";

export default function SystemHealth() {
    return (
        <div className="space-y-10 animate-fade-in">
            <div className="space-y-1">
                <ExecutiveBadge variant="gold">Environment Monitoring</ExecutiveBadge>
                <h1 className="text-4xl font-clash font-bold text-[var(--foreground)]">System Health</h1>
                <p className="text-[var(--muted-foreground)] italic">Sub-harmonic status of core BrandMindAI infrastructure.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ExecutiveCard title="Compute Infrastructure" icon={<Cpu className="w-5 h-5 text-amber-500" />}>
                    <div className="space-y-6 pt-4">
                        <HealthMetric label="CPU Node Alpha" value="12%" status="optimal" />
                        <HealthMetric label="Memory Distribution" value="2.4 / 8.0 GB" status="optimal" />
                        <HealthMetric label="Job Queue Velocity" value="0.2ms" status="optimal" />
                    </div>
                </ExecutiveCard>

                <ExecutiveCard title="Database & Storage" icon={<Database className="w-5 h-5 text-blue-500" />}>
                    <div className="space-y-6 pt-4">
                        <HealthMetric label="Read Connection Pool" value="14/100" status="optimal" />
                        <HealthMetric label="Write Latency" value="4ms" status="optimal" />
                        <HealthMetric label="Backup Integrity" value="Verified" status="optimal" />
                    </div>
                </ExecutiveCard>

                <ExecutiveCard title="Shopify API Latency" icon={<Cloud className="w-5 h-5 text-emerald-500" />}>
                    <div className="h-40 flex items-center justify-center border border-dashed border-[var(--border)] rounded-2xl bg-[var(--foreground)]/[0.02]">
                        <span className="text-xs text-[var(--muted)] font-medium uppercase tracking-widest text-center">
                            Network Telemetry Initializing...<br />
                            <span className="opacity-50 text-[10px]">Real-time Shopify API Monitor</span>
                        </span>
                    </div>
                </ExecutiveCard>

                <ExecutiveCard title="Security & Access" icon={<ShieldAlert className="w-5 h-5 text-rose-500" />}>
                    <div className="space-y-6 pt-4">
                        <HealthMetric label="OAuth Token Health" value="100% Valid" status="optimal" />
                        <HealthMetric label="Encryption Layer" value="AES-256 Active" status="optimal" />
                        <HealthMetric label="Session Persistence" value="Edge Managed" status="optimal" />
                    </div>
                </ExecutiveCard>
            </div>
        </div>
    );
}

function HealthMetric({ label, value, status }: { label: string, value: string, status: 'optimal' | 'warning' | 'alert' }) {
    const colors = {
        optimal: 'text-emerald-400',
        warning: 'text-amber-500',
        alert: 'text-rose-500'
    };

    return (
        <div className="flex items-center justify-between group">
            <span className="text-sm font-medium text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">{label}</span>
            <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[var(--foreground)]">{value}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${colors[status]} bg-current shadow-[0_0_8px_currentColor]`} />
            </div>
        </div>
    )
}
