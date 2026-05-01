import { Layout } from "@/components/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, MapPin, Phone, Shield } from "lucide-react";

const internalTeam = [
  {
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=500&auto=format&fit=crop",
    name: "Accounting Assistant",
    title: "Bookkeeping Support",
    focus: "Receipt collection, invoice organization, expense categorization, data entry, document follow-up, and monthly bookkeeping preparation.",
    traits: ["Organized", "Detail-focused", "Patient", "Consistent"]
  },
  {
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=500&auto=format&fit=crop",
    name: "Client Coordinator",
    title: "Owner Communication & Document Coordinator",
    focus: "WhatsApp follow-up, client reminders, missing documents, meeting coordination, owner questions, and reporting schedules.",
    traits: ["Friendly", "Responsive", "Structured", "Clear"]
  },
  {
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop",
    name: "Financial Reporting Specialist",
    title: "Monthly Reporting & Owner Statement Support",
    focus: "Monthly financial reports, cashflow summaries, expense breakdowns, staff cost summaries, and owner statement preparation.",
    traits: ["Analytical", "Accurate", "Calm", "Responsible"]
  },
  {
    img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=500&auto=format&fit=crop",
    name: "Compliance Coordinator",
    title: "Compliance-Readiness Support",
    focus: "Preparing clean documents for licensed Indonesian tax or legal professionals, keeping records organized, tracking deadlines, and flagging missing documents.",
    traits: ["Careful", "Discreet", "Structured", "Professional"]
  },
  {
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop",
    name: "Operations Finance Controller",
    title: "Villa Expense & Cost Control Support",
    focus: "Supplier bills, petty cash review, staff salary tracking, recurring expenses, maintenance cost visibility, and operational finance checks.",
    traits: ["Practical", "Observant", "Firm", "Problem-solving"]
  }
];

const externalAdvisors = [
  {
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=500&auto=format&fit=crop",
    name: "Michael David",
    title: "External Accounting Advisor",
    background: "Former PwC experience",
    focus: "Accounting advisory, financial control, international reporting structure, and owner-level financial review.",
    note: "External advisor only. Not an Indonesian licensed tax or legal representative."
  },
  {
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500&auto=format&fit=crop",
    name: "David Jurosmidt",
    title: "External Accounting Advisor",
    background: "Former Deloitte experience",
    focus: "Accounting advisory, bookkeeping structure, reporting quality, financial review, and operational finance control.",
    note: "External advisor only. Not an Indonesian licensed tax or legal representative."
  },
  {
    img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=500&auto=format&fit=crop",
    name: "Licensed Indonesian Compliance Partner",
    title: "External Licensed Compliance Partner",
    background: "Konsultan Pajak registered with DJP",
    focus: "Indonesian tax, legal, and compliance matters when formal local advice, filing, or representation is required.",
    note: "All formal Indonesian tax and legal work is handled by a licensed Indonesian professional where required."
  }
];

