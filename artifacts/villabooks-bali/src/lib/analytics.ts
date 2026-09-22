type AnalyticsData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track(name: string, data?: AnalyticsData): void };
  }
}

export function trackEvent(name: string, data?: AnalyticsData) {
  if (typeof window === "undefined") return;
  try { window.umami?.track(name, data); } catch { /* analytics must never interrupt reading */ }
}