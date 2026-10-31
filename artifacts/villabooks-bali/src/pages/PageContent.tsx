import { useEffect } from "react";
import { prices, priceText } from "@/lib/pricing";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, MapPin } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ConsultationForm } from "@/components/ConsultationForm";
import { MonthlyVillaReport } from "@/components/finance-report/MonthlyVillaReport";
import { BookkeepingDecisionGuide } from "@/components/BookkeepingDecisionGuide";
import { ClientShowcase, SixVillaScenario } from "@/components/ClientShowcase";
import { PageEducation } from "@/components/PageEducation";
import { additionalFaqs } from "@/lib/additional-faqs";
import { serviceFaqs } from "@/lib/service-faqs";
import { PHONE, SITE_ORIGIN, sitePages, whatsapp } from "@/lib/site-pages";
import { updateShareImage } from "@/lib/social-images";
import { trackEvent } from "@/lib/analytics";
import { expandedServices, relatedServicePaths, type ServiceInfo } from "@/lib/expanded-services";
import { SeoTopicGuides } from "@/components/SeoTopicGuides";
import { getPageImagery } from "@/lib/page-imagery";
import { PageVisual } from "@/components/PageVisual";

const wrap = "mx-auto max-w-7xl px-5 md:px-8";
const eyebrow = "text-xs font-bold uppercase tracking-[.2em] text-secondary";
const linkClass = "inline-flex items-center gap-2 font-semibold text-primary underline decoration-secondary/50 underline-offset-4 transition-colors hover:text-secondary";
const serviceLinks = [
  ...expandedServices.map(service => [service.path, service.label]),
  ["/airbnb-ota-reconciliation-bali", "Airbnb & OTA payout reconciliation (pillar guide)"],
  ["/airbnb-bookkeeping-bali", "Airbnb bookkeeping and OTA reconciliation"],
  ["/villa-financial-reporting-bali", "Monthly villa financial reporting"],
  ["/villa-bookkeeping-cleanup-bali", "Bookkeeping cleanup and catch-up records"],
  ["/pt-pma-villa-bookkeeping", "PT PMA villa bookkeeping"],
  ["/villa-payroll-records-bali", "Villa payroll and BPJS records"],
];

/** Each service page answers one comparison question, so the cluster is not orphaned. */
const compareCrossLinks: Record<string, [string, string]> = {
  "/airbnb-bookkeeping-bali": ["Bali firm or offshore bookkeeper?", "/compare/bali-firm-vs-offshore-bookkeeper"],
  "/airbnb-ota-reconciliation-bali": ["Manager statement or specialist books?", "/compare/villa-manager-vs-specialist-bookkeeping"],
  "/villa-financial-reporting-bali": ["Manager statement or specialist books?", "/compare/villa-manager-vs-specialist-bookkeeping"],
  "/villa-bookkeeping-cleanup-bali": ["Cleanup first, or straight to monthly?", "/compare/cleanup-and-monthly-vs-monthly-only"],
  "/pt-pma-villa-bookkeeping": ["Bali firm or offshore bookkeeper?", "/compare/bali-firm-vs-offshore-bookkeeper"],
  "/villa-payroll-records-bali": ["Manager statement or specialist books?", "/compare/villa-manager-vs-specialist-bookkeeping"],
};

