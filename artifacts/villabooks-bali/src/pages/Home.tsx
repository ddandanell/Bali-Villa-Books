import { Layout } from "@/components/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Motion";
import { Link } from "wouter";
import { CheckCircle2, ArrowRight, FileText, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero.jpg" 
            alt="Luxury Bali Villa" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-6 leading-tight">
              Finally Know If Your Bali Villa Is Actually Making Money
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-10 leading-relaxed max-w-3xl mx-auto">
              Monthly bookkeeping, owner financial statements, and tax-ready records — built specifically for foreign villa owners in Bali. Clear reports. Plain English. Full visibility.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/get-started" className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                Get a Free 15-Minute Financial Clarity Call
              </Link>
              <Link href="/sample-report" className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-md border-2 border-primary bg-transparent px-8 text-base font-medium text-primary shadow-sm transition-colors hover:bg-primary/5">
                Download a Sample Owner Statement
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pain/Problem Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">The Reality of Remote Ownership</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">Managing a villa from overseas often means navigating financial blind spots.</p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              "Not knowing if the villa is actually profitable after all costs",
              "Airbnb payouts that don't match the calendar",
              "Vendor invoices you can't verify",
              "Indonesian tax season with no clean records",
              "Records too messy to refinance or sell confidently"
            ].map((pain, i) => (
              <StaggerItem key={i}>
                <Card className="h-full border-border/50 bg-background/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6 flex gap-4">
                    <div className="mt-1 bg-destructive/10 p-2 rounded-full h-fit">
                      <ShieldCheck className="w-5 h-5 text-destructive" />
                    </div>
                    <p className="text-foreground/80 font-medium leading-relaxed">{pain}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">This is not villa management. It is pure financial organization.</h2>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                We don't fix leaky roofs or greet guests. We give you total clarity on where your money comes from, where it goes, and what's left.
              </p>
              <ul className="space-y-4">
                {[
                  "Monthly bookkeeping",
                  "OTA revenue reconciliation",
                  "Owner financial statements in English",
                  "Expense control and vendor invoice tracking",
                  "Tax-readiness document preparation",
                  "Coordination with licensed Indonesian Konsultan Pajak where required"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-secondary shrink-0" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn delay={0.2} className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted relative shadow-xl">
                <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                  <FileText className="w-32 h-32 text-primary/20" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">How It Works</h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">A seamless monthly process designed for remote owners.</p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-primary-foreground/20" />
            
            {[
              {
                step: "1",
                title: "Submit your month",
                desc: "Owner or manager shares receipts, invoices, OTA reports via shared Google Drive."
              },
              {
                step: "2",
                title: "We organize everything",
                desc: "We categorize, reconcile, verify, and flag anything unusual."
              },
              {
                step: "3",
                title: "You see clearly",
                desc: "Receive your Owner Financial Statement with plain-English summary by the 15th of each month."
              }
            ].map((item, i) => (
              <StaggerItem key={i} className="relative z-10">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-background text-primary flex items-center justify-center text-3xl font-serif font-bold mb-6 shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-primary-foreground/80 leading-relaxed">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Transparent Pricing</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">Flat monthly rates. No hidden fees.</p>
          </FadeIn>

          <div className="grid lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Essentials</CardTitle>
                <div className="text-3xl font-bold text-primary mt-4">$149<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <CardDescription className="mt-4 text-foreground/80 font-medium">Best for: single villa, simple operations.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm text-foreground/70">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Monthly bookkeeping and expense categorization</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> OTA reconciliation up to 2 platforms</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Basic P&L summary</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Digital receipt/invoice organization</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Email support within 48 hours</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full border-primary shadow-md relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-primary">Professional</CardTitle>
                <div className="text-3xl font-bold text-primary mt-4">$299<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <CardDescription className="mt-4 text-foreground/80 font-medium">Best for: multiple OTA channels, staff payroll.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-sm font-medium mb-3">Everything in Essentials, plus:</div>
                <ul className="space-y-3 text-sm text-foreground/70">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> Full monthly Owner Financial Statement</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> Staff payroll reconciliation</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> Vendor invoice verification log</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> OTA reconciliation across all platforms</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> Occupancy vs. revenue analysis</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> Monthly 30-min review call</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> Quarterly performance summary</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Premium</CardTitle>
                <div className="text-3xl font-bold text-primary mt-4">$499<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <CardDescription className="mt-4 text-foreground/80 font-medium">Best for: high-revenue properties, PT PMA structures, upcoming sale.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-sm font-medium mb-3">Everything in Professional, plus:</div>
                <ul className="space-y-3 text-sm text-foreground/70">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Tax-year document pack</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Annual estimated tax position summary</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Expense anomaly alerts</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Financial forecast vs. actuals comparison</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Priority 24-hour support</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Dedicated account manager</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full bg-foreground text-background">
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-background">Cleanup</CardTitle>
                <div className="text-3xl font-bold text-secondary mt-4"><span className="text-lg font-normal mr-1">from</span>$499</div>
                <CardDescription className="mt-4 text-background/80 font-medium">Best for: owners who have been operating informally.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-sm font-medium mb-3 text-secondary">One-Time Service:</div>
                <ul className="space-y-3 text-sm text-background/80">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> Historical bookkeeping reconstruction up to 12 months</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> All transactions categorized</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> Clean starting point</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Trusted by Villa Owners</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">Real peace of mind from fellow investors.</p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "I finally understood where 40M IDR was going each month — turned out our maintenance vendor was double-billing. VillaBooks caught it in the first report.",
                author: "Mark T.",
                detail: "Australian, villa owner in Canggu"
              },
              {
                quote: "As a remote owner in the Netherlands, I had zero visibility into our villa's actual profit. Now I get a clean 2-page report by the 15th of every month. I finally feel in control.",
                author: "Sophie V.",
                detail: "Dutch, villa owner in Ubud"
              },
              {
                quote: "We were about to refinance and our records were a disaster. The cleanup service gave us 12 months of organized books in two weeks. The bank was happy. We were relieved.",
                author: "James & Rachel K.",
                detail: "British, villa owners in Seminyak"
              }
            ].map((item, i) => (
              <StaggerItem key={i}>
                <Card className="h-full bg-muted/20 border-none shadow-none">
                  <CardContent className="pt-8">
                    <div className="mb-6 text-secondary text-4xl font-serif">"</div>
                    <p className="text-foreground/80 mb-8 italic leading-relaxed">{item.quote}</p>
                    <div>
                      <div className="font-bold text-primary">{item.author}</div>
                      <div className="text-sm text-foreground/60">{item.detail}</div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y border-border/50 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            {[
              "Serving villa owners from 12+ countries",
              "100% remote — no in-person visits required",
              "Reports delivered in plain English",
              "Coordinated with licensed Konsultan Pajak"
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-medium text-foreground/70">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Owner Statement Preview */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Your Monthly Owner Financial Statement</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Delivered by the 15th of every month. Clear, structured, and written in plain English — not accountant-speak.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="bg-background border border-border/60 rounded-2xl shadow-xl overflow-hidden">
              {/* Document Header */}
              <div className="bg-primary text-primary-foreground px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-widest text-primary-foreground/60 mb-1">Owner Financial Statement</div>
                  <div className="text-xl font-serif font-bold">Villa Tirta Sari, Canggu</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-primary-foreground/60">Reporting Period</div>
                  <div className="font-semibold">April 1 – April 30, 2025</div>
                </div>
              </div>
              <div className="p-6 md:p-8 space-y-6">
                {/* Revenue Summary */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 border-b border-border pb-2">1. Revenue Summary</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70">Airbnb gross revenue</td><td className="text-right font-medium">$6,840</td></tr>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70">Booking.com gross revenue</td><td className="text-right font-medium">$2,100</td></tr>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70 pl-4 text-xs">Less: OTA commissions (15%)</td><td className="text-right text-destructive text-xs">– $1,341</td></tr>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70">Direct booking</td><td className="text-right font-medium">$1,200</td></tr>
                      <tr><td className="py-2 font-bold text-primary">Net revenue received</td><td className="text-right font-bold text-primary">$8,799</td></tr>
                    </tbody>
                  </table>
                </div>
                {/* Operating Expenses */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 border-b border-border pb-2">2. Operating Expenses</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70">Staff wages & payroll</td><td className="text-right font-medium">$1,200</td></tr>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70">Utilities (electricity, water, internet)</td><td className="text-right font-medium">$380</td></tr>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70">Maintenance & repairs</td><td className="text-right font-medium">$215</td></tr>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70">Cleaning & laundry</td><td className="text-right font-medium">$340</td></tr>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70">Supplies & consumables</td><td className="text-right font-medium">$95</td></tr>
                      <tr className="border-b border-border/30"><td className="py-2 text-foreground/70">Villa agent management fee</td><td className="text-right font-medium">$450</td></tr>
                      <tr><td className="py-2 font-bold text-foreground">Total operating expenses</td><td className="text-right font-bold">$2,680</td></tr>
                    </tbody>
                  </table>
                </div>
                {/* Net Position + Occupancy */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">3. Net Operating Position</div>
                    <div className="flex justify-between mb-1 text-sm"><span>Total revenue</span><span className="font-medium">$8,799</span></div>
                    <div className="flex justify-between mb-3 text-sm"><span>Total expenses</span><span className="font-medium text-destructive">– $2,680</span></div>
                    <div className="flex justify-between border-t border-primary/20 pt-3"><span className="font-bold text-primary">Net income (April)</span><span className="font-bold text-primary text-lg">$6,119</span></div>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">5. Occupancy Snapshot</div>
                    <div className="flex justify-between mb-1 text-sm"><span>Nights booked / available</span><span className="font-medium">24 / 30</span></div>
                    <div className="flex justify-between mb-1 text-sm"><span>Avg daily rate (ADR)</span><span className="font-medium">$365</span></div>
                    <div className="flex justify-between text-sm"><span>Revenue per available night</span><span className="font-medium">$293</span></div>
                  </div>
                </div>
                <div className="text-center pt-2">
                  <Link href="/sample-report" className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline">
                    <FileText className="w-4 h-4" /> View the full sample statement
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Common Questions</h2>
            <p className="text-lg text-foreground/70">Clear answers about how VillaBooks Bali works.</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Accordion type="single" collapsible className="space-y-3">
              {[
                {
                  q: "What exactly does VillaBooks Bali do — and what doesn't it do?",
                  a: "We organize your monthly villa finances: bookkeeping, OTA revenue reconciliation, expense categorization, and Owner Financial Statements in plain English. We are not a villa management company, and we do not handle property maintenance, guest services, or staffing. For Indonesian tax filings and legal advice, we coordinate with and refer to licensed Konsultan Pajak — we do not file taxes ourselves."
                },
                {
                  q: "Do you file our Indonesian taxes for us?",
                  a: "No. We are a bookkeeping and financial reporting service, not a licensed tax firm. We prepare your records, organize your documents, and keep everything tax-ready. When you need to file, we coordinate with and refer to a licensed Indonesian Konsultan Pajak (tax consultant registered with DJP) on your behalf."
                },
                {
                  q: "Do I need to be in Bali for this service?",
                  a: "Not at all. Our entire service is remote. You share documents via a secure Google Drive folder, and we deliver your Owner Financial Statement by email. We coordinate with your local manager or management company so you never need to be physically present to keep your books organized."
                },
                {
                  q: "My records are a complete mess. Can you still help?",
                  a: "Yes — that's exactly what our One-Time Financial Cleanup service is designed for. We'll reconstruct up to 12 months of historical bookkeeping from whatever records you have, categorize everything, and give you a clean starting point for ongoing monthly work."
                },
                {
                  q: "What is OTA reconciliation and why does it matter?",
                  a: "OTA stands for Online Travel Agency — Airbnb, Booking.com, VRBO, and similar platforms. Their payouts often don't match your actual bookings due to platform commissions, currency conversions, and timing delays. We download and cross-reference your payout reports against your booking calendar every month to make sure every dollar is accounted for."
                },
                {
                  q: "What ownership structures do you work with?",
                  a: "We work with all common Bali villa ownership structures — PT PMA (foreign investment company), leasehold arrangements, and nominee structures. You don't need to have a formal corporate structure; many of our clients are individual foreign owners with various levels of formalization."
                },
                {
                  q: "How is this different from what my villa manager already does?",
                  a: "Villa managers focus on operations — guest check-ins, maintenance, pool cleaning, staff scheduling. Very few produce financial reports that are clean enough for an owner to understand their actual profitability. VillaBooks Bali provides the financial layer that most management arrangements don't include: structured monthly bookkeeping, reconciliation, and an owner-facing financial statement."
                },
                {
                  q: "What are the Indonesian tax obligations for foreign villa rental income?",
                  a: "Indonesian tax obligations for villa rental income vary based on your ownership structure, residency status, and income level. We can help you keep your records organized and tax-ready, but for specific advice on your tax obligations, we recommend speaking with a licensed Konsultan Pajak registered with the Directorate General of Taxes (DJP). We can facilitate that referral."
                },
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-border/50 rounded-xl px-6 data-[state=open]:border-primary/30 data-[state=open]:bg-primary/5 transition-colors">
                  <AccordionTrigger className="text-left font-semibold py-5 hover:no-underline text-foreground/90">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-foreground/70 pb-5 leading-relaxed">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="text-center mt-8">
              <Link href="/faq" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                View all frequently asked questions <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Compliance Disclaimer */}
      <section className="py-8 bg-muted/20 border-y border-border/30">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            VillaBooks Bali is a bookkeeping and financial reporting service. Our reports are for owner information only and do not constitute official tax filings or legal advice. For Indonesian tax filings and legal compliance, we coordinate with and refer to licensed Konsultan Pajak registered with the Directorate General of Taxes (DJP).
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Ready for financial clarity?</h2>
            <p className="text-xl text-primary-foreground/80 mb-10">
              Stop guessing. Start knowing. Let's discuss how we can organize your villa's finances.
            </p>
            <Link href="/get-started" className="inline-flex h-14 items-center justify-center rounded-md bg-secondary px-8 text-base font-bold text-secondary-foreground shadow-lg transition-transform hover:scale-105">
              Get a Free 15-Minute Clarity Call <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
}
