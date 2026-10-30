/**
 * Vercel has no copy of the production database. Forward only public website
 * endpoints to the existing backend; never forward credentials or private APIs.
 *
 * BACKEND_ORIGIN must be a host that still reaches the Replit deployment after
 * the public domain moves to Vercel (for example https://api.bali-villa-accounting-service.com).
 * Leaving it unset keeps today's safe default: the public apex, which still points at Replit.
 */
export const publicOrigin = "https://bali-villa-accounting-service.com";
export const origin = (process.env.BACKEND_ORIGIN || publicOrigin).replace(/\/$/, "");

export function allowedEndpoint(path, method) {
  const readApi = ["/api/healthz", "/api/blog/posts"].includes(path) ||
    /^\/api\/blog\/posts\/[a-z0-9-]+$/.test(path);
  const readSite = path === "/blog" || path === "/sitemap.xml" ||
    /^\/blog\/[A-Za-z0-9/_-]*$/.test(path);
  return (["GET", "HEAD"].includes(method) && (readApi || readSite)) ||
    (method === "POST" && ["/api/enquiries", "/api/site-events", "/api/blog/events"].includes(path));
}

function gatewayPath(raw) {
  if (!raw) return "/api/";
  return raw.startsWith("/") ? raw : `/api/${raw}`;
}

export async function proxyRequest(req, fetcher = fetch) {
  const url = new URL(req.url, "https://gateway.invalid");
  const targetPath = url.pathname === "/api/gateway" ?
    gatewayPath(url.searchParams.get("__gateway") ?? "") : url.pathname;
  url.searchParams.delete("__gateway");
  if (!allowedEndpoint(targetPath, req.method))
    return new Response('{"error":"Not found"}', { status: 404, headers: { "content-type": "application/json" } });
  const headers = { accept: req.headers.accept ?? "application/json" };
  let body;
  if (req.method === "POST") {
    // These are anonymous public forms/events, never authenticated endpoints.
    // Always claim the public site origin so the backend same-origin check still
    // passes after BACKEND_ORIGIN moves to api.* Cookies and Authorization are
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

export default async function handler(req, res) {
  try {
    const upstream = await proxyRequest(req);
    res.statusCode = upstream.status;
    for (const name of ["content-type", "location", "retry-after"])
      if (upstream.headers.has(name)) res.setHeader(name, upstream.headers.get(name));
    res.setHeader("Cache-Control", "no-store");
    res.end(req.method === "HEAD" ? undefined : Buffer.from(await upstream.arrayBuffer()));
  } catch {
    res.statusCode = 502;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "The website service is temporarily unavailable. Please try again or use WhatsApp." }));
  }
}
