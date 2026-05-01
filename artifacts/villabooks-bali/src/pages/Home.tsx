import { Layout } from "@/components/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Motion";
import { Link } from "wouter";
import { CheckCircle2, MessageCircle, AlertTriangle, FileText, ShieldCheck, Clock, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const WA_BASE = "https://wa.me/6281237402292";
const waLink = (msg: string) => `${WA_BASE}?text=${encodeURIComponent(msg)}`;

function WhatsAppCTA({ label = "Chat on WhatsApp Now", message = "Hi, I want to talk about my Bali villa accounting." }: { label?: string; message?: string }) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 h-14 px-8 rounded-xl bg-[#25D366] text-white font-bold text-base shadow-lg hover:bg-[#1ebe5e] active:scale-[0.98] transition-all"
    >
      <MessageCircle className="w-5 h-5" />
      {label}
    </a>
  );
}

function CTABand({ headline, sub, label, message }: { headline: string; sub?: string; label?: string; message?: string }) {
  return (
    <section className="py-10 sm:py-14 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-2">{headline}</h3>
        {sub && <p className="text-primary-foreground/80 mb-6 text-base sm:text-lg">{sub}</p>}
        <div className="flex justify-center">
          <WhatsAppCTA label={label} message={message} />
        </div>
        <p className="mt-4 text-xs text-primary-foreground/60">Reply within 1 hour. WhatsApp +62 812-3740-2292</p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout>

      {/* HERO */}
      <section className="relative min-h-[88vh] sm:min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2076&auto=format&fit=crop"
            alt="Bali villa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/85 to-primary/95 sm:bg-gradient-to-r sm:from-primary/95 sm:via-primary/80 sm:to-primary/40" />
        </div>
        <div className="container mx-auto px-4 relative z-10 py-16 sm:py-24">
          <FadeIn className="max-w-3xl">
            <span className="inline-block mb-5 rounded-full bg-secondary text-secondary-foreground px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
              Bali Villa Accounting — Made Simple
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white mb-5 leading-[1.05]">
              Your Bali Villa. Real Numbers. Zero Stress.
            </h1>
            <p className="text-lg sm:text-xl text-white/85 mb-8 leading-relaxed">
              We do your villa bookkeeping. You get a clear monthly report. In plain English. No more guessing if your villa is actually making money.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <WhatsAppCTA label="Chat on WhatsApp Now" message="Hi Abel, I want to talk about accounting for my Bali villa." />
              <Link
                href="/sample-report"
                className="inline-flex items-center justify-center h-14 px-6 rounded-xl border-2 border-white/40 text-white font-semibold text-base hover:bg-white/10 transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" /> See Sample Report
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 sm:flex sm:flex-wrap gap-x-6 gap-y-3 text-xs sm:text-sm text-white/75">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-secondary" /> 100% remote</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-secondary" /> Local Bali team</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-secondary" /> Reports by 15th</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-secondary" /> Plain English</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="py-4 bg-foreground text-background">
        <div className="container mx-auto px-4 overflow-hidden">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-wider text-background/60">
            <span>Canggu</span>
            <span className="text-secondary">•</span>
            <span>Seminyak</span>
            <span className="text-secondary">•</span>
            <span>Ubud</span>
            <span className="text-secondary">•</span>
            <span>Uluwatu</span>
            <span className="text-secondary">•</span>
            <span>Sanur</span>
            <span className="text-secondary">•</span>
            <span>Nusa Dua</span>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <FadeIn className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-3">Sound Familiar?</h2>
            <p className="text-base sm:text-lg text-foreground/70">If you own a villa in Bali, you've felt at least one of these.</p>
          </FadeIn>
          <StaggerContainer className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop",
                text: "You have NO idea if your villa is actually making money."
              },
              {
                img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=600&auto=format&fit=crop",
                text: "Your records are a mess of WhatsApp photos and random receipts."
              },
              {
                img: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?q=80&w=600&auto=format&fit=crop",
                text: "Airbnb payouts never match your booking calendar. You don't know why."
              },
              {
                img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=600&auto=format&fit=crop",
                text: "Tax season is coming. You have nothing organized for a Konsultan Pajak."
              },
            ].map((p, i) => (
              <StaggerItem key={i}>
                <div className="bg-background rounded-2xl border border-border/40 overflow-hidden shadow-sm h-full flex flex-col sm:flex-row">
                  <div className="w-full sm:w-32 h-40 sm:h-auto shrink-0">
                    <img src={p.img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
                    <p className="text-foreground/85 font-medium leading-snug">{p.text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <FadeIn className="mt-10 text-center">
            <p className="text-lg font-semibold text-primary mb-5">We fix all of this. In one message.</p>
            <WhatsAppCTA label="Chat With Us On WhatsApp" message="Hi, I have one of these problems with my Bali villa. Can you help?" />
          </FadeIn>
        </div>
      </section>

      {/* SOLUTION — WHAT WE DO */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <FadeIn className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-secondary mb-2">What We Do</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-3">We Handle Your Villa Money. You Get Clear Reports.</h2>
            <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto">No accounting jargon. No spreadsheets you can't read. Just clear monthly numbers.</p>
          </FadeIn>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop",
                title: "Monthly Bookkeeping",
                desc: "Every receipt, every bill, every Airbnb payout — categorized and reconciled every single month."
              },
              {
                img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
                title: "Owner Financial Report",
                desc: "One simple report by the 15th of every month. Revenue, expenses, profit. Done."
              },
              {
                img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop",
                title: "OTA Reconciliation",
                desc: "Airbnb, Booking.com, VRBO — every payout matched to every booking. Nothing missing."
              },
              {
                img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop",
                title: "Expense Control",
                desc: "We catch double-billing, weird vendor charges, and cost spikes before they hurt you."
              },
              {
                img: "https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=800&auto=format&fit=crop",
                title: "Staff & Payroll Tracking",
                desc: "Staff wages, BPJS, bonuses — all tracked properly so nothing slips."
              },
              {
                img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop",
                title: "Tax-Ready Documents",
                desc: "Records organized year-round, ready to hand to a licensed Konsultan Pajak when you need to file."
              },
            ].map((s, i) => (
              <StaggerItem key={i}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg text-primary mb-2">{s.title}</h3>
                    <p className="text-sm text-foreground/70 leading-relaxed">{s.desc}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* WHATSAPP BAND #1 */}
      <CTABand
        headline="Want a free 15-min review of your villa books?"
        sub="No commitment. Just clarity. Message Abel directly on WhatsApp."
        label="Book Free Review on WhatsApp"
        message="Hi Abel, I'd like a free 15-minute review of my Bali villa books."
      />

      {/* PRICING — IDR ONLY */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <FadeIn className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Simple Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-3">Flat Monthly Price. No Surprises.</h2>
            <p className="text-base sm:text-lg text-foreground/70">Cancel anytime. All prices in Indonesian Rupiah (IDR).</p>
          </FadeIn>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                name: "Starter",
                price: "Rp 2.500.000",
                per: "/ month",
                desc: "1 villa, basic operations",
                highlight: false,
                features: [
                  "Monthly bookkeeping",
                  "Up to 2 OTA channels reconciled",
                  "Basic monthly P&L report",
                  "Document folder organization",
                  "WhatsApp + email support",
                ],
                msg: "Hi Abel, I want the Starter package (Rp 2.500.000/month). My villa is in [area]."
              },
              {
                name: "Professional",
                price: "Rp 5.000.000",
                per: "/ month",
                desc: "Most popular for active rentals",
                highlight: true,
                features: [
                  "Everything in Starter",
                  "Full Owner Financial Report",
                  "All OTA channels reconciled",
                  "Staff payroll tracking",
                  "Vendor invoice review",
                  "Monthly review call",
                ],
                msg: "Hi Abel, I want the Professional package (Rp 5.000.000/month). My villa is in [area]."
              },
              {
                name: "Premium",
                price: "Rp 8.500.000",
                per: "/ month",
                desc: "PT PMA & high-revenue villas",
                highlight: false,
                features: [
                  "Everything in Professional",
                  "Tax-year document pack",
                  "Coordinated with Konsultan Pajak",
                  "Expense anomaly alerts",
                  "Forecast vs. actuals",
                  "Priority 24-hour support",
                ],
                msg: "Hi Abel, I want the Premium package (Rp 8.500.000/month). My villa is in [area]."
              },
            ].map((p, i) => (
              <StaggerItem key={i}>
                <Card className={`flex flex-col h-full ${p.highlight ? "border-primary shadow-xl ring-2 ring-primary/30 relative" : "border-border/50"}`}>
                  {p.highlight && (
                    <div className="absolute top-0 left-0 right-0 -translate-y-1/2 flex justify-center">
                      <span className="inline-block bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">Most Popular</span>
                    </div>
                  )}
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-serif font-bold text-primary mb-1">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mb-5">{p.desc}</p>
                    <div className="mb-6">
                      <div className="text-3xl sm:text-4xl font-bold text-primary leading-none">{p.price}</div>
                      <div className="text-sm text-muted-foreground mt-1">{p.per}</div>
                    </div>
                    <ul className="space-y-2.5 mb-6 flex-1">
                      {p.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-foreground/75">
                          <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={waLink(p.msg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full inline-flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all ${p.highlight ? "bg-[#25D366] text-white hover:bg-[#1ebe5e] shadow-md" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                    >
                      <MessageCircle className="w-4 h-4" /> Get This on WhatsApp
                    </a>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn className="mt-8 text-center">
            <div className="inline-block bg-muted/30 border border-border/50 rounded-xl px-6 py-4 text-sm">
              <p className="text-foreground/70">
                <span className="font-semibold">Records a mess?</span> Our One-Time Cleanup starts from{" "}
                <span className="font-bold text-primary">Rp 8.500.000</span>. We rebuild up to 12 months of books.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* WHATSAPP BAND #2 */}
      <CTABand
        headline="Not sure which package fits?"
        sub="Send Abel a quick WhatsApp. She'll tell you in 5 minutes."
        label="Ask Abel on WhatsApp"
        message="Hi Abel, I'm not sure which package fits my villa. Can you help me choose?"
      />

      {/* SAMPLE REPORT — IDR */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <FadeIn className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-3">This Is What You Get Every Month</h2>
            <p className="text-base sm:text-lg text-foreground/70">One simple report. All your villa numbers. Delivered by the 15th.</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="bg-background border border-border/60 rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-primary text-primary-foreground px-5 sm:px-8 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-widest text-primary-foreground/60 mb-1">Owner Financial Report</div>
                  <div className="text-lg sm:text-xl font-serif font-bold">Villa Tirta Sari, Canggu</div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-[10px] sm:text-xs text-primary-foreground/60">Period</div>
                  <div className="font-semibold text-sm sm:text-base">April 2025</div>
                </div>
              </div>
              <div className="p-5 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 border-b border-border pb-2">Revenue</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70">Airbnb</td><td className="text-right font-medium">Rp 113.000.000</td></tr>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70">Booking.com</td><td className="text-right font-medium">Rp 34.700.000</td></tr>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70 pl-3 text-xs">Less: OTA commissions (15%)</td><td className="text-right text-destructive text-xs">– Rp 22.155.000</td></tr>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70">Direct bookings</td><td className="text-right font-medium">Rp 19.800.000</td></tr>
                      <tr><td className="py-2 font-bold text-primary">Net revenue received</td><td className="text-right font-bold text-primary">Rp 145.345.000</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 border-b border-border pb-2">Expenses</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70">Staff wages & BPJS</td><td className="text-right font-medium">Rp 19.800.000</td></tr>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70">Utilities (PLN, water, internet)</td><td className="text-right font-medium">Rp 6.270.000</td></tr>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70">Maintenance & repairs</td><td className="text-right font-medium">Rp 3.550.000</td></tr>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70">Cleaning & laundry</td><td className="text-right font-medium">Rp 5.610.000</td></tr>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70">Supplies & consumables</td><td className="text-right font-medium">Rp 1.570.000</td></tr>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70">Villa management fee</td><td className="text-right font-medium">Rp 7.425.000</td></tr>
                      <tr><td className="py-2 font-bold text-foreground">Total expenses</td><td className="text-right font-bold">Rp 44.225.000</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-primary/5 rounded-xl p-5 border border-primary/15">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Net Profit</div>
                    <div className="flex justify-between text-sm mb-1"><span>Revenue</span><span className="font-medium">Rp 145.345.000</span></div>
                    <div className="flex justify-between text-sm mb-3"><span>Expenses</span><span className="font-medium text-destructive">– Rp 44.225.000</span></div>
                    <div className="border-t border-primary/20 pt-3 flex justify-between items-baseline">
                      <span className="font-bold text-primary">Net profit (April)</span>
                      <span className="font-bold text-primary text-2xl">Rp 101M</span>
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Occupancy</div>
                    <div className="flex justify-between text-sm mb-1"><span>Nights booked / available</span><span className="font-medium">24 / 30</span></div>
                    <div className="flex justify-between text-sm mb-1"><span>Avg nightly rate</span><span className="font-medium">Rp 6.020.000</span></div>
                    <div className="flex justify-between text-sm"><span>Occupancy rate</span><span className="font-medium">80%</span></div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
          <FadeIn className="mt-8 text-center">
            <Link href="/sample-report" className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline">
              <FileText className="w-4 h-4" /> See the full sample report
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* WHATSAPP BAND #3 */}
      <CTABand
        headline="Want a report like this for your villa?"
        sub="Tell Abel about your villa on WhatsApp. Get started this week."
        label="Get My Villa Report"
        message="Hi Abel, I want a monthly report like this for my Bali villa. Can we start?"
      />

      {/* PROCESS — SUPER SIMPLE */}
      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <FadeIn className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-secondary mb-2">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-3">3 Steps. That's It.</h2>
          </FadeIn>
          <StaggerContainer className="grid sm:grid-cols-3 gap-5">
            {[
              {
                step: "1",
                title: "Message us on WhatsApp",
                desc: "Tell Abel about your villa, where it is, and how many bookings. Free 15-min chat.",
              },
              {
                step: "2",
                title: "We collect your records",
                desc: "Receipts, invoices, OTA reports, bank statements — uploaded to your private Google Drive folder.",
              },
              {
                step: "3",
                title: "You get your monthly report",
                desc: "By the 15th of every month. Clear numbers. Plain English. No surprises.",
              },
            ].map((s, i) => (
              <StaggerItem key={i}>
                <Card className="h-full text-center border-border/50">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-md">
                      {s.step}
                    </div>
                    <h3 className="font-bold text-lg text-primary mb-2">{s.title}</h3>
                    <p className="text-sm text-foreground/70 leading-relaxed">{s.desc}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <FadeIn className="mt-10 text-center">
            <WhatsAppCTA label="Start Step 1 Now" message="Hi Abel, I want to start. Here's my villa info: [name], [area], [bedrooms]." />
          </FadeIn>
        </div>
      </section>

      {/* TEAM / TRUST */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <FadeIn className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-secondary mb-2">The Team</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-3">You'll Talk Directly to Abel.</h2>
            <p className="text-base sm:text-lg text-foreground/70">Real person. Local team. Based in Denpasar, Bali.</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="bg-background border border-border/50 rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">
              <div className="aspect-[4/3] md:aspect-auto">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=688&auto=format&fit=crop"
                  alt="Abel Yuniartini — Finance Controller"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-10 flex flex-col justify-center">
                <h3 className="text-2xl font-serif font-bold text-primary mb-1">Abel Yuniartini</h3>
                <p className="text-sm font-semibold text-muted-foreground mb-4">Partner / Finance Controller / Your Direct Contact</p>
                <p className="text-foreground/75 leading-relaxed mb-6">
                  Abel runs your account directly — bookkeeping, monthly reports, expense control, and your monthly review call. No middlemen. No call centers. Just one person who knows your villa.
                </p>
                <WhatsAppCTA label="Message Abel Directly" message="Hi Abel, I want to talk about accounting for my Bali villa." />
              </div>
            </div>
          </FadeIn>
          <FadeIn className="mt-6 text-center">
            <Link href="/about" className="text-sm text-primary hover:underline font-medium">
              Meet the full team and external advisors →
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="py-12 bg-muted/20 border-y border-border/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: <MapPin className="w-6 h-6" />, label: "Based in Denpasar, Bali" },
              { icon: <ShieldCheck className="w-6 h-6" />, label: "Secure Google Workspace" },
              { icon: <Clock className="w-6 h-6" />, label: "Reports by the 15th" },
              { icon: <CheckCircle2 className="w-6 h-6" />, label: "Konsultan Pajak coordination" },
            ].map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">{b.icon}</div>
                <span className="text-xs sm:text-sm font-medium text-foreground/70">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <FadeIn className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-3">Quick Questions, Quick Answers</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Accordion type="single" collapsible className="space-y-3">
              {[
                {
                  q: "How much does it cost?",
                  a: "Starts at Rp 2.500.000 per month for one villa. Most clients pick the Rp 5.000.000 Professional package. No setup fee. Cancel anytime."
                },
                {
                  q: "Do you file my taxes?",
                  a: "No. We organize your financial records and prepare them for review by a licensed professional. When you need to file, we coordinate with a licensed Konsultan Pajak registered with DJP."
                },
                {
                  q: "Do I have to come to Bali?",
                  a: "No. 100% remote. You upload documents to a private Google Drive. We send your monthly report by email or WhatsApp. You never need to fly here."
                },
                {
                  q: "My books are a total mess. Can you fix it?",
                  a: "Yes. Our One-Time Cleanup starts at Rp 8.500.000. We rebuild up to 12 months of books from whatever records you have. Then ongoing monthly service takes over."
                },
                {
                  q: "How fast can we start?",
                  a: "Message Abel on WhatsApp today. We do a free 15-min chat, set up your Google Drive, and your first monthly report goes out the following month."
                },
                {
                  q: "Is my data safe?",
                  a: "Yes. Records are stored in secure Google Workspace folders with restricted access. Nothing is shared with anyone without your written approval."
                },
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-border/50 rounded-xl px-5 sm:px-6 data-[state=open]:border-primary/30 data-[state=open]:bg-primary/5 transition-colors">
                  <AccordionTrigger className="text-left font-semibold py-5 hover:no-underline text-foreground/90">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-foreground/70 pb-5 leading-relaxed">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
          <FadeIn className="mt-8 text-center">
            <p className="text-foreground/70 mb-4">More questions? Just message us.</p>
            <WhatsAppCTA label="Ask on WhatsApp" message="Hi, I have a question about your Bali villa accounting service." />
          </FadeIn>
        </div>
      </section>

      {/* OFFICE / CONTACT */}
      <section className="py-12 bg-foreground text-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div>
              <div className="text-xs uppercase tracking-wider text-background/50 mb-1">Office</div>
              <div className="text-sm leading-relaxed">Jl. Tukad Barito Timur III No.16, Panjer, Denpasar Selatan, Bali 80226</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-background/50 mb-1">WhatsApp</div>
              <a href={WA_BASE} target="_blank" rel="noopener noreferrer" className="text-secondary text-sm font-semibold hover:underline">+62 812-3740-2292</a>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-background/50 mb-1">Service</div>
              <div className="text-sm">100% remote, worldwide</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1537640851516-2b39be13d0d3?q=80&w=2070&auto=format&fit=crop"
            alt="Bali villa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/95" />
        </div>
        <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
          <FadeIn>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-5 leading-tight">
              Stop Guessing. Start Knowing.
            </h2>
            <p className="text-lg sm:text-xl text-white/85 mb-8 leading-relaxed">
              One message on WhatsApp. We take it from there.
            </p>
            <WhatsAppCTA
              label="Chat With Abel on WhatsApp Now"
              message="Hi Abel, I want to start. My villa is in [area] with [number] bedrooms."
            />
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 text-white/70 text-sm">
              <span className="flex items-center justify-center gap-2"><Phone className="w-4 h-4" /> +62 812-3740-2292</span>
              <span className="hidden sm:block text-white/30">•</span>
              <span className="flex items-center justify-center gap-2"><MapPin className="w-4 h-4" /> Denpasar, Bali</span>
            </div>
            <p className="mt-8 text-xs text-white/50 max-w-xl mx-auto">
              VillaBooks Bali is a bookkeeping and financial reporting service. We organize your financial records and prepare them for review by a licensed professional. Formal Indonesian tax or legal matters are handled by licensed Indonesian professionals where required.
            </p>
          </FadeIn>
        </div>
      </section>

    </Layout>
  );
}
