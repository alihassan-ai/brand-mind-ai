"use client";

import { useState } from "react";
import { User, Shield, Store, Save, Lock, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export function SettingsForms({ user, shop, metaConnected, metaAdAccountName }: { user: any; shop: any, metaConnected?: boolean, metaAdAccountName?: string | null }) {
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileStatus, setProfileStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordStatus, setPasswordStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileStatus(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch("/api/settings/profile", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });
            const result = await res.json();

            if (result.success) {
                setProfileStatus({ type: "success", message: "Profile updated successfully!" });
            } else {
                setProfileStatus({ type: "error", message: result.error || "Failed to update profile" });
            }
        } catch (err) {
            setProfileStatus({ type: "error", message: "An unexpected error occurred" });
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordStatus(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (data.newPassword !== data.confirmPassword) {
            setPasswordStatus({ type: "error", message: "New passwords do not match" });
            setPasswordLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/settings/password", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });
            const result = await res.json();

            if (result.success) {
                setPasswordStatus({ type: "success", message: "Password updated successfully!" });
                (e.target as HTMLFormElement).reset();
            } else {
                setPasswordStatus({ type: "error", message: result.error || "Failed to update password" });
            }
        } catch (err) {
            setPasswordStatus({ type: "error", message: "An unexpected error occurred" });
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Forms */}
            <div className="lg:col-span-2 space-y-8">
                {/* Profile Section */}
                <section className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <User className="w-6 h-6 text-blue-400" />
                        <h2 className="text-2xl font-clash font-bold">Profile Identity</h2>
                    </div>

                    <form className="space-y-4" onSubmit={handleProfileSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--muted-foreground)]">Full Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    defaultValue={user.name || ""}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-all outline-none"
                                    placeholder="Enter your name"
                                    disabled={profileLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--muted-foreground)]">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={user.email}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-all outline-none"
                                    placeholder="name@company.com"
                                    disabled={profileLoading}
                                />
                            </div>
                        </div>

                        {profileStatus && (
                            <div className={`flex items-center gap-2 p-4 rounded-xl text-sm ${profileStatus.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                }`}>
                                {profileStatus.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                {profileStatus.message}
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={profileLoading}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--primary-foreground)] font-clash font-bold text-sm transition-all duration-300"
                            >
                                {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Identity Changes
                            </button>
                        </div>
                    </form>
                </section>

                {/* Security Section */}
                <section className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-rose-400" />
                        <h2 className="text-2xl font-clash font-bold">Security & Access</h2>
                    </div>

                    <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--muted-foreground)]">Current Password</label>
                            <input
                                name="currentPassword"
                                type="password"
                                className="w-full max-w-md px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all outline-none"
                                disabled={passwordLoading}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--muted-foreground)]">New Password</label>
                                <input
                                    name="newPassword"
                                    type="password"
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all outline-none"
                                    disabled={passwordLoading}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--muted-foreground)]">Confirm New Password</label>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all outline-none"
                                    disabled={passwordLoading}
                                    required
                                />
                            </div>
                        </div>

                        {passwordStatus && (
                            <div className={`flex items-center gap-2 p-4 rounded-xl text-sm ${passwordStatus.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                }`}>
                                {passwordStatus.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                {passwordStatus.message}
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-clash font-bold text-sm transition-all duration-300"
                            >
                                {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                Update Security Credentials
                            </button>
                        </div>
                    </form>
                </section>
            </div>

            {/* Right Column: Info */}
            <div className="space-y-8">
                {/* Connected Interfaces */}
                <section className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <Store className="w-6 h-6 text-amber-400" />
                        <h2 className="text-xl font-clash font-bold">Connected Interfaces</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Shopify (Always Connected) */}
                        <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#95BF47]/20 flex items-center justify-center">
                                    <Store className="w-5 h-5 text-[#95BF47]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Shopify Store</h4>
                                    <p className="text-xs text-[var(--muted-foreground)]">{shop?.shopDomain || "Connected"}</p>
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#95BF47] bg-[#95BF47]/10 px-2 py-1 rounded-full border border-[#95BF47]/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#95BF47] animate-pulse" />
                                CONNECTED
                            </div>
                        </div>

                        {/* Meta Ads */}
                        <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#1877F2]/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Meta Ads</h4>
                                    <p className="text-xs text-[var(--muted-foreground)]">
                                        {metaConnected ? (metaAdAccountName || "Account Linked") : "Connect to Sync Ads"}
                                    </p>
                                </div>
                            </div>

                            {metaConnected ? (
                                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#1877F2] bg-[#1877F2]/10 px-2 py-1 rounded-full border border-[#1877F2]/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2]" />
                                    CONNECTED
                                </div>
                            ) : (
                                <a href="/api/auth/meta" className="text-[10px] font-bold text-white bg-[#1877F2] hover:bg-[#166fe5] px-3 py-1.5 rounded-lg transition-colors">
                                    CONNECT
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="pt-2">
                        <p className="text-xs text-[var(--muted-foreground)]">
                            Integrations allow BrandMindAI to sync your data for deeper intelligence.
                            <br /><span className="text-emerald-400">Shopify is mandatory</span> and cannot be disconnected.
                        </p>
                    </div>
                </section>

                <section className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                    <h3 className="text-lg font-clash font-bold mb-2">Need Support?</h3>
                    <p className="text-sm text-[var(--muted-foreground)] mb-6 italic leading-relaxed">
                        If you have any issues with your account or shop connection, our team is ready to help at the Command Center.
                    </p>
                    <button className="w-full py-4 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-clash font-bold text-sm hover:opacity-90 transition-all">
                        Contact Tech Support
                    </button>
                </section>
            </div>
        </div>
    );
}
