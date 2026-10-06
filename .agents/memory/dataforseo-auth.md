---
name: DataForSEO authentication formats
description: Avoid double-encoding a dashboard-provided Base64 credential pair.
---

DataForSEO dashboard credentials can be supplied as an already Base64-encoded full login/password pair rather than two raw fields. Normalize the supported formats only in server-side runtime code before constructing Basic authorization.

**Why:** Repeated authorization failures were resolved by recognizing a complete encoded pair instead of encoding it again as an ordinary password.

**How to apply:** Validate a decoded pair without displaying it, authenticate before paid research, and never log authorization headers or decoded values. Keep credentials out of client bundles and research outputs. Store unavailable search-volume results as unavailable, not zero; measured broader terms do not establish volume for an exact niche variant.
