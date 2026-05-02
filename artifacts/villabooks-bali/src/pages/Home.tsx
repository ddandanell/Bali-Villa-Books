import { Layout } from "@/components/Layout";
import { motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  MessageCircle,
  Star,
  Clock,
  ShieldCheck,
  TrendingUp,
  Eye,
  Wallet,
  AlertTriangle,
  FileText,
  Phone,
  MapPin,
  Sparkles,
  Building2,
  UserCheck,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const WA = "https://wa.me/6281237402292";
const wa = (msg: string) =>
  `${WA}?text=${encodeURIComponent(msg)}`;

const CALENDLY_URL = "https://calendly.com/villabooksbali/clarity-call";

function openCalendly() {
  window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
}

/* ---------- Reusable WhatsApp button ---------- */
function WAButton({
  label = "Chat on WhatsApp",
  message = "Hi Abel, I want to talk about accounting for my Bali villa.",
  size = "lg",
  variant = "green",
  className = "",
}: {
  label?: string;
  message?: string;
  size?: "lg" | "md";
  variant?: "green" | "outline";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-bold shadow-lg transition-all active:scale-[0.97]";
  const sizes =
    size === "lg"
      ? "h-14 px-7 text-base w-full sm:w-auto"
      : "h-12 px-5 text-sm w-full sm:w-auto";
  const styles =
    variant === "green"
      ? "bg-[#25D366] hover:bg-[#1ebe5e] text-white shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40"
      : "border-2 border-white/40 text-white hover:bg-white/10 shadow-none";

  return (
    <a
      href={wa(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${sizes} ${styles} ${className}`}
    >
      <MessageCircle className={size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
      {label}
    </a>
  );
}

/* ---------- Calendly / Book a Call button ---------- */
function BookCallButton({
  label = "Book a Free 15-Min Call",
  size = "lg",
  variant = "primary",
  className = "",
}: {
  label?: string;
  size?: "lg" | "md";
  variant?: "primary" | "outline" | "outline-dark";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-bold shadow-lg transition-all active:scale-[0.97] cursor-pointer";
  const sizes =
    size === "lg"
      ? "h-14 px-7 text-base w-full sm:w-auto"
      : "h-12 px-5 text-sm w-full sm:w-auto";
  const styles =
    variant === "outline"
      ? "border-2 border-white/40 text-white hover:bg-white/10 shadow-none"
      : variant === "outline-dark"
      ? "border-2 border-primary/40 text-primary hover:bg-primary/5 shadow-none"
      : "bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40";

  return (
    <button
      type="button"
      onClick={openCalendly}
      className={`${base} ${sizes} ${styles} ${className}`}
    >
      <Clock className={size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
      {label}
    </button>
  );
}

/* ---------- Animation helpers ---------- */
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Stagger({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        visible: { transition: { staggerChildren: 0.08 } },
        hidden: {},
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Item({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={{
        hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Page ---------- */
export default function Home() {
  return (
    <Layout>

      {/* ============== HERO ============== */}
      <section className="relative overflow-hidden bg-[#0b1f1c]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2076&auto=format&fit=crop"
            alt="Bali villa"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1f1c] via-[#0b1f1c]/80 to-[#0b1f1c]" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 max-w-5xl">
          <FadeUp>
            <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white/90">
                Kantor di Denpasar · Melayani seluruh Bali
              </span>
            </div>
          </FadeUp>

          <FadeUp delay={0.05}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white leading-[1.05] tracking-tight max-w-3xl">
              Your Bali villa.{" "}
              <span className="text-secondary">Real numbers.</span>{" "}
              Zero stress.
            </h1>
          </FadeUp>

          <FadeUp delay={0.12}>
            <p className="mt-5 text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl">
              We handle every receipt, every OTA payout, every staff cost —
              personally. One clean report by the 15th, every month. In plain English.
            </p>
          </FadeUp>

          <FadeUp delay={0.18}>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
              <BookCallButton label="Book a Free 15-Min Call" />
              <WAButton label="WhatsApp Abel Now" variant="outline" />
            </div>
          </FadeUp>

          <FadeUp delay={0.25}>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-3 max-w-2xl">
              {[
                "Office in Denpasar",
                "Serving all of Bali",
                "Report by the 15th",
                "English & Indonesian",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm text-white/85">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.32}>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
              <a
                href="https://maps.google.com/?q=Jl.+Tukad+Barito+Timur+III+No.16,+Panjer,+Denpasar+Selatan,+Bali"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-white/45 hover:text-white/70 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                Jl. Tukad Barito Timur III No.16, Panjer, Denpasar Selatan, Bali 80226
              </a>
              <span className="text-white/20 hidden sm:inline">·</span>
              <a
                href={wa("Hi Abel, I want to talk about accounting for my Bali villa.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-white/45 hover:text-white/70 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-secondary shrink-0" />
                +62 812-3740-2292
              </a>
            </div>
          </FadeUp>
        </div>

        {/* location ticker */}
        <div className="relative bg-black/30 border-t border-white/5 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-white/55">
            <span className="text-secondary">●</span>
            <span>Canggu</span>
            <span className="text-white/20">·</span>
            <span>Seminyak</span>
            <span className="text-white/20">·</span>
            <span>Ubud</span>
            <span className="text-white/20">·</span>
            <span>Uluwatu</span>
            <span className="text-white/20">·</span>
            <span>Sanur</span>
            <span className="text-white/20">·</span>
            <span>Nusa Dua</span>
          </div>
        </div>
      </section>

      {/* ============== PROBLEM ============== */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <FadeUp className="text-center mb-12 sm:mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">
              Sound familiar?
            </p>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-primary tracking-tight">
              You own a villa in Bali.<br />
              You have <span className="italic">no idea</span> if it's making money.
            </h2>
          </FadeUp>

          <Stagger className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: AlertTriangle,
                title: "Mystery payouts",
                text: "Airbnb, Booking.com, and VRBO send money with deductions you can't explain. Commissions, adjustments, damage claims — what's actually yours?",
              },
              {
                icon: Eye,
                title: "You can't verify your manager",
                text: "Your villa manager sends a WhatsApp summary. The numbers look fine. But you can't cross-check a thing — and you know it.",
              },
              {
                icon: FileText,
                title: "Tax season is a crisis",
                text: "Your Konsultan Pajak asks for documents you don't have. You scramble through emails and receipts. You probably overpay — or underpay and get penalised.",
              },
            ].map((p) => (
              <Item key={p.title}>
                <div className="h-full rounded-2xl bg-white border border-border/60 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                    <p.icon className="w-5 h-5 text-destructive" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-primary mb-2">{p.title}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{p.text}</p>
                </div>
              </Item>
            ))}
          </Stagger>

          <FadeUp className="mt-10 text-center">
            <p className="text-base sm:text-lg text-foreground/75 max-w-2xl mx-auto">
              We fix all of that. One clear report every month. One person handling everything. One WhatsApp away.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section id="how" className="py-16 sm:py-24 bg-[#f4f1ea] scroll-mt-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <FadeUp className="text-center mb-12 sm:mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">
              How it works
            </p>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-primary tracking-tight">
              Three simple steps. Every month.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto">
              Same routine. Same WhatsApp contact. Same clean report. Month after month.
            </p>
          </FadeUp>

          <Stagger className="grid md:grid-cols-3 gap-5">
            {[
              {
                n: "01",
                title: "You send your documents",
                text: "Receipts, OTA reports, manager summaries — dropped into your private Google Drive. We pull Airbnb and Booking.com reports directly. You don't need to do much.",
                icon: FileText,
              },
              {
                n: "02",
                title: "We do all the work",
                text: "We sort, reconcile, and check every transaction. Banjar fees, BPJS, pool staff, OTA commissions — nothing is missed. We WhatsApp you immediately if anything looks wrong.",
                icon: ShieldCheck,
              },
              {
                n: "03",
                title: "Your report arrives",
                text: "By the 15th. Revenue, expenses, profit, occupancy. Abel personally reviews every figure before your report is sent. Plus a plain-English summary of what you need to know.",
                icon: TrendingUp,
              },
            ].map((s) => (
              <Item key={s.n}>
                <div className="relative h-full rounded-2xl bg-white border border-border/60 p-7 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="absolute top-5 right-6 text-5xl font-serif font-bold text-primary/8 select-none">
                    {s.n}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <s.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-primary mb-2.5">{s.title}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{s.text}</p>
                </div>
              </Item>
            ))}
          </Stagger>

          <FadeUp className="mt-12 text-center">
            <WAButton label="Start This Month" message="Hi Abel, I want to start your monthly villa bookkeeping service." />
          </FadeUp>
        </div>
      </section>

      {/* ============== WHY US / ABOUT ABEL ============== */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            <FadeUp>
              <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">
                Who we are
              </p>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-primary tracking-tight mb-5">
                A real person.<br />A real Bali office.
              </h2>
              <p className="text-base sm:text-lg text-foreground/75 leading-relaxed mb-6">
                VillaBooks Bali is run personally by <strong>Abel Yuniartini</strong>, from our office in Panjer, Denpasar Selatan.
                Every client works directly with Abel — there is no assistant, no outsourced team, no automated system.
                Just one dedicated person who handles your villa's books, every month.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Full-time villa bookkeeping — Airbnb, Booking.com, VRBO, banjar, BPJS",
                  "Specialists in foreign-owned villas: PT PMA, leasehold, nominee",
                  "We prepare your documents and coordinate with your Konsultan Pajak",
                  "All prices in Indonesian Rupiah · WhatsApp within 1 hour",
                ].map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center mt-0.5 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                    </div>
                    <span className="text-sm sm:text-base text-foreground/85">{b}</span>
                  </div>
                ))}
              </div>

              {/* Abel's business card */}
              <div className="rounded-2xl border border-border bg-[#f4f1ea] p-5 flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-secondary/30 flex items-center justify-center shrink-0">
                  <UserCheck className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-primary text-base">Abel Yuniartini</p>
                  <p className="text-sm text-foreground/60 mb-2">Founder & Lead Bookkeeper, VillaBooks Bali</p>
                  <div className="flex flex-col gap-1">
                    <a
                      href={wa("Hi Abel, I have a question about VillaBooks Bali.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-foreground/60 hover:text-primary transition-colors"
                    >
                      <Phone className="w-3 h-3 text-secondary shrink-0" />
                      +62 812-3740-2292 (WhatsApp)
                    </a>
                    <a
                      href="https://maps.google.com/?q=Jl.+Tukad+Barito+Timur+III+No.16,+Panjer,+Denpasar+Selatan,+Bali"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-foreground/60 hover:text-primary transition-colors"
                    >
                      <MapPin className="w-3 h-3 text-secondary shrink-0" />
                      Jl. Tukad Barito Timur III No.16, Panjer, Denpasar Selatan, Bali 80226
                    </a>
                  </div>
                </div>
              </div>

              <WAButton label="Ask Abel a Question" message="Hi Abel, I have a quick question about VillaBooks Bali." />
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="relative">
                <div className="absolute -inset-4 bg-secondary/20 rounded-3xl blur-2xl" />
                <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
                  <img src="/images/team-accountant.png" alt="Indonesian bookkeeper working at a villa office in Bali" loading="lazy" className="rounded-2xl aspect-[3/4] object-cover w-full shadow-lg" />
                  <img src="/images/team-villa-staff.png" alt="Balinese villa hospitality team welcoming guests" loading="lazy" className="rounded-2xl aspect-square object-cover w-full mt-8 shadow-lg" />
                  <img src="/images/team-bookkeeper.png" alt="Indonesian woman reviewing financial reports on a tablet" loading="lazy" className="rounded-2xl aspect-square object-cover w-full -mt-4 shadow-lg" />
                  <img src="/images/team-manager.png" alt="Indonesian villa manager outside a Bali villa" loading="lazy" className="rounded-2xl aspect-[3/4] object-cover w-full shadow-lg" />
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ============== METRICS BAND ============== */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <Stagger className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { n: "15th", t: "Report every month, on time" },
              { n: "< 1 hr", t: "WhatsApp reply time" },
              { n: "IDR", t: "All prices in Rupiah" },
              { n: "Abel", t: "You always deal with her directly" },
            ].map((m) => (
              <Item key={m.t}>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-secondary mb-1">{m.n}</div>
                <div className="text-xs sm:text-sm text-primary-foreground/80 uppercase tracking-wider">{m.t}</div>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ============== PRICING ============== */}
      <section id="pricing" className="py-16 sm:py-24 bg-[#f4f1ea] scroll-mt-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <FadeUp className="text-center mb-12 sm:mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">
              Pricing
            </p>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-primary tracking-tight">
              Simple monthly pricing.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-foreground/70">
              All in Indonesian Rupiah. No setup fee. Cancel anytime. Just WhatsApp Abel.
            </p>
          </FadeUp>

          <Stagger className="grid md:grid-cols-3 gap-5 pt-4">
            {[
              {
                name: "Starter",
                price: "Rp 2.500.000",
                tagline: "1 villa. Simple operations.",
                msg: "Hi Abel, I want the Starter package (Rp 2.500.000/month).",
                features: [
                  "Monthly bookkeeping",
                  "Up to 2 booking channels",
                  "Basic monthly P&L",
                  "Private Google Drive",
                  "WhatsApp + email support",
                ],
                highlight: false,
              },
              {
                name: "Professional",
                price: "Rp 5.000.000",
                tagline: "Most popular. Full visibility.",
                msg: "Hi Abel, I want the Professional package (Rp 5.000.000/month).",
                features: [
                  "Everything in Starter",
                  "Full Owner Financial Report",
                  "Staff payroll + BPJS tracking",
                  "All booking channels",
                  "Anomaly alerts on WhatsApp",
                  "Monthly 30-min review call",
                ],
                highlight: true,
              },
              {
                name: "Premium",
                price: "Rp 8.500.000",
                tagline: "PT PMA. Tax-ready. Priority.",
                msg: "Hi Abel, I want the Premium package (Rp 8.500.000/month).",
                features: [
                  "Everything in Professional",
                  "Tax-pack for Konsultan Pajak",
                  "Annual position summary",
                  "Forecast vs. actuals",
                  "Priority 24-hour support",
                  "Dedicated account manager",
                ],
                highlight: false,
              },
            ].map((p) => (
              <Item key={p.name}>
                <div
                  className={`relative h-full rounded-2xl p-6 sm:p-7 transition-all flex flex-col ${
                    p.highlight
                      ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/30 ring-1 ring-secondary/40 md:scale-[1.02]"
                      : "bg-white border border-border/60 shadow-sm hover:shadow-md"
                  }`}
                >
                  {p.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Most Popular
                    </div>
                  )}
                  <h3 className={`text-2xl font-serif font-bold mb-1 ${p.highlight ? "text-white" : "text-primary"}`}>{p.name}</h3>
                  <p className={`text-sm mb-5 ${p.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{p.tagline}</p>
                  <div className="mb-6">
                    <div className={`text-3xl sm:text-4xl font-bold leading-none ${p.highlight ? "text-secondary" : "text-primary"}`}>{p.price}</div>
                    <div className={`text-xs mt-1 ${p.highlight ? "text-primary-foreground/60" : "text-muted-foreground"}`}>per month, IDR</div>
                  </div>
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${p.highlight ? "text-secondary" : "text-secondary"}`} />
                        <span className={p.highlight ? "text-primary-foreground/90" : "text-foreground/80"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={wa(p.msg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-auto inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                      p.highlight
                        ? "bg-[#25D366] hover:bg-[#1ebe5e] text-white shadow-lg shadow-[#25D366]/30"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" /> Get {p.name}
                  </a>
                </div>
              </Item>
            ))}
          </Stagger>

          {/* Cleanup band */}
          <FadeUp className="mt-8">
            <div className="rounded-2xl bg-[#0b1f1c] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5 shadow-lg">
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold mb-1">Books a total mess?</h3>
                <p className="text-white/70 text-sm sm:text-base">
                  One-time cleanup from <span className="text-secondary font-bold">Rp 8.500.000</span>. We rebuild up to 12 months of records, then start your monthly service with clean books.
                </p>
              </div>
              <WAButton label="Get a Cleanup Quote" message="Hi Abel, my villa books are a mess. I need a one-time cleanup quote." size="md" />
            </div>
          </FadeUp>

          <FadeUp className="mt-8 text-center">
            <p className="text-sm text-foreground/60">
              Not sure which package?{" "}
              <a
                href={wa("Hi Abel, I'm not sure which package fits my villa. Can you help me choose?")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-primary hover:text-primary/80 underline underline-offset-4"
              >
                Ask Abel on WhatsApp →
              </a>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section id="faq" className="py-16 sm:py-24 bg-background scroll-mt-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <FadeUp className="text-center mb-12 sm:mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">
              Quick answers
            </p>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-primary tracking-tight">
              Real questions. Plain answers.
            </h2>
          </FadeUp>

          <FadeUp>
            <Accordion type="single" collapsible className="w-full divide-y divide-border/60">
              {[
                {
                  q: "What do you actually do?",
                  a: "We do your villa's monthly bookkeeping. Every month we collect your receipts, match your Airbnb and Booking.com payouts, and send you one clear report showing what came in, what went out, and what you actually made.",
                },
                {
                  q: "How much does it cost?",
                  a: "Three packages: Rp 2.500.000, Rp 5.000.000, or Rp 8.500.000 per month. All Indonesian Rupiah. No setup fee. Cancel anytime.",
                },
                {
                  q: "Do you file my Indonesian taxes?",
                  a: "No. We organise your records and prepare a clean document pack. Then a licensed Indonesian Konsultan Pajak (registered with DJP) handles your actual filings. We work with their team or yours.",
                },
                {
                  q: "I don't live in Bali. Can you still help?",
                  a: "Yes — 100% remote. Most clients live in Australia, Europe, Singapore, or the US. Everything happens by WhatsApp, email, and Google Drive.",
                },
                {
                  q: "What if my books are a total mess right now?",
                  a: "Very common. We do a one-time cleanup (from Rp 8.500.000) — rebuild up to 12 months of records, then start your monthly service with clean books.",
                },
                {
                  q: "When do I get my monthly report?",
                  a: "By the 15th of every month. As long as your documents are in the Google Drive by the 5th.",
                },
                {
                  q: "Is my data safe?",
                  a: "Yes. Secure Google Workspace storage with locked access. We never share your data with anyone without your permission.",
                },
                {
                  q: "Do you work with PT PMA, leasehold, nominee?",
                  a: "Yes — all of them. The legal structure changes the compliance details, not the bookkeeping work itself.",
                },
                {
                  q: "Who will I actually deal with?",
                  a: "Abel Yuniartini directly. Not an assistant, not a call centre. You WhatsApp Abel. She answers. That's how it works.",
                },
              ].map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-0">
                  <AccordionTrigger className="text-left font-serif font-bold text-base sm:text-lg text-primary hover:text-primary/80 hover:no-underline py-5">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/75 leading-relaxed text-sm sm:text-base pb-5">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeUp>

          <FadeUp className="mt-10 text-center">
            <WAButton label="Got a Question? Ask Abel" message="Hi Abel, I have a question about VillaBooks Bali." />
          </FadeUp>
        </div>
      </section>

      {/* ============== CONTACT / FINAL CTA ============== */}
      <section id="contact" className="relative py-16 sm:py-28 overflow-hidden bg-[#0b1f1c] text-white scroll-mt-24">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2076&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1f1c]/95 via-[#0b1f1c]/85 to-[#0b1f1c]" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 max-w-3xl text-center">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Talk to Abel</p>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight leading-[1.1] mb-5">
              Ready to see your<br />
              <span className="text-secondary">real numbers?</span>
            </h2>
            <p className="text-base sm:text-lg text-white/80 mb-10 max-w-xl mx-auto">
              Book a free 15-minute call with Abel. Tell her about your villa — which platforms you use, how messy your books are, what you need.
              She'll tell you exactly how she can help. No pressure, no jargon.
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <BookCallButton label="Book a Free 15-Min Call" />
              <WAButton label="WhatsApp Abel Now" variant="outline" />
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="grid sm:grid-cols-3 gap-5 text-left max-w-2xl mx-auto">
              <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm p-5">
                <Phone className="w-5 h-5 text-secondary mb-3" />
                <p className="text-xs uppercase tracking-wider text-white/60 mb-1">WhatsApp</p>
                <a
                  href={wa("Hi Abel, I want to talk about accounting for my Bali villa.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold hover:text-secondary transition-colors"
                >
                  +62 812-3740-2292
                </a>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm p-5">
                <Clock className="w-5 h-5 text-secondary mb-3" />
                <p className="text-xs uppercase tracking-wider text-white/60 mb-1">Response time</p>
                <p className="text-sm font-semibold">Within 1 hour</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm p-5">
                <MapPin className="w-5 h-5 text-secondary mb-3" />
                <p className="text-xs uppercase tracking-wider text-white/60 mb-1">Office</p>
                <a
                  href="https://maps.google.com/?q=Jl.+Tukad+Barito+Timur+III+No.16,+Panjer,+Denpasar+Selatan,+Bali"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold hover:text-secondary transition-colors leading-snug"
                >
                  Panjer, Denpasar Selatan,<br />Bali 80226
                </a>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="mt-12 text-xs text-white/45 max-w-xl mx-auto leading-relaxed">
              VillaBooks Bali is a bookkeeping service. We organise your financial records and prepare them for review by a licensed professional. For Indonesian tax filings, we coordinate with licensed Konsultan Pajak registered with DJP.
            </p>
          </FadeUp>
        </div>
      </section>

    </Layout>
  );
}
