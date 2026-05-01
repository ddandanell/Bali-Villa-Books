import { Layout } from "@/components/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Motion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, MessageCircle, UploadCloud, FileText, AlertCircle, Calendar } from "lucide-react";

const WA = "https://wa.me/6281237402292";
const wa = (msg: string) => `${WA}?text=${encodeURIComponent(msg)}`;

function WAButton({ label, message, big = true }: { label: string; message: string; big?: boolean }) {
  return (
    <a
      href={wa(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white font-bold shadow-lg hover:bg-[#1ebe5e] active:scale-[0.98] transition-all ${big ? "h-14 px-8 text-base" : "h-12 px-6 text-sm"}`}
    >
      <MessageCircle className={big ? "w-5 h-5" : "w-4 h-4"} />
      {label}
    </a>
  );
}

export default function Services() {
  return (
    <Layout>

      {/* HERO */}
      <section className="bg-primary text-primary-foreground py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">What You Get. How It Works.</h1>
            <p className="text-lg sm:text-xl text-primary-foreground/85 mb-8">
              Same simple service every month. Same WhatsApp contact. Same clear report. No surprises.
            </p>
            <div className="flex justify-center">
              <WAButton label="Chat on WhatsApp Now" message="Hi, I want to know more about your villa accounting service." />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* MONTHLY WORKFLOW — SIMPLE 3-STEP */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <FadeIn className="mb-10 sm:mb-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-3">Every Month. Same Simple Steps.</h2>
            <p className="text-base sm:text-lg text-foreground/70">From day 1 to day 15. Then we do it again.</p>
          </FadeIn>

          <StaggerContainer className="space-y-5 sm:space-y-6">
            {[
              {
                step: 1,
                color: "border-l-primary",
                period: "Days 1–3",
                title: "We Collect Your Records",
                items: [
                  { icon: <UploadCloud className="w-5 h-5 text-secondary shrink-0 mt-0.5" />, text: "Receipts, invoices, bills uploaded to your private Google Drive folder." },
                  { icon: <FileText className="w-5 h-5 text-secondary shrink-0 mt-0.5" />, text: "We pull Airbnb, Booking.com, VRBO payouts and match to your calendar." },
                  { icon: <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />, text: "Staff wages confirmed with your villa manager." },
                ],
              },
              {
                step: 2,
                color: "border-l-secondary",
                period: "Days 4–10",
                title: "We Check & Categorize Everything",
                items: [
                  { icon: <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />, text: "Every transaction sorted into the right expense bucket." },
                  { icon: <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />, text: "Vendor bills checked against last month — no double-billing." },
                  { icon: <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />, text: "Weird charges or cost spikes flagged on WhatsApp before they hurt you." },
                ],
              },
              {
                step: 3,
                color: "border-l-primary",
                period: "Days 11–15",
                title: "You Get Your Monthly Report",
                items: [
                  { icon: <FileText className="w-5 h-5 text-secondary shrink-0 mt-0.5" />, text: "Clear monthly Owner Financial Report — revenue, expenses, profit." },
                  { icon: <FileText className="w-5 h-5 text-secondary shrink-0 mt-0.5" />, text: "Cash balance reconciled. Occupancy and ADR shown." },
                  { icon: <FileText className="w-5 h-5 text-secondary shrink-0 mt-0.5" />, text: "Delivered by WhatsApp or email with a 2-line plain-English summary." },
                ],
              },
            ].map((s) => (
              <StaggerItem key={s.step}>
                <div className="flex gap-4 sm:gap-6 items-start">
                  <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground items-center justify-center font-bold text-lg shadow-md mt-1">
                    {s.step}
                  </div>
                  <Card className={`flex-1 border-l-4 ${s.color}`}>
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <Calendar className="w-4 h-4" /> {s.period}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary mb-4">{s.title}</h3>
                      <ul className="space-y-3">
                        {s.items.map((item, i) => (
                          <li key={i} className="flex gap-3 items-start text-sm sm:text-base">
                            {item.icon}
                            <span className="text-foreground/80">{item.text}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn className="mt-10 text-center">
            <p className="text-foreground/70 mb-4">That's it. Three steps. Every month. Forever.</p>
            <div className="flex justify-center">
              <WAButton label="Start This Month" message="Hi, I want to start your monthly villa accounting service." />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* WHATSAPP BAND */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-2">Got 30 seconds?</h3>
          <p className="text-primary-foreground/80 mb-6">Send Abel a quick WhatsApp. Get a real answer today.</p>
          <div className="flex justify-center">
            <WAButton label="Message Abel Now" message="Hi Abel, I have a question about your service." />
          </div>
        </div>
      </section>

      {/* PACKAGES — IDR */}
      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <FadeIn className="mb-10 sm:mb-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-3">Pick a Package. Pay Monthly.</h2>
            <p className="text-base sm:text-lg text-foreground/70">All prices in Indonesian Rupiah (IDR). No setup fee. Cancel anytime.</p>
          </FadeIn>

          <StaggerContainer className="space-y-6">
            {[
              {
                name: "Starter",
                price: "Rp 2.500.000",
                per: "/ month",
                tagline: "1 villa. Basic operations.",
                bestFor: "Single villa with simple operations and 1–2 booking channels.",
                msg: "Hi Abel, I want the Starter package (Rp 2.500.000/month).",
                features: [
                  "Monthly bookkeeping",
                  "Up to 2 OTA channels reconciled (Airbnb + Booking.com)",
                  "Basic monthly P&L summary",
                  "Google Drive document folder",
                  "WhatsApp + email support (48h)",
                ],
                highlight: false,
              },
              {
                name: "Professional",
                price: "Rp 5.000.000",
                per: "/ month",
                tagline: "Most popular. Full visibility.",
                bestFor: "Active villas with multiple OTAs, staff payroll, and steady bookings.",
                msg: "Hi Abel, I want the Professional package (Rp 5.000.000/month).",
                features: [
                  "Everything in Starter, plus:",
                  "Full monthly Owner Financial Report",
                  "Staff payroll & BPJS tracking",
                  "Vendor invoice checks + anomaly alerts",
                  "All OTA channels reconciled (Airbnb, Booking, VRBO, direct)",
                  "Monthly 30-min review call",
                  "Quarterly performance summary",
                ],
                highlight: true,
              },
              {
                name: "Premium",
                price: "Rp 8.500.000",
                per: "/ month",
                tagline: "PT PMA. High revenue. Tax-ready.",
                bestFor: "PT PMA structures, high-revenue villas, or owners preparing to refinance or sell.",
                msg: "Hi Abel, I want the Premium package (Rp 8.500.000/month).",
                features: [
                  "Everything in Professional, plus:",
                  "Tax-year document pack — coordinated with licensed Konsultan Pajak",
                  "Annual position summary (for owner reference only)",
                  "Expense anomaly alerts (live)",
                  "Forecast vs. actuals comparison",
                  "Priority 24-hour support",
                  "Dedicated account manager",
                ],
                highlight: false,
              },
            ].map((p, i) => (
              <StaggerItem key={i}>
                <Card className={`${p.highlight ? "border-primary shadow-xl ring-2 ring-primary/30 relative" : "border-border/50"}`}>
                  {p.highlight && (
                    <div className="absolute top-0 left-6 -translate-y-1/2 bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                      Most Popular
                    </div>
                  )}
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                      <div>
                        <h3 className="text-2xl font-serif font-bold text-primary">{p.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{p.tagline}</p>
                      </div>
                      <div className="md:text-right">
                        <div className="text-3xl sm:text-4xl font-bold text-primary leading-none">{p.price}</div>
                        <div className="text-sm text-muted-foreground mt-1">{p.per}</div>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 mb-5">
                      {p.features.map((f, j) => (
                        <div key={j} className="flex items-start gap-2 text-sm text-foreground/75">
                          {f.startsWith("Everything in") ? (
                            <span className="font-semibold text-primary">{f}</span>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground border-t border-border/40 pt-4 mb-5"><span className="font-semibold">Best for:</span> {p.bestFor}</p>
                    <WAButton label={`Get ${p.name} on WhatsApp`} message={p.msg} big={false} />
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}

            {/* Cleanup */}
            <StaggerItem>
              <Card className="bg-foreground text-background border-foreground">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-background">One-Time Cleanup</h3>
                      <p className="text-sm text-background/70 mt-1">Books a mess? We rebuild them.</p>
                    </div>
                    <div className="md:text-right">
                      <div className="text-3xl sm:text-4xl font-bold text-secondary leading-none">from Rp 8.500.000</div>
                      <div className="text-sm text-background/60 mt-1">one-time</div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 mb-5">
                    {[
                      "Up to 12 months of historical bookkeeping rebuilt",
                      "Every past transaction categorized and reconciled",
                      "OTA payouts matched back to bookings",
                      "Clean folder ready for ongoing monthly service",
                    ].map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-background/85">
                        <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-background/60 border-t border-background/15 pt-4 mb-5"><span className="font-semibold text-background/80">Best for:</span> Owners with messy or no records who want a fresh start.</p>
                  <WAButton label="Get a Cleanup Quote" message="Hi Abel, my villa books are a mess. I need a one-time cleanup quote." big={false} />
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerContainer>

          <FadeIn className="mt-12 text-center">
            <p className="text-foreground/70 mb-4 text-lg">Still not sure? Just message Abel — she'll help you pick.</p>
            <WAButton label="Ask Abel on WhatsApp" message="Hi Abel, I'm not sure which package fits my villa. Can you help me choose?" />
          </FadeIn>
        </div>
      </section>

      {/* TAX READINESS — SIMPLE */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-4">Tax Time? Already Sorted.</h2>
            <p className="text-base sm:text-lg text-foreground/75 leading-relaxed mb-3">
              Your records are organized year-round in clean monthly folders. When you need to file, we hand a complete document pack to a licensed Indonesian Konsultan Pajak. No last-minute panic.
            </p>
            <p className="text-xs text-muted-foreground mb-8">
              We organize your financial records and prepare them for review by a licensed professional. Formal Indonesian tax filings are handled by a licensed Konsultan Pajak registered with DJP.
            </p>
            <WAButton label="Talk to Abel About Tax-Readiness" message="Hi Abel, I want to make sure my Bali villa records are tax-ready. Can we talk?" />
          </FadeIn>
        </div>
      </section>

    </Layout>
  );
}
