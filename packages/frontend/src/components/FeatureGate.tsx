"use client";

import React from "react";
import { Database, AlertCircle, ChevronRight, Clock, Info } from "lucide-react";

// ============================================
// TYPES
// ============================================

interface DataBlocker {
    feature: string;
    requirement: string;
    current: string;
    needed: string;
    message: string;
    estimatedReadyDate?: string;
}

interface SufficiencyResult {
    sufficient: boolean;
    score: number;
    blockers: DataBlocker[];
    warnings: Array<{ feature: string; message: string; impact: string }>;
    estimates: Array<{
        feature: string;
        currentProgress: number;
        estimatedDaysUntilReady: number;
        message: string;
    }>;
}

// ============================================
// FEATURE GATE COMPONENT
// ============================================

interface FeatureGateProps {
    feature: string;
    sufficiency: SufficiencyResult | null;
    children: React.ReactNode;
}

export function FeatureGate({ feature, sufficiency, children }: FeatureGateProps) {
    if (!sufficiency) {
        return <LoadingState />;
    }

    const blocker = sufficiency.blockers.find(
        (b) => b.feature === feature || b.feature === "all"
    );

    if (blocker) {
        return <InsufficientDataBlock blocker={blocker} />;
    }

    return <>{children}</>;
}

// ============================================
// INSUFFICIENT DATA BLOCK
// ============================================

