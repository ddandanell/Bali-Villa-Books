import { imageLibrary } from "./blog-policy";
import { logger } from "./logger";

export type JournalImage = { url: string; alt: string; creditHtml?: string };
type CommonsImage = { thumburl?: string; descriptionurl?: string; width?: number; height?: number; extmetadata?: Record<string, { value?: string }> };
type CommonsPage = { title: string; imageinfo?: CommonsImage[] };
const plain = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
export function isJournalImage(url: string) {
  if (imageLibrary.some(image => image.url === url)) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && ["upload.wikimedia.org", "thumb.wikimedia.org"].includes(parsed.hostname)
      && parsed.pathname.startsWith("/wikipedia/commons/") && !parsed.username && !parsed.password && !parsed.port;
  } catch { return false; }
}

/** Search open-license photos on every run; keep the attribution with the article. */
export async function findJournalImage(used: Set<string>, seed: number): Promise<JournalImage> {
  try {
    const endpoint = new URL("https://commons.wikimedia.org/w/api.php");
    endpoint.search = new URLSearchParams({
      action: "query", format: "json", generator: "search", gsrnamespace: "6", gsrlimit: "10",
      gsrsearch: "Bali villa filetype:bitmap -Crete -Greece", prop: "imageinfo",
      iiprop: "url|extmetadata|size", iiurlwidth: "1200",
    }).toString();
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(15000),
      headers: { "User-Agent": "BaliAccountingJournal/1.0 (https://bali-villa-accounting-service.com)" } });
    if (!response.ok) throw new Error(`Commons image search returned ${response.status}`);
    const body = await response.json() as { query?: { pages?: Record<string, CommonsPage> } };
    const candidates = Object.values(body.query?.pages ?? {}).filter(page => {
      const image = page.imageinfo?.[0];
      return image?.thumburl && isJournalImage(image.thumburl) && (image.width ?? 0) >= 900
        && /villa|hotel|resort|residence|house|pool|lodge/i.test(page.title)
        && !/Crete|Greece/i.test(page.title)
        && /^(?:CC BY(?:-SA)? [234]\.0|CC0|Public domain)$/i.test(plain(image.extmetadata?.LicenseShortName?.value ?? ""));
    }).sort((a, b) => Number(used.has(a.imageinfo![0].thumburl!.split("?")[0])) - Number(used.has(b.imageinfo![0].thumburl!.split("?")[0])));
    const candidate = candidates[0];
    if (!candidate) throw new Error("No suitable openly licensed Bali villa photo found");
    const image = candidate.imageinfo![0];
    const url = image.thumburl!.split("?")[0];
    const check = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(10000) });
    if (!check.ok || !check.headers.get("content-type")?.startsWith("image/")) throw new Error("Selected photo is not reachable");
    const artist = plain(image.extmetadata?.Artist?.value ?? "See source for photographer").slice(0,180);
    const license = plain(image.extmetadata?.LicenseShortName?.value ?? "");
    const source = new URL(image.descriptionurl!);
    if (source.hostname !== "commons.wikimedia.org") throw new Error("Invalid photo attribution URL");
    const licenseUrl = image.extmetadata?.LicenseUrl?.value;
    const approvedLicense = licenseUrl && /^https:\/\/creativecommons\.org\/(?:licenses|publicdomain)\//.test(licenseUrl) ? licenseUrl : null;
    logger.info({ source: source.href, license }, "Open-license journal image selected");
    return { url, alt: `Illustrative photo: ${plain(candidate.title.replace(/^File:/, "").replace(/\.[a-z]+$/i, "").replace(/[-_]/g, " ")).slice(0,150)}`,
      creditHtml: `<p><em>Illustrative photo, not a client property. Photo credit: ${escape(artist)}. ${escape(license)}. <a href="${escape(source.href)}">Original image and attribution</a>${approvedLicense ? ` · <a href="${escape(approvedLicense)}">License terms</a>` : ""}. Displayed in a cropped layout; no endorsement implied.</em></p>` };
  } catch (err) {
    logger.warn({ err }, "Live image search unavailable; using the approved local illustration library instead");
    const image = imageLibrary[seed % imageLibrary.length];
    return { url: image.url, alt: image.alt, creditHtml: "<p><em>Illustrative accounting image; not a photograph of a client engagement.</em></p>" };
  }
}
