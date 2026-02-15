"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { Loader2, User, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CompleteProfilePage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/complete-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to update profile");
                return;
            }

            router.push("/onboarding");
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="w-full max-w-md relative animate-slide-up">
                {/* Logo */}
                <div className="flex justify-center mb-10">
                    <Link href="/">
                        <BrandLogo size="lg" />
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                            Email Verified Successfully
                        </div>
                        <h1 className="text-2xl font-bold text-[var(--foreground)]">Complete your profile</h1>
                        <p className="text-sm text-[var(--muted-foreground)]">Almost there! Tell us who you are.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-[var(--muted-foreground)]">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <User className="w-4 h-4 text-[var(--muted)]" />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full h-11 pl-10 pr-4 bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--primary)]/50 focus:ring-1 focus:ring-[var(--primary)]/30 transition-all font-medium"
                                    placeholder="E.g. Alexander Hamilton"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !name}
                            className="w-full h-11 bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--primary-foreground)] font-semibold rounded-xl transition-all duration-200 shadow-[var(--shadow-primary)] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Finalizing...
                                </>
                            ) : (
                                <>
                                    Complete Setup
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-[var(--muted-foreground)] text-xs mt-8 uppercase tracking-widest font-bold opacity-30">
                    Personalizing Your Executive Dashboard
                </p>
            </div>
        </div>
    );
}
