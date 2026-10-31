type AnalyticsData = Record<string, string | number | boolean>;
const firstPartyEvents = new Set([
  "whatsapp_click", "phone_click", "consultation_click", "sample_report_view",
  "sample_report_download", "blog_view", "article_completion",
]);
const supportedEvents = new Set([...firstPartyEvents, "enquiry_form_started", "plan_selected", "enquiry_submitted"]);

export function enquiryPlan(value: string): string {
  if (value === "One-time cleanup") return "Cleanup";
  return /^(Starter|Professional|Premium)(?:\s+—|$)/.exec(value)?.[1] ?? "unspecified";
}

declare global {
  interface Window {
    umami?: { track(name: string, data?: AnalyticsData): void | Promise<unknown> };
  }
}

export function trackEvent(name: string, data?: AnalyticsData) {
  if (typeof window === "undefined") return;
  if (!supportedEvents.has(name)) return;
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  // Only public routes; exclude query strings, hashes and arbitrary error-page paths.
  const page = pathname.length <= 200 && /^(?:\/|\/(?:compare(?:\/[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?|services|airbnb-bookkeeping-bali|villa-financial-reporting-bali|villa-bookkeeping-cleanup-bali|pt-pma-villa-bookkeeping|villa-payroll-records-bali|pricing|sample-report|about|get-started|faq|privacy|terms)|\/blog(?:\/[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?)$/.test(pathname) ? pathname : "other_page";
  const label = (value: unknown, fallback: string) => typeof value === "string" && /^[a-zA-Z0-9 _-]{1,80}$/.test(value) ? value : fallback;
  const safeData = {
    eventType: name, page,
    placement: label(data?.placement ?? data?.location ?? data?.source, "website"),
    ...(data?.service ? { service: label(data.service, "unspecified") } : {}),
  };
  const { eventType: _eventType, ...dimensions } = safeData;
  const plan = typeof data?.plan === "string" && ["Starter", "Professional", "Premium", "Cleanup", "unspecified"].includes(data.plan) ? data.plan : undefined;
  try {
    // Publishing injects the tracker. Never configure a script, website ID or pageview here.
    void Promise.resolve(window.umami?.track(name, {
      ...dimensions, ...(plan ? { plan } : {}),
    })).catch(() => { /* Rejected tracking requests must not affect the interaction. */ });
  } catch { /* The tracker may be unavailable or blocked. */ }

  // The server records saved enquiries transactionally; do not insert a second one here.
  // New dashboard-only events also do not change the existing first-party API contract.
  if (!firstPartyEvents.has(name)) return;
  // Only an allowlisted event payload reaches first-party measurement. Never URLs with queries or personal details.
  try {
    void fetch(`${import.meta.env.BASE_URL}api/site-events`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(safeData), keepalive: true,
    }).catch(() => { /* Measurement failure never blocks contact or reading. */ });
  } catch { /* Network APIs may also be unavailable. */ }
}