import { SITE_ORIGIN } from "./site-pages";

// New filenames intentionally replace the cached, old VillaBooks screenshot.
export const DEFAULT_SHARE_IMAGE = "/bali-accounting-share-2026-10.jpg";
export const JOURNAL_SHARE_IMAGE = "/bali-accounting-journal-share-2026-10.jpg";

export function shareImage(pathname: string) {
  return pathname.replace(/\/+$/, "") === "/blog" ? JOURNAL_SHARE_IMAGE : DEFAULT_SHARE_IMAGE;
}

export function shareImageAlt(pathname: string) {
  return pathname.replace(/\/+$/, "") === "/blog"
    ? "Bali Accounting Journal — practical guides for better villa records"
    : "Bali Accounting — villa bookkeeping and clear owner reports";
}

export function updateShareImage(pathname: string, article?: { imageUrl: string; imageAlt: string; updatedAt: string | Date }) {
  const url = new URL(article?.imageUrl ?? shareImage(pathname), SITE_ORIGIN);
  if (article && url.origin === SITE_ORIGIN) {
    const version = new Date(typeof article.updatedAt === "string" ? article.updatedAt : article.updatedAt.getTime()).getTime();
    if (Number.isFinite(version)) url.searchParams.set("v", String(version));
  }
  const setMeta = (kind: "property" | "name", key: string, value: string) => {
    let meta = document.querySelector<HTMLMetaElement>(`meta[${kind}="${key}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute(kind, key);
      document.head.appendChild(meta);
    }
    meta.content = value;
  };
  const alt = article?.imageAlt ?? shareImageAlt(pathname);
  setMeta("property", "og:image", url.href);
  setMeta("property", "og:image:secure_url", url.href);
  setMeta("property", "og:image:alt", alt);
  setMeta("name", "twitter:image", url.href);
  setMeta("name", "twitter:image:alt", alt);
  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("property", "og:type", article ? "article" : "website");
  const mime = /\.png$/i.test(url.pathname) ? "image/png" : /\.webp$/i.test(url.pathname) ? "image/webp" : /\.jpe?g$/i.test(url.pathname) ? "image/jpeg" : undefined;
  if (mime) setMeta("property", "og:image:type", mime);
  else document.querySelector('meta[property="og:image:type"]')?.remove();
  for (const dimension of ["width", "height"]) {
    const key = `og:image:${dimension}`;
    if (article) document.querySelector(`meta[property="${key}"]`)?.remove();
    else setMeta("property", key, dimension === "width" ? "1200" : "630");
  }
}
