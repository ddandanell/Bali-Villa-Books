-- Remap mistaken SEO categories on the Replit production database.
-- Safe to re-run: only updates rows still labelled SEO.
BEGIN;
UPDATE blog_posts SET category = 'Bookkeeping Cleanup', updated_at = NOW() WHERE slug = 'bookkeeping-software-migration-opening-cutover-records' AND category = 'SEO';
UPDATE blog_posts SET category = 'Villa Bookkeeping', updated_at = NOW() WHERE slug = 'villa-bookkeeping-duplicate-invoices-credit-notes' AND category = 'SEO';
UPDATE blog_posts SET category = 'Bookkeeping Cleanup', updated_at = NOW() WHERE slug = 'villa-petty-cash-reconciliation-vouchers-floats-counts' AND category = 'SEO';
UPDATE blog_posts SET category = 'Villa Bookkeeping', updated_at = NOW() WHERE slug = 'month-end-bookkeeping-late-supplier-invoices' AND category = 'SEO';
UPDATE blog_posts SET category = 'Villa Bookkeeping', updated_at = NOW() WHERE slug = 'monthly-bookkeeping-cost-villa-deliverables' AND category = 'SEO';
COMMIT;
-- Expect 0 rows: SELECT slug, category FROM blog_posts WHERE category = 'SEO';
