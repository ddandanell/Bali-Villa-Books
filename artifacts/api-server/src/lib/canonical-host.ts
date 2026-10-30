/**
 * The Replit hostname remains the backend origin after the public domain moves
 * to Vercel. Only the public adapter's routes may bypass its canonical redirect.
 */
export function isBackendOriginRoute(path: string, method: string): boolean {
  if (["GET", "HEAD"].includes(method)) {
    return path === "/api/healthz" || path === "/api/blog/posts" ||
      /^\/api\/blog\/posts\/[a-z0-9-]+$/.test(path) ||
      path === "/blog" || /^\/blog\/[a-z0-9-]+\/?$/.test(path) ||
      path === "/sitemap.xml";
  }
  return method === "POST" &&
    ["/api/enquiries", "/api/site-events", "/api/blog/events"].includes(path);
}
