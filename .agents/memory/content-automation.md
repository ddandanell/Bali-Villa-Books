---
name: Content automation
description: User's editorial requirements and unattended publishing constraints.
---

The user wants daily Journal publishing with pictures, individual SEO keywords and internal links, plus weekly SEO improvements. The latest request on 31 October 2026 specifies one post every day, including weekends; it supersedes the older two-post allowance. The supplied blueprint asks for 1,500–2,500-word standard articles.

**Why:** The user wants unattended publishing and ongoing improvement, not a process they must supervise.

**How to apply:** The latest daily request takes precedence over the attachment's three-posts-per-week plan and the older Monday–Friday schedule. Keep Bali-time scheduling and publication quality checks. Use site engagement as a signal, but not as search rankings or search-volume research.

An in-server timer on Autoscale is not a reliable unattended trigger because the production process can scale to zero. Continuous background publishing requires always-on hosting or an independent scheduled worker.

**Why:** The original publisher ran weekly only once in the recorded production history; the hosting configuration did not guarantee timer execution while idle.

**How to apply:** Check actual deployment type, not just workspace configuration. Publishing configuration changes do not activate until the user publishes.

The user chose to keep Autoscale and use an independent scheduled worker.

**Why:** The user explicitly selected this hosting approach rather than Reserved VM.

**How to apply:** Preserve the website's Autoscale deployment. Replit publishes all project artifacts together; use a separate Scheduled project, not a guessed per-artifact cron setting. Require an explicit production database connection and never substitute the worker's own development database. Report activation separately from preparing the worker package.

The website should sound like a serious company. Sales contacts are Sales / Client Advisory, not “WhatsApp Abel.”

**Why:** The user explicitly requested company-led positioning.

**How to apply:** Keep founder references in leadership context only. Never invent third-party client relationships, endorsements or results. Check social-share artwork as well as page copy: the old preview screenshot retained retired personal CTAs and a reporting-deadline promise after the website was rebranded.

The user does not use Calendly. All booking and consultation actions must open WhatsApp.

**Why:** The user explicitly repeated this requirement while requesting the full SEO blueprint update.

**How to apply:** Do not add calendar integrations, embed calendar widgets, or retain placeholder booking links for this site. Keep the verified WhatsApp number.

The 100-topic blueprint is a topic and structure plan, not verified evidence of tax rates, deadlines, permissions or new professional services.

**Why:** Its blanket factual claims are unverified. The user subsequently confirmed expanded in-house company, tax and visa support, but did not confirm audits, health checks, guarantee offers or lead magnets.

**How to apply:** Use practical evidence-preparation angles and real service/contact links, including the expanded scope described in service-scope.md. Hold unsupported regulatory claims, including in headlines and metadata. Do not invent a named licensed reviewer.

Supply mandatory links and the exact service disclaimer deterministically rather than relying entirely on generated HTML.

**Why:** Repeated long-form drafts omitted link attributes or varied the disclaimer wording; regenerating the entire article for such formatting errors wasted generation without improving its substance.

**How to apply:** Separate deterministic formatting from editorial quality. Keep valid draft content available during explicit development runs so small formatting repairs do not require repeated full generations; never bypass substantive quality checks.

Editorial rewrites must preserve an article's primary keyword and chosen picture. Apply the same strict checks after a bounded draft repair, and validate against current published content immediately before insertion.

**Why:** Production review found an automated rewrite had recycled generic covers and two posts competed for the same subject. Retry helpers can also outlive a failed batch, so pre-generation duplicate checks alone are insufficient.

**How to apply:** Treat wording improvements separately from article identity or media replacement. Preserve revision history, avoid overlapping publisher callbacks, and never let an error or exhausted retry be reported as completed publication.

Supply compact, topic-relevant research summaries to the writer, not entire raw provider responses. Transport failures are not editorial findings.

**Why:** Bulk research included long historical volume arrays; repeating them across concurrent articles exhausted provider token throughput. A rate-limited editorial check then incorrectly triggered a full rewrite of an otherwise usable draft.

**How to apply:** Keep dated demand evidence and its limitations, omit irrelevant raw arrays, and resume checkpoints serially when necessary. Hold transport failures without treating them as instructions to change article content.
