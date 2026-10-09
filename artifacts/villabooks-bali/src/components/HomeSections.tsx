import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, Check, CircleHelp, FileText, MapPin, MessageCircle, RefreshCw } from "lucide-react";
import { useListBlogPosts } from "@workspace/api-client-react";
import { BlogCard } from "@/components/BlogCard";
import { ConsultationForm } from "@/components/ConsultationForm";
import { PHONE, sitePages, whatsapp } from "@/lib/site-pages";
import { prices, priceText, priceShort } from "@/lib/pricing";
import { trackEvent } from "@/lib/analytics";
import { expandedServices } from "@/lib/expanded-services";

const wrap = "mx-auto max-w-7xl px-5 md:px-8";
const eyebrow = "text-xs font-bold uppercase tracking-[.2em] text-secondary";
const heading = "font-serif text-3xl leading-[1.08] text-primary sm:text-5xl";

function Heading({ label, title, body }: { label: string; title: string; body?: string }) {
  return <div className="max-w-3xl"><p className={eyebrow}>{label}</p><h2 className={`mt-4 ${heading}`}>{title}</h2>{body && <p className="mt-5 text-base leading-7 text-foreground/70 sm:text-lg">{body}</p>}</div>;
}
function WhatsAppCTA({ place, text = "Book a free consultation", message = "Hello Client Advisory, I would like a free consultation about my Bali villa bookkeeping." }: { place: string; text?: string; message?: string }) {
  return <a href={whatsapp(message)} target="_blank" rel="noreferrer" onClick={() => trackEvent("whatsapp_click", { page: typeof window === "undefined" ? "/" : window.location.pathname, placement: place })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#238f5c] px-6 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"><MessageCircle className="h-4 w-4" />{text}<ArrowUpRight className="h-4 w-4" /></a>;
}

export function Hero() {
  return <section id="top" className="overflow-hidden bg-background pb-16 pt-32 sm:pb-24 sm:pt-40">
    <div className={`${wrap} grid items-center gap-10 lg:grid-cols-12 lg:gap-14`}>
      <div className="lg:col-span-6">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[.12em] text-primary"><MapPin className="h-4 w-4 text-secondary" /> Denpasar, Bali · Professional services</div>
        <h1 className="max-w-3xl font-serif text-5xl leading-[.99] tracking-tight text-primary sm:text-7xl">{sitePages["/"].h1}</h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-foreground/75">Monthly bookkeeping for Bali villas and short-term rental properties. Our Denpasar team reconciles Airbnb and other booking payouts, tracks operating expenses and prepares clear owner financial reports. Understand your income and cash flow, with packages from {priceShort(prices.starter)} per month.</p>
        <p className="mt-4 max-w-xl text-sm leading-7 text-foreground/70">Our qualified in-house team also supports <Link href="/company-formation-bali" className="font-semibold text-primary underline underline-offset-4">company setup</Link>, <Link href="/tax-compliance-bali" className="font-semibold text-primary underline underline-offset-4">tax compliance</Link> and <Link href="/business-visa-bali" className="font-semibold text-primary underline underline-offset-4">visa applications</Link>, with separate scopes and quotations.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row"><WhatsAppCTA place="home_hero" /><Link href="/sample-report" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/20 px-6 text-sm font-semibold text-primary transition-colors hover:bg-accent">View a sample report <ArrowRight className="h-4 w-4" /></Link></div>
        <p className="mt-7 max-w-xl text-sm leading-6 text-foreground/55">Based in Denpasar. English and Indonesian support. Scope agreed before work begins.</p>
      </div>
      <div className="relative lg:col-span-6">
        <div className="absolute -inset-5 rounded-[4rem] bg-secondary/10 blur-3xl" />
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-primary/10 shadow-xl sm:aspect-[5/4]">
          <img src="/images/bali-villa-accounting-services-hero.jpg" alt="Illustrative Bali bookkeeping workspace with records and laptop" width="1024" height="1024" fetchPriority="high" className="h-full w-full object-cover" />
          <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/50 bg-background/95 p-5 shadow-lg backdrop-blur sm:inset-x-6 sm:bottom-6"><p className="font-serif text-xl text-primary">A report that shows how the money moved.</p><p className="mt-1 text-sm text-foreground/60">Gross booking activity · costs · cash timing</p></div>
        </div>
      </div>
    </div>
  </section>;
}

export function TrustIntro() {
  return <section className="border-y border-primary/10 bg-accent/40 py-10"><div className={`${wrap} grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center`}>
    <div><p className={eyebrow}>The firm and its work</p><p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/70">Bali Accounting is a Denpasar bookkeeping firm founded by Abel Yuniartini. The work is practical: reconcile booking activity, organize operating records and prepare monthly owner reporting. <Link href="/about" className="font-semibold text-primary underline decoration-secondary/50 underline-offset-4">Meet the firm and see its responsibilities.</Link></p></div>
    <address className="not-italic text-xs leading-5 text-foreground/55">Jl. Tukad Barito Timur III No.16<br/>Panjer, Denpasar Selatan, Bali 80226</address>
  </div></section>;
}

const services = [
  { n: "01", title: "Rental property bookkeeping", desc: "Organize villa income, supplier expenses and bank records for a consistent monthly close.", href: "/villa-financial-reporting-bali", link: "See monthly villa reporting" },
  { n: "02", title: "Airbnb & OTA reconciliation", desc: "Match Airbnb, Booking.com, Agoda, VRBO and direct-booking payouts with fees, refunds and bank receipts.", href: "/airbnb-bookkeeping-bali", link: "Explore Airbnb bookkeeping" },
  { n: "03", title: "Villa owner financial reports", desc: "Read your profit and loss, cash movements and outstanding questions—not just a bank balance.", href: "/villa-financial-reporting-bali", link: "Review financial report scope" },
  { n: "04", title: "Payroll records", desc: "Track supplied staff schedules and BPJS document status in the agreed bookkeeping scope.", href: "/villa-payroll-records-bali", link: "See record tracking" },
  { n: "05", title: "Catch-up bookkeeping", desc: "Bring overdue villa records into an agreed cleanup process. Reconcile what the evidence supports and list remaining gaps.", href: "/villa-bookkeeping-cleanup-bali", link: "Understand bookkeeping cleanup" },
  ...expandedServices.map((service, index) => ({ n: String(index + 6).padStart(2, "0"), title: service.label, desc: service.summary, href: service.path, link: "Explore scope and documents" })),
];
export function ServicesSection() {
  return <section id="services" className="bg-background py-16 sm:py-24"><div className={wrap}>
    <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-end"><Heading label="Accounting and business services in Bali" title="From company setup to clearer monthly records." body="Our in-house team connects bookkeeping with separately scoped company formation, OSS licensing, tax registration, tax-compliance and planning support, and visa applications. Explore the deliverables and documents for each service." /><Link href="/services" className="inline-flex items-center gap-2 pb-1 font-semibold text-primary underline decoration-secondary/50 underline-offset-4">Compare all service scopes <ArrowRight className="h-4 w-4" /></Link></div>
    <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-primary/10 bg-primary/10 sm:grid-cols-2 lg:grid-cols-3">{services.map((s) => <Link key={s.n} href={s.href} className="group min-h-56 bg-background p-6 transition-colors hover:bg-accent/50 sm:p-7"><span className="font-mono text-xs text-secondary">{s.n} / SCOPE</span><h3 className="mt-5 font-serif text-2xl text-primary">{s.title}</h3><p className="mt-3 text-sm leading-6 text-foreground/65">{s.desc}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:text-secondary">{s.link}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></Link>)}</div>
  </div></section>;
}

