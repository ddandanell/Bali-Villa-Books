import { Layout } from "@/components/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Motion";
import { Link } from "wouter";
import { CheckCircle2, ArrowRight, FileText, BarChart3, TrendingUp, Building2, ShieldCheck, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
