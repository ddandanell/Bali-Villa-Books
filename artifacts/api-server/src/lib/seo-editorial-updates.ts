import { and, eq } from "drizzle-orm";
import { db, blogPosts, blogRevisions } from "@workspace/db";
import { cleanHtml } from "./blog-content";
import { countWords } from "./blog-policy";
import { logger } from "./logger";

type EditorialUpdate = {
  title: string; metaTitle: string; description: string; keyword: string;
  heading: string; paragraphs: string[]; links: [string, string][];
};
const updates: Record<string, EditorialUpdate> = {
  "bali-remote-worker-visa-compliance-october-2026": {
    title: "Bali Remote Worker Visa Rules: October 2026 Enforcement News",
    metaTitle: "Bali Remote Worker Visa: October 2026 News",
    description: "Read the October 2026 Bali remote-worker enforcement statement, distinguish digital-nomad headlines from permit conditions, and check the official source.",
    keyword: "Bali remote worker visa",
    heading: "Remote-worker visa news and a villa owner's record checklist",
    paragraphs: [
      "For someone researching a digital nomad visa in Bali, the practical question is whether the actual activity matches the actual permission—not whether a general label sounds suitable. Keep the dated release separate from a current permit review. This article reports the cited enforcement news; it does not establish that a particular visa is appropriate for you.",
      "For your villa records, distinguish personal travel costs, owner funding and documented operating activity. Preserve the contracts and transaction explanations that your qualified advisers request. A bookkeeping entry does not authorize work or determine immigration status. Avoid treating rental income, remote employment and local business activity as interchangeable merely because the same person is involved.",
    ],
    links: [["Organize owner and company financial records", "/pt-pma-villa-bookkeeping"], ["Review the villa bookkeeping service scope", "/services"]],
  },
  "bali-foreign-investment-18-business-categories-2026": {
    title: "Bali Foreign Investment Rules: The 18 Business Categories in 2026 News",
    metaTitle: "Bali Foreign Investment Rules: 2026 News",
    description: "Understand the July 2026 Bali foreign-investment licensing report, its 18 business categories, and why investors must verify their own activity and approvals.",
    keyword: "Bali foreign investment",
    heading: "Keep investment assumptions separate from confirmed financial records",
    paragraphs: [
      "A prospective villa investment may combine an entity, a property arrangement and an operating activity. Record those as separate questions for professional review rather than treating a news headline as approval of the entire project. Keep the source and date alongside any assumption used in a business plan.",
      "Once transactions occur, retain a clear trail for owner contributions, deposits, supplier invoices and the entity or property they concern. A management report can organize that evidence; it cannot confirm that an activity is licensed. Before using the figures to make a commitment, ask the appropriate qualified advisers to review the arrangements and current requirements. The dated report above remains a news source, not a legal determination.",
    ],
    links: [["PT PMA villa bookkeeping and adviser handover", "/pt-pma-villa-bookkeeping"], ["Monthly villa financial reporting", "/villa-financial-reporting-bali"]],
  },
  "indonesia-visa-free-entry-july-2026-passport-list": {
    title: "Indonesia Visa-Free Entry Countries: What the July 2026 List Says",
    metaTitle: "Indonesia Visa-Free Entry: 2026 List",
    description: "Read the official July 2026 Indonesia visa-free entry list, distinguish passport nationality from residence, and verify travel conditions before arrival.",
    keyword: "Indonesia visa free countries",
    heading: "Visa-free entry information in a villa guest-arrival workflow",
    paragraphs: [
      "A villa operator can link a guest to the cited official source without promising that the guest qualifies for entry. Keep arrival communications distinct from booking confirmation: a reservation establishes the planned accommodation, not a visa decision. Check the article's source date rather than repeating an old country list as a live guarantee.",
      "If travel plans change, preserve the booking amendment, refund approval and payment reference in the villa records. That lets an owner report explain the financial change without collecting unnecessary passport information through a public bookkeeping enquiry. Immigration eligibility remains a question for the responsible authority or a qualified provider; rental property bookkeeping concerns the documented transactions.",
    ],
    links: [["Reconcile changed bookings and refunds", "/airbnb-bookkeeping-bali"], ["Read public enquiry privacy guidance", "/privacy"]],
  },
  "indonesia-emergency-stay-permits-krakatau-september-2026": {
    title: "Indonesia Emergency Stay Permits: September 2026 Krakatau Travel News",
    metaTitle: "Indonesia Emergency Stay Permits: 2026",
    description: "Read the September 2026 Indonesia emergency-stay announcement after Krakatau flight disruption, its evidence checks, and why extensions are not automatic.",
    keyword: "Indonesia emergency stay permits",
    heading: "Record disrupted bookings without assuming an automatic extension",
    paragraphs: [
      "The reported emergency response and a guest's booking changes are separate matters. Retain the dated announcement as context, and refer current permit questions to the responsible office. A flight cancellation, an extended villa reservation and permission to remain are not the same document.",
      "For bookkeeping, connect the revised stay dates with the additional charge or refund, the platform adjustment and the bank receipt. Record supplier costs connected with the change against their invoices. If the evidence is incomplete, place the item on the questions list rather than making up a settlement explanation. This records the financial consequences of disruption without claiming to assess eligibility for an emergency permit.",
    ],
    links: [["Airbnb and OTA refund reconciliation", "/airbnb-bookkeeping-bali"], ["Track villa operating expenses", "/blog/bali-villa-expense-tracking-system"]],
  },
  "indonesia-foreign-worker-permits-oss-september-2026": {
    title: "Indonesia Foreign Worker Permits and OSS: September 2026 Update",
    metaTitle: "Indonesia Foreign Worker Permits & OSS",
    description: "Understand the September 2026 OSS, SIAPkerja and All Indonesia announcement, distinguish processing targets from approvals, and verify employer requirements.",
    keyword: "Indonesia foreign worker permits OSS",
    heading: "Keep permit administration separate from payroll bookkeeping",
    paragraphs: [
      "An announcement about system integration does not establish that an individual employer or worker has completed the necessary process. Retain the actual correspondence and current instructions from the responsible provider. A processing target in a news report is not a guaranteed approval date.",
      "The bookkeeping file should distinguish authorized staff-cost schedules, recorded payments and the supporting documents supplied. If a fee or reimbursement is recorded, keep the invoice and purpose identifiable. Payroll record tracking cannot confirm employment eligibility, calculate every statutory obligation or replace a permit application. Agree who handles those professional responsibilities and which factual schedules the monthly owner report should include.",
    ],
    links: [["Villa payroll records and BPJS tracking scope", "/villa-payroll-records-bali"], ["Read the staff-record control calendar", "/blog/bali-villa-supplier-invoice-payroll-bpjs-control-calendar"]],
  },
  "bali-villa-supplier-invoice-payroll-bpjs-control-calendar": {
    title: "Bali Villa Payroll, Supplier Invoices and BPJS: A Monthly Control Checklist",
    metaTitle: "Bali Villa Payroll & Invoice Checklist",
    description: "Build a monthly Bali villa control calendar for supplier invoices, payroll records and BPJS documents, with property labels, approvals and missing-item checks.",
    keyword: "Bali villa payroll records",
    heading: "A staff-cost and supplier checklist for the next monthly close",
    paragraphs: [
      "For each invoice or approved staff schedule, record the property, period, amount, supporting reference and contact responsible for clarification. A file received is not automatically a payment verified. Check which evidence shows the recorded amount reaching the intended recipient, and keep a question open if that evidence has not been supplied.",
      "When one team serves several villas, agree how shared staff and supplier costs are allocated before producing the owner reports. Keep the allocation basis and subsequent changes documented. BPJS tracking concerns records supplied; it does not execute contributions or certify compliance. Use the calendar to coordinate evidence and follow-up, while the owner, operator and qualified providers retain their respective payment and statutory responsibilities.",
    ],
    links: [["Review payroll and BPJS record tracking", "/villa-payroll-records-bali"], ["See property-level owner reporting", "/villa-financial-reporting-bali"]],
  },
  "bali-villa-monthly-management-reporting-pack": {
    title: "Monthly Villa Management Reporting: P&L, Cash Flow and Open Items",
    metaTitle: "Monthly Villa Management Reporting Pack",
    description: "Build a Bali villa management reporting pack with rental income, expenses, payout reconciliation, cash flow, budget questions and supporting source records.",
    keyword: "villa management reporting",
    heading: "Use the management pack to connect figures with decisions",
    paragraphs: [
      "Choose a recurring review order: coverage and completeness, rental activity, costs, cash movements and unresolved questions. If a line changed significantly, inspect its underlying records before assuming the change represents a new operating trend. Keep a named contact and follow-up date for information the pack cannot yet explain.",
      "For a multi-villa operation, preserve the property-level detail behind the combined view. A management fee, owner transfer and supplier expense describe different transactions. Label their purpose and evidence consistently. Confirm whether budget analysis and forecasts are in your agreed package; an illustrative reporting pack does not establish that every service includes every analysis or that the conclusions replace qualified advice.",
    ],
    links: [["Explore monthly villa financial reporting", "/villa-financial-reporting-bali"], ["Inspect the sample management report", "/sample-report"]],
  },
  "bali-villa-owner-monthly-report": {
    title: "Bali Villa Owner Monthly Report: Rental Income, P&L and Cash Flow",
    metaTitle: "Bali Villa Owner Report: Monthly Checklist",
    description: "See what a Bali villa owner monthly report should include: rental income, platform fees, operating costs, cash movements and an unresolved-records checklist.",
    keyword: "Bali villa owner monthly report",
    heading: "An owner review that separates profit from available cash",
    paragraphs: [
      "Ask whether the month's bank receipts relate to stays in the same reporting period. Check what remains in the platform payout cycle, which supplier commitments are unpaid and whether owner funding or withdrawals changed cash. The cash balance and operating result answer different questions and should not be presented as if they are interchangeable.",
      "Use consistent property labels when reviewing several villas. Document the basis for shared costs and keep management-company overhead distinct where the structure requires it. A clear questions register is part of a useful report: it tells the owner what is supported and what still needs evidence. The demonstration report explains these views with fictional figures, not client outcomes or promised investment returns.",
    ],
    links: [["Read the monthly financial reporting scope", "/villa-financial-reporting-bali"], ["Compare the worked owner report", "/sample-report"]],
  },
  "bali-villa-expense-tracking-system": {
    title: "Bali Villa Expense Tracking: Invoices, Shared Costs and Owner Payments",
    metaTitle: "Bali Villa Expense Tracking Guide",
    description: "Track Bali villa expenses with invoices, property references, payment evidence and shared-cost allocations. Separate owner movements from operating costs.",
    keyword: "rental property bookkeeping",
    heading: "Rental property bookkeeping starts with an identifiable expense",
    paragraphs: [
      "A useful expense record identifies the supplier, date, property, purpose and source document. Add the payment reference separately so the reviewer can distinguish an invoice received from cash paid. If several properties share a charge, retain the allocation explanation rather than putting the full invoice against whichever villa handled the payment.",
      "Flag repairs and larger improvements for the professional assessment appropriate to the actual facts; do not infer treatment from a short bank description. Owner withdrawals and transfers are not automatically supplier costs. A monthly review can organize those distinctions and the missing-document list, while decisions about statutory accounting or tax treatment remain with qualified advisers.",
    ],
    links: [["Bring overdue expense records into a cleanup review", "/villa-bookkeeping-cleanup-bali"], ["Review the monthly P&L and cash views", "/villa-financial-reporting-bali"]],
  },
  "bali-villa-cash-flow-forecast": {
    title: "Bali Villa Cash-Flow Forecast: Booking Payouts, Costs and Owner Withdrawals",
    metaTitle: "Bali Villa Cash-Flow Forecast: Worked Guide",
    description: "Build a Bali villa cash-flow forecast from booking payouts, supplier commitments and owner movements, with clear timing assumptions and scenario limits.",
    keyword: "rental property cash flow",
    heading: "Test a forecast against the next real settlement cycle",
    paragraphs: [
      "List each material expected collection with its source and expected payout date, then compare it with the platform statement and bank evidence when it arrives. A changed receipt date should change the cash scenario without silently changing the recorded booking activity. Keep known commitments separate from optional spending.",
      "Review owner withdrawals alongside the upcoming payment schedule, not only the current bank balance. Record what changed between the forecast and actual cash movement, including refunds, delayed settlements or supplier timing. Scenario figures are assumptions to inspect, not guaranteed available cash. The sample report shows the process with demonstration data and the reporting service explains which forecasts can be agreed in scope.",
    ],
    links: [["Explore the fictional cash forecast example", "/sample-report"], ["Understand Airbnb payout timing", "/airbnb-bookkeeping-bali"]],
  },
  "preparing-villa-records-indonesian-tax-consultant": {
    title: "PT PMA Villa Bookkeeping: Prepare Records for an Indonesian Tax Consultant",
    metaTitle: "PT PMA Villa Records for a Tax Consultant",
    description: "Prepare Bali villa records for a licensed Konsultan Pajak: ledger, bank and OTA reconciliations, owner funding, invoices and documented evidence gaps.",
    keyword: "PT PMA bookkeeping Bali",
    heading: "A tax-adviser handover should show the evidence behind the totals",
    paragraphs: [
      "Confirm the entity, period and schedules requested by the licensed adviser. Use the same property and transaction references across the ledger, booking exports, bank reconciliation and supplier register. An unexplained total is harder to assess than a schedule that identifies the documents behind it.",
      "Keep owner funding, reimbursements and transfers distinguishable, and include a factual list of missing records. Ask the adviser how they want unresolved questions presented rather than deciding tax treatment yourself. Bookkeeping prepares information for professional review; it does not file a return, determine legal status or guarantee acceptance by an authority. Discuss the actual handover scope before assuming a package includes a particular filing or advisory task.",
    ],
    links: [["Review PT PMA villa bookkeeping boundaries", "/pt-pma-villa-bookkeeping"], ["Compare record-handover package inclusions", "/pricing"]],
  },
  "reconciling-airbnb-booking-payouts": {
    title: "Bali Airbnb Bookkeeping: Reconcile Airbnb and Booking.com Payouts",
    metaTitle: "Airbnb Bookkeeping: Reconcile OTA Payouts",
    description: "Learn Airbnb bookkeeping for Bali villas: match bookings to OTA statements and bank receipts, separate fees and refunds, and document month-end payout timing.",
    keyword: "Airbnb bookkeeping",
    heading: "Build a repeatable short-term rental payout reconciliation",
    paragraphs: [
      "For every settlement, retain the reservation reference, property, gross activity, fee or adjustment, payout reference and matching bank receipt. If one payout includes several reservations, reconcile the components before assigning the net amount to a month. Keep currency and transaction dates visible so a later review can explain the result.",
      "Do not close a difference simply by calling it a platform fee. Use the supporting statement, or flag the question for the owner or manager. Carry outstanding settlements into the next period's checklist and record when they clear. This source-record approach applies to the agreed Airbnb, Booking.com and direct-booking records without implying automatic platform integration or authority over the owner's accounts.",
    ],
    links: [["See Airbnb bookkeeping service deliverables", "/airbnb-bookkeeping-bali"], ["Inspect the sample OTA reconciliation", "/sample-report"]],
  },
  "monthly-bali-villa-bookkeeping-checklist": {
    title: "Bali Villa Bookkeeping Checklist: A Monthly Rental Property Close",
    metaTitle: "Bali Villa Bookkeeping: Monthly Checklist",
    description: "Follow a monthly Bali villa bookkeeping checklist for rental income, bank and OTA reconciliation, supplier invoices, owner movements and report review.",
    keyword: "Bali villa bookkeeping",
    heading: "Turn the checklist into an agreed rental bookkeeping handover",
    paragraphs: [
      "Assign a contact to each source: bank records, booking channels, direct reservations, supplier invoices and authorized staff schedules. Agree the reporting cutoff and how late documents will be identified. For several properties, apply consistent labels before the data enters a combined spreadsheet so each owner's report remains traceable.",
      "At review, distinguish supported balances from unresolved questions and carry open items forward with their references. A target reporting date depends on complete, timely documents and the agreed scope. If older periods are incomplete, assess cleanup independently rather than assuming the next recurring close resolves the historical backlog. Compare the monthly reporting views and package limits with your operation before choosing a service.",
    ],
    links: [["Compare Bali villa bookkeeping services", "/services"], ["Review catch-up bookkeeping for overdue periods", "/villa-bookkeeping-cleanup-bali"]],
  },
};