export function SamplePreview() {
  return <section className="bg-primary py-16 text-primary-foreground sm:py-24"><div className={`${wrap} grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-center`}>
    <div><p className={eyebrow}>A sample monthly owner report</p><h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">A villa financial report you can inspect.</h2><p className="mt-5 text-base leading-7 text-primary-foreground/70">See how a monthly P&amp;L, OTA reconciliation and cash-flow forecast answer different questions. Our ungated example also explains occupancy, ADR and RevPAR, using fictional figures rather than claimed client returns.</p><Link href="/sample-report" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-background px-6 text-sm font-semibold text-primary">Explore the villa report example <ArrowRight className="h-4 w-4" /></Link></div>
    <div className="rounded-[1.75rem] border border-white/15 bg-white/[.06] p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[.18em] text-secondary">Fictional demonstration · IDR</p><h3 className="mt-2 font-serif text-2xl">Illustrative payout bridge</h3></div><FileText className="h-6 w-6 text-secondary" /></div>
      <div className="space-y-0">{[["Gross booking value","Rp 100.000.000"],["Platform fee","− Rp 15.000.000"],["Refunds / adjustments","− Rp 2.000.000"],["Net due from platform","Rp 83.000.000"],["Bank receipt observed","Rp 80.000.000"]].map(([label,value],i)=><div key={label} className={`flex items-center justify-between gap-4 border-t border-white/10 py-3 ${i===3?"font-bold text-white":"text-primary-foreground/70"}`}><span className="text-sm">{label}</span><span className="font-mono text-sm">{value}</span></div>)}</div>
      <p className="mt-5 rounded-xl bg-secondary/15 p-4 text-sm leading-6 text-primary-foreground/75">Rp 3.000.000 remains a timing or exception item to check—not silently counted as received.</p>
    </div>
  </div></section>;
}

