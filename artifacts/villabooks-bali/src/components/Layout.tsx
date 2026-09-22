import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Menu, X, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/Logo";

const WA = "https://wa.me/6281237402292";
const wa = (msg: string) => `${WA}?text=${encodeURIComponent(msg)}`;

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
];

function smoothScroll(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith("#")) return;
  e.preventDefault();
  const el = document.querySelector(href);
  if (el) {
    const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 80;
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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-black/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-5 md:px-8 max-w-7xl flex items-center justify-between">
          <a
            href="#top"
            onClick={(e) => smoothScroll(e, "#top")}
            className="flex items-center group relative z-50"
            aria-label="Bali Accounting — home"
          >
            <Logo
              variant="full"
              onDark={false}
              iconClassName="w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1 bg-white/50 backdrop-blur-md rounded-full px-2 py-1.5 border border-black/5 shadow-sm">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => smoothScroll(e, l.href)}
                  className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-black/5 rounded-full transition-all duration-300"
                >
                  {l.label}
                </a>
              ))}
            </div>
            
            <a
              href={wa("Hi Abel, I want to talk about accounting for my Bali villa.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/90 px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 active:scale-95 transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" /> Let's Talk
            </a>
          </nav>

          {/* Mobile: WhatsApp + menu */}
          <div className="md:hidden flex items-center gap-3 relative z-50">
            <a
              href={wa("Hi Abel, I want to talk about accounting for my Bali villa.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-md active:scale-95 transition-all"
            >
               Chat
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-black/5 text-foreground hover:bg-black/10 transition-colors"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full left-0 right-0 md:hidden bg-white/95 backdrop-blur-xl border-b border-black/5 shadow-xl origin-top"
            >
              <nav className="container mx-auto px-5 py-6 flex flex-col gap-2">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={(e) => { smoothScroll(e, l.href); setOpen(false); }}
                    className="px-4 py-3 text-lg font-medium text-foreground/80 hover:bg-black/5 hover:text-primary rounded-xl transition-colors"
                  >
                    {l.label}
                  </a>
                ))}
                
                <div className="mt-4 pt-4 border-t border-black/5 flex flex-col gap-3">
                  <div className="flex items-start gap-3 text-sm text-foreground/60 px-4">
                    <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span>Jl. Tukad Barito Timur III No.16, Panjer, Denpasar Selatan</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground/60 px-4">
                    <Phone className="w-4 h-4 text-secondary shrink-0" />
                    <span>+62 812-3740-2292</span>
                  </div>
                </div>

                <a
                  href={wa("Hi Abel, I want to talk about accounting for my Bali villa.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="mt-4 mx-4 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe5e] px-4 text-base font-bold text-white shadow-lg shadow-[#25D366]/30 active:scale-95 transition-all"
                >
                  <MessageCircle className="w-5 h-5" /> WhatsApp Abel Now
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main id="top" className="flex-1">{children}</main>

      {/* FOOTER */}
      <footer className="bg-primary text-primary-foreground pt-20 pb-8 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="container mx-auto px-5 md:px-8 max-w-7xl relative z-10">
          <div className="grid gap-12 md:grid-cols-12 mb-16">
            <div className="md:col-span-5">
              <div className="mb-6">
                <Logo variant="full" onDark={true} iconClassName="w-10 h-10" textClassName="text-2xl" />
              </div>
              <p className="text-base text-primary-foreground/70 leading-relaxed mb-8 max-w-sm font-sans">
                Professional Bali villa bookkeeping services in Denpasar. Run personally by Abel Yuniartini, delivering precise monthly financial clarity for villa owners across the island.
              </p>
              <a
                href={wa("Hi Abel, I want to talk about accounting for my Bali villa.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe5e] px-6 text-sm font-bold text-white shadow-lg shadow-[#25D366]/20 transition-all hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
              </a>
            </div>
            
            <div className="md:col-span-3">
              <h4 className="text-sm font-bold uppercase tracking-widest text-primary-foreground mb-6 font-sans">Contact</h4>
              <div className="space-y-4 text-sm font-sans">
                <a
                  href={wa("Hi Abel, quick question about my Bali villa.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-primary-foreground/70 hover:text-white transition-colors group"
                >
                  <Phone className="w-4 h-4 shrink-0 mt-0.5 text-secondary group-hover:scale-110 transition-transform" />
                  <span>+62 812-3740-2292<br/><span className="text-xs opacity-70">(WhatsApp & Call)</span></span>
                </a>
                <a
                  href="https://maps.google.com/?q=Jl.+Tukad+Barito+Timur+III+No.16,+Panjer,+Denpasar+Selatan,+Bali"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-primary-foreground/70 hover:text-white transition-colors group"
                >
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-secondary group-hover:scale-110 transition-transform" />
                  <span>Jl. Tukad Barito Timur III No.16,<br />Panjer, Denpasar Selatan,<br />Bali 80226</span>
                </a>
              </div>
            </div>
            
            <div className="md:col-span-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-primary-foreground mb-6 font-sans">Compliance & Trust</h4>
              <p className="text-sm text-primary-foreground/50 leading-relaxed font-sans">
                Bali Accounting provides bookkeeping and financial reporting services. We organize your financial records for clarity and operational health. Our reports are for owner information and do not constitute official tax filings or legal advice. For formal Indonesian tax filings, we coordinate directly with licensed Konsultan Pajak registered with DJP.
              </p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-sans text-primary-foreground/40">
            <span>© {new Date().getFullYear()} Bali Accounting. All rights reserved.</span>
            <span>Made in Denpasar, Bali.</span>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP — visible mostly on mobile when scrolled */}
      <AnimatePresence>
        {scrolled && (
          <motion.a
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            href={wa("Hi Abel, I want to talk about accounting for my Bali villa.")}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5e] text-white rounded-full shadow-2xl shadow-[#25D366]/40 transition-all hover:scale-105 active:scale-95 md:hidden"
            aria-label="Chat on WhatsApp"
          >
            <span className="flex items-center justify-center w-14 h-14">
              <MessageCircle className="w-6 h-6" />
            </span>
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}