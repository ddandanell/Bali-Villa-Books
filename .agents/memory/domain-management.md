---
name: Domain management
description: Where the user manages this site's custom domain and DNS.
---

The user confirmed that they bought this site's custom domain through Replit. They report that its registrar is shown as Name.com, Inc., despite never having used Name.com.

**Why:** Vercel nameservers led to incorrect guidance to edit the domain in Vercel. Nameserver branding alone does not establish which account or interface manages the DNS.

**How to apply:** Distinguish the registrar from the purchase and DNS-management interface; do not assume the user has a separate Name.com login. The connected Vercel account has since directly confirmed ownership of this domain's DNS zone and exposes its existing records, so that verified API can manage this zone. Preserve the existing Replit verification TXT record and unrelated records. Do not infer DNS-account access from nameservers alone.

The user wants `bali-villa-accounting-service.com` to be the only public website address, not a separate copy at `bali-villa-books.replit.app`.

**Why:** The user is concerned that showing the Replit address could damage the site's search presence.

**How to apply:** Keep the apex as the canonical destination for site links and sharing. The user explicitly requested no www redirect and no second website; remove the www domain mapping rather than serving a duplicate. Keep the separate backend running.

The public site should live on Vercel, while Replit remains the invisible backend.

**Why:** Dual hosting made GitHub/Vercel updates invisible on the custom domain.

**How to apply:** Keep a separate verified backend origin. The Replit hostname's public-route exception is published, so it can now serve as the adapter's backend without a new api subdomain. Never target the public apex from its own Vercel adapter.

`www.bali-villa-accounting-service.com` must stay attached to Vercel project
`prj_R4hssmwrWpUrqAn7wgPlxTSeUbX7` with a DNS record (CNAME to `cname.vercel-dns.com`
or the A/AAAA values Vercel shows). Apex alone is not enough if clients or old
links use www. Agents authenticated only to other Vercel teams cannot edit this.
