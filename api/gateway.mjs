/**
 * Vercel has no copy of the production database. Forward only public website
 * endpoints to the existing backend; never forward credentials or private APIs.
 *
 * The Replit hostname's public-route exception is now published and verified.
 * Never target the public domain here: it is served by this Vercel adapter.
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

export async function proxyRequest(req, fetcher = fetch) {
  const url = new URL(req.url, "https://gateway.invalid");
  const documentPath = url.pathname === "/api/gateway" ? url.searchParams.get("__document") : null;
  const targetPath = url.pathname === "/api/gateway" ?
    (documentPath !== null ? `/${documentPath}` : gatewayPath(url.searchParams.get("__gateway") ?? "")) : url.pathname;
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

// The proxied journal documents still carry the database image, which for 68 of
// the 76 live articles is a Wikimedia scan rather than this site's own art. The
// origin cannot be redeployed yet, so the gateway swaps the article hero, the
// share/schema image and the hub cards for the local files. Every replacement is
// keyed on the old value being present, so once the origin serves the same art
// these functions return their input unchanged.
const SITE = "https://bali-villa-accounting-service.com";

function decodeEntities(value) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;")
    .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function artImgTag(art, width, height) {
  return (tag) => {
    const keep = (tag.match(/\s(?:fetchpriority|loading)="[^"]*"/g) ?? []).join("");
    return `<img src="${SITE}${art.imageUrl}" alt="${escapeAttr(art.imageAlt)}" width="${width}" height="${height}"${keep}>`;
  };
}

export function repointArticleArt(html, slug) {
  const art = journalArt[slug];
  if (!art) return html;
  const tag = html.match(/<img\b[^>]*>/i);
  if (!tag) return html;
  const src = tag[0].match(/src="([^"]*)"/i);
  const alt = tag[0].match(/alt="([^"]*)"/i);
  const oldSrc = src ? src[1] : null;
  const oldSrcRaw = oldSrc && decodeEntities(oldSrc);
  const oldAlt = alt ? alt[1] : null;
  const oldAltRaw = oldAlt && decodeEntities(oldAlt);
  const share = `${SITE}${art.shareImage}`;
  // An article that already carries this build's art keeps its own markup and
  // alt text; only a stale image is replaced.
  const currentPath = oldSrcRaw ? oldSrcRaw.replace(SITE, "").split("?")[0] : null;
  const stale = currentPath !== art.imageUrl;
  let out = stale ? html.replace(/<img\b[^>]*>/i, artImgTag(art, 1200, 750)) : html;
  if (stale) {
    if (oldSrc) {
      out = out.split(`content="${oldSrc}"`).join(`content="${share}"`);
      out = out.split(`content="${oldSrcRaw}"`).join(`content="${share}"`);
    }
    if (oldSrcRaw) out = out.split(`"image":"${oldSrcRaw}"`).join(`"image":"${share}"`);
    if (oldAlt) out = out.split(`content="${oldAlt}"`).join(`content="${escapeAttr(art.imageAlt)}"`);
    if (oldAltRaw) out = out.split(`content="${oldAltRaw}"`).join(`content="${escapeAttr(art.imageAlt)}"`);
    // The embedded post copy still names the old file; keep the two in step so
    // the client seed cannot reintroduce the scan the page has just replaced.
    if (oldSrcRaw && oldAltRaw) {
      const pair = `"imageUrl":"${oldSrcRaw}","imageAlt":"${oldAltRaw}"`;
      out = out.split(pair).join(`"imageUrl":"${SITE}${art.imageUrl}","imageAlt":"${escapeAttr(art.imageAlt)}"`);
    }
  }
  // The old hero sometimes carried a credit line naming the Wikimedia scan.
  // Leaving it under this art would credit the wrong source, so the caption is
  // replaced with the one recorded for the local file.
  if (art.caption) {
    const caption = escapeAttr(art.caption);
    // Scope each replacement to one paragraph: the credit line is its own <em>
    // block, and a spanning match would delete the scope disclaimer above it.
    out = out.replace(/<p><em>(?:(?!<\/em>)[\s\S]){0,400}<\/em><\/p>/g, (block) =>
      /Photo credit: \.|Image credit:/.test(block) ? `<p><em>${caption}</em></p>` : block);
    // The same body is also embedded as an escaped copy for the client app.
    out = out.replace(/\\u003cem>(?:(?!\\u003c\/em>)[\s\S]){0,600}\\u003c\/em>/g, (block) =>
      /Photo credit: \.|Image credit:/.test(block) ? `\\u003cem>${caption}\\u003c/em>` : block);
  }
  return out;
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
    const pathname = new URL(req.url, "https://gateway.invalid").pathname;
    if (req.method !== "HEAD" && type.includes("text/html")) {
      res.end(repointDocument(Buffer.from(await upstream.arrayBuffer()).toString("utf8"), pathname));
      return;
    }
    if (req.method !== "HEAD" && pathname === "/sitemap.xml" && /xml/.test(type)) {
      res.end(repointSitemapArt(Buffer.from(await upstream.arrayBuffer()).toString("utf8")));
      return;
    }
    res.end(req.method === "HEAD" ? undefined : Buffer.from(await upstream.arrayBuffer()));
  } catch {
    res.statusCode = 502;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "The website service is temporarily unavailable. Please try again or use WhatsApp." }));
  }
}
