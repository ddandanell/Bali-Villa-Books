-- Repairs for the Replit production journal (blog_posts).
-- Run in the Replit database console. Safe to re-run: every statement is
-- scoped to rows that still need the fix.

BEGIN;

-- 1. Public category labels. Internal cluster codes ("SEO") were persisted
--    before the allowlist existed. New posts are handled in code by
--    applyJournalRecordRepairs(); this fixes the rows already published.
UPDATE blog_posts SET category = 'Bookkeeping Cleanup', updated_at = NOW() WHERE slug = 'bookkeeping-software-migration-opening-cutover-records' AND category = 'SEO';
UPDATE blog_posts SET category = 'Villa Bookkeeping', updated_at = NOW() WHERE slug = 'villa-bookkeeping-duplicate-invoices-credit-notes' AND category = 'SEO';
UPDATE blog_posts SET category = 'Villa Bookkeeping', updated_at = NOW() WHERE slug = 'villa-petty-cash-reconciliation-vouchers-floats-counts' AND category = 'SEO';
UPDATE blog_posts SET category = 'Villa Bookkeeping', updated_at = NOW() WHERE slug = 'month-end-bookkeeping-late-supplier-invoices' AND category = 'SEO';
UPDATE blog_posts SET category = 'Villa Bookkeeping', updated_at = NOW() WHERE slug = 'monthly-bookkeeping-cost-villa-deliverables' AND category = 'SEO';
UPDATE blog_posts SET category = 'Villa Bookkeeping', updated_at = NOW() WHERE slug = 'villa-inventory-linen-supplies-bookkeeping-records' AND category = 'SEO';
UPDATE blog_posts SET category = 'OTA Operations', updated_at = NOW() WHERE slug = 'direct-booking-payment-processor-reconciliation-villa' AND category = 'SEO';

-- 2. Empty image credits. The Wikimedia author field resolved to an empty
--    string, producing "Photo credit: . Public domain." in 30 articles.
UPDATE blog_posts SET content_html = replace(content_html, 'Photo credit: . ', ''), updated_at = NOW() WHERE content_html LIKE '%Photo credit: . %';

COMMIT;

-- Expect 0 rows from both checks.
SELECT slug, category FROM blog_posts WHERE category = 'SEO';
SELECT slug FROM blog_posts WHERE content_html LIKE '%Photo credit: . %';
