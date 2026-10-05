import { useEffect } from "react";
import { prices, priceText } from "@/lib/pricing";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, MapPin } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ConsultationForm } from "@/components/ConsultationForm";
import { MonthlyVillaReport } from "@/components/finance-report/MonthlyVillaReport";
import { PHONE, SITE_ORIGIN, sitePages, whatsapp } from "@/lib/site-pages";
import { trackEvent } from "@/lib/analytics";

const wrap = "mx-auto max-w-7xl px-5 md:px-8";
const eyebrow = "text-xs font-bold uppercase tracking-[.2em] text-secondary";
const linkClass = "inline-flex items-center gap-2 font-semibold text-primary underline decoration-secondary/50 underline-offset-4 transition-colors hover:text-secondary";
const serviceLinks = [
  ["/airbnb-bookkeeping-bali", "Booking-channel bookkeeping"],
  ["/villa-financial-reporting-bali", "Monthly owner reporting"],
  ["/villa-bookkeeping-cleanup-bali", "Historical cleanup"],
  ["/pt-pma-villa-bookkeeping", "PT PMA records"],
  ["/villa-payroll-records-bali", "Payroll records"],
];

type ServiceInfo = { intro: string; audience: string; problem: string; included: string[]; inputs: string[]; exampleTitle: string; example: string; steps: string[]; timing: string; price: string; excludes: string[]; faqs: [string, string][]; guide: string };
const serviceDetails: Record<string, ServiceInfo> = {
  "/airbnb-bookkeeping-bali": {
    intro: "A platform deposit is the end of a calculation, not the starting point. We organize booking activity and payout statements from Airbnb, Booking.com, Agoda, VRBO and direct bookings so gross activity, fees, adjustments and bank receipts can be reviewed together.",
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
    faqs: [["Do you connect directly to Airbnb or Booking.com?", "No direct integration is promised. We work from the records and exports agreed during intake."], ["What if a payout is different from the bank deposit?", "We record the visible difference and ask for the relevant statement or explanation. Unresolved timing or evidence gaps remain identified in the report."], ["Can you reconcile direct bookings too?", "Yes, where booking schedules and supporting receipts are supplied and included in the agreed scope."]],
    guide: "Visit the journal for practical notes on payout reconciliation and monthly records.",
  },
  "/villa-financial-reporting-bali": {
    intro: "A useful villa report makes it possible to distinguish operating activity from cash timing. Bali Accounting prepares an agreed monthly bookkeeping pack with clear income, expenses, supporting schedules and a list of questions still open.",
    audience: "Owners living remotely, villa managers who need a consistent handover, and operators who want period-by-period records rather than a bank balance alone.",
    problem: "A cash balance cannot explain which month earned the revenue, what costs relate to operations, or whether an open booking payout or owner movement changed cash.",
    included: ["Monthly profit-and-loss view based on the records supplied", "Relevant balance schedules and reconciled cash movements by agreed scope", "Booking-channel view and payout reconciliation where included", "Payroll schedules and BPJS record status where applicable to package scope", "Open questions and missing-document notes for owner or manager review"],
    inputs: ["Bank and cash records, platform activity and direct-booking schedules", "Supplier invoices, receipts and operating cost information", "Owner funding or withdrawal notes where applicable", "Payroll schedules and supporting records if those are in scope"],
    exampleTitle: "How to read a simple month",
    example: "If booking activity produces Rp 98,000,000 after Rp 2,000,000 of refunds, and platform charges are Rp 15,000,000, the report can show those lines separately. If operating costs are Rp 52,000,000, the illustrative operating result is Rp 31,000,000. A bank receipt of Rp 80,000,000 can still differ because Rp 3,000,000 has not arrived yet. Owner funding and drawings are shown as cash movements, not operating revenue or expense.",
    steps: ["Agree reporting needs, source records, periods and responsibilities.", "Collect documents in an agreed shared workflow.", "Code and reconcile the period, documenting exceptions.", "Deliver the report and question list for owner or manager review."],
    timing: "The 15th is a reporting target only when source documents are complete and received on time. Late records, unresolved questions or complex reconciliations can change delivery timing.",
    price: `Packages are ${priceText(prices.starter)}, ${priceText(prices.professional)} and ${priceText(prices.premium)} per month, with different reporting inclusions. Review the comparison page and confirm exact scope and price basis before agreement.`,
    excludes: ["Reports are management information, not audit opinions or official tax statements.", "Tax advice and filing are handled by a licensed Indonesian tax adviser, not by Bali Accounting.", "No control of client bank accounts or payment authority is included."],
    faqs: [["Can you show me what the report looks like?", "Yes. The ungated sample page uses fictional figures and explains how to read each part."], ["Does a report guarantee delivery on the 15th?", "No. The 15th is a target after complete, timely source records are received."], ["Is a P&L the same as cash in the bank?", "No. The page explains the difference using fictional example numbers."]],
    guide: "The sample report shows the shape of the monthly pack using demonstration figures only.",
  },
  "/villa-bookkeeping-cleanup-bali": {
    intro: "A backlog is easier to scope when its boundaries are visible. We review the periods, source records and outstanding reconciliations first, then agree which historical work can be reconstructed and how gaps will be reported.",
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
    faqs: [["What does up to 12 months mean?", "It describes the maximum period in the stated starting offer, subject to review—not a promise that every 12-month backlog fits the same price."], ["Can all missing records be reconstructed?", "Only where evidence supports it. Remaining gaps are listed for owner or adviser follow-up."], ["What should I send first?", "Start with a high-level description through the form or WhatsApp. We will agree a suitable document handover after reviewing fit and scope."]],
    guide: "Browse the journal for practical record-keeping guidance before a cleanup review.",
  },
  "/pt-pma-villa-bookkeeping": {
    intro: "PT PMA villa records benefit from a clear separation between company activity, owner funding and supporting documents. Bali Accounting organizes bookkeeping schedules and prepares a records handover for your licensed Indonesian tax adviser.",
    audience: "Villa operators who keep records through a PT PMA and need a consistent monthly view of transactions, accounts and supporting documents.",
    problem: "Company transactions, owner advances, multiple accounts and property-level activity can become difficult to distinguish when records are stored across separate inboxes or spreadsheets.",
    included: ["Organized company transaction records using supplied source documents", "Bank and cash schedule reconciliation within the agreed bookkeeping scope", "Owner funding and company movements recorded distinctly when supported", "Period folders and schedules prepared for review by your licensed tax adviser"],
    inputs: ["Entity and account list relevant to bookkeeping", "Bank exports, receipts, invoices and booking-channel records", "Owner funding or reimbursement documentation", "Existing accounting records and the tax adviser's requested schedules, if available"],
    exampleTitle: "Keep the handover factual",
    example: "If an owner transfers funds to cover a supplier payment, the transfer and supplier invoice are recorded with their documents and owner explanation. The bookkeeping schedule makes the movement visible; classification questions that require tax or legal judgment go to the licensed adviser.",
    steps: ["Agree record owner, entity scope and source-document handover.", "Organize and reconcile records for the agreed periods.", "List unanswered classification or documentation questions.", "Provide agreed schedules to the owner for onward review with their licensed adviser."],
    timing: "Monthly timing follows the agreed close and document arrival. The 15th is a target after complete, timely records; it is not a filing deadline or delivery guarantee.",
    price: `Monthly packages currently range from ${priceText(prices.starter)} to ${priceText(prices.premium)}. Exact scope and price basis depend on the records review and must be confirmed before agreement.`,
    excludes: ["No company formation, legal conclusions, tax advice or official filings.", "Bali Accounting does not represent that it holds a tax-adviser licence.", "No bank access, payment execution or authorization is implied."],
    faqs: [["Do you advise on PT PMA legal or tax treatment?", "No. We organize records and hand over schedules for review by a qualified, licensed Indonesian professional."], ["Can records be separated by property?", "We can discuss an agreed schedule structure based on the records and scope; confirm the exact reporting dimensions before agreement."], ["Do you file company tax returns?", "No. Official filings remain with your licensed tax adviser."]],
    guide: "Browse our journal for useful notes on preparing organized bookkeeping records.",
  },
  "/villa-payroll-records-bali": {
    intro: "Keep staff-cost information legible in the monthly books with schedules and supporting documents. This service concerns payroll record organization and BPJS record tracking—not payroll execution or statutory administration.",
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
    faqs: [["Do you run payroll or pay staff?", "No. We organize supplied payroll records within the bookkeeping scope; the owner or operator remains responsible for execution and authorization."], ["Do you register staff with BPJS?", "No. The stated service is record tracking only, not registration or filing."], ["What if payroll records are incomplete?", "We list missing evidence and request clarification rather than inventing amounts or status."]],
    guide: "Read more journal notes on record-keeping and monthly close processes.",
  },
};

