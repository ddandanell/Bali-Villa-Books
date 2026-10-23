import { Router, type IRouter } from "express";
import { desc, eq, sql, notInArray } from "drizzle-orm";
import { articleAliases } from "@workspace/site-content";
import { db, blogEvents, blogPosts, automationConfig, automationRuns } from "@workspace/db";
import { ListBlogPostsQueryParams, ListBlogPostsResponse, GetBlogPostParams, GetBlogPostResponse, RecordBlogEventBody, GetBlogAutomationStatusResponse } from "@workspace/api-zod";
import { logger } from "../lib/logger";
import { cleanHtml } from "../lib/blog-content";
import { baliClock, countWords, imageLibrary, nextPublication, TIMEZONE, SCHEDULED_HOUR, MIN_WORDS } from "../lib/blog-policy";
export { startBlogAutomation } from "../lib/blog-automation";

const router: IRouter = Router();
const now = new Date();
const launchPosts = [
  {
    slug: "monthly-bali-villa-bookkeeping-checklist",
    title: "The Monthly Bali Villa Bookkeeping Checklist",
    metaTitle: "Bali Villa Bookkeeping Checklist",
    metaDescription: "A practical monthly bookkeeping checklist for Bali villa owners, from OTA statements and receipts to owner reports and accountant handover.",
    excerpt: "Keep your villa finances clear each month with a repeatable checklist for income, costs, records, and management review.",
    primaryKeyword: "Bali villa bookkeeping checklist", category: "Villa Finance", readTimeMinutes: 8,
    contentHtml: `<h2>A calm monthly close for a Bali villa</h2><p>Good bookkeeping turns a busy booking calendar into useful decisions. This checklist is designed for owners and managers who want a reliable record of what happened during the month. It is bookkeeping guidance, not Indonesian tax advice; ask a licensed <em>Konsultan Pajak</em> about obligations that apply to your structure.</p><h3>1. Gather the complete income record</h3><p>Export reservations and payout statements from Airbnb, Booking.com, your direct-booking channel, and the property manager. Record the stay date, payout date, gross accommodation amount, cleaning charges, platform fees, promotions, refunds, and net payout. Keep gross sales separate from bank deposits so fees are visible.</p><h3>2. Match deposits and payment timing</h3><p>Compare each bank deposit with the relevant payout statement. A deposit can represent several reservations, and a reservation can be paid after month end. Mark deposits as matched, pending, or needing explanation. Never “plug” a difference into revenue simply to make a bank account balance.</p><h3>3. File operating costs</h3><p>Collect invoices and receipts for cleaners, laundry, utilities, internet, maintenance, supplies, pool and garden care, insurance, software, transport, and management. Note the property, supplier, date, currency, and business purpose. Photograph paper receipts while they are legible and keep the original where required.</p><h3>4. Review owner and property transactions</h3><p>Separate personal spending from villa spending. Record owner withdrawals, replenishments, deposits held for guests, and expenses paid personally. Make a short list of unusual or one-off items for review rather than guessing how they should be classified.</p><h3>5. Produce a simple monthly pack</h3><p>Finish with a bank reconciliation, an income summary, an expense summary, unpaid bills, upcoming commitments, and questions for the manager. Compare occupancy and average nightly rate with the prior month, but do not confuse operational metrics with accounting results.</p><p>For the next step, see our guide to <a href="/blog/reconciling-airbnb-booking-payouts">reconciling Airbnb and Booking.com payouts</a> and <a href="/blog/preparing-villa-records-indonesian-tax-consultant">preparing records for an Indonesian Konsultan Pajak</a>. You can also <a href="/#how-it-works">see how VillaBooks supports a tidy monthly close</a>.</p>`
  },
  {
    slug: "reconciling-airbnb-booking-payouts",
    title: "How to Reconcile Airbnb and Booking.com Villa Payouts",
    metaTitle: "Reconcile Airbnb & Booking.com Payouts",
    metaDescription: "Learn how Bali villa owners can reconcile Airbnb and Booking.com payout reports to bank deposits without losing fees, refunds, or timing differences.",
    excerpt: "A practical method for matching OTA statements to deposits while keeping gross bookings, commissions, refunds, and timing differences visible.",
    primaryKeyword: "reconcile Airbnb Booking.com payouts", category: "OTA Operations", readTimeMinutes: 9,
    contentHtml: `<h2>Why OTA reconciliation matters</h2><p>Airbnb and Booking.com present booking, fee, and payout information differently. A bank feed shows cash; an OTA statement explains the activity behind that cash. Reconciliation connects the two and helps a villa owner spot missing deposits, duplicated entries, refunds, and unexpected commissions.</p><h3>Start with one payout period</h3><p>Download the platform report for the month and identify its currency, report date, reservation dates, and payout dates. Work from the payout rather than only the booking calendar: a reservation arriving on the last day of a month may be paid in the next month.</p><h3>Build a payout bridge</h3><p>For every payout, capture gross nightly revenue, cleaning or other guest charges, discounts, platform commission, adjustments, refunds, taxes shown by the platform, and net amount. The bridge should calculate net amount from the components. Keep a note when a platform groups multiple reservations into one deposit.</p><h3>Match to the bank</h3><p>Search the bank statement by amount and date, allowing for weekends, holidays, and international settlement timing. Match one deposit to one payout where possible; otherwise create a grouped match with the underlying payout IDs. Flag partial payments and foreign-exchange differences instead of changing the original booking value.</p><h3>Handle common exceptions</h3><ul><li><strong>Refunds:</strong> link the refund to its reservation and payout, including the date it left the bank.</li><li><strong>Fee changes:</strong> retain the platform statement showing the commission calculation.</li><li><strong>Currency conversion:</strong> record the banked currency and exchange rate source used by your bookkeeping process.</li><li><strong>Manager collections:</strong> obtain the manager's statement and distinguish their transfer from the guest booking.</li></ul><p>Reconcile both the total and the detail. This is a bookkeeping control, not a determination of Indonesian tax treatment. Ask a licensed adviser how your records should support tax reporting. For the recurring workflow, use the <a href="/blog/monthly-bali-villa-bookkeeping-checklist">monthly Bali villa bookkeeping checklist</a>, then <a href="/blog/preparing-villa-records-indonesian-tax-consultant">prepare a clean adviser pack</a>. <a href="/#bookkeeping">Talk with VillaBooks about your monthly process</a>.</p>`
  },
  {
    slug: "preparing-villa-records-indonesian-tax-consultant",
    title: "Preparing Bali Villa Records for an Indonesian Konsultan Pajak",
    metaTitle: "Bali Villa Records for a Konsultan Pajak",
    metaDescription: "Prepare clear Bali villa bookkeeping records for an Indonesian Konsultan Pajak with an organized income, expense, bank, and ownership evidence pack.",
    excerpt: "Give your licensed Indonesian tax adviser a clearer starting point with a structured, traceable villa record pack.",
    primaryKeyword: "Bali villa records Konsultan Pajak", category: "Records & Compliance", readTimeMinutes: 8,
    contentHtml: `<h2>Make professional advice easier</h2><p>A Konsultan Pajak can give advice based on your facts, registrations, contracts, and records. Bookkeeping cannot replace licensed tax advice, and this guide does not state which taxes, filings, permits, or entity rules apply to you. Its purpose is to make your information complete and easy to trace.</p><h3>Assemble an overview</h3><p>Prepare a one-page profile with property name and location, ownership or operating entity, management arrangement, booking channels, bank accounts, currencies, and the period covered. Include contact details for the owner, manager, and bookkeeper and list open questions rather than making assumptions.</p><h3>Provide reconciled income</h3><p>Include OTA exports, direct-booking invoices or receipts, manager statements, payout summaries, and a bank reconciliation. Explain timing differences between stay dates and payout dates. Keep cancellations, refunds, discounts, cleaning charges, and commissions identifiable so the adviser can assess the records in context.</p><h3>Provide supported expenses</h3><p>Arrange supplier invoices and receipts by month and category: utilities, wages or contractor payments, maintenance, furnishings, supplies, insurance, management, software, and professional fees. Each item should show date, supplier, amount, currency, property connection, and payment evidence when available.</p><h3>Separate ownership activity</h3><p>Identify owner contributions, withdrawals, loans, deposits, and personal transactions. Add agreements with property managers, leases, vendor contracts, and relevant ownership or operating documents. Do not redact facts that could change the advice; instead, label sensitive documents and share them through an appropriate secure channel.</p><h3>Use a questions register</h3><p>List uncertain classifications, missing invoices, unusual payments, changes in management, and periods with incomplete data. A clear questions register helps a licensed adviser focus their review and avoids treating a bookkeeping category as a legal conclusion.</p><p>Keep this pack current with our <a href="/blog/monthly-bali-villa-bookkeeping-checklist">monthly bookkeeping checklist</a> and <a href="/blog/reconciling-airbnb-booking-payouts">OTA reconciliation guide</a>. <a href="/#clarity-call">Book a clarity call to discuss your record-keeping workflow</a>; tax advice remains with your licensed Indonesian adviser.</p>`
  }
];

