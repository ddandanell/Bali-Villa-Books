/**
 * Vercel has no copy of the production database. Forward only public website
 * endpoints to the existing backend; never forward credentials or private APIs.
 *
 * Production for this site is the Vercel domain. The Replit hostname is the
 * data source behind this gateway, not a verification surface: the two
 * deliberately disagree about journal markup, and only the Vercel domain is what
 * readers and crawlers see.
 */
import { journalArt } from "./journal-art.mjs";

export const origin = "https://bali-villa-books.replit.app";
export const publicOrigin = "https://bali-villa-accounting-service.com";
export function allowedEndpoint(path, method) {
  const readApi = ["/api/healthz", "/api/blog/posts"].includes(path) ||
    /^\/api\/blog\/posts\/[a-z0-9-]+$/.test(path);
  const readSite = path === "/blog" || path === "/sitemap.xml" ||
    /^\/blog\/[a-z0-9-]+\/?$/.test(path);
  return (["GET", "HEAD"].includes(method) && (readApi || readSite)) ||
    (method === "POST" && ["/api/enquiries", "/api/site-events", "/api/blog/events"].includes(path));
}

function gatewayPath(raw) {
  if (!raw) return "/api/";
  return raw.startsWith("/") ? raw : `/api/${raw}`;
}

// The public path this request belongs to. Vercel hands the function the
// original request URL, so that is normally the answer; the __gateway and
// __document parameters exist only for a direct call to this function.
export function resolveTarget(req) {
  const url = new URL(req.url, "https://gateway.invalid");
  if (url.pathname !== "/api/gateway") return url.pathname;
  const documentPath = url.searchParams.get("__document");
  if (documentPath !== null) return `/${documentPath}`;
  return gatewayPath(url.searchParams.get("__gateway") ?? "");
}

export async function proxyRequest(req, fetcher = fetch) {
  const url = new URL(req.url, "https://gateway.invalid");
  const targetPath = resolveTarget(req);
  url.searchParams.delete("__gateway");
  url.searchParams.delete("__document");
  const documentRead = ["GET", "HEAD"].includes(req.method) &&
    (targetPath === "/blog" || /^\/blog\/[a-z0-9-]+\/?$/.test(targetPath) || targetPath === "/sitemap.xml");
  if (!allowedEndpoint(targetPath, req.method) && !documentRead)
    return new Response('{"error":"Not found"}', { status: 404, headers: { "content-type": "application/json" } });
  const headers = { accept: req.headers.accept ?? "application/json" };
  let body;
  if (req.method === "POST") {
    // These are anonymous public forms/events, never authenticated endpoints.
    // Always claim the public site origin so the backend same-origin check still
    // passes with a separate backend origin. Cookies and Authorization are
    // deliberately NOT forwarded.
    headers.origin = publicOrigin;
    headers["content-type"] = "application/json";
    if (req.body !== undefined)
      body = typeof req.body === "string" || Buffer.isBuffer(req.body) ? req.body : JSON.stringify(req.body);
    else {
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += Buffer.byteLength(chunk);
        if (size > 65536) return new Response(null, { status: 413 });
        chunks.push(Buffer.from(chunk));
      }
      body = Buffer.concat(chunks);
    }
    if (Buffer.byteLength(body) > 65536) return new Response(null, { status: 413 });
  }
  return fetcher(`${origin}${targetPath}${url.search}`, {
    method: req.method, headers, body, redirect: "manual",
    signal: AbortSignal.timeout(15000),
  });
}

// The journal documents are rendered by the older Replit build, which references
// asset hashes this deployment does not have; both 404, so the page arrives with
// no stylesheet and no bundle. Repoint those two references at the aliases
// prerender.mjs publishes from this build. Nothing else in the document changes.
export function repointAssets(html) {
  return html
    .replace(/\/assets\/index-[A-Za-z0-9_.-]+\.js/g, "/assets/app.js")
    .replace(/\/assets\/index-[A-Za-z0-9_.-]+\.css/g, "/assets/app.css");
}

// The backend still carries the database image, which for 31 of the 76 live
// articles is a Wikimedia scan rather than this site's own art. Production is
// the Vercel domain, so the gateway swaps the hero, the share/schema image, the
// hub cards, the sitemap entry and the API record for the local files. Every
// replacement is keyed on the old value being present, so once the backend
// serves the same art these functions return their input unchanged.
const SITE = "https://bali-villa-accounting-service.com";