export default function About() {
  return (
    <Layout>

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2098&auto=format&fit=crop"
            alt="Bali landscape"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <FadeIn>
            <span className="inline-block mb-4 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/70">
              Bali Villa Accounting Service — Denpasar, Bali
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">About VillaBooks Bali</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/80 font-serif italic max-w-2xl mx-auto">
              A hands-on specialist team built for foreign villa owners who deserve financial clarity.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Mission */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <h2 className="text-3xl font-serif font-bold text-primary mb-6">The Mission</h2>
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                We started VillaBooks Bali — Bali Villa Account Service — because we saw the same problem repeating across Canggu, Seminyak, Ubud, and Uluwatu: foreign investors pouring real capital into beautiful Bali properties, with no clean financial picture to show for it.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                Between complex OTA payouts, local vendors operating mostly in cash, and management teams focused on guests rather than spreadsheets — villa owners were left completely in the dark about whether their property was actually profitable.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                We provide bookkeeping, accounting organization, owner reporting, expense control, and compliance-readiness support. Formal Indonesian tax, legal, or filing matters are coordinated with licensed Indonesian professionals where required.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1537726235470-8504e3beef77?q=80&w=2070&auto=format&fit=crop"
                  alt="Bali villa accounting office"
                  className="w-full h-full object-cover"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Abel — Featured Lead */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-primary mb-3">The Team Behind Your Accounts</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Led by Abel Yuniartini — a hands-on finance controller who works directly with villa owners every day, not a back-office you never speak to.
            </p>
          </FadeIn>

          {/* Abel */}
          <FadeIn className="mb-16">
            <div className="bg-background border border-border/50 rounded-2xl overflow-hidden shadow-lg">
              <div className="grid md:grid-cols-5">
                <div className="md:col-span-2 aspect-[4/3] md:aspect-auto">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=688&auto=format&fit=crop"
                    alt="Abel Yuniartini — Finance Controller, VillaBooks Bali"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                  <span className="inline-block rounded-full bg-secondary/15 border border-secondary/30 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-secondary mb-4">
                    Partner &amp; Day-to-Day Lead
                  </span>
                  <h3 className="text-3xl font-serif font-bold text-primary mb-1">Abel Yuniartini</h3>
                  <p className="text-sm font-semibold text-muted-foreground mb-6">Partner / Finance Controller / Villa Accounting Lead</p>
                  <p className="text-foreground/75 leading-relaxed mb-6">
                    Abel is the primary contact and operational lead at VillaBooks Bali. She works directly with villa owners on their accounts — from bookkeeping structure and document collection through to monthly financial statements, expense control, and owner review calls.
                  </p>
                  <p className="text-foreground/70 leading-relaxed mb-8">
                    She brings a hardworking, precise, and calm approach to every client relationship — built specifically for the complexity of Bali villa rental income, OTA reconciliation, and foreign ownership structures.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      "Day-to-day villa bookkeeping & accounting",
                      "Monthly Owner Financial Statement oversight",
                      "Direct client contact & owner review calls",
                      "Expense control & vendor invoice review",
                      "Coordination across all owner timezones",
                      "OTA reconciliation across all platforms"
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                        <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8">
                    <a
                      href="https://wa.me/6281237402292?text=Hi%20Abel%2C%20I%27d%20like%20to%20book%20a%20confidential%20accounting%20review%20for%20my%20Bali%20villa."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                      <Phone className="w-4 h-4" /> Book a Review with Abel
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Internal team */}
          <h3 className="text-2xl font-serif font-bold text-primary mb-8 text-center">The Internal Support Team</h3>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {internalTeam.map((m, i) => (
              <StaggerItem key={i}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <div className="aspect-[3/2] overflow-hidden rounded-t-[inherit]">
                    <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="pt-5">
                    <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary mb-2">Internal Team</span>
                    <h4 className="font-bold text-foreground mb-0.5">{m.name}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{m.title}</p>
                    <p className="text-sm text-foreground/60 leading-relaxed mb-4">{m.focus}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {m.traits.map((t, j) => (
                        <span key={j} className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* External Advisors */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <FadeIn className="mb-12 text-center">
            <h2 className="text-3xl font-serif font-bold text-primary mb-4">External Advisory Partners</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Our external advisors provide an additional quality layer on accounting structure and reporting methodology. They are not the day-to-day operators — Abel and the internal team are. They are not Indonesian licensed tax or legal representatives.
            </p>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {externalAdvisors.map((a, i) => (
              <StaggerItem key={i}>
                <Card className="h-full bg-muted/10 border-border/40 hover:shadow-md transition-shadow">
                  <div className="aspect-square overflow-hidden rounded-t-[inherit]">
                    <img src={a.img} alt={a.name} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="pt-5">
                    <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground mb-2">External Partner</span>
                    <h4 className="font-bold text-foreground mb-0.5">{a.name}</h4>
                    <p className="text-xs text-muted-foreground mb-1">{a.title}</p>
                    <p className="text-xs font-medium text-primary/70 mb-3">{a.background}</p>
                    <p className="text-sm text-foreground/60 leading-relaxed mb-4">{a.focus}</p>
                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
                      <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground" />
                      <span>{a.note}</span>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Office + Contact */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <h2 className="text-3xl font-serif font-bold text-primary mb-6">Where We Work</h2>
              <p className="text-foreground/70 leading-relaxed mb-6">
                Based in Denpasar, Bali — we operate locally on the ground, which means we understand the reality of Bali villa expenses, local vendors, IDR transactions, and management company reports in a way that no offshore accounting service can.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm mb-0.5">Office Address</div>
                    <div className="text-sm text-foreground/60">Jl. Tukad Barito Timur III No.16, Panjer, Denpasar Selatan, Kota Denpasar, Bali 80226</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm mb-0.5">WhatsApp</div>
                    <a
                      href="https://wa.me/6281237402292"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      +62 812-3740-2292
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center rounded-full bg-background border px-3 py-1 text-xs font-medium text-muted-foreground">Australia — AEST / AWST</span>
                <span className="inline-flex items-center rounded-full bg-background border px-3 py-1 text-xs font-medium text-muted-foreground">UK — GMT / BST</span>
                <span className="inline-flex items-center rounded-full bg-background border px-3 py-1 text-xs font-medium text-muted-foreground">Netherlands — CET / CEST</span>
                <span className="inline-flex items-center rounded-full bg-background border px-3 py-1 text-xs font-medium text-muted-foreground">USA — EST / PST</span>
                <span className="inline-flex items-center rounded-full bg-background border px-3 py-1 text-xs font-medium text-muted-foreground">Singapore — SGT</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=987&auto=format&fit=crop"
                  alt="VillaBooks Bali office and team"
                  className="w-full h-full object-cover"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Compliance note */}
      <section className="py-10 border-t border-border/30">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Compliance note:</strong> VillaBooks Bali is a bookkeeping and financial reporting service. We organize your financial records and prepare them for review by a licensed professional. Our reports are for owner information only and do not constitute official tax filings or legal advice. For Indonesian tax filings and legal compliance, we coordinate with and refer to licensed Konsultan Pajak registered with the Directorate General of Taxes (DJP).
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <FadeIn>
            <h2 className="text-3xl font-serif font-bold mb-4">Ready to Get Organized?</h2>
            <p className="text-primary-foreground/80 mb-8">
              Book a free, confidential 15-minute accounting review with Abel. No obligation — just clarity.
            </p>
            <a
              href="https://wa.me/6281237402292?text=Hi%20Abel%2C%20I%27d%20like%20to%20book%20a%20confidential%20accounting%20review%20for%20my%20Bali%20villa."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center rounded-md bg-secondary text-secondary-foreground px-8 text-base font-bold shadow transition-all hover:bg-secondary/90 hover:scale-105"
            >
              Book a Confidential Accounting Review
            </a>
          </FadeIn>
        </div>
      </section>

    </Layout>
  );
}
