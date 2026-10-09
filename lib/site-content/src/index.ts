import pages from "./page-imagery.json";
import journals from "./journal-imagery.json";

export type PageImagery = {
  imageUrl: string; imageAlt: string; shareImage: string;
  width: number; height: number; caption: string; updatedAt?: string;
};
export const pageImagery: Record<string, PageImagery> = pages;
export const journalImagery: Record<string, PageImagery> = journals;
export const publicPagePaths = Object.keys(pageImagery);
export function getPageImagery(pathname: string): PageImagery | undefined {
  return pageImagery[pathname.replace(/\/+$/, "") || "/"];
}

/** Compare the actual source photo, not resized URLs or cache-busting parameters. */
export function photoKey(value: string): string {
  try {
    const url = new URL(value, "https://bali-villa-accounting-service.com");
    if (url.pathname.startsWith("/images/")) return url.pathname;
    const pathname = url.pathname.replace(/\/wikipedia\/commons\/thumb\/([^/]+\/[^/]+\/[^/]+)\/[^/]+$/, "/wikipedia/commons/$1");
    const host = /^(?:upload|thumb)\.wikimedia\.org$/.test(url.hostname) ? "wikimedia" : url.hostname;
    return `${host}${decodeURIComponent(pathname)}`;
  } catch { return value.split(/[?#]/)[0]; }
}