const summary = (post: { slug: string; title: string; excerpt: string; primaryKeyword: string; category: string; readTimeMinutes: number; publishedAt?: Date | null; imageUrl: string; imageAlt: string }) => ({ slug: post.slug, title: post.title, excerpt: post.excerpt, primaryKeyword: post.primaryKeyword, category: post.category, readTimeMinutes: post.readTimeMinutes, publishedAt: post.publishedAt ?? now, imageUrl: post.imageUrl, imageAlt: post.imageAlt });

export async function seedBlogPosts(): Promise<void> {
  let inserted = 0;
  for (const [index, post] of launchPosts.entries()) {
    const image = imageLibrary[index % imageLibrary.length];
    const created = await db.insert(blogPosts).values({ ...post, publishedAt: now, wordCount: countWords(post.contentHtml), imageUrl: image.url, imageAlt: image.alt }).onConflictDoNothing({ target: blogPosts.slug }).returning({ id: blogPosts.id });
    inserted += created.length;
  }
  if (inserted > 0) {
    await db.insert(automationConfig).values({ lastRunAt: now }).onConflictDoNothing();
  }
}

router.get("/blog/posts", async (req, res): Promise<void> => {
  const parsed = ListBlogPostsQueryParams.safeParse(req.query);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const posts = await db.select().from(blogPosts).where(notInArray(blogPosts.slug, Object.keys(articleAliases))).orderBy(desc(blogPosts.publishedAt)).limit(parsed.data.limit).offset(parsed.data.offset ?? 0);
  res.json(ListBlogPostsResponse.parse(posts.map(summary)));
});

