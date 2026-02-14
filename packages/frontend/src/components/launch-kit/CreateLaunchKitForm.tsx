"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Rocket, Plus, X } from "lucide-react";

const PRODUCT_TYPES = [
  "Apparel",
  "Accessories",
  "Beauty",
  "Electronics",
  "Food & Beverage",
  "Home & Living",
  "Sports & Outdoors",
  "Toys & Games",
  "General",
];

export function CreateLaunchKitForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("General");
  const [targetPrice, setTargetPrice] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productName.trim() || !targetPrice) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/agents/launch-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: productName.trim(),
          productType,
          targetPrice: Number(targetPrice),
          description: description.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate launch kit");

      setOpen(false);
      setProductName("");
      setProductType("General");
      setTargetPrice("");
      setDescription("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] font-clash font-bold text-sm transition-all shadow-[0_10px_30px_-10px_rgba(245,158,11,0.4)]"
      >
        <Plus className="w-4 h-4" />
        New Launch Kit
      </button>
    );
  }

  return (
    <div className="bg-[var(--background-card)] border border-white/10 rounded-[2rem] p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary-muted)] border border-[var(--primary-border)] flex items-center justify-center">
            <Rocket className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="text-lg font-clash font-bold text-[var(--foreground)]">New Launch Kit</h3>
            <p className="text-xs text-[var(--muted-foreground)]">Generate strategy for any product</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-slate-600 hover:text-[var(--foreground)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
              Product Name *
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Summer Linen Shirt"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--foreground)] text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
              Product Type
            </label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--foreground)] text-sm focus:outline-none focus:border-amber-500/50 transition-colors appearance-none"
            >
              {PRODUCT_TYPES.map((t) => (
                <option key={t} value={t} className="bg-[var(--background-card)]">
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
              Target Price *
            </label>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="e.g. 89"
              min="0.01"
              step="0.01"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--foreground)] text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
            Description <span className="text-slate-600 normal-case font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief product description for better copy generation..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--foreground)] text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 font-medium">{error}</p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || !productName.trim() || !targetPrice}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-clash font-bold text-sm transition-all shadow-[0_4px_15px_rgba(124,58,237,0.3)]"
          >
            <Rocket className="w-4 h-4" />
            {loading ? "Generating..." : "Generate Launch Kit"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-6 py-3 rounded-xl text-slate-400 hover:text-[var(--foreground)] font-clash font-bold text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
