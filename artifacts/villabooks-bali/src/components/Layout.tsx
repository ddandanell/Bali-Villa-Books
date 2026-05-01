import { ReactNode } from "react";
import { Link } from "wouter";
import { MessageCircle, MapPin, Phone, Mail } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-primary">VillaBooks Bali</span>
            <span className="hidden sm:block text-xs text-muted-foreground border-l border-border/60 pl-2 ml-1">Bali Villa Accounting Service</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/services" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Services</Link>
            <Link href="/sample-report" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Sample Report</Link>
            <Link href="/faq" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">FAQ</Link>
            <Link href="/about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">About</Link>
            <a
              href="https://wa.me/6281237402292"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Book a Review
            </a>
          </nav>
          <a
            href="https://wa.me/6281237402292"
            target="_blank"
            rel="noopener noreferrer"
            className="md:hidden inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow"
          >
            Book Now
          </a>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-primary text-primary-foreground pt-16 pb-8 mt-20">
        <div className="container mx-auto px-4 grid gap-10 md:grid-cols-2 lg:grid-cols-4 mb-10">
          <div className="lg:col-span-1">
            <h3 className="font-serif text-xl font-bold mb-2">VillaBooks Bali</h3>
            <p className="text-primary-foreground/70 text-sm mb-4">Bali Villa Accounting Service</p>
            <p className="text-primary-foreground/60 text-xs leading-relaxed">
              Bookkeeping, financial reporting, OTA reconciliation, and expense control — built for foreign villa owners in Bali.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Navigate</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              <Link href="/services" className="hover:text-white transition-colors">Services & Pricing</Link>
              <Link href="/sample-report" className="hover:text-white transition-colors">Sample Report</Link>
              <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
              <Link href="/about" className="hover:text-white transition-colors">Our Team</Link>
              <Link href="/get-started" className="hover:text-white transition-colors">Get Started</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <a
                href="https://wa.me/6281237402292"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0 mt-0.5" />
                <span>+62 812-3740-2292</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Jl. Tukad Barito Timur III No.16, Panjer, Denpasar Selatan, Kota Denpasar, Bali 80226</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Compliance</h4>
            <p className="text-xs text-primary-foreground/55 leading-relaxed">
              VillaBooks Bali is a bookkeeping and financial reporting service. We organize your financial records and prepare them for review by a licensed professional. Our reports are for owner information only and do not constitute official tax filings or legal advice. For Indonesian tax filings and legal compliance, we coordinate with and refer to licensed Konsultan Pajak registered with DJP.
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/50">
          <span>©2025 VillaBooks Bali — Bali Villa Accounting Service. All rights reserved.</span>
          <span>Denpasar, Bali, Indonesia</span>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/6281237402292?text=Hi%2C%20I%27d%20like%20to%20book%20a%20confidential%20accounting%20review%20for%20my%20Bali%20villa."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#1ebe5e] transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <span className="flex items-center gap-2 px-4 py-3 text-sm font-semibold">
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:block">WhatsApp Us</span>
        </span>
      </a>
    </div>
  );
}
