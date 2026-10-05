import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { publicServer } from "../../artifacts/villabooks-bali/server.mjs";

function request(url, options = {}) {
  return new Promise(resolve => {
    const response = {
      status: 200, headers: {},
      writeHead(status, headers = {}) { this.status = status; this.headers = headers; return this; },
      end(body) { resolve({ status: this.status, headers: this.headers, body: body?.toString() ?? "" }); },
    };
    publicServer.emit("request", { url, method: "GET", headers: { host: "bali-villa-accounting-service.com" }, ...options }, response);
  });
}

const routes = JSON.parse(await readFile("artifacts/villabooks-bali/dist/public/routes.json", "utf8"));
const canonicals = new Set();
for (const pathname of routes) {
  const result = await request(pathname);
  assert.equal(result.status, 200, pathname);
  assert.equal((result.body.match(/<h1\b/g) ?? []).length, 1, `${pathname}: exactly one initial H1`);
  assert(!result.body.includes("RecurringCharge"));
  assert(!/calendly/i.test(result.body));
  const canonical = result.body.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(canonical, `https://bali-villa-accounting-service.com${pathname}`);
  assert(!canonicals.has(canonical), "Duplicate marketing canonical");
  canonicals.add(canonical);
  const scripts = [...result.body.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1);
  const schema = JSON.parse(scripts[0][1]);
  assert(schema["@graph"].some(node => node["@type"] === "AccountingService"));
  assert(schema["@graph"].some(node => node["@type"] === "WebPage"));
  if (pathname === "/pricing" || pathname === "/") {
    const offers = schema["@graph"].find(node => node["@type"] === "OfferCatalog").itemListElement;
    assert.deepEqual(offers.map(offer => offer.priceSpecification.price), [2900000, 4900000, 6900000]);
    assert(offers.every(offer => offer.priceSpecification["@type"] === "UnitPriceSpecification" && !offer.priceSpecification.billingDuration));
  }
}
assert.equal((await request("/nonexistent-resource")).status, 404);
assert.equal((await request("/assets/missing.js")).status, 404);
assert.equal((await request("/routes.json")).status, 404);
assert.equal((await request("/pricing/")).headers.Location, "/pricing");
assert.equal((await request("/pricing/index.html")).headers.Location, "/pricing");
assert.equal((await request("/contact?utm_source=qa")).headers.Location, "/get-started?utm_source=qa");
assert.equal((await request("/services?utm_source=qa", { headers: { host: "www.bali-villa-accounting-service.com" } })).headers.Location, "https://bali-villa-accounting-service.com/services?utm_source=qa");
assert.equal((await request("/sample-report", { headers: { host: "bali-villa-books.replit.app" } })).status, 308);
assert.equal((await request("/", { method: "POST" })).status, 405);
assert.equal((await request("/", { method: "HEAD" })).body, "");
process.stdout.write(`PASS: ${routes.length} pre-rendered routes, distinct metadata/H1/canonicals, schema graphs, package prices, redirects, 404s and HEAD/method behavior.\n`);
