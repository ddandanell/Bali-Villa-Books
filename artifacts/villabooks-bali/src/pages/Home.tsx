import { Layout } from "@/components/Layout";
import { motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  MessageCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  Eye,
  AlertTriangle,
  FileText,
  Phone,
  MapPin,
  Star,
  UserCheck,
  Building2,
  ArrowRight,
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
  variant = "primary",
  className = "",
}: {
  label?: string;
  message?: string;
  size?: "lg" | "md";
  variant?: "primary" | "outline" | "green";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 active:scale-[0.98]";
  const sizes =
    size === "lg"
      ? "h-14 px-8 text-base w-full sm:w-auto"
      : "h-12 px-6 text-sm w-full sm:w-auto";
      
  let styles = "";
  if (variant === "primary") {
    styles = "bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5";
  } else if (variant === "green") {
    styles = "bg-[#25D366] hover:bg-[#1ebe5e] text-white shadow-xl shadow-[#25D366]/30 hover:shadow-2xl hover:shadow-[#25D366]/40 hover:-translate-y-0.5";
  } else {
    styles = "border-2 border-primary text-primary hover:bg-primary/5 shadow-none";
  }

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
  variant = "secondary",
  className = "",
}: {
  label?: string;
  size?: "lg" | "md";
  variant?: "secondary" | "outline" | "primary";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 active:scale-[0.98] cursor-pointer";
  const sizes =
    size === "lg"
      ? "h-14 px-8 text-base w-full sm:w-auto"
      : "h-12 px-6 text-sm w-full sm:w-auto";
  
  let styles = "";
  if (variant === "secondary") {
    styles = "bg-secondary hover:bg-secondary/90 text-white shadow-xl shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/40 hover:-translate-y-0.5";
  } else if (variant === "primary") {
    styles = "bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 hover:-translate-y-0.5";
  } else {
    styles = "bg-white text-primary border border-primary/20 hover:border-primary/40 shadow-sm hover:shadow-md";
  }

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
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
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
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        visible: { transition: { staggerChildren: 0.15 } },
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
        hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
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
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden bg-background">
        <div className="container mx-auto px-5 md:px-8 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            <div className="lg:col-span-6 lg:pr-8">
              <FadeUp>
                <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-primary">
                    Based in Denpasar, Bali
                  </span>
                </div>
              </FadeUp>

              <FadeUp delay={0.1}>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-primary leading-[1.1] tracking-tight mb-6">
                  Your Bali villa. <br />
                  <span className="italic text-secondary">Real numbers.</span> <br />
                  Zero stress.
                </h1>
              </FadeUp>

              <FadeUp delay={0.2}>
                <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed mb-10 max-w-lg font-sans">
                  Professional Bali villa accounting and bookkeeping services. Expert account management for Bali villas handling every receipt, Airbnb bookkeeping, and OTA payout reconciliation—delivering clear financial reporting by the 15th of every month.
                </p>
              </FadeUp>

              <FadeUp delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <WAButton 
                    label="WhatsApp Abel" 
                    message="Hi Abel, I need a reliable villa accountant in Bali." 
                    variant="green"
                  />
                  <BookCallButton label="Book Free Call" variant="outline" />
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm font-sans text-foreground/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span>English & Indonesian</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span>All prices in IDR</span>
                  </div>
                </div>
              </FadeUp>
            </div>

            <div className="lg:col-span-6 relative">
              <FadeUp delay={0.4} className="relative">
                {/* Decorative blob */}
                <div className="absolute -inset-4 bg-secondary/20 rounded-[100px] blur-3xl rotate-12 opacity-60" />
                
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/50 aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]">
                  <img
                    src="/images/bali-villa-accounting-services-hero.jpg"
                    alt="Professional Bali villa accountant working on financial reporting"
                    width="800"
                    height="1000"
                    className="w-full h-full object-cover"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                  
                  {/* Floating Trust Badge */}
                  <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 glass-panel rounded-2xl p-5 sm:p-6 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                      <img src="/images/bali-accountant-consultation.jpg" alt="Abel Yuniartini, Villa Accountant in Bali" width="48" height="48" className="w-10 h-10 rounded-full object-cover" />
                    </div>
                    <div>
                      <p className="text-primary font-bold text-sm sm:text-base font-serif">Run personally by Abel</p>
                      <p className="text-primary/70 text-xs sm:text-sm font-sans mt-0.5">Your dedicated Denpasar bookkeeper</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>

          </div>
        </div>
      </section>

      {/* ============== LOGOS / PROOF ============== */}
      <section className="py-10 border-y border-border/50 bg-white">
        <div className="container mx-auto px-5 max-w-7xl">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-foreground/40 mb-6 font-sans">
            Reconciling operations across
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale mix-blend-multiply">
            <span className="text-xl font-bold font-sans">Airbnb</span>
            <span className="text-xl font-bold font-sans">Booking.com</span>
            <span className="text-xl font-bold font-sans">VRBO</span>
            <span className="text-xl font-bold font-sans">Agoda</span>
            <span className="text-xl font-bold font-sans">Expedia</span>
          </div>
        </div>
      </section>

      {/* ============== PROBLEM ============== */}
      <section id="services" className="py-24 sm:py-32 bg-accent/40 scroll-mt-24">
        <div className="container mx-auto px-5 md:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <FadeUp>
                <h2 className="text-3xl sm:text-5xl font-serif text-primary tracking-tight leading-[1.1] mb-6">
                  You own a villa in Bali.<br />
                  But is it actually <span className="italic text-secondary">profitable?</span>
                </h2>
                <p className="text-lg text-foreground/75 leading-relaxed font-sans mb-8">
                  Managing a Bali villa remotely often means relying on a manager's WhatsApp summary. You receive payouts, but deductions remain a mystery. You have zero confidence in the numbers.
                </p>
                <div className="hidden lg:block">
                  <WAButton label="Fix Your Books" message="Hi Abel, my villa books need a professional review." variant="primary" />
                </div>
              </FadeUp>
            </div>

            <div className="lg:col-span-7">
              <Stagger className="flex flex-col gap-6">
                {[
                  {
                    icon: AlertTriangle,
                    title: "OTA Payout Reconciliation",
                    text: "Airbnb and Booking.com send money with deductions you can't trace. We reconcile commissions, cancellations, and adjustments so you know what is actually yours.",
                  },
                  {
                    icon: Eye,
                    title: "Unverifiable Expenses",
                    text: "Banjar fees, pool maintenance, BPJS for staff, electricity tokens. Without a dedicated villa accountant in Bali, you can't verify if expenses are legitimate or inflated.",
                  },
                  {
                    icon: FileText,
                    title: "Tax Season Crisis",
                    text: "Your Konsultan Pajak needs documents you don't have. We provide full financial reporting to prevent scrambling through emails, risking penalties, or overpaying due to messy records.",
                  },
                ].map((p, i) => (
                  <Item key={p.title}>
                    <div className="group bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-border/50 hover:shadow-xl hover:border-secondary/30 transition-all duration-500">
                      <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-colors duration-500 text-secondary">
                        <p.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-serif text-primary mb-3">{p.title}</h3>
                      <p className="text-foreground/70 leading-relaxed font-sans text-base">{p.text}</p>
                    </div>
                  </Item>
                ))}
              </Stagger>
              
              <div className="mt-10 lg:hidden text-center">
                <WAButton label="Fix Your Books" message="Hi Abel, my villa books need a professional review." variant="primary" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="py-24 sm:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
          <img src="/images/bali-villa-bookkeeping-reconciliation.jpg" alt="Bali villa bookkeeping and reconciliation process" width="1024" height="1024" loading="lazy" className="w-full h-full object-cover" />
        </div>
        
        <div className="container mx-auto px-5 md:px-8 max-w-7xl relative z-10">
          <FadeUp className="text-center mb-16 sm:mb-20">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block font-sans">The Process</span>
            <h2 className="text-3xl sm:text-5xl font-serif tracking-tight leading-[1.1] max-w-2xl mx-auto">
              Three simple steps to <span className="italic text-secondary">financial clarity.</span>
            </h2>
          </FadeUp>

          <Stagger className="grid md:grid-cols-3 gap-8 sm:gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            {[
              {
                n: "01",
                title: "Upload Documents",
                text: "Drop receipts and manager summaries into your private Google Drive. We pull Airbnb/Booking.com reports directly.",
              },
              {
                n: "02",
                title: "We Reconcile",
                text: "We cross-check every transaction. Banjar fees, BPJS, payroll, and OTA commissions. We WhatsApp you if anything is missing.",
              },
              {
                n: "03",
                title: "Report Delivered",
                text: "By the 15th of every month, you receive a clean P&L. Abel personally reviews every figure before it reaches your inbox.",
              },
            ].map((s) => (
              <Item key={s.n} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary-foreground/5 border border-white/10 backdrop-blur-sm flex items-center justify-center mb-8 shrink-0">
                  <span className="text-3xl font-serif text-secondary">{s.n}</span>
                </div>
                <h3 className="text-2xl font-serif mb-4">{s.title}</h3>
                <p className="text-primary-foreground/70 leading-relaxed font-sans text-sm sm:text-base max-w-sm">
                  {s.text}
                </p>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ============== ABOUT ABEL / WHY US ============== */}
      <section id="about" className="py-24 sm:py-32 bg-background scroll-mt-24">
        <div className="container mx-auto px-5 md:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <FadeUp>
              <div className="relative">
                <div className="absolute -inset-4 bg-secondary/10 rounded-[3rem] blur-2xl -z-10" />
                <div className="grid grid-cols-2 gap-4">
                  <img 
                    src="/images/bali-accountant-consultation.jpg" 
                    alt="Bali accountant consulting with a villa owner" 
                    width="600"
                    height="600"
                    loading="lazy" 
                    className="rounded-[2rem] w-full h-[300px] object-cover shadow-lg mt-8" 
                  />
                  <img 
                    src="/images/bali-account-management-team.jpg" 
                    alt="Account management team for Bali villas working together" 
                    width="600"
                    height="600"
                    loading="lazy" 
                    className="rounded-[2rem] w-full h-[300px] object-cover shadow-lg" 
                  />
                </div>
                {/* Info Card Overlay */}
                <div className="absolute -bottom-8 -left-4 sm:left-8 glass-panel rounded-2xl p-6 shadow-xl max-w-[280px]">
                  <div className="flex items-center gap-4 mb-3">
                    <Building2 className="w-6 h-6 text-secondary" />
                    <h3 className="font-serif text-lg text-primary leading-tight m-0">Denpasar Based</h3>
                  </div>
                  <p className="text-sm font-sans text-foreground/70">Bookkeeping services in Denpasar serving Canggu, Seminyak, Ubud, and Uluwatu.</p>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block font-sans">The firm</span>
              <h2 className="text-3xl sm:text-5xl font-serif text-primary tracking-tight leading-[1.1] mb-6">
                A real person.<br />
                <span className="italic">A real Bali office.</span>
              </h2>
              
              <div className="space-y-6 text-lg text-foreground/75 leading-relaxed font-sans mb-10">
                <p>
                  Bali Accounting is run personally by <strong>Abel Yuniartini</strong> from our office in Panjer, Denpasar Selatan.
                </p>
                <p>
                  You don't get handed off to a junior assistant or a nameless support ticket system. Every client works directly with Abel. One dedicated professional who knows your villa's financial history inside out.
                </p>
              </div>

              <div className="space-y-4 mb-10">
                {[
                  "Specialists in foreign-owned villas (PT PMA & Leasehold)",
                  "We prepare tax-packs for your Konsultan Pajak",
                  "Direct WhatsApp access to Abel — replies < 1 hour",
                ].map((b) => (
                  <div key={b} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                    </div>
                    <span className="text-base text-foreground/80 font-sans">{b}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6">
                <WAButton label="Chat with Abel" message="Hi Abel, I'd like to learn more about your firm." variant="primary" />
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground/50">Direct Line</span>
                  <span className="text-sm font-semibold text-primary">+62 812-3740-2292</span>
                </div>
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ============== METRICS BAND ============== */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-5 md:px-8 max-w-7xl">
          <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center divide-x-0 md:divide-x divide-white/20">
            {[
              { n: "15th", t: "Report Date Every Month" },
              { n: "< 1 hr", t: "WhatsApp Reply Time" },
              { n: "IDR", t: "Transparent Rupiah Pricing" },
              { n: "100%", t: "Personal Service" },
            ].map((m) => (
              <Item key={m.t} className="px-4">
                <div className="text-4xl sm:text-5xl font-serif mb-2">{m.n}</div>
                <div className="text-sm font-sans font-medium uppercase tracking-wider text-white/80">{m.t}</div>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ============== PRICING ============== */}
      <section id="pricing" className="py-24 sm:py-32 bg-accent/30 scroll-mt-24">
        <div className="container mx-auto px-5 md:px-8 max-w-7xl">
          <FadeUp className="text-center mb-16 sm:mb-20">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block font-sans">Pricing</span>
            <h2 className="text-3xl sm:text-5xl font-serif text-primary tracking-tight mb-6">
              Simple monthly pricing.
            </h2>
            <p className="text-lg text-foreground/70 font-sans max-w-2xl mx-auto">
              All prices in Indonesian Rupiah. No setup fees. Cancel anytime.<br/>Choose the level of clarity your villa needs.
            </p>
          </FadeUp>

          <Stagger className="grid lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
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
                  "Private Google Drive folder",
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
                  "All booking channels reconciled",
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
                  "Forecast vs. actuals tracking",
                  "Priority 24-hour support",
                  "Dedicated account review",
                ],
                highlight: false,
              },
            ].map((p) => (
              <Item key={p.name}>
                <div
                  className={`relative rounded-[2rem] p-8 sm:p-10 transition-all duration-500 flex flex-col h-full ${
                    p.highlight
                      ? "bg-primary text-white shadow-2xl lg:scale-105 border-none"
                      : "bg-white text-primary border border-border/60 hover:border-primary/20 shadow-md"
                  }`}
                >
                  {p.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-current" /> Most Popular
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <h3 className="text-2xl font-serif mb-2">{p.name}</h3>
                    <p className={`text-sm font-sans ${p.highlight ? "text-white/70" : "text-foreground/60"}`}>{p.tagline}</p>
                  </div>
                  
                  <div className="mb-10">
                    <div className={`text-4xl font-serif font-medium mb-1 ${p.highlight ? "text-secondary" : "text-primary"}`}>{p.price}</div>
                    <div className={`text-sm font-sans ${p.highlight ? "text-white/60" : "text-foreground/50"}`}>per month, IDR</div>
                  </div>
                  
                  <ul className="space-y-4 mb-10 flex-1 font-sans">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 ${p.highlight ? "text-secondary" : "text-secondary"}`} />
                        <span className={p.highlight ? "text-white/90" : "text-foreground/80"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <a
                    href={wa(p.msg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-auto inline-flex h-14 w-full items-center justify-center gap-2 rounded-full font-semibold text-sm transition-all active:scale-95 ${
                      p.highlight
                        ? "bg-[#25D366] hover:bg-[#1ebe5e] text-white shadow-lg shadow-[#25D366]/30"
                        : "bg-accent hover:bg-accent/80 text-primary border border-primary/10"
                    }`}
                  >
                    <MessageCircle className="w-5 h-5" /> Select {p.name}
                  </a>
                </div>
              </Item>
            ))}
          </Stagger>

          {/* Cleanup band */}
          <FadeUp className="mt-16 max-w-4xl mx-auto">
            <div className="rounded-[2rem] bg-white border border-secondary/20 p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h3 className="text-2xl font-serif text-primary mb-3">Are your current books a mess?</h3>
                <p className="text-foreground/70 font-sans max-w-lg">
                  We offer a one-time cleanup starting at <span className="font-semibold text-primary">Rp 8.500.000</span>. We will rebuild up to 12 months of historical records, then transition you to a clean monthly service.
                </p>
              </div>
              <WAButton label="Get Cleanup Quote" message="Hi Abel, my villa books are a mess. I need a cleanup quote." variant="primary" className="relative z-10 shrink-0" />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section id="faq" className="py-24 sm:py-32 bg-background scroll-mt-24">
        <div className="container mx-auto px-5 md:px-8 max-w-3xl">
          <FadeUp className="text-center mb-16">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block font-sans">FAQ</span>
            <h2 className="text-3xl sm:text-5xl font-serif text-primary tracking-tight">
              Real questions.<br/>
              <span className="italic">Plain answers.</span>
            </h2>
          </FadeUp>

          <FadeUp>
            <Accordion type="single" collapsible className="w-full space-y-4 font-sans">
              {[
                {
                  q: "What does a villa accountant actually do?",
                  a: "We manage your villa's complete monthly bookkeeping. We collect receipts, reconcile Airbnb and Booking.com payouts, track payroll, and provide one clear monthly report detailing revenue, expenses, and true profit.",
                },
                {
                  q: "Do you file my Indonesian taxes?",
                  a: "No. We organize your financial records and prepare a clean document pack. A licensed Indonesian Konsultan Pajak (registered with DJP) then handles your official filings. We coordinate directly with your chosen tax consultant to make the process seamless.",
                },
                {
                  q: "I don't live in Bali. Can you still help?",
                  a: "Yes, our service is 100% remote-friendly. Most of our clients reside in Australia, Europe, or Singapore. All communication happens via WhatsApp, email, and shared Google Drive folders.",
                },
                {
                  q: "How do you handle staff payroll and BPJS?",
                  a: "Our Professional and Premium packages include payroll tracking. You send us the attendance or salary details, and we calculate the correct payouts including BPJS (health and employment social security) deductions, ensuring your staff are paid correctly.",
                },
                {
                  q: "Can I upgrade or downgrade my package?",
                  a: "Absolutely. There are no lock-in contracts. You can change your package month-to-month based on your villa's operational needs. Just send Abel a message on WhatsApp.",
                },
              ].map((faq, i) => (
                <AccordionItem 
                  key={i} 
                  value={`item-${i}`}
                  className="bg-white border border-border/60 rounded-2xl px-6 py-2 shadow-sm data-[state=open]:border-primary/30 transition-colors"
                >
                  <AccordionTrigger className="text-left font-semibold text-primary text-base sm:text-lg hover:no-underline hover:text-secondary py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70 leading-relaxed pb-4 text-base">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeUp>
          
          <FadeUp className="mt-16 text-center">
            <p className="text-foreground/60 font-sans mb-6">Still have questions?</p>
            <WAButton label="Ask Abel Directly" message="Hi Abel, I have a specific question about your accounting services." variant="outline" />
          </FadeUp>
        </div>
      </section>

      {/* ============== CTA ============== */}
      <section className="py-24 sm:py-32 bg-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/bali-account-management-team.jpg"
            alt="Bali villa account management team working on financial records"
            width="1024"
            height="1024"
            loading="lazy"
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/90 to-primary/60" />
        </div>
        
        <div className="container mx-auto px-5 md:px-8 max-w-4xl relative z-10 text-center">
          <FadeUp>
            <h2 className="text-4xl sm:text-6xl font-serif text-white tracking-tight mb-8">
              Stop guessing your profits.<br/>
              <span className="italic text-secondary">Start with clear books.</span>
            </h2>
            <p className="text-lg sm:text-xl text-white/80 font-sans leading-relaxed mb-12 max-w-2xl mx-auto">
              Partner with Denpasar's dedicated villa bookkeeping service. Gain total financial visibility this month.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <WAButton label="WhatsApp Abel Now" variant="green" />
              <BookCallButton label="Schedule a Call" variant="secondary" />
            </div>
          </FadeUp>
        </div>
      </section>

    </Layout>
  );
}