router.get("/blog/posts/:slug", async (req, res): Promise<void> => {
  const preferred = articleAliases[String(req.params.slug)];
  if (preferred) { res.redirect(308, `/api/blog/posts/${preferred}`); return; }
  const parsed = GetBlogPostParams.safeParse(req.params);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, parsed.data.slug));
  if (!post) { res.status(404).json({ error: "Post not found" }); return; }
  const related = await db.select().from(blogPosts).where(sql`${blogPosts.slug} <> ${post.slug}`).orderBy(desc(blogPosts.publishedAt)).limit(3);
  res.json(GetBlogPostResponse.parse({ ...post, contentHtml: cleanHtml(post.contentHtml), relatedPosts: related.map(summary) }));
});

router.post("/blog/events", async (req, res): Promise<void> => {
  const parsed = RecordBlogEventBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  await db.insert(blogEvents).values(parsed.data);
  res.sendStatus(204);
});

router.get("/blog/automation/status", async (_req, res): Promise<void> => {
  const [config] = await db.select().from(automationConfig).limit(1);
  const [latest] = await db.select().from(automationRuns).orderBy(desc(automationRuns.startedAt)).limit(1);
  const published = await db.select({ count: sql<number>`count(*)` }).from(blogPosts);
  const [daily] = await db.select().from(automationRuns).where(eq(automationRuns.runKey, `daily:${baliClock().dateKey}`));
  const [review] = await db.select().from(automationRuns).where(sql`${automationRuns.runKey} like 'review:%' AND ${automationRuns.status} = 'completed'`).orderBy(desc(automationRuns.completedAt)).limit(1);
  const last = latest?.completedAt ?? config?.lastRunAt ?? null;
  const next = daily && daily.status !== "completed" && baliClock().eligible
    ? new Date(Date.now() + 5 * 60000) : nextPublication(new Date(), daily?.status === "completed");
  res.json(GetBlogAutomationStatusResponse.parse({
    enabled: config?.enabled ?? true, cadence: "Every day, including weekends: two journals daily; weekly SEO review",
    maxPostsPerRun: 2, publishedPosts: Number(published[0]?.count ?? 0), lastRunAt: last,
    nextEligibleRunAt: next, timezone: TIMEZONE, scheduledHour: SCHEDULED_HOUR,
    minimumWords: MIN_WORDS, lastRunStatus: latest?.status ?? null, lastReviewAt: review?.completedAt ?? null,
  }));
});

export default router;