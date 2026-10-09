import { imageLibrary } from "./blog-policy";
import { journalImagery, pageImagery, photoKey } from "@workspace/site-content";
import { logger } from "./logger";

export type JournalImage = { url: string; alt: string; creditHtml?: string };
type CommonsImage = { thumburl?: string; descriptionurl?: string; width?: number; height?: number; extmetadata?: Record<string, { value?: string }> };
type CommonsPage = { title: string; imageinfo?: CommonsImage[] };
const plain = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export function isJournalImage(url: string) {
  if (imageLibrary.some(image => image.url === url) || Object.values(journalImagery).some(image => image.imageUrl === url)) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && ["upload.wikimedia.org", "thumb.wikimedia.org"].includes(parsed.hostname)
      && parsed.pathname.startsWith("/wikipedia/commons/") && !parsed.username && !parsed.password && !parsed.port;
  } catch { return false; }
}

export function journalPhotoTopic(topic: string) {
  if (/visa|passport|immigration|stay permit|travel|entry|remote.work/i.test(topic))
    return { queries: ["passport cover", "travel documents", "immigration airport"], match: /passport|document|immigration|airport/i };
  if (/company|pma|licen[cs]|registration|investment/i.test(topic))
    return { queries: ["business documents", "accounting ledger", "office paperwork"], match: /document|ledger|account|paperwork|office/i };
  return { queries: ["accounting calculator", "bookkeeping ledger", "invoice receipt"], match: /account|calculat|ledger|bookkeep|invoice|receipt/i };
}

/** Fresh, topic-related licensed photos only. Never disguise reuse with a new URL. */
export async function findJournalImage(used: Set<string>, seed: number, topic = "villa bookkeeping"): Promise<JournalImage> {
  const usedKeys = new Set([...used, ...imageLibrary.map(image => image.url),
    ...Object.values(pageImagery).map(image => image.imageUrl),
    ...Object.values(journalImagery).map(image => image.imageUrl)].map(photoKey));
  const selection = journalPhotoTopic(topic);
  for (const query of selection.queries) {
    try {
      const endpoint = new URL("https://commons.wikimedia.org/w/api.php");
      endpoint.search = new URLSearchParams({
        action: "query", format: "json", generator: "search", gsrnamespace: "6", gsrlimit: "30",
        gsrsearch: `${query} filetype:bitmap`, prop: "imageinfo", iiprop: "url|extmetadata|size", iiurlwidth: "1200",
      }).toString();
      const response = await fetch(endpoint, { signal: AbortSignal.timeout(15000),
        headers: { "User-Agent": "BaliAccountingJournal/1.0 (https://bali-villa-accounting-service.com)" } });
      if (!response.ok) throw new Error(`Image search returned ${response.status}`);
      const body = await response.json() as { query?: { pages?: Record<string, CommonsPage> } };
      const candidates = Object.values(body.query?.pages ?? {}).filter(page => {
        const image = page.imageinfo?.[0];
        return image?.thumburl && isJournalImage(image.thumburl) && !usedKeys.has(photoKey(image.thumburl))
          && (image.width ?? 0) >= 900 && selection.match.test(page.title)
          && !/portrait|conference|politician|logo|flag|coat.of.arms/i.test(page.title)
          && /^(?:CC BY(?:-SA)? [234]\.0|CC0|Public domain)$/i.test(plain(image.extmetadata?.LicenseShortName?.value ?? ""));
      });
      if (!candidates.length) continue;
      const candidate = candidates[seed % candidates.length];
      const image = candidate.imageinfo![0];
      const source = new URL(image.descriptionurl!);
      if (source.hostname !== "commons.wikimedia.org") continue;
      const license = plain(image.extmetadata?.LicenseShortName?.value ?? "");
      const artist = plain(image.extmetadata?.Artist?.value ?? "See original attribution");
      const licenseUrl = image.extmetadata?.LicenseUrl?.value;
      const approvedLicense = licenseUrl && /^https:\/\/creativecommons\.org\/(?:licenses|publicdomain)\//.test(licenseUrl) ? licenseUrl : null;
      logger.info({ source: source.href, query, license }, "Unique topic-related journal image selected");
      return {
        url: image.thumburl!,
        alt: `Illustrative photo: ${plain(candidate.title.replace(/^File:/, "").replace(/\.[a-z]+$/i, "").replace(/[-_]/g, " ")).slice(0,150)}`,
        creditHtml: `<p><em>Illustrative photo, not a client engagement. Photo credit: ${escape(artist)}. ${escape(license)}. <a href="${escape(source.href)}">Original image and attribution</a>${approvedLicense ? ` · <a href="${escape(approvedLicense)}">License terms</a>` : ""}. Cropped for display; no endorsement implied.</em></p>`,
      };
    } catch (err) { logger.warn({ err, query }, "Topic-related image search unavailable; trying the next query"); }
  }
  throw new Error("Publication held: no unused, topic-related licensed image was available; shared generic covers are not a fallback");
}
