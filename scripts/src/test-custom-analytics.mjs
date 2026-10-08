import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Use the existing backend build dependency; no new runtime or test packages.
const dir = mkdtempSync(join(tmpdir(), "villabooks-analytics-"));
try {
  const bundle = join(dir, "analytics.cjs");
  execFileSync("pnpm", ["--filter", "@workspace/api-server", "exec", "esbuild",
    "../../artifacts/villabooks-bali/src/lib/analytics.ts", "--bundle", "--platform=node",
    "--format=cjs", '--define:import.meta.env.BASE_URL="/"', `--outfile=${bundle}`], { stdio: "pipe" });
  const { trackEvent, enquiryPlan } = createRequire(import.meta.url)(bundle);
  const hosted = [], firstParty = [];
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  globalThis.fetch = async (url, options) => { firstParty.push({ url, payload: JSON.parse(options.body) }); return {}; };
  const flush = () => new Promise(resolve => setImmediate(resolve));
  try {
    delete globalThis.window;
    assert.doesNotThrow(() => trackEvent("whatsapp_click"));
    assert.equal(firstParty.length, 0, "SSR must not emit events");

    globalThis.window = { location: { pathname: "/pricing/", search: "?contact=private", hash: "#private" },
      umami: { track: (name, data) => hosted.push({ name, data }) } };
    trackEvent("whatsapp_click", { placement: "pricing", name: "private", contact: "private", issue: "private", plan: "Premium" });
    assert.deepEqual(hosted, [{ name: "whatsapp_click", data: { page: "/pricing", placement: "pricing", plan: "Premium" } }]);
    assert.deepEqual(firstParty, [{ url: "/api/site-events", payload: { eventType: "whatsapp_click", page: "/pricing", placement: "pricing" } }]);

    const count = firstParty.length;
    for (const name of ["enquiry_form_started", "plan_selected", "enquiry_submitted"])
      trackEvent(name, { placement: "enquiry_form", plan: "Starter" });
    assert.equal(hosted.length, 4);
    assert.equal(firstParty.length, count, "New events must not duplicate the server's enquiry record or alter its API");
    trackEvent("unknown_event", { placement: "private" });
    assert.equal(hosted.length, 4, "Unknown names must be ignored");

    window.location.pathname = "/about/private-name";
    trackEvent("plan_selected", { placement: "private@example.test", plan: "private@example.test" });
    assert.deepEqual(hosted.at(-1).data, { page: "other_page", placement: "website" });
    window.location.pathname = "/blog/monthly-bali-villa-bookkeeping-checklist";
    trackEvent("article_completion", { placement: "article_end" });
    assert.equal(hosted.at(-1).data.page, window.location.pathname);

    delete window.umami;
    assert.doesNotThrow(() => trackEvent("enquiry_submitted"));
    window.umami = { track: () => { throw new Error("blocked tracker"); } };
    assert.doesNotThrow(() => trackEvent("enquiry_submitted"));
    window.umami = { track: () => Promise.reject(new Error("network unavailable")) };
    trackEvent("enquiry_submitted");
    await flush();
    globalThis.fetch = () => { throw new Error("unavailable fetch"); };
    assert.doesNotThrow(() => trackEvent("phone_click"));
    await flush();
    globalThis.fetch = () => Promise.reject(new Error("network unavailable"));
    trackEvent("phone_click");
    await flush();

    assert.equal(enquiryPlan("Starter — Rp 2.900.000/month"), "Starter");
    assert.equal(enquiryPlan("Professional — Rp 4.900.000/month"), "Professional");
    assert.equal(enquiryPlan("Premium — Rp 6.900.000/month"), "Premium");
    assert.equal(enquiryPlan("One-time cleanup"), "Cleanup");
    assert.equal(enquiryPlan("private@example.test"), "unspecified");

    const form = readFileSync("artifacts/villabooks-bali/src/components/ConsultationForm.tsx", "utf8");
    assert.ok(form.indexOf('trackEvent("enquiry_submitted"') > form.indexOf("await submit.mutateAsync"));
    assert.equal((form.match(/trackEvent\("enquiry_submitted"/g) ?? []).length, 1);
    assert.ok(form.includes("if (started.current) return;"), "Form-start emission must be guarded");
    console.log("PASS: hosted events, safe dimensions, API compatibility, SSR, absent/throwing/rejected trackers, package normalization and success-only form instrumentation.");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
