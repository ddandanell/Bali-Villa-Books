import { ReactNode } from "react";
import { Link } from "wouter";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold text-primary">
            VillaBooks Bali
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/services" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Services</Link>
            <Link href="/sample-report" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Sample Report</Link>
            <Link href="/faq" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">FAQ</Link>
            <Link href="/about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">About</Link>
            <Link href="/get-started" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-primary text-primary-foreground py-12 mt-20">
        <div className="container mx-auto px-4 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">VillaBooks Bali</h3>
            <p className="text-primary-foreground/80 text-sm">Your Bali villa, financially organized.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Navigation</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/80">
              <Link href="/services" className="hover:text-white transition-colors">Services</Link>
              <Link href="/sample-report" className="hover:text-white transition-colors">Sample Report</Link>
              <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
            </div>
          </div>
          <div className="lg:col-span-2">
            <h4 className="font-bold mb-4">Compliance</h4>
            <p className="text-xs text-primary-foreground/60 leading-relaxed">
              VillaBooks Bali is a bookkeeping and financial reporting service. We organize your financial records and prepare them for review by a licensed professional. Our reports are for owner information only and do not constitute official tax filings or legal advice. For Indonesian tax filings and legal compliance, we coordinate with and refer to licensed Konsultan Pajak registered with the Directorate General of Taxes (DJP).
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/60">
          ©2025 VillaBooks Bali. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
