import { ArrowRight, ArrowUpRight, Check, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { PageVisual } from "@/components/PageVisual";
import { getPageImagery } from "@/lib/page-imagery";
import { trackEvent } from "@/lib/analytics";
import { prices, priceText } from "@/lib/pricing";
import { PHONE, whatsapp } from "@/lib/site-pages";
import { compareHub, comparePages, type ComparePage as ComparePageData } from "@/lib/compare-pages";

const wrap = "mx-auto max-w-7xl px-5 md:px-8";
const eyebrow = "text-xs font-bold uppercase tracking-[.2em] text-secondary";
const linkClass =
  "inline-flex items-center gap-2 font-semibold text-primary underline decoration-secondary/50 underline-offset-4 transition-colors hover:text-secondary";
const cardHeading = "font-serif text-2xl text-primary";

type RoSection = {
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  links?: readonly (readonly [string, string])[];
};
type RoTable = { caption: string; columns: readonly string[]; rows: readonly (readonly string[])[]; note: string };
type RoPair = readonly [string, string];

function placement(path: string) {
  return path === "/compare" ? "compare_hub" : `compare_${path.split("/").pop()}`.slice(0, 60);
}

function Hero({ path, h1, deck, crumb }: { path: string; h1: string; deck: string; crumb: string }) {
  const imagery = getPageImagery(path);
  return (
    <section className="bg-primary pb-12 pt-36 text-primary-foreground sm:pb-16">
      <div className={`${wrap} grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-14`}>
        <div>
          <nav aria-label="Breadcrumb" className="mb-9 flex flex-wrap items-center gap-2 text-xs text-primary-foreground/55">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/compare" className="hover:text-white">Compare</Link>
            {path !== "/compare" && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-primary-foreground/85">{crumb}</span>
              </>
            )}
          </nav>
          <p className={eyebrow}>Comparison · Denpasar, Bali</p>
          <h1 className="mt-4 max-w-4xl text-4xl leading-[1.05] sm:text-6xl">{h1}</h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-primary-foreground/70 sm:text-lg">{deck}</p>
        </div>
        {imagery && <PageVisual imagery={imagery} priority className="w-full" />}
      </div>
    </section>
  );
}

