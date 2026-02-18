import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface SyncStep {
    id: string;
    label: string;
    status: "pending" | "loading" | "complete";
}

export function SyncProgress({ syncDone = false }: { shopDomain: string; syncDone?: boolean }) {
    const [steps, setSteps] = useState<SyncStep[]>([
        { id: "sync", label: "Syncing Products & Orders", status: "loading" },
        { id: "dna", label: "Generating Brand DNA", status: "pending" },
        { id: "patterns", label: "Analyzing Customer Patterns", status: "pending" },
        { id: "gaps", label: "Identifying Market Gaps", status: "pending" },
    ]);

    // Animate steps forward while sync is in progress
    useEffect(() => {
        const timer = setTimeout(() => {
            setSteps(s => s.map(step => step.id === "sync" ? { ...step, status: "complete" } : step.id === "dna" ? { ...step, status: "loading" } : step));
        }, 3000);

        const timer2 = setTimeout(() => {
            setSteps(s => s.map(step => step.id === "dna" ? { ...step, status: "complete" } : step.id === "patterns" ? { ...step, status: "loading" } : step));
        }, 6000);

        const timer3 = setTimeout(() => {
            setSteps(s => s.map(step => step.id === "patterns" ? { ...step, status: "complete" } : step.id === "gaps" ? { ...step, status: "loading" } : step));
        }, 9000);

        return () => {
            clearTimeout(timer);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    // When sync API call returns, mark all steps complete
    useEffect(() => {
        if (syncDone) {
            setSteps(s => s.map(step => ({ ...step, status: "complete" })));
        }
    }, [syncDone]);

    return (
        <div className="w-full max-w-sm mx-auto space-y-6">
            <div className="space-y-4">
                {steps.map((step) => (
                    <div key={step.id} className="flex items-center gap-4 group">
                        <div className="flex-shrink-0">
                            {step.status === "complete" ? (
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            ) : step.status === "loading" ? (
                                <Loader2 className="w-6 h-6 text-[var(--primary)] animate-spin" />
                            ) : (
                                <Circle className="w-6 h-6 text-[var(--border)]" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className={`text-sm font-medium transition-colors ${step.status === "complete" ? "text-emerald-500" : step.status === "loading" ? "text-white" : "text-[var(--muted-foreground)]"}`}>
                                {step.label}
                            </p>
                            {step.status === "loading" && (
                                <div className="mt-2 w-full bg-[var(--background-surface)] rounded-full h-1 overflow-hidden">
                                    <div className="bg-[var(--primary)] h-full animate-[progress_2s_infinite_linear]" style={{ width: "40%" }}></div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-center text-xs text-[var(--muted-foreground)] animate-pulse">
                Fetching the last 6 months of data to build your dashboard...
            </p>
        </div>
    );
}
