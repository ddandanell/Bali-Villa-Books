import { prices, priceText } from "./pricing";

export const OTA_PILLAR_PATH = "/airbnb-ota-reconciliation-bali";

/**
 * Shared pillar data. The visible page, the FAQPage schema and the HowTo
 * schema all read from these lists so structured data always matches the
 * words a visitor (and Google) can actually see on the page.
 */
export const otaSteps: { name: string; text: string }[] = [
  {
    name: "Export or receive the platform transaction reports",
    text: "Start with the source, not the bank. Collect the transaction or payout report for Airbnb, Booking.com, Agoda and VRBO, plus the direct-booking schedule for reservations taken outside a platform. Each line should keep the booking reference, property, check-in and check-out dates, currency and gross amount identifiable. A monthly total exported without reservation detail cannot be reconciled — it can only be guessed at.",
  },
  {
    name: "Map gross booking value to platform fees to net due",
    text: "For every channel, walk the same bridge: gross booking value, less platform commission and host fees, less refunds, cancellations and adjustments, equals the net amount the platform owes you. Cleaning fees and extra-guest charges belong in this map as their own lines, not folded into the nightly rate, so the owner can see what guests paid for and what the platform kept.",
  },
  {
    name: "Match the net due to bank receipts and explain the timing",
    text: "A payout released by a platform is not the same event as money arriving in the bank. Settlements combine several reservations, cross month-ends, wait on reserves and land in a different currency. Match each net-due amount to a bank receipt and carry anything unmatched onto a dated timing list, so next month's close starts by clearing last month's open items instead of rediscovering them.",
  },
  {
    name: "Flag refunds, cancellations, cleaning fees and adjustments separately",
    text: "Refunds and cancellation adjustments change revenue; cleaning fees and extra-guest charges are separate guest charges; reserves are money held back, not money lost. Record each category in its own line with its supporting document. When a difference has no evidence yet, it stays visible as an open question for the owner or manager — it is never plugged into a miscellaneous total to make the month look finished.",
  },
  {
    name: "Produce the payout bridge that feeds the owner report",
    text: "The finished reconciliation becomes the payout bridge in the monthly owner report: gross bookings by channel, platform fees, net due, bank receipts, timing items still in transit and unresolved questions, each traceable back to a statement line. That bridge is what lets an owner, a manager and a licensed Indonesian tax adviser review the same month and reach the same numbers.",
  },
];

export const otaReportLines: string[] = [
  "Gross bookings by channel — Airbnb, Booking.com, Agoda, VRBO and direct bookings shown separately, never merged into one deposit total",
  "Platform fees and commissions, matched to the commission invoice or payout statement that charged them",
  "Refunds, cancellations and adjustments as their own lines, with the approval or platform notice behind each one",
  "Net due from each platform for the period, before any money moves",
  "Bank receipts matched to those net-due amounts, with the value date and currency recorded",
  "Timing items — payouts released but not yet received, reserves still held, and receipts that arrived for a different period",
  "Unresolved questions and missing evidence, listed openly instead of being absorbed into the figures",
  "Evidence references for every line, so a reviewer can walk from the report back to the statement, invoice or booking record",
];

export const otaErrors: { title: string; text: string }[] = [
  {
    title: "Using net bank deposits as revenue",
    text: "A bank deposit is what survived fees, refunds and timing — not what the villa earned. Recording deposits as revenue understates income, hides platform costs and makes every later comparison meaningless.",
  },
  {
    title: "Missing refund and cancellation entries",
    text: "A cancelled stay that was refunded after payout appears as a quiet deduction in a later settlement. If refunds are not recorded as their own lines, revenue stays overstated and the deduction looks like a missing deposit.",
  },
  {
    title: "Ignoring reserves and delayed payouts",
    text: "Platforms hold reserves and release payouts on their own calendar. Treating a held reserve as lost income — or a delayed payout as a shortfall — creates false alarms and false comfort in alternate months.",
  },
  {
    title: "Mixing owner funding with rental income",
    text: "Money an owner transfers to cover a supplier or top up an account is not guest revenue. Booking it as income inflates performance and corrupts the record pack a tax adviser later relies on.",
  },
  {
    title: "Incomplete multi-currency conversion records",
    text: "A payout converted from USD or AUD into IDR changes value between booking, release and receipt. Without the rate and date recorded for each conversion, the difference gets misread as a fee or an error.",
  },
  {
    title: "No evidence trail for PBJT or PPh review",
    text: "Local accommodation taxes and income-tax positions are assessed by the responsible qualified adviser — but only from records that exist. A report without statement-level evidence behind each total leaves that review with nothing to stand on.",
  },
];

