import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { seoStrategy } from "@workspace/site-content";

export function SeoTopicGuides({ path }: { path: string }) {
  const cluster = seoStrategy.clusters.find(item => item.page === path)
    ?? seoStrategy.clusters.find(item => item.supportPages.includes(path));
  if (!cluster) return null;
  return <section className="border-y border-primary/10 bg-accent/40 py-12 sm:py-16" aria-label="Practical service guides">
    <div className="mx-auto max-w-7xl px-6 sm:px-10">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-secondary">Practical Journal guides</p>
      <h2 className="mt-3 font-serif text-3xl text-primary sm:text-4xl">{cluster.label}</h2>
      <p className="mt-5 max-w-3xl text-base leading-8 text-foreground/70">{cluster.description}</p>
      <ul className="mt-7 grid gap-4 lg:grid-cols-3">{cluster.guides.map(guide =>
        <li key={guide.href}><Link href={guide.href} className="flex h-full items-start justify-between gap-4 rounded-2xl border border-primary/10 bg-background p-5 text-sm font-semibold leading-6 text-primary underline decoration-secondary/40 underline-offset-4 hover:border-secondary/50">
          {guide.title}<ArrowRight className="mt-1 h-4 w-4 shrink-0" />
        </Link></li>
      )}</ul>
      {path !== cluster.page && <Link href={cluster.page} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4">Explore the related service<ArrowRight className="h-4 w-4" /></Link>}
    </div>
  </section>;
}