function CompareCrossLink({ path }: { path: string }) {
  const entry = compareCrossLinks[path];
  if (!entry) return null;
  return <section className="border-y border-primary/10 bg-white py-10">
    <div className={`${wrap} flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}>
      <p className="text-sm leading-7 text-foreground/70"><span className="font-semibold text-primary">Still deciding between options?</span> The comparison sets out what each model produces, and where it breaks.</p>
      <Link href={entry[1]} className={linkClass}>{entry[0]}<ArrowRight className="h-4 w-4" /></Link>
    </div>
  </section>;
}

const serviceDetails: Record<string, ServiceInfo> = {
  ...Object.fromEntries(expandedServices.map(service => [service.path, service.details])),
  "/airbnb-bookkeeping-bali": {
    intro: "Airbnb bookkeeping connects each short-term rental booking with its fees, refunds and eventual bank deposit. We reconcile records supplied from Airbnb, Booking.com, Agoda, VRBO and direct bookings, keeping gross rental income and payout timing visible in your Bali villa books.",
    audience: "Remote villa owners and operators using one or more booking channels who need to understand how a stay became a bank deposit.",
    problem: "Payouts can land on different dates, combine several reservations, include deductions or refunds, and cross a reporting month. Looking only at deposits can make revenue and cash timing difficult to explain.",
    included: ["Record and categorize booking revenue using the source information supplied", "Compare OTA statements or exports with booking detail and bank deposits", "Record platform commissions, adjustments, refunds and unresolved differences", "Include direct-booking schedules where those records are supplied", "Carry documented exceptions into the agreed monthly report"],
    inputs: ["Reservation and payout exports from each active platform", "Bank transaction export or statements for the relevant period", "Direct booking and refund records, if applicable", "The owner's notes on deposits received outside the period"],
    exampleTitle: "Illustrative payout bridge — fictional figures",
    example: "Assume the platform statement shows Rp 100,000,000 in gross bookings. Rp 15,000,000 is platform commission and Rp 2,000,000 is refunds or other adjustments, leaving Rp 83,000,000 due. The bank shows Rp 80,000,000 received, so Rp 3,000,000 remains a timing or exception item to investigate. The deposit alone does not show the gross booking activity.",
    steps: ["Agree which channels, periods and source exports are in scope.", "Match reservation and payout lines against bank receipts; document timing differences.", "Ask the owner or manager about unclear items; do not replace missing evidence with assumptions.", "Include reconciled totals and unresolved items in the agreed monthly pack."],
    timing: "Timing depends on the agreed close calendar and when complete, usable source records arrive. Delivery by the 15th is a target after complete and timely source documents—not a guaranteed date.",
    price: `Monthly channel reconciliation is included according to the selected package's stated scope. Current package prices are ${priceText(prices.starter)}, ${priceText(prices.professional)} and ${priceText(prices.premium)} per month. Confirm the price basis, transaction volume and exact limits before agreement; those details are not assumed here.`,
    excludes: ["Direct OTA account access or platform integrations are not promised; work uses exports or statements provided by the client.", "We do not control bank accounts, authorize transfers or pay suppliers.", "Tax advice, legal advice and official filings are outside scope."],
    faqs: serviceFaqs["/airbnb-bookkeeping-bali"],
    guide: "Visit the journal for practical notes on payout reconciliation and monthly records.",
  },
  "/villa-financial-reporting-bali": {
    intro: "Monthly villa financial reporting explains rental income, operating expenses, profit and cash flow—not just the closing bank balance. Bali Accounting prepares a management pack from your supplied records, with profit-and-loss reporting, agreed schedules and clearly identified questions for owner review.",
    audience: "Owners living remotely, villa managers who need a consistent handover, and operators who want period-by-period records rather than a bank balance alone.",
    problem: "A cash balance cannot explain which month earned the revenue, what costs relate to operations, or whether an open booking payout or owner movement changed cash.",
    included: ["Monthly profit-and-loss view based on the records supplied", "Relevant balance schedules and reconciled cash movements by agreed scope", "Booking-channel view and payout reconciliation where included", "Payroll schedules and BPJS record status where applicable to package scope", "Open questions and missing-document notes for owner or manager review"],
    inputs: ["Bank and cash records, platform activity and direct-booking schedules", "Supplier invoices, receipts and operating cost information", "Owner funding or withdrawal notes where applicable", "Payroll schedules and supporting records if those are in scope"],
    exampleTitle: "How to read a simple month",
    example: "If booking activity produces Rp 98,000,000 after Rp 2,000,000 of refunds, and platform charges are Rp 15,000,000, the report can show those lines separately. If operating costs are Rp 52,000,000, the illustrative operating result is Rp 31,000,000. A bank receipt of Rp 80,000,000 can still differ because Rp 3,000,000 has not arrived yet. Owner funding and drawings are shown as cash movements, not operating revenue or expense.",
    steps: ["Agree reporting needs, source records, periods and responsibilities.", "Collect documents in an agreed shared workflow.", "Code and reconcile the period, documenting exceptions.", "Deliver the report and question list for owner or manager review."],
    timing: "The 15th is a reporting target only when source documents are complete and received on time. Late records, unresolved questions or complex reconciliations can change delivery timing.",
    price: `Packages are ${priceText(prices.starter)}, ${priceText(prices.professional)} and ${priceText(prices.premium)} per month, with different reporting inclusions. Review the comparison page and confirm exact scope and price basis before agreement.`,
    excludes: ["Reports are management information, not audit opinions or official tax statements.", "Tax advice and filing support require a separate tax-compliance engagement; they are not included in this reporting package.", "No control of client bank accounts or payment authority is included."],
    faqs: serviceFaqs["/villa-financial-reporting-bali"],
    guide: "The sample report shows the shape of the monthly pack using demonstration figures only.",
  },
  "/villa-bookkeeping-cleanup-bali": {
    intro: "Catch-up bookkeeping brings overdue Bali villa records into an agreed review and reconciliation process. Whether the backlog sits in spreadsheets, bank statements or booking exports, we first assess the evidence, then scope the bookkeeping cleanup and explain what remains missing.",
    audience: "Villa owners and operators with incomplete, inconsistent or delayed bookkeeping who need an orderly handover into a regular monthly process.",
    problem: "Missing statements, mixed owner transactions, incomplete receipts and unmatched OTA deposits make it difficult to establish a reliable opening position. Rebuilding without evidence can create false certainty.",
    included: ["Initial records review and agreed period definition", "Transaction organization and reconciliation against records supplied", "Documented gaps, ambiguous items and assumptions requiring owner confirmation", "Opening schedules and a handover list for the recurring workflow, where agreed"],
    inputs: ["Bank exports or statements for the periods under review", "OTA payout reports and booking detail", "Receipts, supplier invoices and available expense records", "Opening balances, owner funding notes and prior reports if available"],
    exampleTitle: "What a records review may uncover",
    example: "For example, a three-month statement may show deposits but no matching platform exports, while supplier payments are present without invoices. The review lists those evidence gaps separately; it does not invent a booking allocation or silently classify unsupported transactions.",
    steps: ["Share a high-level description of period and document availability—do not send financial files via the public form.", "Review period, transaction volume, entities, channels and evidence condition.", "Agree in writing on the cleanup scope, price and treatment of unresolved items.", "Reconstruct what the evidence supports, record remaining gaps, then agree a monthly starting point."],
    timing: "Duration depends on the period, completeness, transaction complexity and response to questions. Timing is confirmed after records review; no fixed turnaround is promised.",
    price: `Historical cleanup starts at ${priceText(prices.cleanup)} for up to 12 months, subject to review of the records and scope. This is a starting point, not a quote; confirm price basis and boundaries before agreement.`,
    excludes: ["Unsupported figures are not fabricated to fill gaps.", "Official filings, tax advice, legal conclusions and audit assurance are not included.", "The public enquiry form is not a document upload channel."],
    faqs: serviceFaqs["/villa-bookkeeping-cleanup-bali"],
    guide: "Browse the journal for practical record-keeping guidance before a cleanup review.",
  },
  "/pt-pma-villa-bookkeeping": {
    intro: "PT PMA bookkeeping in Bali separates company transactions, villa operating costs and owner funding. We organise bank and booking records into agreed monthly schedules for owner and tax-professional review. Company formation and tax-compliance support are available through separate engagements with our in-house team; they are not automatic inclusions in this bookkeeping package.",
    audience: "Villa operators who keep records through a PT PMA and need a consistent monthly view of transactions, accounts and supporting documents.",
    problem: "Company transactions, owner advances, multiple accounts and property-level activity can become difficult to distinguish when records are stored across separate inboxes or spreadsheets.",
    included: ["Organized company transaction records using supplied source documents", "Bank and cash schedule reconciliation within the agreed bookkeeping scope", "Owner funding and company movements recorded distinctly when supported", "Period folders and schedules prepared for review by your licensed tax adviser"],
    inputs: ["Entity and account list relevant to bookkeeping", "Bank exports, receipts, invoices and booking-channel records", "Owner funding or reimbursement documentation", "Existing accounting records and the tax adviser's requested schedules, if available"],
    exampleTitle: "Keep the handover factual",
    example: "If an owner transfers funds to cover a supplier payment, the transfer and supplier invoice are recorded with their documents and owner explanation. The bookkeeping schedule makes the movement visible; classification questions that require tax or legal judgment go to the licensed adviser.",
    steps: ["Agree record owner, entity scope and source-document handover.", "Organize and reconcile records for the agreed periods.", "List unanswered classification or documentation questions.", "Provide agreed schedules to the owner for onward review with their licensed adviser."],
    timing: "Monthly timing follows the agreed close and document arrival. The 15th is a target after complete, timely records; it is not a filing deadline or delivery guarantee.",
    price: `Monthly packages currently range from ${priceText(prices.starter)} to ${priceText(prices.premium)}. Exact scope and price basis depend on the records review and must be confirmed before agreement.`,
    excludes: ["Company formation, tax assessment and submission work are separately scoped, not included in this bookkeeping package.", "Any work requiring a professional licence or authority must be undertaken by the appropriate authorised person confirmed in the engagement.", "No bank access, payment execution or authorization is implied."],
    faqs: serviceFaqs["/pt-pma-villa-bookkeeping"],
    guide: "Browse our journal for useful notes on preparing organized bookkeeping records.",
  },
  "/villa-payroll-records-bali": {
    intro: "Bali villa payroll records should connect approved staff schedules with recorded salary costs, payment evidence and BPJS documents. We organize the information supplied within your monthly books; this is record tracking, not payroll execution, BPJS administration or employee-tax filing.",
    audience: "Villa owners and operators who want staff costs and supporting records reflected clearly in their bookkeeping process.",
    problem: "Salary changes, allowances, reimbursements and staff documents can arrive through different channels. Without a dated schedule and source records, monthly costs are harder to review consistently.",
    included: ["Maintain an agreed staff cost schedule from supplied records", "Record salary changes and supporting notes provided by the owner or manager", "Track receipt or status of BPJS-related records in the agreed checklist", "Reconcile payroll-related expense records to the bookkeeping period where in scope", "List missing or inconsistent payroll documents for follow-up"],
    inputs: ["Owner-approved payroll schedule and changes", "Payslips or payment evidence supplied through the agreed client process", "BPJS documents or status records supplied by the responsible party", "Reimbursements and supporting receipts where applicable"],
    exampleTitle: "A record-status example",
    example: "A monthly schedule may show staff role, pay period, amount supported by the supplied payroll record, payment evidence received or missing, and BPJS document status. It does not calculate legal contribution obligations or submit a registration or filing.",
    steps: ["Agree the schedule fields and who supplies approved payroll changes.", "Receive the records through the agreed client document workflow.", "Match available payroll expense evidence to the bookkeeping period.", "Return a status list of received, missing and unclear records."],
    timing: "Records follow the monthly close calendar. The 15th remains a target after complete and timely source documents, not a guarantee.",
    price: "Payroll and BPJS record tracking appears in the published Professional and Premium package inclusions. Confirm the exact scope, price basis and record limits before agreement.",
    excludes: ["No payroll payment execution, bank access or payment authorization.", "No BPJS registration, contribution calculation, filing or employment-law advice.", "No tax advice or official filings."],
    faqs: serviceFaqs["/villa-payroll-records-bali"],
    guide: "Read more journal notes on record-keeping and monthly close processes.",
  },
};

