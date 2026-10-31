import sanitizeHtml from "sanitize-html";
import { countWords, imageLibrary, journalCategories, MIN_WORDS, similarTitle } from "./blog-policy";
import { isJournalImage } from "./journal-images";

// Hand-researched news may cite these verified official and public-news sources.
const sourceHosts = new Set(["kemenimipas.go.id", "www.imigrasi.go.id", "evisa.imigrasi.go.id", "peraturan.bpk.go.id", "en.antaranews.com", "allindonesia.imigrasi.go.id", "oss.go.id", "www.pajak.go.id", "pajak.go.id", "jdih.kemenkeu.go.id", "bali.bps.go.id", "www.bps.go.id", "docs.stripe.com", "commons.wikimedia.org", "creativecommons.org"]);
export function safeArticleLink(href?: string) {
  if (!href) return false;
  if (href.startsWith("/") && !href.startsWith("//")) return true;
  try {
    const url = new URL(href);
    return url.protocol === "https:" && !url.username && !url.password && !url.port && sourceHosts.has(url.hostname);
  } catch { return false; }
}

export function cleanHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["h2", "h3", "p", "ul", "ol", "li", "strong", "em", "a", "blockquote", "table", "thead", "tbody", "tr", "th", "td", "caption"],
    allowedAttributes: { a: ["href"] },
    allowedSchemes: ["https"],
    allowProtocolRelative: false,
    transformTags: {
      a: (_tag, attributes): sanitizeHtml.Tag => ({
        tagName: "a",
        attribs: safeArticleLink(attributes.href) ? { href: attributes.href } : {},
      }),
    },
  });
}

type Existing = { slug: string; title: string; primaryKeyword: string };
export const serviceLinks = ["/services", "/airbnb-bookkeeping-bali", "/villa-financial-reporting-bali", "/villa-bookkeeping-cleanup-bali", "/pt-pma-villa-bookkeeping", "/villa-payroll-records-bali", "/company-formation-bali", "/business-licensing-bali", "/tax-registration-bali", "/tax-compliance-bali", "/tax-planning-bali", "/business-visa-bali", "/investor-kitas-bali", "/company-compliance-bali"];
export const publicLinks = ["/", "/#services", "/#pricing", "/#faq", "/blog", "/pricing", "/sample-report", "/about", "/get-started", "/faq", ...serviceLinks];
/** Remove invented destinations without deleting the surrounding useful prose. */
export function repairArticleLinks(html: string, existing: Existing[]) {
  const known = new Set([...publicLinks, ...existing.map(post => `/blog/${post.slug}`)]);
  return cleanHtml(html).replace(/<a href="([^"]+)">([\s\S]*?)<\/a>/g, (_all, href: string, label: string) => {
    let candidate = href;
    try {
      const url = new URL(href, "https://bali-villa-accounting-service.com");
      if (url.hostname === "bali-villa-accounting-service.com") {
        const pathname = url.pathname.replace(/\/+$/, "") || "/";
        candidate = known.has(pathname + url.hash) ? pathname + url.hash : pathname;
      }
    } catch { return label; }
    const valid = known.has(candidate) || (candidate.startsWith("https://") && safeArticleLink(candidate));
    return valid ? `<a href="${candidate.replace(/"/g, "&quot;")}">${label}</a>` : label;
  });
}
export function validateArticle(value: unknown, existing: Existing[], revisionSlug?: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Article must be a JSON object");
  const data = value as Record<string, unknown>;
  const string = (key: string, min: number, max: number) => {
    const result = data[key];
    if (typeof result !== "string" || result.trim().length < min || result.trim().length > max) throw new Error(`Invalid ${key}`);
    return result.trim();
  };
  const slug = revisionSlug ?? string("slug", 8, 120);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Invalid URL slug");
  const title = string("title", 20, 150);
  const primaryKeyword = string("primaryKeyword", 8, 100);
  const normalize = (text: string) => text.normalize("NFKC").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const peers = existing.filter(p => p.slug !== revisionSlug);
  if (peers.some(p => p.slug === slug || similarTitle(p.title, title) || normalize(p.primaryKeyword) === normalize(primaryKeyword))) {
    throw new Error("Duplicate article topic or keyword");
  }
  const contentHtml = cleanHtml(string("contentHtml", 1000, 90000));
  const wordCount = countWords(contentHtml);
  if (wordCount < MIN_WORDS) throw new Error(`Article has only ${wordCount} words; minimum is ${MIN_WORDS}`);
  if ((contentHtml.match(/<h2>/g) ?? []).length < 4) throw new Error("Article needs at least four meaningful sections");
  const links = [...contentHtml.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  const blogLinks = new Set(links.filter(link => existing.some(p => link === `/blog/${p.slug}` && p.slug !== slug)));
  if (blogLinks.size < 2 || !links.some(link => serviceLinks.includes(link) || link === "/#services")) throw new Error("Missing required service and related-journal links");
  if (links.some(link => !publicLinks.includes(link) && !existing.some(p => link === `/blog/${p.slug}`) && !(link.startsWith("https://") && safeArticleLink(link)))) {
    throw new Error("Unknown internal link");
  }
  const imageUrl = string("imageUrl", 8, 1000);
  if (!isJournalImage(imageUrl)) throw new Error("Image must be an approved local illustration or an openly licensed Commons photograph");
  return {
    slug, title, primaryKeyword, contentHtml, wordCount,
    excerpt: string("excerpt", 60, 350),
    metaTitle: string("metaTitle", 20, 60),
    metaDescription: string("metaDescription", 90, 160),
    category: (() => {
      const category = string("category", 3, 70);
      if (!(journalCategories as readonly string[]).includes(category))
        throw new Error(`Invalid category; use one of: ${journalCategories.join(", ")}`);
      return category;
    })(),
    imageUrl, imageAlt: string("imageAlt", 20, 180),
    readTimeMinutes: Math.ceil(wordCount / 220),
    updatedAt: new Date(),
  };
}
