import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, FileText, MessageCircle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageVisual } from "@/components/PageVisual";
import { getPageImagery } from "@/lib/page-imagery";
import { OTA_PILLAR_PATH, otaErrors, otaFaqs, otaRecords, otaReportLines, otaSteps } from "@/lib/ota-pillar";
import { prices, priceText, priceShort } from "@/lib/pricing";
import { SITE_ORIGIN, sitePages, whatsapp } from "@/lib/site-pages";
import { updateShareImage } from "@/lib/social-images";
import { trackEvent } from "@/lib/analytics";

const wrap = "mx-auto max-w-7xl px-5 md:px-8";
const eyebrow = "text-xs font-bold uppercase tracking-[.2em] text-secondary";
const heading = "font-serif text-3xl leading-[1.08] text-primary sm:text-5xl";
const linkClass = "inline-flex items-center gap-2 font-semibold text-primary underline decoration-secondary/50 underline-offset-4 transition-colors hover:text-secondary";
const WA_MESSAGE = "Hello Client Advisory, I would like help reconciling my Airbnb and OTA payouts for my Bali villa.";

function Heading({ label, title, body }: { label: string; title: string; body?: string }) {
  return <div className="max-w-3xl"><p className={eyebrow}>{label}</p><h2 className={`mt-4 ${heading}`}>{title}</h2>{body && <p className="mt-5 text-base leading-7 text-foreground/70 sm:text-lg">{body}</p>}</div>;
}