function Header({ path }: { path: string }) {
  const page = sitePages[path];
  const imagery = getPageImagery(path);
  return <section className="bg-primary pb-12 pt-36 text-primary-foreground sm:pb-16">
    <div className={`${wrap} grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-14`}>
      <div>
      <nav aria-label="Breadcrumb" className="mb-9 flex flex-wrap items-center gap-2 text-xs text-primary-foreground/55"><Link href="/" className="hover:text-white">Home</Link>{(page?.service || path === "/services") && <><ChevronRight className="h-3 w-3" /><Link href="/services" className="hover:text-white">Services</Link></>}{path !== "/services" && <><ChevronRight className="h-3 w-3" /><span className="text-primary-foreground/85">{page?.h1}</span></>}</nav>
      <p className={eyebrow}>{page?.service ? "Professional service · Denpasar, Bali" : "Bali Accounting · Denpasar"}</p>
      <h1 className="mt-4 max-w-4xl text-4xl leading-[1.05] sm:text-6xl">{page?.h1}</h1>
      <p className="mt-6 max-w-3xl text-base leading-7 text-primary-foreground/70 sm:text-lg">{serviceDetails[path]?.intro ?? page?.description}</p>
      </div>
      {imagery && <PageVisual imagery={imagery} priority className="w-full" />}
    </div>
  </section>;
}

