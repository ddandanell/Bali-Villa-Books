---
name: Content automation
description: User's editorial requirements and unattended publishing constraints.
---

The user wants daily Journal publishing with pictures, individual SEO keywords and internal links, plus weekly SEO improvements. Their latest request says every day; retain the previously requested two-post daily allowance and include weekends. The supplied blueprint asks for 1,500–2,500-word standard articles.

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

**Why:** Its blanket factual claims and proposed tax audits, health checks, guarantee offers and lead magnets conflict with the firm's confirmed bookkeeping-only scope.

**How to apply:** Use practical evidence-preparation angles and real service/contact links. Hold unsupported regulatory claims, including in headlines and metadata. Do not invent a named licensed reviewer.

Supply mandatory links and the exact service disclaimer deterministically rather than relying entirely on generated HTML.

**Why:** Repeated long-form drafts omitted link attributes or varied the disclaimer wording; regenerating the entire article for such formatting errors wasted generation without improving its substance.

**How to apply:** Separate deterministic formatting from editorial quality. Keep valid draft content available during explicit development runs so small formatting repairs do not require repeated full generations; never bypass substantive quality checks.
