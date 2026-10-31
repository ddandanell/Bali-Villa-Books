# Daily Journal publishing

## Editorial pipeline

The uploaded 100-topic blueprint is bundled with the API and parsed into an explicit topic queue. Existing published primary keywords determine which topics have already been covered; the queue survives restarts without an in-memory progress counter.

The latest owner request is one useful post per day; this supersedes the older two-post allowance. The schedule now includes **every calendar day**, including weekends, at **09:00 Asia/Makassar**. Checks run every five minutes after that time. A database advisory lock, date/slot publication keys and completed run records prevent concurrent workers and restarted processes from publishing the same daily slot twice.

The first article can be explicitly created before the scheduled hour with:

    pnpm --filter @workspace/api-server run publish-journals --first

This creates only the first slot and skips the weekly review. The completed slot is skipped by later scheduled recovery checks. A normal unattended worker uses the same command without --first.

Each new article receives:

- A distinct assigned primary keyword and practical intent.
- Between 1,500 and 2,500 words, aiming for 1,800–2,000 plus concise credits.
- A direct answer, reader scope, illustrative IDR example, table, three corrected mistakes, checklist and four to six FAQs.
- Two or three existing sibling links and real service/contact links.
- Short branded metadata, description, canonical URL, social image, Article, Breadcrumb and visible-answer FAQ structured data.
- Live Commons image search restricted to appropriate openly licensed property photos, tested image URLs and persisted credit/license links. If search fails, a logged fallback uses the site's approved local illustration library.
- A separate automated editorial quality check before insertion.
- Visible editorial attribution and updated date; no fabricated licensed reviewer.

Monthly bookkeeping and decision-support topics are prioritized first. Tax and licensing titles are treated as working questions, not verified claims. Those articles stay within evidence preparation and professional-review boundaries. The source document's rates, deadlines, filing instructions, professional credentials, lead magnets and guarantee offers are not automatically adopted. Current numerical tax claims and mandatory deadlines are held rather than published without appropriate review.

After the 100 planned primary keywords have been covered, the same article template selects new underserved practical angles from existing service clusters. Existing articles are not deleted to make space.

## Hosting requirement—must not be overlooked

The verified live deployment was Autoscale during this setup. Autoscale can scale to zero while idle, so an in-process timer does not guarantee a daily run.

Choose one of:

1. **Reserved VM:** run the existing website/API continuously. This changes hosting costs and must be selected in Publishing settings and activated by the user.
2. **Independent scheduled worker:** keep the website on Autoscale, but run the publisher in a separate daily job against the same production database. A website itself must not be converted into a scheduled-only deployment. The worker must use the production environment and a verified deployment configuration.

The selected approach is the independent worker. Run
`node scripts/src/export-journal-worker.mjs` to prepare
`exports/journal-worker.zip`; activation instructions are in
`tools/journal-worker/README.md`. It uses a separate Scheduled Replit project,
an explicit `JOURNAL_PRODUCTION_DATABASE_URL` secret (never a default development
database), and that project's managed AI integration. Preparing or downloading
the archive does not activate a schedule. After the worker is configured, use
`JOURNAL_SCHEDULER_MODE=external` in the website's production environment and
republish so the website timer no longer competes with the worker.

The code being enabled does not prove either trigger is active. Publishing/re-publishing is still a user action. AI generation and review incur the existing AI integration's usage costs.

## Persistence and monitoring

The first article and its actual related-article dependencies are bundled as launch content for the next publish; initialization inserts missing slugs only and never overwrites an existing published version.

Use /api/blog/automation/status for enabled flag, cadence, next eligible run, latest run state and minimum length. Public reads do not trigger generation and cannot authorize an ad-hoc paid publication.

Failed runs retain valid published slots and report an error. They have bounded retries instead of unlimited paid generation. Weekly quality improvements preserve pre-edit versions.

Check that the selected always-on or independent trigger is active after publishing. Do not equate a nextEligibleRunAt timestamp with proof that a sleeping host will wake.
