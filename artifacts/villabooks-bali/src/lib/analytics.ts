type AnalyticsData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track(name: string, data?: AnalyticsData): void };
  }
}

export function trackEvent(name: string, data?: AnalyticsData) {
  if (typeof window === "undefined") return;
  const supported = ["whatsapp_click", "phone_click", "consultation_click", "sample_report_view", "sample_report_download", "blog_view", "article_completion"];
  if (!supported.includes(name)) return;
  const page = window.location.pathname.replace(/\/+$/, "") || "/";
  const label = (value: unknown, fallback: string) => typeof value === "string" && /^[a-zA-Z0-9 _-]{1,80}$/.test(value) ? value : fallback;
  const safeData = {
    eventType: name, page,
    placement: label(data?.placement ?? data?.location ?? data?.source, "website"),
    ...(data?.service ? { service: label(data.service, "unspecified") } : {}),
  };
  // Only an allowlisted event payload reaches first-party measurement. Never URLs with queries or personal details.
  fetch(`${import.meta.env.BASE_URL}api/site-events`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(safeData), keepalive: true,
  }).catch(() => { /* Measurement failure never blocks contact or reading. */ });
}