function decodeEntities(value) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;")
    .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeText(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function artImgTag(art, width, height) {
  return (tag) => {
    const keep = (tag.match(/\s(?:fetchpriority|loading)="[^"]*"/g) ?? []).join("");
    return `<img src="${SITE}${art.imageUrl}" alt="${escapeAttr(art.imageAlt)}" width="${width}" height="${height}"${keep}>`;
  };
}

/** The public path of an image, so a relative, absolute or stale URL can be compared. */
function imagePath(value) {
  if (!value) return null;
  return decodeEntities(String(value)).replace(SITE, "").split("?")[0];
}

/** The local art this slug should carry, or null when it already carries it. */
function staleArt(slug, imageUrl) {
  const art = journalArt[slug];
  if (!art) return null;
  return imagePath(imageUrl) === art.imageUrl ? null : art;
}

// An image credit starts the paragraph. A paragraph that merely mentions a
// credit note, a credit card or a credit check does not, and is never touched.
const CREDIT_START = /^\s*(?:<strong>\s*|<em>\s*)?(?:Illustrative photo|Image credit:|Photo credit:|AI-generated editorial illustration)/i;
// A scope or qualification paragraph is never an image credit, whatever it says.
const SCOPE_HINT = /General information (?:only|disclaimer)|licensed professional review|not tax, legal|not tax advice|not legal advice|not immigration advice|Illustrative figures are not client results/i;

/**
 * Keep exactly one image-credit paragraph, at the position of the first, holding
 * the caption recorded for the local file. A page can then never show two
 * captions, a named third party, or a description of an open-license library
 * image under art this site generated. A page with no credit paragraph is left
 * alone rather than having one inserted.
 */
export function normaliseCredits(html, caption) {
  if (!caption) return html;
  let placed = false;
  return html.replace(/<p(?:\s[^>]*)?>((?:(?!<\/p>)[\s\S]){0,1500})<\/p>/g, (block, inner) => {
    if (SCOPE_HINT.test(inner) || !CREDIT_START.test(inner)) return block;
    if (placed) return "";
    placed = true;
    return `<p><em>${escapeText(caption)}</em></p>`;
  });
}

/**
 * The article page removes the server markup on mount and renders the record
 * embedded here. Rather than patch escaped HTML with a regex, parse the record,
 * apply the same transform the API gets, and re-serialise it script-safe.
 */
export function repointSeed(html) {
  const marker = "window.__BLOG_INITIAL__=";
  const at = html.indexOf(marker);
  if (at === -1) return html;
  const start = at + marker.length;
  if (html[start] !== "{") return html;
  let depth = 0, end = -1, inString = false, escaped = false;
  for (let i = start; i < html.length; i += 1) {
    const ch = html[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) { end = i + 1; break; }
    }
  }
  if (end === -1) return html;
  let seed;
  try { seed = JSON.parse(html.slice(start, end)); } catch { return html; }
  if (!seed || typeof seed !== "object" || !seed.post) return html;
  const post = repointPost(seed.post);
  if (JSON.stringify(post) === JSON.stringify(seed.post)) return html;
  const json = JSON.stringify({ ...seed, post })
    .replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
  return html.slice(0, start) + json + html.slice(end);
}

export function repointArticleArt(html, slug) {
  const art = journalArt[slug];
  if (!art) return html;
  const tag = html.match(/<img\b[^>]*>/i);
  const src = tag && tag[0].match(/src="([^"]*)"/i);
  const alt = tag && tag[0].match(/alt="([^"]*)"/i);
  const oldSrc = src ? src[1] : null;
  const oldSrcRaw = oldSrc && decodeEntities(oldSrc);
  const oldAlt = alt ? alt[1] : null;
  const oldAltRaw = oldAlt && decodeEntities(oldAlt);
  const share = `${SITE}${art.shareImage}`;
  // An article that already carries this build's art keeps its own markup and
  // alt text; only a stale image is replaced. Either way the page ends with one
  // credit paragraph, and it is the one recorded for the local file.
  const stale = !!tag && imagePath(oldSrcRaw) !== art.imageUrl;
  // The client seed carries its own copy of the record, image and credit line,
  // so it is transformed directly rather than patched as escaped text. This runs
  // whether or not the hero is stale, because the credit can be stale alone.
  let out = repointSeed(html);
  if (stale) {
    out = out.replace(/<img\b[^>]*>/i, artImgTag(art, 1200, 750));
    if (oldSrc) {
      out = out.split(`content="${oldSrc}"`).join(`content="${share}"`);
      out = out.split(`content="${oldSrcRaw}"`).join(`content="${share}"`);
    }
    if (oldSrcRaw) out = out.split(`"image":"${oldSrcRaw}"`).join(`"image":"${share}"`);
    if (oldAlt) out = out.split(`content="${oldAlt}"`).join(`content="${escapeAttr(art.imageAlt)}"`);
    if (oldAltRaw) out = out.split(`content="${oldAltRaw}"`).join(`content="${escapeAttr(art.imageAlt)}"`);
  }
  // The old hero carried a credit line naming the scan or an open-license
  // library. Leaving it under this art would credit the wrong source, so the
  // page is left with the caption recorded for the local file and nothing else.
  return normaliseCredits(out, art.caption);
}

