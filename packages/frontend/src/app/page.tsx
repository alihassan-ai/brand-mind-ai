import { getCurrentUser } from "@brandmind/backend/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PublicDemo } from "@/components/PublicDemo";
import { BrandLogo } from "@/components/BrandLogo";
import {
  TrendingUp,
  Target,
  Network,
  BarChart3,
  Sparkles,
  Zap,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen selection:bg-[var(--primary)]/30">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-[var(--border)] glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <BrandLogo />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Intelligence</Link>
            <Link href="#demo" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Live Demo</Link>
            <Button asChild variant="outline" size="sm">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-28 overflow-hidden px-4 sm:px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[var(--primary)]/8 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-8">
          <Badge variant="secondary" className="px-4 py-1.5">
            <Globe className="w-3 h-3 mr-2" />
            The Global Business Intelligence OS
          </Badge>

          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
              Instant Brand{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[var(--primary)] to-amber-200 bg-[length:200%_auto] animate-gradient-flow text-glow-amber">
                Intelligence.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
              BrandMindAI transforms public storefront data into immediate strategic insights. Try our live analysis engine below with any public domain.
            </p>
          </div>

          <div id="demo" className="mt-16 pt-8">
            <PublicDemo />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Enterprise Architecture</h2>
            <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">
              Proprietary logic paths designed for rapid operational scaling and market dominance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Network className="w-7 h-7 text-blue-400" />}
              title="Store DNA Extractor"
              description="Analyzes 50+ unique data signals to map your brand's specific price sweet-spots, customer velocity, and catalog health."
            />
            <FeatureCard
              icon={<TrendingUp className="w-7 h-7 text-emerald-400" />}
              title="Forward-Looking Hits"
              description="Predicts your next best-selling product launch by correlating internal DNA with global trends using our proprietary forecasting model."
            />
            <FeatureCard
              icon={<Target className="w-7 h-7 text-purple-400" />}
              title="Market Gap Detection"
              description="Precisely identifies underserved categories and price bands in your industry that are currently being missed by your existing catalog."
            />
          </div>
        </div>
      </section>

      {/* Value Prop */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Leading from the{" "}
              <span className="text-[var(--primary)]">Control Room.</span>
            </h2>
            <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
              We don&apos;t just provide analytics; we provide a decision-ready operating system. The Executive Terminal gives you a consolidated view of momentum, quality, and risk in real-time.
            </p>
            <div className="space-y-3">
              {[
                "Replace daily Shopify analytics usage entirely.",
                "Identify operational risk before it impacts revenue.",
                "Sustainable growth modeling (New vs Repeat share)."
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-[var(--foreground)]/80">
                  <Zap className="w-4 h-4 text-[var(--primary)] shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--background-card)] border border-[var(--border)] p-8 aspect-square flex items-center justify-center relative overflow-hidden">
            <div className="w-full max-w-[300px] h-[300px] bg-[var(--primary)]/5 blur-[100px] absolute rounded-full" />
            <BarChart3 className="w-24 h-24 text-[var(--primary)]/20" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-4 sm:px-6 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Ready to transcend{" "}
            <br className="hidden md:block" />
            standard analytics?
          </h2>
          <Button asChild size="lg" className="rounded-xl px-10 py-6 text-base">
            <Link href="/auth/signup">Get Started with BrandMindAI</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[var(--muted-foreground)] text-xs">
          <div>&copy; 2026 BrandMindAI. All Rights Reserved.</div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Terms</Link>
            <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="group hover:border-[var(--border-hover)] transition-all duration-300 h-full flex flex-col">
      <CardHeader>
        <div className="mb-2 p-3 rounded-xl bg-[var(--foreground)]/5 border border-[var(--border)] group-hover:bg-[var(--primary-muted)] group-hover:border-[var(--primary-border)] transition-all w-fit">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-[var(--muted-foreground)] leading-relaxed text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
