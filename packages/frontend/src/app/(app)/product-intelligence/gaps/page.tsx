import { getConnectedShop } from "@brandmind/backend/auth/session";
import { prisma } from "@brandmind/shared";
import { redirect } from "next/navigation";

import {
  ScanSearch,
  Target
} from "lucide-react";
import { formatCurrency } from "@/lib/formatter";
import { GapDossier } from "./GapDossier";

export default async function GapsPage() {
  const shopDomain = await getConnectedShop();

  if (!shopDomain) {
    redirect("/onboarding");
  }

  const shop = await prisma.shop.findUnique({ where: { shopDomain } });

  if (!shop) {
    redirect("/onboarding");
  }

  const gaps = await prisma.catalogGap.findMany({
    where: { shopId: shop.id, status: "active" },
    orderBy: { confidence: "desc" },
  });

  const currencyCode = (shop as any).currencyCode || "USD";

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-muted)] border border-[var(--primary-border)] text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider">
            <ScanSearch className="w-3 h-3" />
            Intelligence Module / Gap Detection
          </div>
          <h1 className="text-5xl lg:text-6xl font-clash font-bold tracking-tight text-[var(--foreground)]">
            Market <span className="text-[var(--primary)] text-glow-amber">Gaps</span>
          </h1>
          <p className="text-[var(--muted-foreground)] max-w-lg text-lg font-medium leading-relaxed italic">
            Identifying underserved pricing bands and category adjacencies where your catalog is structurally exposed or missing volume.
          </p>
        </div>

        <form action="/api/intelligence/gaps" method="POST">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] font-clash font-bold text-sm transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(245,158,11,0.2)]"
          >
            <ScanSearch className="w-4 h-4" />
            Initialize Deep Scan
          </button>
        </form>
      </div>

      {gaps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gaps.map((gap) => (
            <GapDossier key={gap.id} gap={gap} currencyCode={currencyCode} />
          ))}
        </div>
      ) : (
        <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-[2.5rem] p-24 text-center space-y-6">
          <Target className="w-16 h-16 text-[var(--muted)] mx-auto" />
          <div className="space-y-2">
            <p className="text-xl font-clash font-bold text-[var(--foreground)]">No Strategic Gaps Identified</p>
            <p className="text-[var(--muted-foreground)] max-w-sm mx-auto italic">Your current catalog architecture is aligned with detected market patterns. Run a fresh scan to check for new volatility.</p>
          </div>
        </div>
      )}
    </div>
  );
}