export const otaRecords: string[] = [
  "Platform transaction or payout exports for every active channel (Airbnb, Booking.com, Agoda, VRBO), covering the full period — not screenshots of monthly totals",
  "Bank statements or transaction exports for every account that receives payouts or pays villa costs",
  "The booking calendar or reservation list, with property, dates and booking references that match the platform exports",
  "Direct-booking records and refund approvals for reservations taken outside a platform",
  "Supplier invoices, receipts and payroll schedules for costs that should appear beside the income",
  "Prior owner reports and opening balances, where they exist, so the first reconciled month starts from a known position",
  "Notes on owner funding, withdrawals and transfers between your own accounts, so they are never mistaken for guest income",
];

export const otaFaqs: [string, string][] = [
  ["How do you reconcile Airbnb payouts when the bank amount is lower?", "We walk the payout bridge: gross booking value, less Airbnb fees, refunds and adjustments, gives the net due; then we compare that with the bank receipt. A lower bank amount is usually fees, a refund deducted from a later payout, a reserve still held, a currency conversion, or a payout still in transit. Each cause is recorded as its own line with its evidence. If none of them explains the difference, it stays on the open-questions list — it is not written off as a fee."],
  ["What is the difference between gross booking value and net due?", "Gross booking value is what guests booked before platform deductions. Net due is what the platform owes after its commission and host fees, refunds, cancellations and other adjustments. The bank receipt is a third number again, because payouts combine reservations and arrive on the platform's calendar. A useful owner report shows all three instead of presenting the deposit as revenue."],
  ["Do you handle Booking.com commission invoices?", "Yes, within the agreed bookkeeping scope. Booking.com commission invoices are matched against the reservations they relate to and recorded separately from the payout or bank receipt, so the cost of the channel is visible. We work from the invoices and exports you supply; no direct platform integration or account access is promised."],
  ["Can you reconcile multiple villas or channels?", "Yes, where the records are supplied per property and channel and the scope is agreed in advance. Each villa keeps its own booking, fee and payout lines; shared costs follow a documented allocation. Starter is scoped for 1 villa and up to 2 booking channels; wider setups are confirmed before agreement so the close stays achievable."],
  ["What evidence do you attach for the tax consultant?", "The handover pack connects each reported total to its source: platform statements, commission invoices, bank receipts, refund approvals and the dated list of unresolved items. That gives a licensed Konsultan Pajak a traceable record for PBJT, PPh or other reviews. The bookkeeping pack organises evidence; tax treatment and filings remain the adviser's separate, separately scoped work."],
  ["How long does a monthly close take once documents are complete?", "The 15th is our target after complete and timely source documents are received — it is not a guaranteed date. A close moves faster when exports, statements and invoices arrive together and open questions get answered; late or partial records move the delivery date, and we say so rather than closing the month on assumptions."],
  [`How much does OTA reconciliation cost?`, `It is part of the monthly bookkeeping packages: Starter ${priceText(prices.starter)}, Professional ${priceText(prices.professional)} and Premium ${priceText(prices.premium)} per month, with channel and property limits confirmed before agreement. Historical backlogs are scoped separately as a cleanup, starting at ${priceText(prices.cleanup)} for up to 12 months after a records review.`],
  ["What is not included in this service?", "Tax advice, official filings, payroll execution and BPJS administration are not included in bookkeeping. We do not control bank or platform accounts, authorise payments, or promise direct OTA integrations. Where tax-compliance support is needed, it is agreed as a separate engagement with the responsible qualified professional."],
  ["What should I do if my payout records are already behind?", `Start with a records review rather than a monthly package. A cleanup engagement — starting at ${priceText(prices.cleanup)} for up to 12 months, subject to review — reconstructs what the evidence supports, lists what is missing, and establishes an opening position so the recurring reconciliation starts clean.`],
];
