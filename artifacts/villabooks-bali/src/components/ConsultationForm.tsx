import { prices, priceText } from "@/lib/pricing";
import { useRef, useState, type FormEvent } from "react";
import { useSubmitEnquiry } from "@workspace/api-client-react";
import { ArrowUpRight, CheckCircle2, CircleAlert, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { PHONE, whatsapp } from "@/lib/site-pages";
import { enquiryPlan, trackEvent } from "@/lib/analytics";

const inputClass = "mt-2 block min-h-12 w-full rounded-xl border border-primary/15 bg-background px-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/10";

export function ConsultationForm({ compact = false }: { compact?: boolean }) {
  const submit = useSubmitEnquiry();
  const [receipt, setReceipt] = useState<{ reference: string; whatsappUrl: string; message: string } | null>(null);
  const [formError, setFormError] = useState("");
  const [channels, setChannels] = useState("");
  const started = useRef(false);
  const placement = compact ? "compact_form" : "enquiry_form";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const issue = String(data.get("issue") ?? "").trim();
    if (issue.length < 10) { setFormError("Please add a little more detail (at least 10 characters) so we can understand your situation."); return; }
    const count = Number(data.get("propertyCount"));
    if (!Number.isInteger(count) || count < 1 || count > 100) { setFormError("Enter a property count between 1 and 100."); return; }
    try {
      const saved = await submit.mutateAsync({ data: {
        name: String(data.get("name") ?? "").trim(),
        contact: String(data.get("contact") ?? "").trim(),
        propertyCount: count,
        location: String(data.get("location") ?? "").trim(),
        issue,
        bookingChannels: channels.trim() || undefined,
        preferredPackage: String(data.get("preferredPackage") ?? "") || undefined,
        sourcePage: typeof window === "undefined" ? "/" : window.location.pathname,
        consent: data.get("consent") === "on",
        website: String(data.get("website") ?? ""),
      } });
      setReceipt(saved);
      trackEvent("enquiry_submitted", { placement, plan: enquiryPlan(String(data.get("preferredPackage") ?? "")) });
      form.reset();
      setChannels("");
    } catch {
      setFormError("We couldn't save your enquiry just now. Please try again, or contact us directly on WhatsApp or phone.");
    }
  }

  if (receipt) return <div data-testid="status-enquiry-success" role="status" className="rounded-2xl border border-secondary/25 bg-white p-7">
    <CheckCircle2 className="h-8 w-8 text-secondary" />
    <h3 className="mt-4 font-serif text-2xl text-primary">Enquiry saved</h3>
    <p className="mt-2 text-sm leading-6 text-foreground/70">Reference <strong className="text-primary">{receipt.reference}</strong>. Your enquiry is recorded; it is not a confirmed appointment.</p>
    <a href={receipt.whatsappUrl} target="_blank" rel="noreferrer" onClick={() => trackEvent("whatsapp_click", { page: window.location.pathname, placement: "enquiry_success" })} className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground"><MessageCircle className="h-4 w-4" /> Continue in WhatsApp <ArrowUpRight className="h-4 w-4" /></a>
    <p className="mt-3 max-w-lg text-xs leading-5 text-foreground/55">WhatsApp opens a prepared message. Please review and press Send there if you want to contact us; opening it does not send a message or confirm a booking.</p>
  </div>;

  return <form onSubmit={onSubmit} onChange={() => {
    if (started.current) return;
    started.current = true;
    trackEvent("enquiry_form_started", { placement });
  }} className="space-y-5" noValidate>
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="block text-sm font-semibold text-primary">Your name<input data-testid="input-enquiry-name" className={inputClass} name="name" autoComplete="name" minLength={2} maxLength={100} required placeholder="Name" /></label>
      <label className="block text-sm font-semibold text-primary">Email or WhatsApp contact<input data-testid="input-enquiry-contact" className={inputClass} name="contact" autoComplete="email" minLength={5} maxLength={150} required placeholder="Email address or phone" /></label>
      <label className="block text-sm font-semibold text-primary">Number of properties<input data-testid="input-enquiry-property-count" className={inputClass} name="propertyCount" type="number" min={1} max={100} step={1} required defaultValue="1" /></label>
      <label className="block text-sm font-semibold text-primary">Villa location<input data-testid="input-enquiry-location" className={inputClass} name="location" minLength={2} maxLength={100} required placeholder="Area or areas in Bali" /></label>
      <label className="block text-sm font-semibold text-primary sm:col-span-2">Booking channels <span className="font-normal text-foreground/50">(optional)</span><input data-testid="input-enquiry-channels" className={inputClass} value={channels} onChange={(e) => setChannels(e.target.value)} maxLength={200} placeholder="Airbnb, Booking.com, direct…" /></label>
      <label className="block text-sm font-semibold text-primary sm:col-span-2">What would you like help with?<textarea data-testid="input-enquiry-issue" className={`${inputClass} min-h-28 resize-y py-3`} name="issue" minLength={10} maxLength={2000} required placeholder="For example: matching booking payouts, monthly owner reports, or catching up on older records." /></label>
      <label className="block text-sm font-semibold text-primary sm:col-span-2">Package of interest <span className="font-normal text-foreground/50">(optional)</span><select data-testid="input-enquiry-package" className={inputClass} name="preferredPackage" defaultValue="" onChange={event => trackEvent("plan_selected", { placement, plan: enquiryPlan(event.currentTarget.value) })}><option value="">Not sure yet</option><option>Starter — {priceText(prices.starter)}/month</option><option>Professional — {priceText(prices.professional)}/month</option><option>Premium — {priceText(prices.premium)}/month</option><option>One-time cleanup</option></select></label>
    </div>
    <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="flex items-start gap-3 text-sm leading-6 text-foreground/70"><input data-testid="input-enquiry-consent" className="mt-1 h-4 w-4 accent-primary" type="checkbox" name="consent" required /><span>I agree that Bali Accounting may use these enquiry details to respond to me. See the <Link href="/privacy" className="font-semibold text-secondary underline underline-offset-2">privacy information</Link>. Please do not upload or send financial documents through this form.</span></label>
    {formError && <p data-testid="status-enquiry-error" role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-900"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />{formError}</p>}
    {submit.isError && !formError && <p data-testid="status-enquiry-api-error" role="alert" className="text-sm text-red-800">Submission failed. Try again or use WhatsApp.</p>}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <button data-testid="button-submit-enquiry" type="submit" disabled={submit.isPending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">{submit.isPending ? "Saving enquiry…" : "Send enquiry"} {!submit.isPending && <ArrowUpRight className="h-4 w-4" />}</button>
      <span className="text-xs text-foreground/55">No financial uploads. Scope and price basis are confirmed before agreement.</span>
    </div>
    <p className="text-sm text-foreground/60">Prefer direct contact? <a onClick={() => trackEvent("whatsapp_click", { page: typeof window === "undefined" ? "/" : window.location.pathname, placement: compact ? "compact_form" : "form" })} href={whatsapp()} target="_blank" rel="noreferrer" className="font-semibold text-primary underline underline-offset-4">WhatsApp</a> or <a href="tel:+6281237402292" onClick={() => trackEvent("phone_click", { page: typeof window === "undefined" ? "/" : window.location.pathname, placement: "form" })} className="font-semibold text-primary underline underline-offset-4">call {PHONE}</a>.</p>
  </form>;
}