function CTA({ message, children = "Discuss your setup" }: { message: string; children?: string }) {
  return <a href={whatsapp(message)} target="_blank" rel="noreferrer" onClick={() => trackEvent("whatsapp_click", { page: typeof window === "undefined" ? "/" : window.location.pathname, placement: "page_cta" })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"><span>{children}</span><ArrowUpRight className="h-4 w-4" /></a>;
}

function ServicePage({ path }: { path: string }) {
  const d = serviceDetails[path];
  const topic = expandedServices.find(service => service.path === path)?.label ?? ({ "/airbnb-bookkeeping-bali": "Airbnb bookkeeping", "/villa-financial-reporting-bali": "Villa financial reporting", "/villa-bookkeeping-cleanup-bali": "Catch-up bookkeeping", "/pt-pma-villa-bookkeeping": "PT PMA bookkeeping", "/villa-payroll-records-bali": "Payroll record tracking" } as Record<string, string>)[path];
  return <><Header path={path} />
    {d.sources && <section className={`${wrap} pt-8`} aria-label="Official reference portals"><p className="text-xs font-bold uppercase tracking-wider text-primary">Official reference portals</p><div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">{d.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className={linkClass}>{source.label}<ArrowUpRight className="h-4 w-4" /></a>)}</div><p className="mt-3 text-xs leading-6 text-foreground/65">General starting points, not confirmation of individual eligibility. Current requirements are assessed for the actual engagement.</p></section>}
    <section className={`${wrap} grid gap-14 py-16 lg:grid-cols-[.8fr_1.2fr] lg:py-20`}>
      <div><p className={eyebrow}>Who it helps</p><h2 className="mt-3 font-serif text-3xl text-primary">{topic} for owners and operators</h2><p className="mt-5 leading-7 text-foreground/70">{d.audience}</p><h3 className="mt-9 font-serif text-2xl text-primary">The questions this service addresses</h3><p className="mt-3 leading-7 text-foreground/70">{d.problem}</p><div className="mt-8 flex flex-wrap gap-3"><Link className={linkClass} href="/pricing">Compare monthly bookkeeping costs <ArrowRight className="h-4 w-4" /></Link>{d.sources ? <CTA message={`Hello Client Advisory, please discuss the scope and quotation for ${topic}.`}>Discuss this service</CTA> : <Link className={linkClass} href="/get-started">Discuss your bookkeeping needs <ArrowRight className="h-4 w-4" /></Link>}</div></div>
      <div className="rounded-[2rem] border border-primary/10 bg-white p-7 sm:p-10"><p className={eyebrow}>What may be included</p><ul className="mt-6 space-y-4">{d.included.map((x) => <li key={x} className="flex gap-3 text-sm leading-6 text-foreground/75"><Check className="mt-1 h-4 w-4 shrink-0 text-secondary" />{x}</li>)}</ul></div>
    </section>
    <section className="bg-accent/45 py-16 sm:py-20"><div className={`${wrap} grid gap-10 lg:grid-cols-2`}>
      <div><p className={eyebrow}>What to prepare</p><h2 className="mt-3 font-serif text-3xl text-primary">Useful inputs for a first review</h2><p className="mt-4 leading-7 text-foreground/70">We agree an appropriate, practical document handover after the initial scope conversation. The public enquiry form is only for contact details and a high-level description—please do not upload financial records there.</p><ul className="mt-6 space-y-3">{d.inputs.map((x) => <li key={x} className="flex gap-3 text-sm leading-6 text-foreground/75"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />{x}</li>)}</ul></div>
      <div className="rounded-[2rem] bg-primary p-7 text-primary-foreground sm:p-9"><p className="text-xs font-bold uppercase tracking-[.2em] text-secondary">{d.exampleTitle}</p><p className="mt-5 text-lg leading-8 text-primary-foreground/80">{d.example}</p><p className="mt-6 border-t border-white/15 pt-5 text-xs leading-5 text-primary-foreground/50">Illustration only. Not a client result, financial advice, or a promise of outcome.</p></div>
    </div></section>
    <section className={`${wrap} grid gap-14 py-16 lg:grid-cols-2 lg:py-20`}>
      <div><p className={eyebrow}>Workflow and timing</p><h2 className="mt-3 font-serif text-3xl text-primary">From records to review</h2><ol className="mt-7 space-y-5">{d.steps.map((step, i) => <li key={step} className="flex gap-4"><span className="font-mono text-sm text-secondary">0{i + 1}</span><span className="text-sm leading-6 text-foreground/75">{step}</span></li>)}</ol><p className="mt-7 rounded-xl bg-accent/50 p-5 text-sm leading-6 text-foreground/70"><strong className="text-primary">Timing:</strong> {d.timing}</p></div>
      <div><p className={eyebrow}>Price and boundaries</p><h2 className="mt-3 font-serif text-3xl text-primary">Agree the basis before starting</h2><p className="mt-5 leading-7 text-foreground/70">{d.price}</p><ul className="mt-6 space-y-3">{d.excludes.map((x) => <li key={x} className="text-sm leading-6 text-foreground/65">{x}</li>)}</ul><Link href="/pricing" className={`${linkClass} mt-6`}>See monthly bookkeeping package comparison <ArrowRight className="h-4 w-4" /></Link></div>
    </section>
    <section className="border-y border-primary/10 bg-white py-16"><div className={`${wrap} grid gap-10 md:grid-cols-[.7fr_1.3fr]`}><div><p className={eyebrow}>Questions</p><h2 className="mt-3 font-serif text-3xl text-primary">Before you begin</h2></div><div className="divide-y divide-primary/10">{d.faqs.map(([q,a])=><details key={q} className="group py-5"><summary className="cursor-pointer list-none font-semibold text-primary marker:hidden">{q}<span className="float-right text-secondary">+</span></summary><p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/70">{a}</p></details>)}</div></div></section>
    <section className={`${wrap} grid gap-6 py-14 sm:grid-cols-2`}><div className="rounded-2xl border border-primary/10 p-6"><h2 className="font-serif text-2xl text-primary">Evidence and examples</h2><p className="mt-3 text-sm leading-6 text-foreground/65">{d.guide}</p>{path === "/villa-financial-reporting-bali" && <Link href="/sample-report" className={`${linkClass} mt-4`}>View the sample monthly report <ArrowRight className="h-4 w-4" /></Link>}<Link href="/blog" className={`${linkClass} mt-4`}>Browse practical guides <ArrowRight className="h-4 w-4" /></Link></div><div className="rounded-2xl border border-primary/10 p-6"><h2 className="font-serif text-2xl text-primary">A useful next step</h2><p className="mt-3 text-sm leading-6 text-foreground/65">{d.sources ? "Describe the requested work and your current position without sending sensitive documents. Client Advisory can review fit, responsibilities and a separate quotation." : "Share the property count, booking channels and record situation; we can confirm whether the service fits and discuss scope, limits and price basis."}</p>{d.sources ? <div className="mt-4"><CTA message={`Hello Client Advisory, I would like help with ${topic}.`}>Ask Client Advisory</CTA></div> : <Link href="/get-started" className={`${linkClass} mt-4`}>Send a short enquiry <ArrowRight className="h-4 w-4" /></Link>}</div></section>
    {!d.sources && <BookkeepingDecisionGuide path={path} />}
    {relatedServicePaths[path] && <section className={`${wrap} pb-12`} aria-label="Related services">
      <h2 className="font-serif text-2xl text-primary">Connected services</h2>
      <p className="mt-3 text-sm leading-7 text-foreground/70">Explore the adjacent workstreams. Each has its own responsibilities and agreed scope.</p>
      <div className="mt-5 flex flex-wrap gap-x-8 gap-y-4">{relatedServicePaths[path].map(href => <Link key={href} href={href} className={linkClass}>{sitePages[href].h1}<ArrowRight className="h-4 w-4" /></Link>)}</div>
    </section>}
    <CompareCrossLink path={path} />
    <section className="bg-accent/45 py-12"><div className={`${wrap} flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between`}><div><p className={eyebrow}>Client Advisory</p><h2 className="mt-2 font-serif text-3xl text-primary">Talk through your records.</h2></div><CTA message={`Hello Client Advisory, I'd like to discuss ${path.replaceAll("-", " ").replace("/", "")}.`} /></div></section>
  </>;
}

function ServicesDirectory() {
  return <><Header path="/services" />
    <section className={`${wrap} py-16 sm:py-20`}>
      <p className="max-w-3xl text-lg leading-8 text-foreground/70">Start with the task you need help with: company setup, operating permissions, tax administration, visa preparation or recurring bookkeeping. Each page explains the deliverables, documents, process and scope limits. Corporate, tax and visa projects are separately quoted; monthly bookkeeping packages keep their stated inclusions.</p>
      <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-primary/10 bg-primary/10 md:grid-cols-2">
        {serviceLinks.map(([href, title], i) => <Link href={href} key={href} className="group bg-background p-7 sm:p-9">
          <span className="font-mono text-xs text-secondary">{String(i + 1).padStart(2, "0")} / SERVICE</span>
          <h2 className="mt-5 font-serif text-3xl text-primary group-hover:text-secondary">{title}</h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-foreground/65">{serviceDetails[href]?.intro ?? "Step-by-step reconciliation of Airbnb, Booking.com, Agoda, VRBO and direct bookings for Bali villas: gross booking value, platform fees, refunds, reserves and bank receipts, explained in one payout bridge."}</p>
          <span className={`${linkClass} mt-6`}>Explore scope <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
        </Link>)}
      </div>
      <div className="mt-12 rounded-3xl bg-primary p-8 text-primary-foreground sm:p-10">
        <h2 className="font-serif text-3xl">Not sure which service fits?</h2>
        <p className="mt-3 max-w-2xl leading-7 text-primary-foreground/70">Describe the work you need without sending sensitive documents. Client Advisory can discuss fit, responsible people and a written scope. The consultation is a conversation, not a commitment.</p>
        <a href={whatsapp("Hello Client Advisory, please help me choose the right company, tax, visa or bookkeeping service.")} target="_blank" rel="noreferrer" onClick={() => trackEvent("whatsapp_click", { page: "/services", placement: "services_directory" })} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-background px-6 font-semibold text-primary">Discuss your needs <ArrowUpRight className="h-4 w-4" /></a>
      </div>
    </section></>;
}

const packages = [
  { name: "Starter", price: priceText(prices.starter), items: ["1 villa", "Monthly bookkeeping", "Up to 2 booking channels", "Basic monthly P&L", "Private document folder"], tone: "light" },
  { name: "Professional", price: priceText(prices.professional), items: ["Monthly bookkeeping", "Full owner financial report", "Payroll and BPJS record tracking", "All booking channels", "Monthly review call"], tone: "dark" },
  { name: "Premium", price: priceText(prices.premium), items: ["Monthly bookkeeping and reporting", "Tax-pack for Konsultan Pajak (record handover only)", "Forecast versus actuals", "Annual position summary", "Priority account review"], tone: "light" },
];
function Pricing() {
  return <><Header path="/pricing" /><section className={`${wrap} py-14 sm:py-20`}><p className="max-w-3xl text-lg leading-8 text-foreground/70">Three published monthly package prices. The list below preserves the current inclusion descriptions; final boundaries, price basis and practical limits are agreed before work starts.</p><div className="mt-10 grid gap-5 lg:grid-cols-3">{packages.map((p) => <article key={p.name} className={`flex flex-col rounded-[2rem] p-7 sm:p-8 ${p.tone==="dark" ? "bg-primary text-primary-foreground shadow-xl" : "border border-primary/10 bg-white"}`}><p className="text-xs font-bold uppercase tracking-[.18em] text-secondary">{p.name}</p><p className="mt-6 font-serif text-3xl">{p.price}<span className={`ml-2 font-sans text-xs ${p.tone==="dark"?"text-white/50":"text-foreground/50"}`}>/ month</span></p><ul className="my-8 flex-1 space-y-4">{p.items.map((x)=><li key={x} className="flex gap-3 text-sm leading-6"><Check className="mt-1 h-4 w-4 shrink-0 text-secondary" />{x}</li>)}</ul><a href={whatsapp(`Hello Client Advisory, please explain the ${p.name} package inclusions and scope.`)} target="_blank" rel="noreferrer" onClick={()=>trackEvent("whatsapp_click",{page:"/pricing",placement:`${p.name.toLowerCase()}_package`})} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold ${p.tone==="dark"?"bg-[#238f5c] text-white":"bg-accent text-primary"}`}>Ask about {p.name}<ArrowUpRight className="h-4 w-4" /></a></article>)}</div>
    <div className="mt-8 grid gap-8 rounded-3xl border border-secondary/25 bg-accent/40 p-7 sm:p-9 md:grid-cols-[1fr_auto] md:items-center"><div><p className={eyebrow}>One-time project</p><h2 className="mt-2 font-serif text-3xl text-primary">Historical bookkeeping cleanup</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/70">Starts at {priceText(prices.cleanup)} for up to 12 months, subject to records review. This is a starting price—not a fixed quote. Period, volume, evidence quality and unresolved items are reviewed before a written scope.</p></div><Link href="/villa-bookkeeping-cleanup-bali" className={linkClass}>Review cleanup scope <ArrowRight className="h-4 w-4" /></Link></div>
     <div className="mt-10 grid gap-10 md:grid-cols-2"><div><h2 className="font-serif text-2xl text-primary">What to confirm before agreement</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-foreground/70">{["Which properties, entities, periods and records are included", "Transaction volume, account and staff limits, if any", "Price basis and any additional work or fees", "Software, onboarding and agreement terms", "Reporting format, responsibilities and document timetable"].map(x=><li key={x} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />{x}</li>)}</ul></div><div><h2 className="font-serif text-2xl text-primary">Delivery, clearly stated</h2><p className="mt-4 text-sm leading-7 text-foreground/70">Monthly delivery by the 15th is a target after complete and timely source documents are received. Scope can vary with record condition and agreed work. Bookkeeping packages do not include tax advice or official filings; those remain with a licensed Indonesian tax adviser.</p><p className="mt-4 text-sm leading-7 text-foreground/70">Starter states 1 villa and up to 2 booking channels. For other packages, applicable property, volume, account or staff limits and price basis must be confirmed. No software/onboarding charge, contract minimum, or response hours are assumed. Ask us to confirm applicable details in writing.</p></div></div>
    <div className="mt-10 rounded-3xl border border-primary/10 bg-accent/40 p-7 sm:p-9"><h2 className="font-serif text-2xl text-primary">Paying for bookkeeping because OTA payouts do not match?</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/70">Read the pillar guide to <Link href="/airbnb-ota-reconciliation-bali" className="font-semibold text-primary underline underline-offset-4">Airbnb &amp; OTA payout reconciliation for Bali villas</Link> — it shows exactly what each package reconciles, what records you supply, and what stays outside the scope before you compare prices.</p></div>
    <div className="mt-12 flex flex-col gap-5 rounded-3xl bg-primary p-8 text-primary-foreground sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-serif text-2xl">Compare reporting with a real example.</h2><p className="mt-2 text-sm text-primary-foreground/65">The sample is ungated and uses fictional demonstration numbers.</p></div><Link href="/sample-report" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-secondary">Open the sample report <ArrowRight className="h-4 w-4" /></Link></div>
  </section></>;
}

function SampleReport() {
  useEffect(() => { trackEvent("sample_report_view", { page: "/sample-report", placement: "page_view" }); }, []);
  return <><Header path="/sample-report" /><MonthlyVillaReport /><SixVillaScenario /></>;
}

function About() {
  return <><Header path="/about" /><section className={`${wrap} grid gap-12 py-16 lg:grid-cols-[.9fr_1.1fr]`}>
    <div><p className={eyebrow}>A Denpasar-based bookkeeping firm</p><h2 className="mt-3 font-serif text-3xl text-primary">Bookkeeping focused on Bali villa operations.</h2><p className="mt-5 leading-7 text-foreground/70">Bali Accounting was founded by Abel Yuniartini. The firm is based at Jl. Tukad Barito Timur III No.16, Panjer, Denpasar Selatan, Bali 80226. We support villa owners and operators with organized records and monthly financial reporting.</p><p className="mt-5 leading-7 text-foreground/70">Our work connects rental bookings, OTA payouts, supplier expenses and owner movements to their source documents. We prepare agreed management reports and make missing information visible so you can review your property’s numbers with your manager and licensed tax adviser.</p></div>
    <div className="rounded-[2rem] bg-primary p-8 text-primary-foreground sm:p-10"><MapPin className="h-6 w-6 text-secondary" /><p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-secondary">Office address</p><address className="mt-3 not-italic font-serif text-2xl leading-relaxed">Jl. Tukad Barito Timur III No.16<br/>Panjer, Denpasar Selatan<br/>Bali 80226</address><a href="https://maps.google.com/?q=Jl.+Tukad+Barito+Timur+III+No.16,+Panjer,+Denpasar+Selatan,+Bali" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground/70 hover:text-white">Open map <ArrowUpRight className="h-4 w-4" /></a></div>
    <div className="lg:col-span-2"><h2 className="font-serif text-3xl text-primary">Responsibilities and boundaries</h2><div className="mt-6 grid gap-5 md:grid-cols-3">{[
      ["Organize", "Maintain agreed records from documents and schedules supplied by the owner or operator."],
      ["Reconcile", "Compare booking, payout, cash and expense information; record differences that need clarification."],
      ["Hand over", "Prepare agreed reporting and schedules for the owner, manager or licensed Indonesian tax adviser to review."],
    ].map(([title,text])=><div key={title} className="border-t-2 border-secondary pt-5"><h3 className="font-serif text-2xl text-primary">{title}</h3><p className="mt-3 text-sm leading-6 text-foreground/65">{text}</p></div>)}</div><p className="mt-8 max-w-4xl text-sm leading-7 text-foreground/65">Bali Accounting provides bookkeeping and management reporting, not tax advice or official filings. Owners retain control of bank accounts, payments and business decisions. Contact Client Advisory to confirm service fit, reporting responsibilities and the appropriate document-handling process.</p><div className="mt-6"><CTA message="Hello Client Advisory, I would like to learn more about Bali Accounting's bookkeeping scope." >WhatsApp Client Advisory</CTA></div></div>
    <div className="lg:col-span-2"><h2 className="font-serif text-3xl text-primary">Experience you can verify before you enquire</h2><p className="mt-4 max-w-4xl text-sm leading-7 text-foreground/65">We would rather show you how the work is done than ask you to trust adjectives. The founder is named on this page and in our structured data; the office address is published and mapped; the prices are public; and the sample owner report is open for inspection before any conversation. Where a claim would need a licence, credential or client permission we do not have on record, we do not print it — ask us directly and we will tell you what we can document.</p><div className="mt-6 grid gap-5 md:grid-cols-3">{[
      ["Named and accountable", "Founded by Abel Yuniartini and run by an in-house Denpasar team. The same people who agree your scope review your records each month."],
      ["A written, repeatable process", "A four-step monthly close: agree the scope, collect source records, reconcile and review, then share the report with its open questions."],
      ["Evidence before figures", "Every report line traces to a statement, invoice or booking record. Unsupported amounts stay listed as questions — the standard behind our OTA reconciliation work."],
    ].map(([title,text])=><div key={title} className="border-t-2 border-secondary pt-5"><h3 className="font-serif text-2xl text-primary">{title}</h3><p className="mt-3 text-sm leading-6 text-foreground/65">{text}</p></div>)}</div><p className="mt-8 max-w-4xl text-sm leading-7 text-foreground/65">Start with the <Link href="/airbnb-ota-reconciliation-bali" className={linkClass}>Airbnb &amp; OTA payout reconciliation guide</Link> to see that standard applied line by line, then compare it with the <Link href="/sample-report" className={linkClass}>sample owner report</Link> and <Link href="/pricing" className={linkClass}>published package prices</Link>.</p></div>
  </section><ClientShowcase /></>;
}

const faqs: [string,string,string?][] = [
  ["What do the monthly packages cost?",`The published prices are ${priceText(prices.starter)}, ${priceText(prices.professional)} and ${priceText(prices.premium)} per month. Scope, limits and price basis are confirmed before agreement.`,"/pricing"],
  ["What will I receive each month?","Depending on the selected package and agreed scope, this may include bookkeeping, a P&L, owner reporting, reconciled channel records, schedules and a list of open questions.","/villa-financial-reporting-bali"],
  ["Can you work with our existing villa manager?","Yes, the document workflow can include an owner or manager contact. Responsibilities and who supplies or approves information are agreed at intake."],
  ["What if receipts or statements are missing?","We identify gaps and request clarification. Unsupported figures are not made up; a historical cleanup can be reviewed where there is a backlog.","/villa-bookkeeping-cleanup-bali"],
  ["How long does onboarding take?","Timing depends on records, channels and agreed scope. We confirm a practical start after reviewing the setup; no standard duration is promised."],
  ["What documents should I prepare?","Usually the useful starting set includes bank exports, OTA statements, booking details, invoices, receipts and any owner-funding notes relevant to the work. Never attach financial records to the public form."],
  ["Can you handle several villas?","We can discuss the records and reporting scope. Do not assume a per-villa basis or a particular property limit; confirm applicable limits and pricing before agreement."],
  ["Do you require a particular accounting platform?","The exact software and export workflow should be agreed for your setup. No software fee or required platform is assumed by this page."],
  ["Do you access or control my bank or OTA accounts?","No bank control, payment authority or direct OTA integration is implied. Bookkeeping uses agreed documents or exports provided by the client.","/airbnb-bookkeeping-bali"],
  ["Do you support tax compliance or tax planning?","Yes. Our qualified in-house team offers separately scoped tax-compliance and planning engagements. The responsible professional and any authorised submission work are confirmed before agreement. These services are not automatically included in monthly bookkeeping fees.","/tax-compliance-bali"],
  ["When are reports delivered?","The 15th is a target after complete, timely source documents arrive. It is not a guaranteed delivery date."],
  ["How do I get started?","Send a short enquiry with property count, location and the main record question, or contact us directly on the verified WhatsApp number.","/get-started"],
  ...additionalFaqs,
];
function FAQ() {
  return <><Header path="/faq" /><section className={`${wrap} max-w-5xl py-14 sm:py-20`}><p className="mb-8 max-w-3xl text-lg leading-8 text-foreground/70">Straight answers on package fit, source documents and what bookkeeping support does—and does not—cover.</p><div className="divide-y divide-primary/10 border-y border-primary/10">{faqs.map(([q,a,href])=><details key={q} className="group py-5"><summary className="cursor-pointer list-none pr-4 font-semibold text-primary marker:hidden">{q}<span className="float-right text-secondary">+</span></summary><p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/70">{a}{href&&<> <Link className="font-semibold text-secondary underline underline-offset-2" href={href}>Read more</Link>.</>}</p></details>)}</div><Link href="/get-started" className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground">Ask about your situation <ArrowRight className="h-4 w-4" /></Link></section></>;
}
function GetStarted() {
  return <><Header path="/get-started" /><section className={`${wrap} grid gap-12 py-14 lg:grid-cols-[.75fr_1.25fr] lg:py-20`}><div><p className={eyebrow}>No financial uploads</p><h2 className="mt-3 font-serif text-3xl text-primary">Start with the shape of the work.</h2><p className="mt-5 leading-7 text-foreground/70">Tell us where the property is, how many properties you operate and what bookkeeping question is most pressing. The team can then discuss fit, documents and scope before anything is agreed.</p><div className="mt-8 space-y-4 border-t border-primary/10 pt-6 text-sm"><a onClick={()=>trackEvent("whatsapp_click",{page:"/get-started",placement:"contact_panel"})} href={whatsapp()} target="_blank" rel="noreferrer" className="block font-semibold text-primary underline underline-offset-4">WhatsApp {PHONE}</a><a href="tel:+6281237402292" onClick={()=>trackEvent("phone_click",{page:"/get-started",placement:"contact_panel"})} className="block font-semibold text-primary underline underline-offset-4">Call {PHONE}</a><p className="leading-6 text-foreground/55">Office: Jl. Tukad Barito Timur III No.16, Panjer, Denpasar Selatan, Bali 80226</p></div><p className="mt-6 text-xs leading-5 text-foreground/50">No verified response hours are published. Submitting this form saves an enquiry; use WhatsApp to continue a conversation.</p></div><div className="rounded-[2rem] border border-primary/10 bg-white p-6 sm:p-9"><h2 className="mb-6 font-serif text-2xl text-primary">Enquiry form</h2><ConsultationForm /></div></section></>;
}
function Privacy() {
  return <><Header path="/privacy" /><article className={`${wrap} max-w-4xl space-y-8 py-14 sm:py-20`}><section><h2 className="font-serif text-2xl text-primary">Enquiry details</h2><p className="mt-3 text-sm leading-7 text-foreground/70">The enquiry form requests only information needed to understand and respond to an initial request: name, contact details, property count, location, issue summary, and optional booking channels or package interest. Form submissions are stored in our database for 90 days. Do not submit bank statements, receipts or other financial uploads through the public form.</p></section><section><h2 className="font-serif text-2xl text-primary">Website events</h2><p className="mt-3 text-sm leading-7 text-foreground/70">Website event records contain only page, placement, service and event type. They do not include names, contact details, message content, IP addresses or session identifiers. Infrastructure providers may retain operational logs as part of delivering the website.</p></section><section><h2 className="font-serif text-2xl text-primary">WhatsApp and phone</h2><p className="mt-3 text-sm leading-7 text-foreground/70">WhatsApp is a separate service with its own privacy policy and data practices. Contacting us there is optional. You may also call <a href="tel:+6281237402292" className="underline underline-offset-4">{PHONE}</a>.</p></section><section><h2 className="font-serif text-2xl text-primary">Privacy questions or requests</h2><p className="mt-3 text-sm leading-7 text-foreground/70">For a privacy request, message the verified WhatsApp number <a href={whatsapp("Hello Bali Accounting, I have a privacy request.")} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-4">+62 812-3740-2292</a>. Please avoid including sensitive financial documents in an initial message.</p></section><p className="border-t border-primary/10 pt-6 text-xs leading-5 text-foreground/50">This page describes website enquiries and measurement. It is not a substitute for a separately agreed client engagement or document-handling arrangement.</p></article></>;
}
function Terms() {
  return <><Header path="/terms" /><article className={`${wrap} max-w-4xl space-y-8 py-14 sm:py-20`}>
    <section><h2 className="font-serif text-2xl text-primary">Website information</h2><p className="mt-3 text-sm leading-7 text-foreground/70">Website content is general information about the services described. It is not individual legal, tax, investment or immigration advice, and does not create a client engagement or confirm eligibility.</p></section>
    <section><h2 className="font-serif text-2xl text-primary">Examples and package scope</h2><p className="mt-3 text-sm leading-7 text-foreground/70">Sample reports and scenarios are fictional illustrations. Monthly package prices and inclusions require confirmation of scope, price basis and applicable limits. Company, licensing, tax and visa projects are separately quoted, not automatic bookkeeping inclusions.</p></section>
    <section><h2 className="font-serif text-2xl text-primary">Separate engagement terms</h2><p className="mt-3 text-sm leading-7 text-foreground/70">Actual deliverables, responsibilities, timing, fees, document handling and terms are agreed separately with the client. No response time, contract duration or service limit is promised unless confirmed in that agreement.</p></section>
    <section><h2 className="font-serif text-2xl text-primary">Professional boundaries</h2><p className="mt-3 text-sm leading-7 text-foreground/70">Our in-house team supports bookkeeping and separately scoped company, tax and visa work. Tasks requiring a professional licence, authority or notarial execution must be handled by the appropriate person identified in the engagement. Authorities decide applications; tax savings, approvals and unrestricted operating or working permissions are not guaranteed. No bank control, payment authority or direct booking-platform integration is implied.</p><Link href="/services" className={`${linkClass} mt-5`}>Review the service boundaries <ArrowRight className="h-4 w-4" /></Link></section>
  </article></>;
}

export default function PageContent({ path }: { path: string }) {
  const normalized = path === "/" ? "/" : `/${path.replace(/^\/|\/$/g, "")}`;
  useEffect(() => {
    const page = sitePages[normalized];
    if (!page) return;
    document.title = page.title;
    const canonical = `${SITE_ORIGIN}${normalized === "/" ? "/" : normalized}`;
    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) { canonicalLink = document.createElement("link"); canonicalLink.rel = "canonical"; document.head.appendChild(canonicalLink); }
    canonicalLink.href = canonical;
    const setMeta = (selector: string, attribute: string, value: string) => {
      let element = document.querySelector<HTMLMetaElement>(selector);
      if (!element) { element = document.createElement("meta"); if (attribute === "property") element.setAttribute(attribute, selector.match(/property="([^"]+)"/)?.[1] ?? ""); else element.name = selector.match(/name="([^"]+)"/)?.[1] ?? ""; document.head.appendChild(element); }
      element.setAttribute("content", value);
    };
    setMeta('meta[name="description"]', "name", page.description);
    setMeta('meta[property="og:title"]', "property", page.title);
    setMeta('meta[property="og:description"]', "property", page.description);
    setMeta('meta[property="og:url"]', "property", canonical);
    setMeta('meta[name="twitter:title"]', "name", page.title);
    setMeta('meta[name="twitter:description"]', "name", page.description);
    updateShareImage(normalized);
  }, [normalized]);
  const content = serviceDetails[normalized] ? <ServicePage path={normalized} /> : ({
    "/services": <ServicesDirectory />, "/pricing": <Pricing />, "/sample-report": <SampleReport />,
    "/about": <About />, "/get-started": <GetStarted />, "/faq": <FAQ />, "/privacy": <Privacy />, "/terms": <Terms />,
  } as Record<string, React.ReactNode>)[normalized];
  if (content) return <Layout>{content}<PageEducation path={normalized} /><SeoTopicGuides path={normalized} /></Layout>;
  return <Layout><div className={`${wrap} py-24`}><h1 className="font-serif text-4xl text-primary">This page is unavailable</h1><p className="mt-4 text-foreground/65">Choose a current service, report example or contact page.</p><Link href="/services" className={`${linkClass} mt-6`}>Browse services <ArrowRight className="h-4 w-4" /></Link></div></Layout>;
}