function InsufficientDataBlock({ blocker }: { blocker: DataBlocker }) {
    const currentNum = parseFloat(blocker.current) || 0;
    const neededNum = parseFloat(blocker.needed) || 1;
    const progress = Math.min(95, (currentNum / neededNum) * 100);

    return (
        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-12 text-center space-y-6">
            {/* Icon */}
            <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto">
                <Database className="w-10 h-10 text-rose-400" />
            </div>

            {/* Message */}
            <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-clash font-bold text-[var(--foreground)]">
                    Insufficient Data
                </h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed">{blocker.message}</p>
            </div>

            {/* Progress */}
            <div className="max-w-xs mx-auto space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">Current</span>
                    <span className="text-[var(--foreground)] font-bold">{blocker.current}</span>
                </div>
                <div className="h-2 bg-[var(--border-hover)] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-rose-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">Needed</span>
                    <span className="text-rose-400 font-bold">{blocker.needed}</span>
                </div>
            </div>

            {/* Estimated Ready Date */}
            {blocker.estimatedReadyDate && (
                <div className="pt-6 border-t border-[var(--border)]">
                    <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)]">
                        <Clock className="w-4 h-4" />
                        <span>
                            Estimated ready:{" "}
                            <span className="text-amber-400 font-bold">
                                {formatRelativeDate(new Date(blocker.estimatedReadyDate))}
                            </span>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================
// LOADING STATE
// ============================================

function LoadingState() {
    return (
        <div className="rounded-3xl border border-[var(--border-hover)] bg-[var(--background-card)] p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--foreground)]/5 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Database className="w-6 h-6 text-[var(--muted-foreground)]" />
            </div>
            <p className="text-[var(--muted-foreground)]">Checking data requirements...</p>
        </div>
    );
}

// ============================================
// DATA PROGRESS DASHBOARD
// ============================================

interface DataProgressDashboardProps {
    sufficiency: SufficiencyResult;
}

export function DataProgressDashboard({ sufficiency }: DataProgressDashboardProps) {
    return (
        <div className="rounded-3xl border border-[var(--border-hover)] bg-[var(--background-card)] p-8 space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-clash font-bold text-[var(--foreground)]">
                    Building Your Brand DNA
                </h2>
                <p className="text-[var(--muted-foreground)] max-w-lg mx-auto">
                    We&apos;re collecting data to power your predictions. Here&apos;s what
                    we&apos;re waiting for:
                </p>
            </div>

            {/* Overall Progress */}
            <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--muted-foreground)]">Data Collection Progress</span>
                    <span className="text-[var(--foreground)] font-bold">{sufficiency.score}%</span>
                </div>
                <div className="h-3 bg-[var(--border-hover)] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all"
                        style={{ width: `${sufficiency.score}%` }}
                    />
                </div>
            </div>

            {/* Feature Progress Cards */}
            {sufficiency.estimates.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sufficiency.estimates.map((estimate) => (
                        <div
                            key={estimate.feature}
                            className="p-6 rounded-2xl bg-[var(--foreground)]/5 border border-[var(--border-hover)] space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-[var(--foreground)] capitalize">
                                    {formatFeatureName(estimate.feature)}
                                </span>
                                <span className="text-xs text-amber-400 font-bold">
                                    {estimate.currentProgress}%
                                </span>
                            </div>

                            <div className="h-1.5 bg-[var(--border-hover)] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[var(--primary)] rounded-full"
                                    style={{ width: `${estimate.currentProgress}%` }}
                                />
                            </div>

                            <p className="text-xs text-[var(--muted-foreground)]">
                                {estimate.message}
                                {estimate.estimatedDaysUntilReady > 0 && (
                                    <span className="text-[var(--muted-foreground)]">
                                        {" "}
                                        • Ready in ~{estimate.estimatedDaysUntilReady} days
                                    </span>
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Tips */}
            <div className="pt-6 border-t border-[var(--border)]">
                <h3 className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-4">
                    While You Wait
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <TipCard
                        title="Make Sales"
                        description="Every order adds to your Brand DNA"
                    />
                    <TipCard
                        title="Add Products"
                        description="More products = better catalog analysis"
                    />
                    <TipCard
                        title="Complete Profile"
                        description="Fill in your brand details for better predictions"
                    />
                </div>
            </div>
        </div>
    );
}

function TipCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="p-4 rounded-xl bg-[var(--foreground)]/5 border border-[var(--border-hover)]">
            <h4 className="text-sm font-bold text-[var(--foreground)] mb-1">{title}</h4>
            <p className="text-xs text-[var(--muted-foreground)]">{description}</p>
        </div>
    );
}

// ============================================
// DNA COMPLETENESS ALERT
// ============================================

interface MissingField {
    field: string;
    section: string;
    importance: "critical" | "important" | "nice_to_have";
    question: string;
}

interface DNACompletenessAlertProps {
    completeness: {
        overallScore: number;
        isActionable: boolean;
        userActionRequired: MissingField[];
        dataRequired: Array<{
            field: string;
            message: string;
            action: string;
        }>;
    };
    onFillField: (field: string) => void;
}

export function DNACompletenessAlert({
    completeness,
    onFillField,
}: DNACompletenessAlertProps) {
    const { overallScore, isActionable, userActionRequired, dataRequired } =
        completeness;

    // Don't show if DNA is complete
    if (overallScore >= 90 && userActionRequired.length === 0) {
        return null;
    }

    const criticalMissing = userActionRequired.filter(
        (f) => f.importance === "critical"
    );
    const importantMissing = userActionRequired.filter(
        (f) => f.importance === "important"
    );

    return (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-clash font-bold text-[var(--foreground)]">
                            Brand DNA: {overallScore}% Complete
                        </h3>
                        <p className="text-sm text-[var(--muted-foreground)]">
                            {isActionable
                                ? "We can make predictions, but more data improves accuracy"
                                : "Complete required fields to unlock predictions"}
                        </p>
                    </div>
                </div>

                {/* Progress Ring */}
                <div className="relative w-16 h-16">
                    <svg className="w-full h-full -rotate-90">
                        <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-[var(--foreground)]/10"
                        />
                        <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray={`${overallScore * 1.76} 176`}
                            className="text-amber-500"
                        />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[var(--foreground)]">
                        {overallScore}%
                    </span>
                </div>
            </div>

            {/* Critical Missing Fields */}
            {criticalMissing.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-rose-400">
                        Required to Continue
                    </h4>
                    <div className="space-y-2">
                        {criticalMissing.map((field) => (
                            <button
                                key={field.field}
                                onClick={() => onFillField(field.field)}
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all group"
                            >
                                <span className="text-sm text-[var(--foreground)] font-medium">
                                    {field.question}
                                </span>
                                <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Important Missing Fields */}
            {importantMissing.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400">
                        Recommended for Better Predictions
                    </h4>
                    <div className="space-y-2">
                        {importantMissing.slice(0, 3).map((field) => (
                            <button
                                key={field.field}
                                onClick={() => onFillField(field.field)}
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--foreground)]/5 border border-[var(--border-hover)] hover:bg-[var(--border-hover)] transition-all group"
                            >
                                <span className="text-sm text-slate-300">{field.question}</span>
                                <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform" />
                            </button>
                        ))}
                        {importantMissing.length > 3 && (
                            <p className="text-xs text-[var(--muted-foreground)] text-center">
                                +{importantMissing.length - 3} more fields to improve accuracy
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Data Required Notice */}
            {dataRequired.length > 0 && (
                <div className="pt-4 border-t border-[var(--border)] space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                        Awaiting Store Data
                    </h4>
                    {dataRequired.slice(0, 2).map((item) => (
                        <div key={item.field} className="flex items-start gap-3 text-sm">
                            <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-[var(--muted-foreground)]">{item.message}</p>
                                <p className="text-[var(--muted-foreground)] text-xs mt-1">{item.action}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ============================================
// HELPERS
// ============================================

function formatRelativeDate(date: Date): string {
    const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Soon";
    if (days === 1) return "Tomorrow";
    if (days < 7) return `In ${days} days`;
    if (days < 30) return `In ${Math.ceil(days / 7)} weeks`;
    return `In ${Math.ceil(days / 30)} months`;
}

function formatFeatureName(feature: string): string {
    return feature
        .replace(/([A-Z])/g, " $1")
        .replace(/_/g, " ")
        .trim();
}