const reason = "DataForSEO-informed editorial pass: distinct metadata, practical source-record content and contextual internal links";
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const legacyLinks: Record<string, string> = {
  "/posts/reconcile-airbnb-booking-com-payouts": "/blog/reconciling-airbnb-booking-payouts",
  "/posts/preparing-bali-villa-records-indonesian-konsultan-pajak": "/blog/preparing-villa-records-indonesian-tax-consultant",
  "/posts/monthly-bali-villa-bookkeeping-checklist": "/blog/monthly-bali-villa-bookkeeping-checklist",
};
function correctLegacyLinks(html: string) {
  return html.replace(/href=(["'])(\/posts\/[^"'?#\s]+)([^"']*)\1/g,
    (original, quote: string, path: string, suffix: string) => legacyLinks[path] ? `href=${quote}${legacyLinks[path]}${suffix}${quote}` : original);
}

/** Idempotent editorial changes; preserve a full prior version and never replace the source-checked article. */
export async function applySeoEditorialUpdates() {
  let updated = 0;
  for (const [slug, update] of Object.entries(updates)) {
    await db.transaction(async tx => {
      const [post] = await tx.select().from(blogPosts).where(eq(blogPosts.slug, slug)).for("update");
      if (!post) return;
      const [applied] = await tx.select({ id: blogRevisions.id }).from(blogRevisions)
        .where(and(eq(blogRevisions.postId, post.id), eq(blogRevisions.reason, reason))).limit(1);
      if (applied) return;
      const addition = `<h2>${escape(update.heading)}</h2>${update.paragraphs.map(p => `<p>${escape(p)}</p>`).join("")}<ul>${update.links.map(([label, href]) => `<li><a href="${href}">${escape(label)}</a></li>`).join("")}</ul>`;
      const contentHtml = cleanHtml(post.contentHtml + addition);
      const words = countWords(contentHtml);
      await tx.insert(blogRevisions).values({ postId: post.id, previousContent: post, reason });
      await tx.update(blogPosts).set({
        title: update.title, metaTitle: update.metaTitle, metaDescription: update.description,
        excerpt: update.description, primaryKeyword: update.keyword, contentHtml,
        wordCount: words, readTimeMinutes: Math.ceil(words / 220), updatedAt: new Date(),
      }).where(eq(blogPosts.id, post.id));
      updated++;
    });
  }
  let repaired = 0;
  const posts = await db.select().from(blogPosts);
  for (const candidate of posts) {
    if (correctLegacyLinks(candidate.contentHtml) === candidate.contentHtml) continue;
    await db.transaction(async tx => {
      const [post] = await tx.select().from(blogPosts).where(eq(blogPosts.id, candidate.id)).for("update");
      if (!post) return;
      const contentHtml = correctLegacyLinks(post.contentHtml);
      if (contentHtml === post.contentHtml) return;
      await tx.insert(blogRevisions).values({
        postId: post.id, previousContent: post,
        reason: "Repair legacy /posts internal references to the canonical journal URLs; preserve the article text",
      });
      await tx.update(blogPosts).set({ contentHtml, updatedAt: new Date() }).where(eq(blogPosts.id, post.id));
      repaired++;
    });
  }
  logger.info({ updated, reviewed: Object.keys(updates).length, repaired }, "Site-wide journal SEO editorial pass complete; previous versions preserved");
}
