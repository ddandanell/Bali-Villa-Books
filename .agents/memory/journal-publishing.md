---
name: Journal publishing path
description: Posts go live only via blog_posts INSERT on the Replit database.
---

Publishing a journal article requires an INSERT into `blog_posts` on the Replit
production database. There is no CMS, admin write API or Vercel-side database
that the live journal reads.

**Why:** Vercel only proxies allowlisted public reads/forms to
`bali-villa-books.replit.app`. The Supabase store on the Vercel project is not
wired into the journal.

**How to apply:** Do not claim a post is live after a deploy or a write to an
unused store. Verify with `GET /blog/{slug}` returning 200 on the public domain.
Never invent DATABASE_URL or paste credentials into chat.

Static `artifacts/villabooks-bali/public/sitemap.xml` must stay deleted: Vercel
serves filesystem files before rewrites, so a stub would hide the dynamic
sitemap gateway route.
