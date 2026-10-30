import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import Ajv from "ajv-draft-04";
import { origin, allowedEndpoint, proxyRequest } from "../../api/gateway.mjs";

const read = path => JSON.parse(readFileSync(new URL(`../../${path}`, import.meta.url)));
const config = read("vercel.json");
// The official schema declares draft-04 but includes later-draft numeric
// exclusive bounds. Express those same bounds using draft-04's syntax.
function draft4Bounds(value) {
  if (!value || typeof value !== "object") return value;
  for (const [exclusive, bound] of [["exclusiveMinimum", "minimum"], ["exclusiveMaximum", "maximum"]]) {
    if (typeof value[exclusive] === "number") {
      const n = value[exclusive];
      const stricterExisting = typeof value[bound] === "number" &&
        (bound === "minimum" ? value[bound] > n : value[bound] < n);
      if (!stricterExisting) value[bound] = n;
      value[exclusive] = !stricterExisting;
    }
  }
  for (const child of Object.values(value)) draft4Bounds(child);
  return value;
}
const validate = new Ajv({ allErrors: true, strict: false, validateFormats: false })
  .compile(draft4Bounds(read("scripts/schemas/vercel.schema.json")));
assert.ok(validate(config), JSON.stringify(validate.errors));
assert.equal(validate({ ...config, nodejs: "20.x" }), false, "regression: invalid Vercel property");
assert.equal(config.buildCommand, "pnpm run build:web");
assert.ok(config.rewrites.every(r => r.source !== "/(.*)"), "never hide missing pages behind homepage HTML");
assert.equal(config.rewrites.find(r => r.source === "/api/:path*")?.destination, "/api/gateway?__gateway=:path*");
for (const path of ["/blog", "/blog/:path*", "/sitemap.xml"])
  assert.ok(config.rewrites.find(r => r.source === path)?.destination.startsWith(origin));
assert.ok(existsSync(new URL("../../artifacts/villabooks-bali/dist/public/404.html", import.meta.url)));
const routes = read("artifacts/villabooks-bali/dist/public/routes.json");
for (const route of routes)
  assert.ok(existsSync(new URL(`../../artifacts/villabooks-bali/dist/public${route === "/" ? "" : route}/index.html`, import.meta.url)), route);
for (const path of ["/api/admin", "/api/blog/automation/status", "/api/../../admin"])
  assert.equal(allowedEndpoint(path, "GET"), false);
let called = 0;
const fetcher = async (url, init) => {
  called++;
  assert.equal(url, `${origin}/api/enquiries`);
  assert.equal(init.headers.origin, origin);
  assert.equal(init.headers.authorization, undefined);
  assert.equal(init.headers.cookie, undefined);
  assert.deepEqual(JSON.parse(init.body), { serviceInterest: "bookkeeping" });
  return new Response('{"id":"example"}', { status: 201 });
};
const response = await proxyRequest({ url: "/api/enquiries", method: "POST",
  headers: { origin: "https://preview.vercel.app", authorization: "must-not-forward", cookie: "must-not-forward" },
  body: { serviceInterest: "bookkeeping" } }, fetcher);
assert.equal(response.status, 201);
assert.equal((await proxyRequest({ url: "/api/admin", method: "GET", headers: {} }, fetcher)).status, 404);
assert.equal((await proxyRequest({ url: "/api/enquiries", method: "POST", headers: {}, body: "x".repeat(65537) }, fetcher)).status, 413);
assert.equal(called, 1);
let readUrl;
await proxyRequest({url: "/api/blog/posts?limit=50&offset=50", method: "GET", headers: {}}, async url => {
  readUrl = url;
  return new Response("[]");
});
assert.equal(readUrl, `${origin}/api/blog/posts?limit=50&offset=50`);
await proxyRequest({url: "/api/gateway?__gateway=blog%2Fposts&limit=50&offset=50", method: "GET", headers: {}}, async url => {
  readUrl = url;
  return new Response("[]");
});
assert.equal(readUrl, `${origin}/api/blog/posts?limit=50&offset=50`);
assert.equal((await proxyRequest({url: "/api/gateway?__gateway=admin", method: "GET", headers: {}}, fetcher)).status, 404);
console.log(`PASS: official Vercel schema, ${routes.length} prerendered routes, real 404, dynamic Journal/sitemap routing, anonymous form proxy, no credential forwarding, body limits and pagination.`);