function Answer({ paragraphs }: { paragraphs: readonly string[] }) {
  return (
    <section className="border-b border-primary/10 bg-accent/50 py-12 sm:py-14">
      <div className={`${wrap} max-w-4xl`}>
        <p className={eyebrow}>The short answer</p>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="mt-4 text-base leading-8 text-foreground/80 sm:text-lg">{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function CtaBand({ path, label }: { path: string; label: string }) {
  return (
    <section className="bg-accent/45 py-12">
      <div className={`${wrap} flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between`}>
        <div>
          <p className={eyebrow}>Client Advisory</p>
          <h2 className="mt-2 font-serif text-3xl text-primary">Compare your own records.</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-foreground/70">
            Describe the documents you hold and what is currently unmatched. We will say whether the work is a monthly scope, a cleanup, or neither.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={whatsapp(`Hello Client Advisory, I'd like to discuss ${label.toLowerCase()} for my villa.`)}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("whatsapp_click", { page: path, placement: placement(path) })}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            <span>Discuss your setup</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <Link href="/pricing" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/20 px-6 text-sm font-semibold text-primary">
            See prices
          </Link>
        </div>
      </div>
    </section>
  );
}

function Sections({ sections, path }: { sections: readonly RoSection[]; path: string }) {
  return (
    <section className={`${wrap} py-14 sm:py-20`}>
      <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div>
          <p className={eyebrow}>How to decide</p>
          <h2 className="mt-3 font-serif text-3xl text-primary sm:text-4xl">Work through the decision, not the sales page</h2>
          <p className="mt-4 text-sm leading-7 text-foreground/65">
            Each step below is something you can check against your own records today, without sending documents to anyone.
          </p>
        </div>
        <div className="space-y-10">
          {sections.map((section) => (
            <article key={section.heading}>
              <h3 className={cardHeading}>{section.heading}</h3>
              {section.paragraphs.map((paragraph, index) => (
                <p key={index} className="mt-3 text-base leading-8 text-foreground/75">{paragraph}</p>
              ))}
              {section.bullets && (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm leading-7 text-foreground/75">
                      <Check className="mt-1.5 h-4 w-4 shrink-0 text-secondary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.links && (
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {section.links.map(([label, href]) => (
                    <Link key={href} href={href} className={linkClass}>
                      {label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
      <p className="mt-10 text-xs leading-6 text-foreground/50">
        Example figures on this page are illustrative, prepared for {path === "/compare" ? "this comparison" : "a planning comparison"}, and are not a quote for your property.
      </p>
    </section>
  );
}

function DimensionTable({ page }: { page: ComparePageData }) {
  return (
    <section className="border-y border-primary/10 bg-white py-14 sm:py-20">
      <div className={wrap}>
        <p className={eyebrow}>Side by side</p>
        <h2 className="mt-3 max-w-3xl font-serif text-3xl text-primary sm:text-4xl">{page.leftHeading} and {page.rightHeading.toLowerCase()}</h2>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-primary/10">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <caption className="sr-only">{page.h1}: comparison by dimension</caption>
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th scope="col" className="px-5 py-4 font-semibold">Dimension</th>
                <th scope="col" className="px-5 py-4 font-semibold">{page.leftHeading}</th>
                <th scope="col" className="px-5 py-4 font-semibold">{page.rightHeading}</th>
              </tr>
            </thead>
            <tbody>
              {page.rows.map((row, index) => (
                <tr key={row.dimension} className={index % 2 ? "bg-background" : "bg-accent/30"}>
                  <th scope="row" className="px-5 py-4 align-top font-medium text-primary">{row.dimension}</th>
                  <td className="px-5 py-4 align-top text-foreground/75">{row.left}</td>
                  <td className="px-5 py-4 align-top text-foreground/75">{row.right}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-primary/10 bg-background p-6">
            <h3 className="font-serif text-xl text-primary">Choose {page.leftHeading.toLowerCase()} if</h3>
            <ul className="mt-3 space-y-2">
              {page.chooseLeft.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-7 text-foreground/75"><Check className="mt-1.5 h-4 w-4 shrink-0 text-secondary" /><span>{item}</span></li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-primary/10 bg-background p-6">
            <h3 className="font-serif text-xl text-primary">Choose {page.rightHeading.toLowerCase()} if</h3>
            <ul className="mt-3 space-y-2">
              {page.chooseRight.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-7 text-foreground/75"><Check className="mt-1.5 h-4 w-4 shrink-0 text-secondary" /><span>{item}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-foreground/60">{page.verdictNote}</p>
      </div>
    </section>
  );
}

function MoneyTable({ table }: { table: RoTable }) {
  return (
    <section className={`${wrap} py-14 sm:py-20`}>
      <p className={eyebrow}>Illustrative figures</p>
      <h2 className="mt-3 max-w-3xl font-serif text-3xl text-primary sm:text-4xl">The arithmetic, written out</h2>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-primary/10">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <caption className="sr-only">{table.caption}</caption>
          <thead>
            <tr className="bg-accent/60 text-primary">
              {table.columns.map((column) => <th key={column} scope="col" className="px-5 py-4 font-semibold">{column}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {table.rows.map((row) => (
              <tr key={row[0]}>
                <th scope="row" className="px-5 py-4 align-top font-medium text-primary">{row[0]}</th>
                <td className="px-5 py-4 align-top text-foreground/75">{row[1]}</td>
                <td className="px-5 py-4 align-top text-foreground/75">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground/60">{table.caption} {table.note}</p>
      <p className="mt-2 text-xs leading-6 text-foreground/50">Published package prices: Starter {priceText(prices.starter)}, Professional {priceText(prices.professional)}, Premium {priceText(prices.premium)} per month; cleanup from {priceText(prices.cleanup)}.</p>
    </section>
  );
}

function Mistakes({ items }: { items: readonly { heading: string; body: string }[] }) {
  return (
    <section className="border-y border-primary/10 bg-primary py-14 text-primary-foreground sm:py-20">
      <div className={wrap}>
        <p className="text-xs font-bold uppercase tracking-[.2em] text-secondary">What owners get wrong</p>
        <h2 className="mt-3 max-w-3xl font-serif text-3xl sm:text-4xl">Three avoidable mistakes</h2>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-primary-foreground/15 md:grid-cols-3">
          {items.map((item, index) => (
            <article key={item.heading} className="bg-primary p-6">
              <span className="font-mono text-xs text-primary-foreground/50">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-serif text-xl">{item.heading}</h3>
              <p className="mt-3 text-sm leading-7 text-primary-foreground/75">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Checklist({ items, path }: { items: readonly string[]; path: string }) {
  return (
    <section className={`${wrap} py-14 sm:py-20`}>
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div>
          <p className={eyebrow}>Practical checklist</p>
          <h2 className="mt-3 font-serif text-3xl text-primary sm:text-4xl">Take this to any provider</h2>
          <p className="mt-4 text-sm leading-7 text-foreground/65">
            None of these questions asks for a competitor's name. Each one can be answered in a sentence, and a vague answer is information too.
          </p>
        </div>
        <ol className="space-y-3">
          {items.map((item, index) => (
            <li key={item} className="flex gap-4 rounded-xl border border-primary/10 bg-white p-4">
              <span className="font-mono text-xs text-secondary">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-sm leading-7 text-foreground/80">{item}</span>
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-8 text-xs leading-6 text-foreground/50">Questions are general. They are not legal, tax or immigration advice, and they do not create an engagement — see <Link href="/terms" className="underline underline-offset-4">terms</Link>.</p>
    </section>
  );
}

function Faqs({ faqs, path }: { faqs: readonly RoPair[]; path: string }) {
  return (
    <section className="border-y border-primary/10 bg-white py-14 sm:py-20">
      <div className={`${wrap} grid gap-10 md:grid-cols-[.7fr_1.3fr]`}>
        <div>
          <p className={eyebrow}>Questions</p>
          <h2 className="mt-3 font-serif text-3xl text-primary">Asked before choosing</h2>
          <p className="mt-4 text-sm leading-7 text-foreground/65">Straight answers, including the ones that end in "ask a licensed adviser".</p>
        </div>
        <div className="divide-y divide-primary/10">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group py-5">
              <summary className="cursor-pointer list-none pr-4 font-semibold text-primary marker:hidden">
                {question}
                <span className="float-right text-secondary">+</span>
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/70">{answer}</p>
            </details>
          ))}
        </div>
      </div>
      <div className={`${wrap} mt-8`}>
        <Link href="/get-started" onClick={() => trackEvent("consultation_click", { page: path, placement: "compare_faq" })} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground">
          Ask about your situation
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-3 text-xs leading-6 text-foreground/50">Or call {PHONE}. Do not send bank statements through the public form.</p>
      </div>
    </section>
  );
}

function Related({ related, guides, path }: { related: readonly RoPair[]; guides: readonly RoPair[]; path: string }) {
  return (
    <section className={`${wrap} py-14 sm:py-20`}>
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <p className={eyebrow}>Services</p>
          <h2 className="mt-3 font-serif text-2xl text-primary">If you want the work done</h2>
          <div className="mt-4 flex flex-col gap-3">
            {related.map(([label, href]) => (
              <Link key={href} href={href} className={linkClass}>{label}<ArrowRight className="h-4 w-4" /></Link>
            ))}
          </div>
        </div>
        <div>
          <p className={eyebrow}>Guides</p>
          <h2 className="mt-3 font-serif text-2xl text-primary">Read before you decide</h2>
          <div className="mt-4 flex flex-col gap-3">
            {guides.map(([label, href]) => (
              <Link key={href} href={href} className={linkClass}>{label}<ArrowRight className="h-4 w-4" /></Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-10 rounded-2xl border border-primary/10 bg-accent/40 p-6">
        <h2 className="font-serif text-xl text-primary">Scope of this page</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-foreground/70">
          This page compares service models and explains how to assess them. It is general information, not tax, legal or immigration advice, and it does not describe or rank any named provider. Prices shown for Bali Accounting are our published package prices; other figures are illustrative planning numbers. Tax treatment, filing obligations and licensing questions belong with a licensed adviser.
        </p>
        <p className="mt-3 text-xs leading-6 text-foreground/50">Last reviewed {comparePages.find(page => page.path === path)?.updated ?? compareHub.updated}. Contact details: WhatsApp {PHONE}, Panjer, Denpasar Selatan.</p>
      </div>
    </section>
  );
}

function CompareChild({ page }: { page: ComparePageData }) {
  return (
    <Layout>
      <Hero path={page.path} h1={page.h1} deck={page.deck} crumb={page.label} />
      <Answer paragraphs={page.answer} />
      <section className={`${wrap} py-12 sm:py-14`}>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className={eyebrow}>Who this applies to</p>
            <p className="mt-3 text-base leading-8 text-foreground/75">{page.audience}</p>
          </div>
          <div>
            <p className={eyebrow}>Why it matters</p>
            <p className="mt-3 text-base leading-8 text-foreground/75">
              The wrong model does not announce itself. It shows up as a month that cannot be explained, a payout nobody chased, or a filing pack assembled in a hurry from three sources.
            </p>
          </div>
        </div>
      </section>
      <DimensionTable page={page} />
      <Sections sections={page.sections} path={page.path} />
      <MoneyTable table={page.table} />
      <Mistakes items={page.mistakes} />
      <Checklist items={page.checklist} path={page.path} />
      <Faqs faqs={page.faqs} path={page.path} />
      <Related related={page.related} guides={page.guides} path={page.path} />
      <CtaBand path={page.path} label={page.label} />
    </Layout>
  );
}

function CompareHub() {
  const hub = compareHub;
  return (
    <Layout>
      <Hero path={hub.path} h1={hub.h1} deck={hub.deck} crumb="Compare" />
      <Answer paragraphs={hub.answer} />
      <section className={`${wrap} py-14 sm:py-20`}>
        <p className={eyebrow}>Four models</p>
        <h2 className="mt-3 max-w-3xl font-serif text-3xl text-primary sm:text-4xl">What each one produces, and where it fails</h2>
        <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-primary/10 bg-primary/10 md:grid-cols-2">
          {hub.models.map((model, index) => (
            <article key={model.name} className="bg-background p-7 sm:p-9">
              <span className="font-mono text-xs text-secondary">{String(index + 1).padStart(2, "0")} / MODEL</span>
              <h3 className="mt-4 font-serif text-2xl text-primary">{model.name}</h3>
              <dl className="mt-4 space-y-3 text-sm leading-7">
                <div><dt className="font-semibold text-primary">Best for</dt><dd className="text-foreground/70">{model.bestFor}</dd></div>
                <div><dt className="font-semibold text-primary">Produces</dt><dd className="text-foreground/70">{model.produces}</dd></div>
                <div><dt className="font-semibold text-primary">Watch out for</dt><dd className="text-foreground/70">{model.watchOut}</dd></div>
                <div><dt className="font-semibold text-primary">Cost</dt><dd className="text-foreground/70">{model.cost}</dd></div>
              </dl>
            </article>
          ))}
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {comparePages.map((page) => (
            <Link key={page.path} href={page.path} className="group rounded-2xl border border-primary/10 bg-white p-6 transition-colors hover:border-secondary/40">
              <span className="font-mono text-xs text-secondary">DETAILED COMPARISON</span>
              <h3 className="mt-3 font-serif text-xl text-primary group-hover:text-secondary">{page.label}</h3>
              <p className="mt-2 text-sm leading-7 text-foreground/70">{page.description}</p>
              <span className={`${linkClass} mt-4`}>Open comparison<ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </section>
      <Sections sections={hub.sections} path={hub.path} />
      <MoneyTable table={hub.table} />
      <Mistakes items={hub.mistakes} />
      <Checklist items={hub.checklist} path={hub.path} />
      <Faqs faqs={hub.faqs} path={hub.path} />
      <Related related={hub.related} guides={hub.guides} path={hub.path} />
      <CtaBand path={hub.path} label="provider comparison" />
    </Layout>
  );
}

export default function ComparePage({ path }: { path: string }) {
  const page = comparePages.find(item => item.path === path);
  return page ? <CompareChild page={page} /> : <CompareHub />;
}
