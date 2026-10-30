---
name: Domain management
description: Where the user manages this site's custom domain and DNS.
---

The user confirmed that they bought this site's custom domain through Replit. They report that its registrar is shown as Name.com, Inc., despite never having used Name.com.

**Why:** Vercel nameservers led to incorrect guidance to edit the domain in Vercel. Nameserver branding alone does not establish which account or interface manages the DNS.

**How to apply:** Distinguish the registrar from the purchase and DNS-management interface; do not assume the user has a separate Name.com login. The connected Vercel account has since directly confirmed ownership of this domain's DNS zone and exposes its existing records, so that verified API can manage this zone. Preserve the existing Replit verification TXT record and unrelated records. Do not infer DNS-account access from nameservers alone.

The user wants `bali-villa-accounting-service.com` to be the only public website address, not a separate copy at `bali-villa-books.replit.app`.

**Why:** The user is concerned that showing the Replit address could damage the site's search presence.

**How to apply:** Keep the custom domain as the canonical destination for site links and sharing. Preserve permanent alias redirects, including page paths and query strings; do not take down the deployment to remove an alias, since the custom domain depends on it.