export function repointHubArt(html) {
  return html.replace(/<article\b[\s\S]*?<\/article>/gi, (block) => {
    const slug = block.match(/\/blog\/([a-z0-9-]+)/i);
    const art = slug ? journalArt[slug[1]] : undefined;
    if (!art) return block;
    return block.replace(/<img\b[^>]*>/i, artImgTag(art, 1200, 750));
  });
}

export function repointSitemapArt(xml) {
  return xml.replace(/<url>[\s\S]*?<\/url>/gi, (block) => {
    const slug = block.match(/<loc>[^<]*\/blog\/([a-z0-9-]+)<\/loc>/i);
    const art = slug ? journalArt[slug[1]] : undefined;
    if (!art) return block;
    return block.replace(/<image:loc>[^<]*<\/image:loc>/i, `<image:loc>${SITE}${art.imageUrl}</image:loc>`);
  });
}

/**
 * One API post record: the image the client draws and the credit line inside the
 * body it draws. The HTML document alone is not enough — the page removes the
 * server markup on mount and renders this record instead.
 */
export function repointPost(post) {
  if (!post || typeof post !== "object") return post;
  const art = journalArt[post.slug];
  if (!art) return post;
  const stale = staleArt(post.slug, post.imageUrl);
  let out = post;
  if (stale) out = { ...out, imageUrl: `${SITE}${art.imageUrl}`, imageAlt: art.imageAlt };
  if (typeof out.contentHtml === "string") {
    const body = normaliseCredits(out.contentHtml, art.caption);
    if (body !== out.contentHtml) out = { ...out, contentHtml: body };
  }
  if (Array.isArray(out.relatedPosts)) out = { ...out, relatedPosts: out.relatedPosts.map(repointPost) };
  return out;
}

/** The JSON endpoints that carry article art, as an array or a single record. */
export function repointJson(body, targetPath) {
  const list = targetPath === "/api/blog/posts";
  const single = /^\/api\/blog\/posts\/[a-z0-9-]+$/.test(targetPath);
  if (!list && !single) return body;
  const parsed = JSON.parse(body);
  if (Array.isArray(parsed)) return JSON.stringify(parsed.map(repointPost));
  if (parsed && typeof parsed === "object" && Array.isArray(parsed.posts))
    return JSON.stringify({ ...parsed, posts: parsed.posts.map(repointPost) });
  return JSON.stringify(repointPost(parsed));
}

export function repointDocument(html, pathname) {
  const withAssets = repointAssets(html);
  const slug = pathname.match(/^\/blog\/([a-z0-9-]+)\/?$/);
  if (slug) return repointArticleArt(withAssets, slug[1]);
  if (/^\/blog\/?$/.test(pathname)) return repointHubArt(withAssets);
  return withAssets;
}

export default async function handler(req, res) {
  try {
    const upstream = await proxyRequest(req);
    res.statusCode = upstream.status;
    for (const name of ["content-type", "location", "retry-after"])
      if (upstream.headers.has(name)) res.setHeader(name, upstream.headers.get(name));
    res.setHeader("Cache-Control", "no-store");
    const type = upstream.headers.get("content-type") ?? "";
    const targetPath = resolveTarget(req);
    if (req.method !== "HEAD" && type.includes("text/html")) {
      res.end(repointDocument(Buffer.from(await upstream.arrayBuffer()).toString("utf8"), targetPath));
      return;
    }
    if (req.method !== "HEAD" && targetPath === "/sitemap.xml" && /xml/.test(type)) {
      res.end(repointSitemapArt(Buffer.from(await upstream.arrayBuffer()).toString("utf8")));
      return;
    }
    if (req.method !== "HEAD" && type.includes("application/json") &&
        (targetPath === "/api/blog/posts" || /^\/api\/blog\/posts\/[a-z0-9-]+$/.test(targetPath))) {
      const text = Buffer.from(await upstream.arrayBuffer()).toString("utf8");
      let out = text;
      // An unexpected payload is passed through rather than broken.
      try { out = repointJson(text, targetPath); } catch { out = text; }
      res.end(out);
      return;
    }
    res.end(req.method === "HEAD" ? undefined : Buffer.from(await upstream.arrayBuffer()));
  } catch {
    res.statusCode = 502;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "The website service is temporarily unavailable. Please try again or use WhatsApp." }));
  }
}
