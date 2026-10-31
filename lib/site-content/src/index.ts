import pages from "./page-imagery.json";
import journals from "./journal-imagery.json";
import strategyData from "./seo-strategy.json";
import priorityData from "./seo-priority-topics.json";
export type SeoCluster = {
  id: string; page: string; supportPages: string[]; keyword: string; label: string; description: string;
  guides: { href: string; title: string }[];
};
export const seoStrategy: {
  checkedAt: string; source: string; limitations: string; clusters: SeoCluster[];
  demand: { keyword: string; market: string; estimatedMonthlySearches: number | null; source: string }[];
} = strategyData;
export const seoPriorityTopics: { id: number; cluster: string; workingTitle: string; keyword: string; service: string }[] = priorityData;
/** Keep both stored articles; serve one preferred public URL for this duplicate topic. */
export const articleAliases: Record<string, string> = {
  "clean-books-villa-sale-price": "clean-books-villa-sale-bali",
};

export type PageImagery = {
  imageUrl: string; imageAlt: string; shareImage: string;
  width: number; height: number; caption: string; updatedAt?: string;
};
export const pageImagery: Record<string, PageImagery> = pages;
export const journalImagery: Record<string, PageImagery> = journals;
export const publicPagePaths = Object.keys(pageImagery);
/** The local art this build ships for an article slug, if any. */
export function localArticleArt(slug: string): PageImagery | undefined {
  return journalImagery[slug];
}
/** Article art: a local journal image wins over whatever the database row carries. */
export function articleVisual(slug: string, fallback: { imageUrl: string; imageAlt: string; width?: number; height?: number }): PageImagery {
  const local = localArticleArt(slug);
  if (local) return local;
  return {
    imageUrl: fallback.imageUrl, imageAlt: fallback.imageAlt, shareImage: fallback.imageUrl,
    width: fallback.width ?? 1200, height: fallback.height ?? 750, caption: "",
  };
}

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
