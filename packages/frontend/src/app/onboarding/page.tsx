"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { SyncProgress } from "@/components/SyncProgress";
import { Store, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shopDomain, setShopDomain] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkRequirements() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/auth/login");
          return;
        }
        const data = await res.json();

        if (!data.user.emailVerified) {
          router.push("/auth/verify-email");
          return;
        }

        if (!data.user.name) {
          router.push("/auth/complete-profile");
          return;
        }

        // user authenticated
      } catch (err) {
        setError("Failed to verify account status.");
      } finally {
        setLoading(false);
      }
    }
    checkRequirements();
  }, [router]);

  const mode = searchParams.get("mode");
  const urlShop = searchParams.get("shop");
  const urlError = searchParams.get("error");

  useEffect(() => {
    if (urlError === "oauth_failed") {
      setError("Shopify authentication failed. Please try again.");
    } else if (urlError === "shop_already_connected") {
      setError("This store is already connected to another account. Please use a different store.");
    }
  }, [urlError]);

  useEffect(() => {
    async function checkRequirements() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/auth/login");
          return;
        }
        const data = await res.json();

        if (!data.user.emailVerified) {
          router.push("/auth/verify-email");
          return;
        }

        if (!data.user.name) {
          router.push("/auth/complete-profile");
          return;
        }

        // user authenticated
      } catch (err) {
        setError("Failed to verify account status.");
      } finally {
        setLoading(false);
      }
    }

    // Only check if we are NOT in the middle of a redirect or error state from URL
    if (!mode && !urlShop && !urlError) {
      checkRequirements();
    } else {
      setLoading(false);
    }
  }, [router, mode, urlShop, urlError]);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      setError("LOCALHOST_DETECTED");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  const [syncDone, setSyncDone] = useState(false);
  const [syncError, setSyncError] = useState("");

  useEffect(() => {
    if (mode !== "oauth_complete" || !urlShop) return;

    async function kickoffSync() {
      try {
        const res = await fetch("/api/sync", { method: "POST" });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setSyncError(body.error || "Sync failed. Please try again from the dashboard.");
        }
      } catch {
        setSyncError("Network error during sync. Please retry from the dashboard.");
      } finally {
        setSyncDone(true);
        router.push("/command-center");
      }
    }

    kickoffSync();
  }, [mode, urlShop, router]);

  if (mode === "oauth_complete" && urlShop) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative text-center w-full max-w-lg animate-scale-in">
          <div className="flex justify-center mb-10">
            <BrandLogo size="lg" />
          </div>

          <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-10">
            <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Initializing Intelligence</h1>
            <p className="text-[var(--muted-foreground)] text-sm mb-10">We&apos;re syncing your recent data and building your Brand DNA.</p>
            {syncError ? (
              <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{syncError}</span>
              </div>
            ) : (
              <SyncProgress shopDomain={urlShop} syncDone={syncDone} />
            )}
          </div>
        </div>
      </div>
    );
  }



  async function handleOAuthRedirect(e: React.FormEvent) {
    e.preventDefault();
    if (!shopDomain) return;

    setLoading(true);
    setError("");

    let domain = shopDomain.toLowerCase().trim();
    if (!domain.includes(".myshopify.com") && !domain.includes(".")) {
      domain = `${domain}.myshopify.com`;
    }

    window.location.href = `/api/auth/shopify?shop=${domain}`;
  }

  if (error === "LOCALHOST_DETECTED") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md relative text-center space-y-6 animate-scale-in bg-[var(--background-card)] border border-rose-500/20 p-8 rounded-2xl">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Incorrect Access Detected</h1>
            <p className="text-[var(--muted-foreground)] text-sm">
              Shopify App setup requires a secure public tunnel (ngrok) for cookie handshakes. <br />
              <strong className="text-rose-400">You are currently on localhost.</strong>
            </p>
          </div>

          <a
            href="https://odontological-predestinately-debbra.ngrok-free.dev/onboarding"
            className="block w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-rose-900/20"
          >
            Switch to Ngrok URL &rarr;
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

      <div className="w-full max-w-md relative animate-slide-up">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-8">
            <BrandLogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Connect Your Store</h1>
          <p className="text-[var(--muted-foreground)] text-sm">Transform your Shopify data into an Executive Decision Engine.</p>
        </div>

        <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-8">
          <form onSubmit={handleOAuthRedirect} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="shopDomain" className="block text-sm font-medium text-[var(--muted-foreground)]">
                Store URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Store className="w-4 h-4 text-[var(--muted)]" />
                </div>
                <input
                  id="shopDomain"
                  type="text"
                  value={shopDomain}
                  onChange={(e) => setShopDomain(e.target.value)}
                  placeholder="your-store.myshopify.com"
                  className="w-full h-12 pl-10 pr-4 bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--primary)]/50 focus:ring-1 focus:ring-[var(--primary)]/30 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !shopDomain}
              className="w-full h-12 bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--primary-foreground)] font-semibold rounded-xl transition-all duration-200 shadow-[var(--shadow-primary)] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redirecting to Shopify...
                </>
              ) : (
                <>
                  Connect with Shopify
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[10px] text-[var(--muted)] text-center uppercase tracking-wider font-medium">
              Secure 256-bit encrypted connection via Shopify OAuth
            </p>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-[var(--muted-foreground)]">
          New to BrandMindAI?{" "}
          <a href="/auth/signup" className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors">
            Start your journey
          </a>
        </p>
      </div>
    </div>
  );
}
