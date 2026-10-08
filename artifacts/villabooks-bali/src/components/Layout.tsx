import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, Menu, MessageCircle, Phone, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { PHONE, whatsapp } from "@/lib/site-pages";
import { trackEvent } from "@/lib/analytics";

const NAV = [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Sample report", href: "/sample-report" },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/blog" },
];

function waClick(placement: string) {
  trackEvent("whatsapp_click", { page: typeof window === "undefined" ? "/" : window.location.pathname, placement });
  trackEvent("consultation_click", { page: typeof window === "undefined" ? "/" : window.location.pathname, placement });
}

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setOpen(false); }, [location]);
  useEffect(() => {
    if (!open) return;
    const prior = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); }
      if (event.key === "Tab" && panel.current) {
        const items = [...panel.current.querySelectorAll<HTMLElement>("a,button")].filter((item) => !item.hasAttribute("disabled"));
        if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[items.length - 1]?.focus(); }
        else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); items[0]?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); if (prior?.isConnected) prior.focus(); };
  }, [open]);

  return <div className="flex min-h-[100dvh] flex-col bg-background">
    <a href="#main-content" className="sr-only z-[100] rounded bg-white p-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${scrolled || open ? "border-primary/10 bg-background/95 shadow-sm backdrop-blur-md" : "border-transparent bg-background/80 backdrop-blur-sm"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <Link href="/" aria-label="Bali Accounting home" className="relative z-10 inline-flex items-center"><Logo variant="full" onDark={false} iconClassName="h-9 w-9" /></Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => <Link key={item.href} href={item.href} className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-primary/5 hover:text-secondary ${location === item.href ? "text-primary" : "text-foreground/70"}`}>{item.label}</Link>)}
          <Link href="/get-started" className="ml-2 rounded-full px-4 py-2 text-sm font-semibold text-foreground/70 transition-colors hover:bg-primary/5 hover:text-primary">Enquiry form</Link>
          <a onClick={() => waClick("header")} href={whatsapp()} target="_blank" rel="noreferrer" className="ml-1 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"><MessageCircle className="h-4 w-4" /> Free consultation</a>
        </nav>
        <div className="flex items-center gap-2 lg:hidden">
          <a onClick={() => waClick("mobile_header")} href={whatsapp()} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${PHONE}`} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"><MessageCircle className="h-4 w-4" /></a>
          <button ref={menuButton} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 text-primary">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && <nav ref={panel} id="mobile-navigation" aria-label="Mobile navigation" className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-primary/10 bg-background px-5 pb-6 pt-3 shadow-xl lg:hidden">
        {NAV.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block border-b border-primary/10 py-4 text-lg font-medium text-primary">{item.label}</Link>)}
        <div className="mt-5 flex flex-col gap-3">
          <Link href="/get-started" onClick={() => setOpen(false)} className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary/20 px-5 font-semibold text-primary">Enquiry form</Link>
          <a onClick={() => waClick("mobile_menu")} href={whatsapp()} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/20 px-5 font-semibold text-primary"><MessageCircle className="h-4 w-4" /> WhatsApp {PHONE}</a>
          <a href="tel:+6281237402292" onClick={() => trackEvent("phone_click", { placement: "mobile_menu" })} className="inline-flex items-center justify-center gap-2 py-2 text-sm text-foreground/70"><Phone className="h-4 w-4" /> Call {PHONE}</a>
        </div>
      </nav>}
    </header>

    <main id="main-content" className="flex-1">{children}</main>
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-12 md:px-8 md:py-20">
        <div className="md:col-span-5">
          <Link href="/" aria-label="Bali Accounting home" className="inline-flex"><Logo variant="full" onDark={true} iconClassName="h-10 w-10" textClassName="text-2xl" /></Link>
          <p className="mt-6 max-w-md text-sm leading-7 text-primary-foreground/70">Bookkeeping and monthly financial reporting for Bali villa owners and operators. Based in Denpasar; scope is agreed before work begins.</p>
          <a onClick={() => waClick("footer")} href={whatsapp()} target="_blank" rel="noreferrer" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#238f5c] px-6 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"><MessageCircle className="h-4 w-4" /> Request a consultation</a>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm md:col-span-3">
          <div><h2 className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-secondary">Explore</h2><div className="space-y-3">{[["Services","/services"],["Pricing","/pricing"],["Sample report","/sample-report"],["About","/about"],["Journal","/blog"],["FAQs","/faq"]].map(([label,href])=><Link key={href} href={href} className="block text-primary-foreground/70 transition-colors hover:text-white">{label}</Link>)}</div></div>
           <div><h2 className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-secondary">Contact</h2><a onClick={() => waClick("footer_contact")} href={whatsapp()} target="_blank" rel="noreferrer" className="block text-primary-foreground/80 hover:text-white">WhatsApp {PHONE}</a><a href="tel:+6281237402292" onClick={() => trackEvent("phone_click", { placement: "footer_contact" })} className="mt-3 block text-primary-foreground/80 hover:text-white">Call {PHONE}</a><p className="mt-5 leading-6 text-primary-foreground/65">Jl. Tukad Barito Timur III No.16, Panjer, Denpasar Selatan, Bali 80226</p></div>
        </div>
        <div className="md:col-span-4"><h2 className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-secondary">A clear scope</h2><p className="text-sm leading-7 text-primary-foreground/65">We organize bookkeeping records and management reports. We do not provide tax advice or official filings. A licensed Indonesian tax adviser remains responsible for those services.</p><p className="mt-4 text-sm leading-7 text-primary-foreground/65">Report delivery by the 15th is a target after complete, timely source documents are received.</p></div>
        <div className="flex flex-col gap-3 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/50 sm:flex-row sm:items-center sm:justify-between md:col-span-12">
          <span>© {new Date().getFullYear()} Bali Accounting · Denpasar, Bali</span>
          <div className="flex gap-5"><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Website terms</Link></div>
        </div>
      </div>
    </footer>
  </div>;
}