function Header({ path }: { path: string }) {
  const page = sitePages[path];
  return <section className="bg-primary pb-16 pt-36 text-primary-foreground sm:pb-20">
    <div className={wrap}>
      <nav aria-label="Breadcrumb" className="mb-9 flex flex-wrap items-center gap-2 text-xs text-primary-foreground/55"><Link href="/" className="hover:text-white">Home</Link>{(page?.service || path === "/services") && <><ChevronRight className="h-3 w-3" /><Link href="/services" className="hover:text-white">Services</Link></>}{path !== "/services" && <><ChevronRight className="h-3 w-3" /><span className="text-primary-foreground/85">{page?.h1}</span></>}</nav>
      <p className={eyebrow}>{page?.service ? "Bookkeeping service · Denpasar, Bali" : "Bali Accounting · Denpasar"}</p>
      <h1 className="mt-4 max-w-4xl text-4xl leading-[1.05] sm:text-6xl">{page?.h1}</h1>
      <p className="mt-6 max-w-3xl text-base leading-7 text-primary-foreground/70 sm:text-lg">{serviceDetails[path]?.intro ?? page?.description}</p>
    </div>
  </section>;
}

function CTA({ message, children = "Discuss your setup" }: { message: string; children?: string }) {
  return <a href={whatsapp(message)} target="_blank" rel="noreferrer" onClick={() => trackEvent("whatsapp_click", { page: typeof window === "undefined" ? "/" : window.location.pathname, placement: "page_cta" })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"><span>{children}</span><ArrowUpRight className="h-4 w-4" /></a>;
}

function ServicePage({ path }: { path: string }) {
  const d = serviceDetails[path];
  return <><Header path={path} />
    <section className={`${wrap} grid gap-14 py-16 lg:grid-cols-[.8fr_1.2fr] lg:py-20`}>
      <div><p className={eyebrow}>Who it helps</p><h2 className="mt-3 font-serif text-3xl text-primary">A clear working scope</h2><p className="mt-5 leading-7 text-foreground/70">{d.audience}</p><h3 className="mt-9 font-serif text-2xl text-primary">The problem behind the numbers</h3><p className="mt-3 leading-7 text-foreground/70">{d.problem}</p><div className="mt-8 flex flex-wrap gap-3"><Link className={linkClass} href="/pricing">Compare package scope <ArrowRight className="h-4 w-4" /></Link><Link className={linkClass} href="/get-started">Enquire about fit <ArrowRight className="h-4 w-4" /></Link></div></div>
      <div className="rounded-[2rem] border border-primary/10 bg-white p-7 sm:p-10"><p className={eyebrow}>What may be included</p><ul className="mt-6 space-y-4">{d.included.map((x) => <li key={x} className="flex gap-3 text-sm leading-6 text-foreground/75"><Check className="mt-1 h-4 w-4 shrink-0 text-secondary" />{x}</li>)}</ul></div>
    </section>
    <section className="bg-accent/45 py-16 sm:py-20"><div className={`${wrap} grid gap-10 lg:grid-cols-2`}>
      <div><p className={eyebrow}>What to prepare</p><h2 className="mt-3 font-serif text-3xl text-primary">Useful inputs for a first review</h2><p className="mt-4 leading-7 text-foreground/70">We agree an appropriate, practical document handover after the initial scope conversation. The public enquiry form is only for contact details and a high-level description—please do not upload financial records there.</p><ul className="mt-6 space-y-3">{d.inputs.map((x) => <li key={x} className="flex gap-3 text-sm leading-6 text-foreground/75"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />{x}</li>)}</ul></div>
      <div className="rounded-[2rem] bg-primary p-7 text-primary-foreground sm:p-9"><p className="text-xs font-bold uppercase tracking-[.2em] text-secondary">{d.exampleTitle}</p><p className="mt-5 text-lg leading-8 text-primary-foreground/80">{d.example}</p><p className="mt-6 border-t border-white/15 pt-5 text-xs leading-5 text-primary-foreground/50">Illustration only. Not a client result, financial advice, or a promise of outcome.</p></div>
    </div></section>
    <section className={`${wrap} grid gap-14 py-16 lg:grid-cols-2 lg:py-20`}>
      <div><p className={eyebrow}>Workflow and timing</p><h2 className="mt-3 font-serif text-3xl text-primary">From records to review</h2><ol className="mt-7 space-y-5">{d.steps.map((step, i) => <li key={step} className="flex gap-4"><span className="font-mono text-sm text-secondary">0{i + 1}</span><span className="text-sm leading-6 text-foreground/75">{step}</span></li>)}</ol><p className="mt-7 rounded-xl bg-accent/50 p-5 text-sm leading-6 text-foreground/70"><strong className="text-primary">Timing:</strong> {d.timing}</p></div>
      <div><p className={eyebrow}>Price and boundaries</p><h2 className="mt-3 font-serif text-3xl text-primary">Agree the basis before starting</h2><p className="mt-5 leading-7 text-foreground/70">{d.price}</p><ul className="mt-6 space-y-3">{d.excludes.map((x) => <li key={x} className="text-sm leading-6 text-foreground/65">Not included: {x}</li>)}</ul><Link href="/pricing" className={`${linkClass} mt-6`}>See current package comparison <ArrowRight className="h-4 w-4" /></Link></div>
    </section>
    <section className="border-y border-primary/10 bg-white py-16"><div className={`${wrap} grid gap-10 md:grid-cols-[.7fr_1.3fr]`}><div><p className={eyebrow}>Questions</p><h2 className="mt-3 font-serif text-3xl text-primary">Before you begin</h2></div><div className="divide-y divide-primary/10">{d.faqs.map(([q,a])=><details key={q} className="group py-5"><summary className="cursor-pointer list-none font-semibold text-primary marker:hidden">{q}<span className="float-right text-secondary">+</span></summary><p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/70">{a}</p></details>)}</div></div></section>
    <section className={`${wrap} grid gap-6 py-14 sm:grid-cols-2`}><div className="rounded-2xl border border-primary/10 p-6"><h2 className="font-serif text-2xl text-primary">Evidence and examples</h2><p className="mt-3 text-sm leading-6 text-foreground/65">{d.guide}</p>{path === "/villa-financial-reporting-bali" && <Link href="/sample-report" className={`${linkClass} mt-4`}>View the sample monthly report <ArrowRight className="h-4 w-4" /></Link>}<Link href="/blog" className={`${linkClass} mt-4`}>Browse practical guides <ArrowRight className="h-4 w-4" /></Link></div><div className="rounded-2xl border border-primary/10 p-6"><h2 className="font-serif text-2xl text-primary">A useful next step</h2><p className="mt-3 text-sm leading-6 text-foreground/65">Share the property count, booking channels and record situation; we can confirm whether the service fits and discuss scope, limits and price basis.</p><Link href="/get-started" className={`${linkClass} mt-4`}>Send a short enquiry <ArrowRight className="h-4 w-4" /></Link></div></section>
    <section className="bg-accent/45 py-12"><div className={`${wrap} flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between`}><div><p className={eyebrow}>Client Advisory</p><h2 className="mt-2 font-serif text-3xl text-primary">Talk through your records.</h2></div><CTA message={`Hello Client Advisory, I'd like to discuss ${path.replaceAll("-", " ").replace("/", "")}.`} /></div></section>
  </>;
}

function ServicesDirectory() {
  return <><Header path="/services" /><section className={`${wrap} py-16 sm:py-20`}><p className="max-w-3xl text-lg leading-8 text-foreground/70">Start with the bookkeeping need you want to solve. Each service page explains what is included, what records help, how the work flows, and where the boundaries sit. Package fit and price basis are confirmed before an agreement.</p><div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-primary/10 bg-primary/10 md:grid-cols-2">{serviceLinks.map(([href,title],i)=><Link href={href} key={href} className="group bg-background p-7 sm:p-9"><span className="font-mono text-xs text-secondary">0{i+1} / SERVICE</span><h2 className="mt-5 font-serif text-3xl text-primary group-hover:text-secondary">{title}</h2><p className="mt-3 max-w-lg text-sm leading-6 text-foreground/65">{serviceDetails[href]?.intro}</p><span className={`${linkClass} mt-6`}>Explore scope <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></Link>)}</div><div className="mt-12 rounded-3xl bg-primary p-8 text-primary-foreground sm:p-10"><h2 className="font-serif text-3xl">Not sure which service fits?</h2><p className="mt-3 max-w-2xl leading-7 text-primary-foreground/70">Begin with your current records, channels and reporting questions. The consultation is a conversation about fit, not a commitment.</p><Link href="/get-started" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-background px-6 font-semibold text-primary">Discuss your setup <ArrowUpRight className="h-4 w-4" /></Link></div></section></>;
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
    <div className="mt-12 flex flex-col gap-5 rounded-3xl bg-primary p-8 text-primary-foreground sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-serif text-2xl">Compare reporting with a real example.</h2><p className="mt-2 text-sm text-primary-foreground/65">The sample is ungated and uses fictional demonstration numbers.</p></div><Link href="/sample-report" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-secondary">Open the sample report <ArrowRight className="h-4 w-4" /></Link></div>
  </section></>;
}

function SampleReport() {
  useEffect(() => { trackEvent("sample_report_view", { page: "/sample-report", placement: "page_view" }); }, []);
  return <><Header path="/sample-report" /><MonthlyVillaReport /></>;
}

function About() {
  return <><Header path="/about" /><section className={`${wrap} grid gap-12 py-16 lg:grid-cols-[.9fr_1.1fr]`}>
    <div><p className={eyebrow}>A Denpasar-based bookkeeping firm</p><h2 className="mt-3 font-serif text-3xl text-primary">A named founder. A specific kind of work.</h2><p className="mt-5 leading-7 text-foreground/70">Bali Accounting was founded by Abel Yuniartini. The firm is based at Jl. Tukad Barito Timur III No.16, Panjer, Denpasar Selatan, Bali 80226. The service is focused on bookkeeping and monthly financial reporting for villa owners and operators.</p><p className="mt-5 leading-7 text-foreground/70">We describe the firm's work rather than implying unverified individual credentials or a larger named team. The agreed work is to organize source records, reconcile booking and cash activity, maintain bookkeeping schedules, prepare management reports, and make missing information visible.</p></div>
    <div className="rounded-[2rem] bg-primary p-8 text-primary-foreground sm:p-10"><MapPin className="h-6 w-6 text-secondary" /><p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-secondary">Office address</p><address className="mt-3 not-italic font-serif text-2xl leading-relaxed">Jl. Tukad Barito Timur III No.16<br/>Panjer, Denpasar Selatan<br/>Bali 80226</address><a href="https://maps.google.com/?q=Jl.+Tukad+Barito+Timur+III+No.16,+Panjer,+Denpasar+Selatan,+Bali" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground/70 hover:text-white">Open map <ArrowUpRight className="h-4 w-4" /></a></div>
    <div className="lg:col-span-2"><h2 className="font-serif text-3xl text-primary">Responsibilities and boundaries</h2><div className="mt-6 grid gap-5 md:grid-cols-3">{[
      ["Organize", "Maintain agreed records from documents and schedules supplied by the owner or operator."],
      ["Reconcile", "Compare booking, payout, cash and expense information; record differences that need clarification."],
      ["Hand over", "Prepare agreed reporting and schedules for the owner, manager or licensed Indonesian tax adviser to review."],
    ].map(([title,text])=><div key={title} className="border-t-2 border-secondary pt-5"><h3 className="font-serif text-2xl text-primary">{title}</h3><p className="mt-3 text-sm leading-6 text-foreground/65">{text}</p></div>)}</div><p className="mt-8 max-w-4xl text-sm leading-7 text-foreground/65">Bali Accounting does not provide tax advice or official filings. No staff biographies, professional credentials, response hours, client outcomes or legal-entity claims are added here without owner verification. Contact us for current service fit and to agree the document-handling process.</p><div className="mt-6"><CTA message="Hello Client Advisory, I would like to learn more about Bali Accounting's bookkeeping scope." >WhatsApp Client Advisory</CTA></div></div>
  </section></>;
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
  ["Do you file taxes or advise on tax?","No. Bali Accounting organizes bookkeeping records for owner information and can prepare an agreed handover for a licensed Indonesian tax adviser. Advice and official filings are outside scope.","/pt-pma-villa-bookkeeping"],
  ["When are reports delivered?","The 15th is a target after complete, timely source documents arrive. It is not a guaranteed delivery date."],
  ["How do I get started?","Send a short enquiry with property count, location and the main record question, or contact us directly on the verified WhatsApp number.","/get-started"],
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
  return <><Header path="/terms" /><article className={`${wrap} max-w-4xl space-y-8 py-14 sm:py-20`}><section><h2 className="font-serif text-2xl text-primary">Website information</h2><p className="mt-3 text-sm leading-7 text-foreground/70">Website content is general information about the bookkeeping services described. It is not legal, tax or investment advice, and does not create a client engagement.</p></section><section><h2 className="font-serif text-2xl text-primary">Examples and package scope</h2><p className="mt-3 text-sm leading-7 text-foreground/70">Sample reports and arithmetic are fictional illustrations for explaining how information may be organized. Published monthly package prices and inclusions are subject to confirmation of scope, price basis and applicable limits before an agreement.</p></section><section><h2 className="font-serif text-2xl text-primary">Separate engagement terms</h2><p className="mt-3 text-sm leading-7 text-foreground/70">Any actual services, deliverables, responsibilities, timing, fees, document arrangements and terms are agreed separately with the client. No response time, contract duration or service limit is promised on this website unless confirmed in that separate agreement.</p></section><section><h2 className="font-serif text-2xl text-primary">Professional boundaries</h2><p className="mt-3 text-sm leading-7 text-foreground/70">Bali Accounting's described scope is bookkeeping and financial reporting. It does not include tax advice or official filings. The website does not imply access to bank accounts, payment authority, or direct integrations with booking platforms.</p><Link href="/get-started" className={`${linkClass} mt-5`}>Discuss the proposed scope <ArrowRight className="h-4 w-4" /></Link></section></article></>;
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
  }, [normalized]);
  if (serviceDetails[normalized]) return <Layout><ServicePage path={normalized} /></Layout>;
  if (normalized === "/services") return <Layout><ServicesDirectory /></Layout>;
  if (normalized === "/pricing") return <Layout><Pricing /></Layout>;
  if (normalized === "/sample-report") return <Layout><SampleReport /></Layout>;
  if (normalized === "/about") return <Layout><About /></Layout>;
  if (normalized === "/get-started") return <Layout><GetStarted /></Layout>;
  if (normalized === "/faq") return <Layout><FAQ /></Layout>;
  if (normalized === "/privacy") return <Layout><Privacy /></Layout>;
  if (normalized === "/terms") return <Layout><Terms /></Layout>;
  return <Layout><div className={`${wrap} py-24`}><h1 className="font-serif text-4xl text-primary">This page is unavailable</h1><p className="mt-4 text-foreground/65">Choose a current service, report example or contact page.</p><Link href="/services" className={`${linkClass} mt-6`}>Browse services <ArrowRight className="h-4 w-4" /></Link></div></Layout>;
}
