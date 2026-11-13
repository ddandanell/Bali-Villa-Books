import { pageImagery } from "@workspace/site-content";

/** Exclude arbitrary error paths and strip query/hash values before measurement. */
export function measurementUrl(value: string): string | null {
  try {
    const url = new URL(value, "https://bali-villa-accounting-service.com");
    const path = url.pathname.replace(/\/+$/, "") || "/";
    if (url.hostname !== "bali-villa-accounting-service.com") return null;
    if (!pageImagery[path] && !/^\/blog\/[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(path)) return null;
    return `${url.origin}${path}`;
  } catch { return null; }
}
