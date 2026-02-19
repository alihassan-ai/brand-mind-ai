"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { Loader2, Database, CheckCircle2, AlertCircle } from "lucide-react";

export default function SyncingPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"syncing" | "completed" | "failed">("syncing");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 10, 95));
    }, 2000);

    // Poll sync status every 5 seconds
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch("/api/sync/status");
        if (res.ok) {
          const data = await res.json();

          if (data.syncStatus === "COMPLETED") {
            setStatus("completed");
            setProgress(100);
            clearInterval(pollInterval);
            clearInterval(progressInterval);

            // Redirect to command center after 2 seconds
            setTimeout(() => {
              router.push("/command-center");
            }, 2000);
          } else if (data.syncStatus === "FAILED") {
            setStatus("failed");
            clearInterval(pollInterval);
            clearInterval(progressInterval);
          }
        }
      } catch (err) {
        console.error("Failed to poll sync status:", err);
      }
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(pollInterval);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative text-center w-full max-w-lg animate-scale-in">
        <div className="flex justify-center mb-10">
          <BrandLogo size="lg" />
        </div>

        <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-10">
          {status === "syncing" && (
            <>
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Database className="w-16 h-16 text-[var(--primary)]" />
                  <Loader2 className="w-6 h-6 text-[var(--primary)] animate-spin absolute -top-1 -right-1" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                Syncing Your Store Data
              </h1>
              <p className="text-[var(--muted-foreground)] text-sm mb-8">
                We're importing your products, orders, and customers from Shopify.
                <br />This usually takes 2-5 minutes.
              </p>

              <div className="w-full bg-[var(--background-surface)] rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className="bg-[var(--primary)] h-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-xs text-[var(--muted)] animate-pulse">
                {progress < 30 && "Connecting to Shopify..."}
                {progress >= 30 && progress < 60 && "Importing products..."}
                {progress >= 60 && progress < 90 && "Syncing orders..."}
                {progress >= 90 && "Almost done..."}
              </p>
            </>
          )}

          {status === "completed" && (
            <>
              <div className="flex justify-center mb-6">
                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
              </div>

              <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                Sync Complete!
              </h1>
              <p className="text-[var(--muted-foreground)] text-sm">
                Redirecting to your Command Center...
              </p>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="flex justify-center mb-6">
                <AlertCircle className="w-16 h-16 text-rose-500" />
              </div>

              <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                Sync Failed
              </h1>
              <p className="text-[var(--muted-foreground)] text-sm mb-6">
                We couldn't complete the sync. Please check your Shopify connection and try again.
              </p>

              <button
                onClick={() => router.push("/command-center")}
                className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] font-semibold rounded-xl transition-all"
              >
                Go to Dashboard
              </button>
            </>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-[var(--muted-foreground)]">
          You can safely close this page. We'll continue syncing in the background.
        </p>
      </div>
    </div>
  );
}
