import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Menu, X, Phone, MapPin } from "lucide-react";

const WA = "https://wa.me/6281237402292";
const wa = (msg: string) => `${WA}?text=${encodeURIComponent(msg)}`;

const NAV_LINKS = [
  { label: "How It Works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

function smoothScroll(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith("#")) return;
  e.preventDefault();
  const el = document.querySelector(href);
  if (el) {
    const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      {/* DARK CONTRAST NAV */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0b1f1c]/95 backdrop-blur-md shadow-lg shadow-black/20"
            : "bg-[#0b1f1c]/80 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-[72px] flex items-center justify-between">
          <a
            href="#top"
            onClick={(e) => smoothScroll(e, "#top")}
            className="flex items-center gap-2 group"
          >
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-secondary flex items-center justify-center font-bold text-secondary-foreground text-sm shadow-md group-hover:scale-105 transition-transform">VB</span>
            <span className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">VillaBooks <span className="text-secondary">Bali</span></span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => smoothScroll(e, l.href)}
                className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-md transition-all"
              >
                {l.label}
              </a>
            ))}
            <a
              href={wa("Hi Abel, I want to talk about accounting for my Bali villa.")}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#25D366] hover:bg-[#1ebe5e] px-4 text-sm font-bold text-white shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Us
            </a>
          </nav>

          {/* Mobile: WhatsApp + menu */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href={wa("Hi Abel, I want to talk about accounting for my Bali villa.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#25D366] hover:bg-[#1ebe5e] px-3 text-sm font-bold text-white shadow-md active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4" /> Chat
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="w-10 h-10 inline-flex items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-[#0b1f1c] border-t border-white/10"
            >
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={(e) => { smoothScroll(e, l.href); setOpen(false); }}
                    className="px-3 py-3 text-base font-medium text-white/85 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href={wa("Hi Abel, I want to talk about accounting for my Bali villa.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1ebe5e] px-4 text-base font-bold text-white shadow-md active:scale-95 transition-all"
                >
                  <MessageCircle className="w-5 h-5" /> WhatsApp Now
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main id="top" className="flex-1 pt-16 sm:pt-[72px]">{children}</main>

      {/* FOOTER */}
      <footer className="bg-[#0b1f1c] text-white/80 pt-14 pb-6">
        <div className="container mx-auto px-4 sm:px-6 grid gap-8 md:grid-cols-3 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center font-bold text-secondary-foreground text-sm">VB</span>
              <span className="font-serif text-xl font-bold text-white">VillaBooks <span className="text-secondary">Bali</span></span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Bookkeeping for Bali villa owners. Clear monthly reports. Real numbers. Zero stress.
            </p>
            <a
              href={wa("Hi Abel, I want to talk about accounting for my Bali villa.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#25D366] hover:bg-[#1ebe5e] px-5 text-sm font-bold text-white shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <a href={wa("Hi Abel, quick question about my Bali villa.")} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-white/70 hover:text-white transition-colors">
                <Phone className="w-4 h-4 shrink-0 mt-0.5 text-secondary" />
                <span>+62 812-3740-2292 (WhatsApp)</span>
              </a>
              <div className="flex items-start gap-2 text-white/70">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-secondary" />
                <span>Jl. Tukad Barito Timur III No.16,<br/>Panjer, Denpasar Selatan, Bali 80226</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Compliance</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              VillaBooks Bali is a bookkeeping and financial reporting service. We organize your financial records and prepare them for review by a licensed professional. Our reports are for owner information only and do not constitute official tax filings or legal advice. For Indonesian tax filings we coordinate with licensed Konsultan Pajak registered with DJP.
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>© 2025 VillaBooks Bali. All rights reserved.</span>
          <span>Made in Denpasar, Bali</span>
        </div>
      </footer>

      {/* FLOATING WHATSAPP — mobile-prominent */}
      <a
        href={wa("Hi Abel, I want to talk about accounting for my Bali villa.")}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5e] text-white rounded-full shadow-2xl shadow-[#25D366]/40 transition-all hover:scale-105 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <span className="flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 text-sm font-bold">
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline">WhatsApp Us</span>
        </span>
      </a>
    </div>
  );
}