function WhatsAppCTA({ place, text = "Discuss your OTA reconciliation" }: { place: string; text?: string }) {
  return <a href={whatsapp(WA_MESSAGE)} target="_blank" rel="noreferrer" onClick={() => trackEvent("whatsapp_click", { page: OTA_PILLAR_PATH, placement: place })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#238f5c] px-6 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"><MessageCircle className="h-4 w-4" />{text}<ArrowUpRight className="h-4 w-4" /></a>;
}

const bridgeRows: [string, string][] = [
  ["Gross booking value (all channels)", "Rp 100,000,000"],
  ["Platform fees and commissions", "− Rp 15,000,000"],
  ["Refunds, cancellations and adjustments", "− Rp 2,000,000"],
  ["Net due from platforms", "Rp 83,000,000"],
  ["Bank receipts matched in the month", "Rp 80,000,000"],
  ["Timing item still in transit (explained, not lost)", "Rp 3,000,000"],
];

const tiers = [
  { title: "Starter", price: priceText(prices.starter), scope: ["1 villa", "Monthly bookkeeping", "Up to 2 booking channels", "Basic monthly P&L", "Private document folder"] },
  { title: "Professional", price: priceText(prices.professional), scope: ["Monthly bookkeeping", "Full owner financial report", "Payroll and BPJS tracking", "All booking channels", "Monthly review call"] },
  { title: "Premium", price: priceText(prices.premium), scope: ["Monthly bookkeeping and reporting", "Tax-pack for Konsultan Pajak (record handover only)", "Forecast versus actuals", "Annual position summary", "Priority account review"] },
];

const guides: [string, string][] = [
  ["Booking.com commission reconciliation checklist", "/blog/booking-com-commission-reconciliation-checklist-bali-villas"],
  ["Handling Airbnb reserves and delayed payouts", "/blog/airbnb-reserves-delayed-payouts-bali-villa-bookkeeping"],
  ["Reconciling Airbnb and Booking.com payouts, step by step", "/blog/reconciling-airbnb-booking-payouts"],
  ["Airbnb refunds, cancellations and payout reserves", "/blog/airbnb-bookkeeping-refunds-cancellations-reserves"],
  ["Multi-currency bookkeeping and exchange differences", "/blog/multi-currency-bookkeeping-bali-villa-exchange-differences"],
  ["Bank reconciliation: resolving unmatched transactions", "/blog/bank-reconciliation-bali-villa-unmatched-transactions"],
  ["What monthly accounting deliverables should include", "/blog/accounting-services-bali-monthly-deliverables"],
];

export default function OtaPillar() {
  const page = sitePages[OTA_PILLAR_PATH];
  const imagery = getPageImagery(OTA_PILLAR_PATH);
  useEffect(() => {
    document.title = page.title;
    const canonical = `${SITE_ORIGIN}${OTA_PILLAR_PATH}`;
    const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (link) link.href = canonical;
    document.querySelector('meta[name="description"]')?.setAttribute("content", page.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", page.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", page.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonical);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", page.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", page.description);
    updateShareImage(OTA_PILLAR_PATH);
  }, [page]);

  return <Layout>
    <section className="bg-primary pb-12 pt-36 text-primary-foreground sm:pb-16">
      <div className={`${wrap} grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-14`}>
        <div>
          <nav aria-label="Breadcrumb" className="mb-9 flex flex-wrap items-center gap-2 text-xs text-primary-foreground/55"><Link href="/" className="hover:text-white">Home</Link><ChevronRight className="h-3 w-3" /><Link href="/services" className="hover:text-white">Services</Link><ChevronRight className="h-3 w-3" /><span className="text-primary-foreground/85">{page.h1}</span></nav>
          <p className={eyebrow}>Airbnb bookkeeping Bali · OTA payout reconciliation</p>
          <h1 className="mt-4 max-w-4xl text-4xl leading-[1.05] sm:text-6xl">{page.h1}</h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-primary-foreground/70 sm:text-lg">Step-by-step reconciliation of Airbnb, Booking.com, Agoda, VRBO and direct bookings for Bali villas — from gross booking value to the bank receipt, with every fee, refund and timing difference explained. Packages from {priceShort(prices.starter)}/month.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><WhatsAppCTA place="pillar_hero" /><Link href="/sample-report" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10">See a sample owner report <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
        {imagery && <PageVisual imagery={imagery} priority className="w-full" />}
      </div>
    </section>

    <section className="bg-background py-16 sm:py-24"><div className={wrap}>
      <Heading label="The problem" title="A bank deposit is not villa revenue." />
      <div className="mt-8 grid gap-8 text-base leading-8 text-foreground/75 lg:grid-cols-3">
        <p>Most Bali villa books go wrong in the same quiet way: the amount that lands in the bank is recorded as income. That deposit has already survived platform commissions, host fees, refunded stays, cancelled reservations, cleaning-fee treatment, held reserves and a payout calendar that ignores your month-end. Two villas with identical bookings can deposit different amounts; one villa can deposit more in a worse month simply because a delayed payout finally arrived. When the deposit becomes the revenue line, none of that is visible — and none of it can be explained later.</p>
        <p>The damage compounds across channels. Airbnb settles one way, Booking.com invoices commission another way, Agoda and VRBO run their own payout timing, and direct bookings bypass platforms entirely. Add a payout converted from USD or AUD into IDR and a refund deducted from next month's settlement, and the spreadsheet total drifts further from what guests actually booked. Owner reports built on deposits cannot answer the only questions that matter: what did we earn, what did the channels keep, and what is still owed to us?</p>
        <p>It also weakens everything downstream. An owner cannot judge pricing or channel mix from figures that hide fees. A manager cannot be asked about a shortfall that was really a reserve. And when a licensed Indonesian tax adviser reviews the records for PBJT, PPh or another obligation, a deposit total with no statement-level evidence behind it is not a record pack — it is a claim. Proper OTA payout reconciliation fixes the source: every rupiah is traced from booking, to platform, to bank, with the differences named instead of buried.</p>
      </div>
    </div></section>

    <section className="bg-accent/45 py-16 sm:py-24"><div className={wrap}>
      <Heading label="How a proper reconciliation works" title="Five steps from booking export to owner report." body="The same sequence runs every month, for every channel, so one month can be compared with the next. No direct platform integration is promised — the work uses the exports and statements you supply, which keeps the evidence in your hands." />
      <ol className="mt-12 space-y-0">
        {otaSteps.map((step, i) => <li key={step.name} className="grid gap-4 border-t border-primary/10 py-8 md:grid-cols-[80px_320px_1fr] md:gap-8">
          <span className="font-mono text-sm text-secondary">0{i + 1}</span>
          <h3 className="font-serif text-2xl text-primary">{step.name}</h3>
          <p className="max-w-3xl text-sm leading-7 text-foreground/70">{step.text}</p>
        </li>)}
      </ol>
      <div className="mt-6 rounded-[1.75rem] bg-primary p-6 text-primary-foreground sm:p-9">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[.18em] text-secondary">Illustrative payout bridge · fictional figures · IDR</p><h3 className="mt-2 font-serif text-2xl">How one month walks from bookings to bank</h3></div><FileText className="h-6 w-6 text-secondary" /></div>
        <div>{bridgeRows.map(([label, value], i) => <div key={label} className={`flex items-center justify-between gap-4 border-t border-white/10 py-3 ${i === 3 ? "font-bold text-white" : "text-primary-foreground/70"}`}><span className="text-sm">{label}</span><span className="font-mono text-sm">{value}</span></div>)}</div>
        <p className="mt-5 rounded-xl bg-secondary/15 p-4 text-sm leading-6 text-primary-foreground/75">Gross booking value → platform fees → refunds and adjustments → net due → bank receipts → timing items. The Rp 3,000,000 still in transit is an explained open item with a date and a reference — not missing money and not extra revenue. Read it beside the <Link href="/sample-report" className="font-semibold text-white underline underline-offset-4">worked sample owner report</Link>.</p>
      </div>
    </div></section>

    <section className="bg-background py-16 sm:py-24"><div className={`${wrap} grid gap-10 lg:grid-cols-[.8fr_1.2fr]`}>
      <div><Heading label="The monthly owner report" title="What appears in the report this reconciliation feeds." /><p className="mt-5 max-w-xl text-base leading-7 text-foreground/70">The reconciliation is not the end product — the owner report is. These are the lines a reconciled month puts in front of you, each one traceable to its source document.</p><Link href="/sample-report" className={`${linkClass} mt-6`}>Inspect the sample owner report <ArrowRight className="h-4 w-4" /></Link><br /><Link href="/villa-financial-reporting-bali" className={`${linkClass} mt-4`}>Monthly villa financial reporting in Bali <ArrowRight className="h-4 w-4" /></Link></div>
      <ul className="space-y-4">{otaReportLines.map((line) => <li key={line} className="flex gap-3 rounded-2xl border border-primary/10 bg-white p-5 text-sm leading-6 text-foreground/75"><Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />{line}</li>)}</ul>
    </div></section>

    <section className="bg-primary py-16 text-primary-foreground sm:py-24"><div className={wrap}>
      <p className={eyebrow}>Common errors that create gaps</p><h2 className="mt-4 max-w-3xl font-serif text-3xl leading-[1.08] sm:text-5xl">Six mistakes that make villa numbers unreliable.</h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{otaErrors.map((error) => <article key={error.title} className="rounded-2xl border border-white/10 bg-white/[.06] p-6"><h3 className="font-serif text-xl">{error.title}</h3><p className="mt-3 text-sm leading-6 text-primary-foreground/65">{error.text}</p></article>)}</div>
    </div></section>

    <section className="bg-background py-16 sm:py-24"><div className={`${wrap} grid gap-10 lg:grid-cols-2`}>
      <div><Heading label="Records required before work starts" title="The checklist we reconcile from." body="Scope and fees are confirmed before engagement, after a short review of these records. Send the first message without financial files — the document handover is agreed privately once fit and scope are clear." />
        <div className="mt-8 flex flex-wrap gap-3"><WhatsAppCTA place="pillar_records" /><Link href="/get-started" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/20 px-6 text-sm font-semibold text-primary transition-colors hover:bg-accent">Use the enquiry form <ArrowRight className="h-4 w-4" /></Link></div></div>
      <ul className="space-y-3">{otaRecords.map((record) => <li key={record} className="flex gap-3 text-sm leading-6 text-foreground/75"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />{record}</li>)}</ul>
    </div></section>

    <section className="bg-accent/45 py-16 sm:py-24"><div className={wrap}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><Heading label="Service connection" title="Reconciliation inside a monthly bookkeeping package." body="OTA reconciliation is not sold as a one-off spreadsheet fix. It runs inside the monthly close, so every month starts from last month's cleared position." /><Link href="/pricing" className="inline-flex shrink-0 items-center gap-2 font-semibold text-primary underline decoration-secondary/50 underline-offset-4">Full package comparison <ArrowRight className="h-4 w-4" /></Link></div>
      <div className="mt-9 grid gap-4 lg:grid-cols-3">{tiers.map((tier, index) => <article key={tier.title} className={`rounded-[1.6rem] p-6 sm:p-7 ${index === 1 ? "bg-primary text-primary-foreground" : "border border-primary/10 bg-background"}`}><p className="text-xs font-bold uppercase tracking-[.18em] text-secondary">{tier.title}</p><p className="mt-4 font-serif text-3xl">{tier.price}<span className={`ml-1 font-sans text-xs ${index === 1 ? "text-white/55" : "text-foreground/45"}`}>/ month</span></p><ul className="mt-6 space-y-3">{tier.scope.map((x) => <li key={x} className="flex gap-2 text-sm leading-5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />{x}</li>)}</ul></article>)}</div>
      <p className="mt-6 max-w-4xl text-xs leading-6 text-foreground/55">Tax advice and official filings are not included in bookkeeping packages; tax-compliance support is a separate engagement. Behind on past months? <Link href="/villa-bookkeeping-cleanup-bali" className="font-semibold text-primary underline underline-offset-4">Historical cleanup starts at {priceText(prices.cleanup)}</Link> for up to 12 months, subject to records review.</p>
      <div className="mt-8 flex flex-wrap gap-3"><WhatsAppCTA place="pillar_packages" text="Book a free consultation" /><Link href="/airbnb-bookkeeping-bali" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/20 px-6 text-sm font-semibold text-primary transition-colors hover:bg-background">Airbnb bookkeeping scope <ArrowRight className="h-4 w-4" /></Link><Link href="/services" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/20 px-6 text-sm font-semibold text-primary transition-colors hover:bg-background">All services <ArrowRight className="h-4 w-4" /></Link></div>
    </div></section>

    <section className="bg-background py-16 sm:py-24"><div className={`${wrap} grid gap-10 lg:grid-cols-[.7fr_1.3fr]`}>
      <div><p className={eyebrow}>OTA reconciliation FAQ</p><h2 className="mt-4 font-serif text-4xl leading-tight text-primary sm:text-5xl">Questions villa owners ask first.</h2><Link href="/faq" className="mt-6 inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-4">See all bookkeeping FAQs <ArrowRight className="h-4 w-4" /></Link></div>
      <div className="divide-y divide-primary/10 border-y border-primary/10">{otaFaqs.map(([q, a]) => <details key={q} className="py-5"><summary className="cursor-pointer list-none font-semibold text-primary">{q}<span className="float-right text-secondary">+</span></summary><p className="mt-3 text-sm leading-7 text-foreground/70">{a}</p></details>)}</div>
    </div></section>

    <section className="border-t border-primary/10 bg-accent/40 py-16 sm:py-20"><div className={wrap}>
      <Heading label="Go deeper" title="Guides that support this reconciliation workflow." />
      <ul className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{guides.map(([label, href]) => <li key={href}><Link href={href} className="flex h-full items-start justify-between gap-4 rounded-2xl border border-primary/10 bg-background p-5 text-sm font-semibold leading-6 text-primary underline decoration-secondary/40 underline-offset-4 hover:border-secondary/50">{label}<ArrowRight className="mt-1 h-4 w-4 shrink-0" /></Link></li>)}</ul>
    </div></section>
  </Layout>;
}
