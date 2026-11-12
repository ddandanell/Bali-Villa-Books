# Bali Accounting SEO autopilot

Owner authorization: 13 November 2026. Operate autonomously on this website and
repository. Make, validate and publish useful SEO improvements without routine
permission questions. The current twice-weekly request supersedes older daily
draft/publishing instructions for this new runner.

## Execution and schedule

The runner is a ChatGPT scheduled automation on Monday and Thursday mornings,
around 09:00 Asia/Makassar. It is an executing coding/editorial task, not a
reminder. `seo-autopilot.json` records its scope. The schedule is external to the
website and does not depend on an idle Replit process. There is deliberately no
second GitHub cron that generates competing articles.

Each run edits the current repository, runs the checks, opens a pull request,
autonomously merges after required checks, then
uses the existing Vercel Git deployment. No new AI API key, database migration,
replacement CMS or Vercel token is required. Connections and the scheduled-task
service must remain available. Report a genuine access failure; do not ask
whether to perform work already authorized here.

## Start from current evidence

1. Fetch `main`, inspect repository instructions and the last run records in
   `docs/seo/autopilot-runs/`. If using scratch, clone the repository first.
2. Use Node 24 and `corepack pnpm install --frozen-lockfile`. Run
   `corepack pnpm seo:plan` to paginate the production article inventory. Read
   the three public sitemaps and recent queued/draft topics. If this read fails,
   repair access or do useful technical maintenance; do not guess the inventory.
3. Read `lib/site-content/src/keyword-lock.json`, current service scope, pricing,
   `docs/seo/keyword-map.json` and dated research. Use connected Search Console,
   GA4 or Vercel analytics only if actually accessible. Log missing measurements.
   A crawl is not keyword volume, ranking, organic traffic or conversion data.

## Choose and implement

Inspect all canonical marketing pages, journal articles, metadata, canonicals,
structured data, crawl/indexing directives, broken assets/links, navigation,
mobile layout and performance. Prioritize real defects, neglected service
clusters and measured opportunities. Make the highest-value supported changes
to the site directly. Keep primary keyword ownership stable while improving
copy, snippets, examples and internal links. Do not churn titles merely to make
a fresh commit. New location pages require distinct, accurate local value.

Target one substantive article per run if a useful distinct question can be
supported. Compare intent against the full inventory and drafts, not only exact
keyword spelling. Improve an existing answer when appropriate. Do not publish
filler to meet a quota. Every new article owns a unique long-tail primary and
points to the existing commercial owner, two relevant guides, pricing and
contact. Append its keyword assignment before writing. Never let an article
take a commercial page's target. Existing assignments may not be moved.

Use original, direct English; answer early; include an explicit audience,
practical steps, an original illustrative IDR example with checked arithmetic,
a table/checklist, 4-6 visible FAQs and clear next steps. Use 1,500-2,500 useful
words as the site's editorial range, not a claimed Google requirement. Research
any current or uncertain factual claim in primary sources. Include source URLs
and access dates in the article and run record. Never fabricate expertise,
client outcomes, search data, credentials or professional review. Preserve
approved company claims, actual prices, service boundaries and contact details.
Do not publish unsupported tax rates, legal instructions or visa entitlements;
use a well-supported records/process topic when specialist evidence is absent.

Save new articles in `lib/site-content/src/autopilot-posts.json` with the existing
`StaticJournalPost` contract. New articles are prerendered to real initial HTML
by the existing build and added to `sitemap-journal.xml`. The journal client and
service-page guide modules automatically include this registry. Use a unique,
relevant local cover and accurate alt text. Additional visuals should clarify
the article; do not invent stock-photo licences or call illustrations real work.
Do not edit the production database to publish these static posts. Preserve the
existing backend for old articles, anonymous forms and measurement events.

## Verify, publish and recover

1. Run `corepack pnpm seo:check --base-ref <starting-main-SHA>` and
   `corepack pnpm check`. The checks must pass before the release. Review the
   actual diff for claims, links, primary intent and unrelated changes.
2. Store a dated run record with inventory, sources, chosen intent and service
   owner, changes, checks, measurement limitations and release expectations.
   Keep draft checkpoints so a failed run can resume without another article.
3. Re-read the `main` head. If another contributor changed it, integrate their
   changes and repeat affected checks. Push a normal commit to a unique `seo/autopilot-*` branch, open a non-draft
   pull request and merge it after required checks pass, using the expected head
   SHA. Main requires a pull request. Never force push, disable branch protection
   or use an administrator bypass. No routine human approval step; report an
   exact unmet human-review requirement if one actually blocks the merge.
4. Observe the commit's GitHub checks and Vercel status. The expected Vercel
   project is the one linked to this repository, previously reported as
   `bali-villa-books-api-serverff` under `daviddandanell-9392s-projects`. Do not
   create a different project when an account cannot list that existing project.
5. Run `corepack pnpm seo:verify-live`. Also inspect the exact changed HTML,
   metadata, canonical, image, journal discovery and assets on the public domain.
   An HTTP 200 login page, old revision or successful push is not publication.
6. If deployment fails, inspect its exact logs/status, repair the cause and
   retry at most twice. If a new release causes a public regression, revert the
   automation's own faulty commit, preserving other contributors' changes.
   Never delete articles, rewrite history or change DNS to hide a failed run.

Keep an accurate record of partial runs and outstanding blockers. Do not claim
completion when the build, push, deployment or public revision is unverified.
The next scheduled run resumes unresolved work first. Report a concise result
with commit, live URLs, checks, measurements and any actual blocker. No client
or staff messages are authorized by this workflow.

## Keyword enforcement

`seo:check` rejects duplicate normalized primary keywords, unsafe/invalid new
articles, missing links/assets and keyword reassignment against a supplied base
commit. CI compares each push/PR to its previous base. The lock is a planning
and validation contract, not an HTML meta-keywords tag or a ranking guarantee.
Retain legacy article identities; intent conflicts beyond exact matches still
need editorial judgment and current evidence.
