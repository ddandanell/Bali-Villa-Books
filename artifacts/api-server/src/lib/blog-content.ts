import sanitizeHtml from "sanitize-html";
import { countWords, imageLibrary, MIN_WORDS, similarTitle } from "./blog-policy";

export function cleanHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["h2", "h3", "p", "ul", "ol", "li", "strong", "em", "a", "blockquote"],
    allowedAttributes: { a: ["href"] },
    allowedSchemes: ["https"],
    allowProtocolRelative: false,
    transformTags: {
      a: (_tag, attributes): sanitizeHtml.Tag => ({
        tagName: "a",
        attribs: attributes.href?.startsWith("/") && !attributes.href.startsWith("//") ? { href: attributes.href } : {},
      }),
    },
  });
}

type Existing = { slug: string; title: string; primaryKeyword: string };
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
  const peers = existing.filter(p => p.slug !== revisionSlug);
  if (peers.some(p => p.slug === slug || similarTitle(p.title, title) || p.primaryKeyword.toLowerCase() === primaryKeyword.toLowerCase())) {
    throw new Error("Duplicate article topic or keyword");
  }
  const contentHtml = cleanHtml(string("contentHtml", 1000, 90000));
  const wordCount = countWords(contentHtml);
  if (wordCount < MIN_WORDS) throw new Error(`Article has only ${wordCount} words; minimum is ${MIN_WORDS}`);
  if ((contentHtml.match(/<h2>/g) ?? []).length < 4) throw new Error("Article needs at least four meaningful sections");
  const links = [...contentHtml.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  const blogLinks = new Set(links.filter(link => existing.some(p => link === `/blog/${p.slug}` && p.slug !== slug)));
  if (blogLinks.size < 2 || !links.includes("/#services")) throw new Error("Missing required service and related-journal links");
  if (links.some(link => !["/#services", "/#pricing", "/#faq", "/blog", "/"].includes(link) && !existing.some(p => link === `/blog/${p.slug}`))) {
    throw new Error("Unknown internal link");
  }
  const imageUrl = string("imageUrl", 8, 200);
  if (!imageLibrary.some(image => image.url === imageUrl)) throw new Error("Image must be from the verified accounting image library");
  return {
    slug, title, primaryKeyword, contentHtml, wordCount,
    excerpt: string("excerpt", 60, 350),
    metaTitle: string("metaTitle", 20, 60),
    metaDescription: string("metaDescription", 90, 160),
    category: string("category", 3, 70),
    imageUrl, imageAlt: string("imageAlt", 20, 180),
    readTimeMinutes: Math.ceil(wordCount / 220),
    updatedAt: new Date(),
  };
}
