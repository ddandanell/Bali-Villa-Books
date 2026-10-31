import { Link } from "wouter";

const guides: Record<string, { heading: string; paragraphs: string[]; related: [string, string][] }> = {
  "/airbnb-bookkeeping-bali": {
    heading: "Short-term rental accounting: bookings are not bank deposits",
    paragraphs: [
      "A reservation, a guest payment, a platform payout and a bank receipt describe different events. Airbnb bookkeeping needs a reference trail between them. Keep stay dates, payout dates, commissions and refunds identifiable so a month-end review can explain both rental activity and cash timing.",
      "For Booking.com and other OTAs, retain the statement that explains each settlement. Match its net amount to the bank and list differences rather than treating every deposit as new rental income. This document-based workflow can be agreed with your existing villa manager; it does not require giving us payment authority.",
    ],
    related: [["How to reconcile Airbnb and Booking.com payouts", "/blog/reconciling-airbnb-booking-payouts"], ["See the OTA reconciliation worked example", "/sample-report"]],
  },
  "/villa-financial-reporting-bali": {
    heading: "What should a monthly villa financial report explain?",
    paragraphs: [
      "Start with the properties, reporting period and source records included. A useful monthly owner report separates rental revenue, channel fees and operating expenses, then explains why profit differs from cash in the bank. Owner funding, withdrawals and transfers need their own supporting schedules rather than being hidden inside income or costs.",
      "Where agreed, compare results with a budget or earlier period using consistent categories. Investigate changes in supplier costs, booking-channel mix and collection timing before making a decision. The sample report demonstrates occupancy, ADR, RevPAR and cash-flow scenarios; it is not a promise that every package includes every analysis.",
    ],
    related: [["Monthly villa owner report checklist", "/blog/bali-villa-owner-statement-template"], ["Explore the villa cash-flow forecast guide", "/blog/bali-villa-cash-flow-forecast"]],
  },
  "/villa-bookkeeping-cleanup-bali": {
    heading: "Catch-up bookkeeping before a recurring monthly close",
    paragraphs: [
      "Separate a historical backlog from current-month bookkeeping. List the periods, accounts, booking channels and documents available before asking for a cleanup quote. A three-month period with complete bank and OTA exports can require different work from the same period with missing statements or mixed owner payments.",
      "Agree the opening position and a register of unresolved items before the recurring service starts. Keep unsupported figures visible as gaps. Bookkeeping cleanup is not an audit, a filing service or a guarantee that every missing transaction can be reconstructed.",
    ],
    related: [["Prepare a monthly bookkeeping document checklist", "/blog/monthly-bali-villa-bookkeeping-checklist"], ["Compare cleanup and recurring bookkeeping costs", "/pricing"]],
  },
  "/pt-pma-villa-bookkeeping": {
    heading: "Company records and tax-adviser handover are different jobs",
    paragraphs: [
      "Identify the PT PMA, reporting period and accounts covered by the bookkeeping. Retain evidence for company expenses, rental receipts, owner advances and reimbursements. If several villas or entities share a workflow, agree the property and entity labels so one operation's records do not become another's unexplained balance.",
      "Ask your licensed tax adviser which schedules they need and who supplies each one. Bali Accounting can organize an agreed factual handover; the adviser determines tax treatment and filing requirements. A management report does not establish legal status, authorize business activities or replace professional advice.",
    ],
    related: [["Prepare villa records for an Indonesian tax consultant", "/blog/preparing-villa-records-indonesian-tax-consultant"], ["Review monthly villa financial reporting", "/villa-financial-reporting-bali"]],
  },
  "/villa-payroll-records-bali": {
    heading: "Track staff costs without confusing records with payroll execution",
    paragraphs: [
      "Use an owner-approved schedule for each pay period and keep dated changes, allowances and reimbursements attached to their supporting records. Reconcile available payment evidence to the staff-cost entries in the monthly books, then list missing documents for the responsible owner or manager.",
      "A BPJS document checklist records what has been supplied and what needs follow-up. It does not calculate statutory contributions, register employees or confirm compliance. Staff payments, employment decisions and official submissions remain with the responsible operator and qualified providers.",
    ],
    related: [["Villa supplier, payroll and BPJS control calendar", "/blog/bali-villa-supplier-invoice-payroll-control-calendar"], ["Compare payroll-record package inclusions", "/pricing"]],
  },
};

export function BookkeepingDecisionGuide({ path }: { path: string }) {
  const guide = guides[path];
  if (!guide) return null;
  return <section className="border-t border-primary/10 bg-accent/35">
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 sm:py-20">
      <h2 className="max-w-4xl font-serif text-3xl leading-tight text-primary">{guide.heading}</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">{guide.paragraphs.map(text => <p key={text} className="text-sm leading-7 text-foreground/70">{text}</p>)}</div>
      <nav aria-label="Related practical guides" className="mt-7 flex flex-wrap gap-x-8 gap-y-4">{guide.related.map(([label, href]) => <Link key={href} href={href} className="font-semibold text-primary underline decoration-secondary/50 underline-offset-4">{label}</Link>)}</nav>
    </div>
  </section>;
}
