import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrandMindAI",
  description: "AI-powered e-commerce intelligence platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        {children}
      </body>
    </html>
  );
}
