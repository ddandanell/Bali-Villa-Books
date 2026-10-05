import { Router, type Request } from "express";
import { randomUUID } from "node:crypto";
import { lt } from "drizzle-orm";
import { db, enquiries, siteEvents } from "@workspace/db";
import { SubmitEnquiryBody, RecordSiteEventBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router = Router();
const limits = new Map<string, { count: number; resetAt: number }>();
const publicOrigin = "https://bali-villa-accounting-service.com";

function sameOrigin(req: Request) {
  if (!req.headers.origin) return true; // No credentialed or private endpoint.
  try {
    const origin = new URL(req.headers.origin);
    return origin.origin === publicOrigin ||
      (process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1"].includes(origin.hostname)) ||
      (process.env.REPLIT_DEV_DOMAIN && origin.hostname === process.env.REPLIT_DEV_DOMAIN);
  } catch { return false; }
}

function rateLimited(req: Request, category: string, max: number) {
  const now = Date.now();
  if (limits.size > 10000) for (const [key, value] of limits) if (value.resetAt < now) limits.delete(key);
  const key = `${category}:${req.ip ?? req.socket.remoteAddress}`;
  const value = limits.get(key);
  if (!value || value.resetAt < now) { limits.set(key, { count: 1, resetAt: now + 15 * 60000 }); return false; }
  value.count++;
  return value.count > max;
}

router.post("/enquiries", async (req, res) => {
  res.set("Cache-Control", "no-store");
  if (!sameOrigin(req)) { res.status(403).json({ error: "Submit through our website." }); return; }
  if (rateLimited(req, "enquiry", 8)) { res.set("Retry-After", "900").status(429).json({ error: "Please wait before sending another enquiry, or contact us directly on WhatsApp." }); return; }
  const parsed = SubmitEnquiryBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Check your name, contact details, property count, location and enquiry." }); return; }
  const data = parsed.data;
  const contact = data.contact.trim();
  const validContact = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) || /^[+\d() .-]{7,30}$/.test(contact) && contact.replace(/\D/g, "").length >= 7;
  if (!data.consent || data.website?.trim() || !validContact || data.name.trim().length < 2 || data.issue.trim().length < 10 || !Number.isInteger(data.propertyCount)) {
    res.status(400).json({ error: "Please provide valid contact details and consent to enquiry handling. Leave the website field blank." }); return;
  }
  const sourcePage = /^\/[a-z0-9/-]*$/i.test(data.sourcePage ?? "") ? data.sourcePage! : "/get-started";
  const reference = `BA-${randomUUID().slice(0, 8).toUpperCase()}`;
  try {
    await db.transaction(async tx => {
      await tx.insert(enquiries).values({
        reference, name: data.name.trim(), contact, propertyCount: data.propertyCount,
        location: data.location.trim(), issue: data.issue.trim(), bookingChannels: data.bookingChannels?.trim() || null,
        preferredPackage: data.preferredPackage?.trim() || null, sourcePage,
      });
      await tx.insert(siteEvents).values({ eventType: "enquiry_submitted", page: sourcePage, placement: "consultation_form" });
    });
    const message = [
      "Hello Bali Accounting Client Advisory, I would like a free villa bookkeeping consultation.",
      `Enquiry reference: ${reference}`, `Name: ${data.name.trim()}`, `Contact: ${contact}`,
      `Properties: ${data.propertyCount}`, `Location: ${data.location.trim()}`,
      data.bookingChannels?.trim() ? `Booking channels: ${data.bookingChannels.trim()}` : "",
      data.preferredPackage?.trim() ? `Package: ${data.preferredPackage.trim()}` : "",
      `Main bookkeeping issue: ${data.issue.trim()}`,
    ].filter(Boolean).join("\n");
    res.status(201).json({
      reference, whatsappUrl: `https://wa.me/6281237402292?text=${encodeURIComponent(message)}`,
      message: "Your enquiry is saved. Open WhatsApp and press Send to deliver the message to Client Advisory.",
    });
  } catch (error) {
    logger.error({ errorName: error instanceof Error ? error.name : "UnknownError" }, "Could not save enquiry");
    res.status(503).json({ error: "We could not save your enquiry. Please try again or contact Client Advisory directly on WhatsApp." });
  }
});

const pageAllowlist = /^\/(?:blog\/[a-z0-9-]+|[a-z0-9-]*)$/;
const safeLabels = /^[a-zA-Z0-9 _-]{1,80}$/;
router.post("/site-events", async (req, res) => {
  if (!sameOrigin(req)) { res.sendStatus(403); return; }
  if (rateLimited(req, "event", 250)) { res.sendStatus(429); return; }
  const parsed = RecordSiteEventBody.safeParse(req.body);
  if (!parsed.success || !pageAllowlist.test(parsed.data.page) || !safeLabels.test(parsed.data.placement) ||
    (parsed.data.service && !safeLabels.test(parsed.data.service)) || parsed.data.eventType === "enquiry_submitted") {
    res.sendStatus(400); return;
  }
  try {
    await db.insert(siteEvents).values(parsed.data);
    res.status(204).end();
  } catch (error) {
    logger.error({ err: error }, "Could not record site event");
    res.status(503).end();
  }
});

/** Delete public enquiry details after 90 days; never expose a public lead-list endpoint. */
export function startEnquiryRetention() {
  const purge = async () => {
    try {
      await db.delete(enquiries).where(lt(enquiries.createdAt, new Date(Date.now() - 90 * 86400000)));
      await db.delete(siteEvents).where(lt(siteEvents.occurredAt, new Date(Date.now() - 365 * 86400000)));
    } catch (error) { logger.error({ err: error }, "Enquiry retention cleanup failed"); }
  };
  void purge();
  setInterval(() => void purge(), 3600000).unref();
}

export default router;
