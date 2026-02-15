"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Loader2, Lock, CheckCircle2, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Reset token is missing.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to reset password");
                return;
            }

            setSuccess(true);
            setTimeout(() => router.push("/auth/login"), 3000);
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (!token) {
        return (
            <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-8 text-center space-y-6">
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-rose-500" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Invalid link</h2>
                    <p className="text-sm text-[var(--muted-foreground)]">This password reset link is invalid or has expired.</p>
                </div>
                <Link
                    href="/auth/forgot-password"
                    className="block w-full h-11 bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold rounded-xl flex items-center justify-center"
                >
                    Request new link
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-8 text-center space-y-6">
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Password reset!</h2>
                    <p className="text-sm text-[var(--muted-foreground)]">Your password has been successfully updated. Redirecting to sign in...</p>
                </div>
                <Link
                    href="/auth/login"
                    className="block w-full h-11 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] font-semibold rounded-xl flex items-center justify-center"
                >
                    Sign in now
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-8 space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-[var(--foreground)]">Set new password</h1>
                <p className="text-sm text-[var(--muted-foreground)]">Please enter your new password below.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-[var(--muted-foreground)]">
                        New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Lock className="w-4 h-4 text-[var(--muted)]" />
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            min={8}
                            className="w-full h-11 pl-10 pr-4 bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--primary)]/50 focus:ring-1 focus:ring-[var(--primary)]/30 transition-all"
                            placeholder="Min. 8 characters"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--muted-foreground)]">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Lock className="w-4 h-4 text-[var(--muted)]" />
                        </div>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full h-11 pl-10 pr-4 bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--primary)]/50 focus:ring-1 focus:ring-[var(--primary)]/30 transition-all"
                            placeholder="Confirm your new password"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--primary-foreground)] font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Resetting password...
                        </>
                    ) : (
                        "Reset password"
                    )}
                </button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="w-full max-w-md relative animate-slide-up">
                <div className="flex justify-center mb-10">
                    <Link href="/">
                        <BrandLogo size="lg" />
                    </Link>
                </div>

                <Suspense fallback={
                    <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-12 flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                        <p className="text-[var(--muted-foreground)]">Loading...</p>
                    </div>
                }>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
