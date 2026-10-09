---
name: Domain management
description: Where the user manages this site's custom domain and DNS.
---

The user confirmed that they bought this site's custom domain through Replit. They report that its registrar is shown as Name.com, Inc., despite never having used Name.com.

**Why:** Vercel nameservers led to incorrect guidance to edit the domain in Vercel. Nameserver branding alone does not establish which account or interface manages the DNS.

**How to apply:** Use Replit's Publishing → Domains → Edit interface for DNS record instructions. Distinguish the registrar from the purchase and DNS-management interface; do not assume the user has a separate Name.com login. Do not ask the user to connect a Vercel account based only on the nameservers. Preserve the existing Replit verification TXT record when adding Google verification.

The user wants `bali-villa-accounting-service.com` to be the only public website address, not a separate copy at `bali-villa-books.replit.app`.

**Why:** The user is concerned that showing the Replit address could damage the site's search presence.

**How to apply:** Keep the custom domain as the canonical destination for site links and sharing. Preserve permanent alias redirects, including page paths and query strings; do not take down the deployment to remove an alias, since the custom domain depends on it.
