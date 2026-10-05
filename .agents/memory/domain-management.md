---
name: Domain management
description: Where the user manages this site's custom domain and DNS.
---

The user confirmed that they bought this site's custom domain through Replit. They report that its registrar is shown as Name.com, Inc., despite never having used Name.com.

**Why:** Vercel nameservers led to incorrect guidance to edit the domain in Vercel. Nameserver branding alone does not establish which account or interface manages the DNS.

**How to apply:** Use Replit's Publishing → Domains → Edit interface for DNS record instructions. Distinguish the registrar from the purchase and DNS-management interface; do not assume the user has a separate Name.com login. Do not ask the user to connect a Vercel account based only on the nameservers. Preserve the existing Replit verification TXT record when adding Google verification.