const tiers = [
  { title: "Starter", price: priceText(prices.starter), scope: ["1 villa", "Monthly bookkeeping", "Up to 2 booking channels", "Basic monthly P&L", "Private document folder"] },
  { title: "Professional", price: priceText(prices.professional), scope: ["Monthly bookkeeping", "Full owner financial report", "Payroll and BPJS tracking", "All booking channels", "Monthly review call"] },
  { title: "Premium", price: priceText(prices.premium), scope: ["Monthly bookkeeping and reporting", "Tax-pack for Konsultan Pajak (record handover only)", "Forecast versus actuals", "Annual position summary", "Priority account review"] },
];
export function PricingSection() {
  return <section id="pricing" className="bg-accent/45 py-16 sm:py-24"><div className={wrap}>
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><Heading label="Bali bookkeeping prices" title="Compare monthly bookkeeping costs and scope." body="Choose between Starter, Professional and Premium villa bookkeeping packages. Compare reporting and record-tracking inclusions, then confirm the exact limits and price basis." /><Link href="/pricing" className="inline-flex shrink-0 items-center gap-2 font-semibold text-primary underline decoration-secondary/50 underline-offset-4">Compare bookkeeping packages <ArrowRight className="h-4 w-4" /></Link></div>
    <div className="mt-9 grid gap-4 lg:grid-cols-3">{tiers.map((tier,index)=><article key={tier.title} className={`rounded-[1.6rem] p-6 sm:p-7 ${index===1?"bg-primary text-primary-foreground":"border border-primary/10 bg-background"}`}><p className="text-xs font-bold uppercase tracking-[.18em] text-secondary">{tier.title}</p><p className="mt-4 font-serif text-3xl">{tier.price}<span className={`ml-1 font-sans text-xs ${index===1?"text-white/55":"text-foreground/45"}`}>/ month</span></p><ul className="mt-6 space-y-3">{tier.scope.map((x)=><li key={x} className="flex gap-2 text-sm leading-5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />{x}</li>)}</ul></article>)}</div>
     <p className="mt-6 max-w-4xl text-xs leading-6 text-foreground/55">Starter is scoped for 1 villa and up to 2 booking channels. Limits and price basis for other packages, plus any software/onboarding fee, contract minimum or response hours, must be confirmed before agreement. Tax advice and official filings are not included.</p>
    <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3"><Link href="/villa-bookkeeping-cleanup-bali" className="text-sm font-semibold text-primary underline underline-offset-4">Historical cleanup from {priceText(prices.cleanup)}, subject to records review</Link><Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary">All package details <ArrowRight className="h-4 w-4" /></Link></div>
  </div></section>;
}

export function WorkflowSection() {
  const items = [
    ["01","Agree the scope","Confirm properties or records, channels, document sources, reporting period and responsibilities."],
    ["02","Collect source records","Owner or manager provides agreed statements, booking exports, invoices and schedules in the agreed workflow."],
    ["03","Reconcile and review","Transactions are organized; differences and missing evidence become a question list."],
    ["04","Share the month","Deliver the agreed report and schedules. The 15th is a target after complete and timely source documents."],
  ];
  return <section id="how-it-works" className="bg-background py-16 sm:py-24"><div className={wrap}><Heading label="How the monthly close works" title="From source documents to a monthly villa report." body="Agree the document handover, reconcile booking and bank records, then review the report and open questions. Owners and operators retain control of accounts, payments and decisions."/><div className="mt-10 grid gap-8 md:grid-cols-4">{items.map(([n,title,body])=><article key={n} className="border-t-2 border-secondary pt-5"><span className="font-mono text-xs text-secondary">{n} / PROCESS</span><h3 className="mt-4 font-serif text-2xl text-primary">{title}</h3><p className="mt-3 text-sm leading-6 text-foreground/65">{body}</p></article>)}</div></div></section>;
}

export function MidConsultation() {
  return <section id="clarity-call" className="bg-accent/55 py-12"><div className={`${wrap} flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between`}><div><p className={eyebrow}>A conversation before a commitment</p><h2 className="mt-2 font-serif text-3xl text-primary">Need help reconciling Airbnb or Booking.com payouts?</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/65">Discuss fees, missing deposits and the records needed for a clearer monthly report.</p></div><WhatsAppCTA place="home_midpage" /></div></section>;
}

export function EvidenceSection() {
  return <section id="bookkeeping" className="bg-primary py-16 text-primary-foreground sm:py-24"><div className={`${wrap} grid gap-10 lg:grid-cols-[.8fr_1.2fr]`}>
    <div><p className={eyebrow}>Why a reconciled record matters</p><h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">A manager summary is useful. It is not the full record.</h2><p className="mt-5 leading-7 text-primary-foreground/70">A monthly process keeps supporting documents, consistent categories and unresolved questions visible together. It helps people review the period without mistaking cash movement for operating performance.</p><p className="mt-4 text-sm leading-6 text-primary-foreground/55">We do not claim a particular client outcome or savings figure. Examples on this website are illustrative only.</p></div>
    <div className="grid gap-4 sm:grid-cols-2">{[
      ["Separate the movements","Booking value, platform fees, refunds, deposits and owner transfers are distinct parts of the picture."],
      ["Keep evidence attached","Invoices, source exports and notes help a reviewer understand where a figure came from."],
      ["Make exceptions explicit","Unmatched deposits and missing receipts become follow-up items rather than hidden assumptions."],
      ["Prepare a handover","Agreed schedules can help an owner share organized records with a licensed tax adviser."],
    ].map(([title,body])=><div key={title} className="rounded-2xl border border-white/10 bg-white/[.06] p-6"><Check className="h-5 w-5 text-secondary" /><h3 className="mt-4 font-serif text-2xl">{title}</h3><p className="mt-3 text-sm leading-6 text-primary-foreground/65">{body}</p></div>)}</div>
  </div></section>;
}

export function UseCasesSection() {
  return <section className="bg-background py-16 sm:py-24"><div className={wrap}><Heading label="For owners and operators" title="Different roles. A shared need for dependable records."/><div className="mt-9 grid gap-8 md:grid-cols-3">{[
    ["Remote owner","Review booking activity, expenses and cash movements when you are not on the island. A documented question list gives a manager conversation a useful starting point."],
    ["Villa operator","Keep channel exports, supplier documents and payroll records organized across an agreed monthly close and handover."],
    ["PT PMA records","Organize entity transactions and owner funding into schedules for an owner's review and licensed tax-adviser handover."],
  ].map(([title,body])=><article key={title} className="border-l-2 border-secondary pl-5"><h3 className="font-serif text-2xl text-primary">{title}</h3><p className="mt-3 text-sm leading-7 text-foreground/65">{body}</p></article>)}</div><Link href="/pt-pma-villa-bookkeeping" className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4">Explore PT PMA bookkeeping records <ArrowRight className="h-4 w-4" /></Link></div></section>;
}

export function LocalAbout() {
  return <section id="about" className="bg-accent/45 py-16 sm:py-24"><div className={`${wrap} grid gap-10 lg:grid-cols-[1fr_.8fr] lg:items-center`}><div><p className={eyebrow}>Denpasar, Bali</p><h2 className="mt-4 font-serif text-4xl leading-tight text-primary sm:text-5xl">Local records. Clear responsibilities.</h2><p className="mt-5 max-w-2xl leading-7 text-foreground/70">Founded by Abel Yuniartini, Bali Accounting works from Panjer, Denpasar. The firm's focus is organizing villa records, preparing monthly owner reporting and making exceptions visible—not giving tax advice or filing official returns.</p><Link href="/about" className="mt-6 inline-flex items-center gap-2 font-semibold text-primary underline decoration-secondary/50 underline-offset-4">About Bali Accounting <ArrowRight className="h-4 w-4" /></Link></div><div className="rounded-3xl border border-primary/10 bg-background p-7"><MapPin className="h-5 w-5 text-secondary" /><p className="mt-4 font-serif text-2xl text-primary">Panjer · Denpasar Selatan</p><address className="mt-3 not-italic text-sm leading-6 text-foreground/60">Jl. Tukad Barito Timur III No.16<br/>Panjer, Denpasar Selatan<br/>Bali 80226</address><p className="mt-5 border-t border-primary/10 pt-5 text-xs leading-5 text-foreground/50">Service coverage and responsibilities are confirmed for each engagement. No unverified team credentials or response hours are presented.</p></div></div></section>;
}

const homeFaq: [string,string][] = [
  ["What is the monthly price?",`Starter is ${priceText(prices.starter)}, Professional ${priceText(prices.professional)} and Premium ${priceText(prices.premium)} per month. Confirm price basis and applicable limits before agreement.`],
  ["Do you provide tax and company support?","Yes. Our in-house team supports company setup, tax registration, tax-compliance and planning engagements, plus visa application administration. These services are separately scoped and quoted; they are not automatically included in monthly bookkeeping prices."],
  ["Can you reconcile Airbnb and other OTA payouts?","Yes, from records and exports supplied and within the agreed package scope. Direct integrations are not promised."],
  ["When will I receive my report?","The 15th is a target after complete and timely source documents are received—not a guaranteed date."],
  ["What should I do if my books are behind?",`A cleanup starts at ${priceText(prices.cleanup)} for up to 12 months, subject to records review and a scoped agreement.`],
];
export function HomeFAQ() {
  return <section id="faq" className="bg-background py-16 sm:py-24"><div className={`${wrap} grid gap-10 lg:grid-cols-[.7fr_1.3fr]`}><div><p className={eyebrow}>Before you begin</p><h2 className="mt-4 font-serif text-4xl leading-tight text-primary sm:text-5xl">Useful answers. No hidden booking step.</h2><Link href="/faq" className="mt-6 inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-4">See all buying FAQs <ArrowRight className="h-4 w-4" /></Link></div><div className="divide-y divide-primary/10 border-y border-primary/10">{homeFaq.map(([q,a])=><details key={q} className="py-5"><summary className="cursor-pointer list-none font-semibold text-primary">{q}<span className="float-right text-secondary">+</span></summary><p className="mt-3 text-sm leading-7 text-foreground/70">{a}</p></details>)}</div></div></section>;
}

export function JournalPreview() {
  const { data, isLoading, isError, refetch } = useListBlogPosts({ limit: 3 });
  return <section className="bg-accent/45 py-16 sm:py-24"><div className={wrap}><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><Heading label="Relevant guides" title="Notes for better villa records." body="Practical reading on payouts, reporting and the monthly close."/><Link href="/blog" className="inline-flex items-center gap-2 font-semibold text-primary underline decoration-secondary/50 underline-offset-4">Visit the journal <ArrowRight className="h-4 w-4" /></Link></div>
    {data?.length ? <div className="mt-9 grid gap-5 md:grid-cols-3">{data.map((post,i)=><BlogCard key={post.slug} post={post} featured={i===0}/>)}</div> : isLoading ? <div aria-label="Loading latest guides" className="mt-9 grid gap-5 md:grid-cols-3"><div className="h-64 animate-pulse rounded-3xl bg-background"/><div className="h-64 animate-pulse rounded-3xl bg-background"/><div className="h-64 animate-pulse rounded-3xl bg-background"/></div> : isError ? <div className="mt-9 flex flex-col gap-4 rounded-2xl border border-primary/10 bg-background p-6 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm leading-6 text-foreground/60">The guide list is temporarily unavailable. Existing articles remain accessible from the journal.</p><div className="flex gap-4"><button onClick={() => refetch()} className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><RefreshCw className="h-4 w-4"/>Retry</button><Link href="/blog" className="text-sm font-semibold text-secondary underline underline-offset-4">Open journal</Link></div></div> : <div className="mt-9 rounded-2xl bg-background p-7"><CircleHelp className="h-5 w-5 text-secondary"/><p className="mt-3 text-sm text-foreground/65">No published guides are available yet.</p><Link href="/blog" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">Visit the journal <ArrowRight className="h-4 w-4"/></Link></div>}
  </div></section>;
}

export function HomeContact() {
  return <section className="bg-primary py-16 text-primary-foreground sm:py-20"><div className={`${wrap} grid gap-10 lg:grid-cols-[.8fr_1.2fr]`}><div><p className={eyebrow}>Talk with Client Advisory</p><h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Make the next step straightforward.</h2><p className="mt-5 max-w-lg leading-7 text-primary-foreground/70">Send a short enquiry, or reach us directly on WhatsApp. A form submission records your request; it does not book an appointment. Any WhatsApp message is sent only if you press Send in WhatsApp.</p><div className="mt-7 flex flex-col items-start gap-4"><WhatsAppCTA place="home_final" text="WhatsApp for a free consultation" /><a href="tel:+6281237402292" onClick={() => trackEvent("phone_click", { page: "/", placement: "home_final" })} className="text-sm text-primary-foreground/75 underline underline-offset-4">Call {PHONE}</a><p className="max-w-sm text-xs leading-5 text-primary-foreground/50">No response hours are published. Scope and applicable limits are confirmed before agreement.</p></div></div><div className="rounded-[2rem] bg-background p-6 text-foreground sm:p-9"><h3 className="mb-5 font-serif text-2xl text-primary">Short enquiry</h3><HomeEnquiry /></div></div></section>;
}

function HomeEnquiry() { return <ConsultationForm compact />; }
