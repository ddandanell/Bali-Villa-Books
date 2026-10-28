import { useEffect, useMemo, useState } from "react";
import { updateShareImage } from "@/lib/social-images";
import { Link } from "wouter";
import { Search, ArrowRight, BookOpen, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { getGetBlogAutomationStatusQueryKey, useListBlogPosts, useGetBlogAutomationStatus, type BlogPostSummary } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { BlogCard } from "@/components/BlogCard";
import { trackEvent } from "@/lib/analytics";
import { SITE_ORIGIN } from "@/lib/site-pages";
import { PageEducation } from "@/components/PageEducation";
import { getPageImagery } from "@/lib/page-imagery";

export default function Blog() {
  const imagery = getPageImagery("/blog");
  const [search, setSearch] = useState("");
  const [page] = useState(() => {
    if (typeof window === "undefined") return 1;
    const requested = Number(new URLSearchParams(window.location.search).get("page") ?? "1");
    return Number.isInteger(requested) && requested > 0 ? requested : 1;
  });
  useEffect(() => {
    updateShareImage("/blog");
    const title = page > 1 ? `Bali Accounting Journal — Page ${page}` : "Bali Villa Bookkeeping & Airbnb Guides | Bali Accounting";
    const description = "Practical Bali villa bookkeeping guides: Airbnb reconciliation, expense tracking, monthly owner reports and cash-flow forecasts, plus source-checked news.";
    document.title = title;
    const canonical = `${SITE_ORIGIN}/blog${page > 1 ? `?page=${page}` : ""}`;
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = canonical;
    for (const [selector, value, key] of [
      ['meta[name="description"]', description, "name"],
      ['meta[property="og:title"]', title, "property"],
      ['meta[property="og:description"]', description, "property"],
      ['meta[property="og:url"]', canonical, "property"],
      ['meta[name="twitter:title"]', title, "name"],
      ['meta[name="twitter:description"]', description, "name"],
    ]) {
      let meta = document.querySelector<HTMLMetaElement>(selector);
      if (!meta) { meta = document.createElement("meta"); meta.setAttribute(key, selector.match(/(?:name|property)="([^"]+)"/)?.[1] ?? ""); document.head.appendChild(meta); }
      meta.content = value;
    }
    trackEvent("blog_view", { page: "/blog", placement: "journal_page" });
  }, [page]);
  const offset = (page - 1) * 50;
  const params = page === 1 ? { limit: 50 } : { limit: 50, offset };
  const { data: posts, isLoading, isError, refetch } = useListBlogPosts(params);
  const { data: automation } = useGetBlogAutomationStatus({ query: { queryKey: getGetBlogAutomationStatusQueryKey(), refetchInterval: 60000 } });
  const filtered = useMemo(() => (posts ?? []).filter((post) =>
    `${post.title} ${post.excerpt} ${post.category} ${post.primaryKeyword}`.toLowerCase().includes(search.toLowerCase())
  ), [posts, search]);

  return (
    <Layout>
      <section className="bg-background">
        <section className="relative overflow-hidden bg-primary pb-20 pt-36 text-primary-foreground sm:pb-28">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
           <div className="container relative mx-auto grid max-w-7xl items-center gap-10 px-5 md:px-8 lg:grid-cols-[1fr_.8fr] lg:gap-14">
             <div>
             <Link href="/" data-testid="link-blog-home" className="mb-10 inline-flex items-center gap-2 text-sm text-primary-foreground/60 transition-colors hover:text-white">Bali Accounting <ArrowRight className="h-4 w-4" /> Journal</Link>
             <div className="max-w-3xl">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-secondary">The Bali villa ledger</p>
              <h1 data-testid="text-blog-heading" className="text-5xl leading-[1.02] sm:text-7xl">Bali Villa Bookkeeping Guides</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-primary-foreground/70">Learn how to reconcile Airbnb payouts, track rental property expenses and review monthly villa P&amp;L and cash flow. Our practical guides connect reporting questions with the source records behind them.</p>
              {automation && <div className="mt-6 text-sm text-primary-foreground/60" data-testid="text-publication-schedule"><p>{automation.enabled ? "Editorial automation is enabled." : "Editorial automation is currently paused."} Cadence: {automation.cadence}; up to {automation.maxPostsPerRun} article(s) per run. {automation.timezone} time.</p><p className="mt-2">{automation.lastRunStatus === "failed" ? "The last automated run needs attention; published guides remain available." : automation.lastRunStatus === "running" ? "An editorial run is in progress." : automation.lastRunAt ? `Last run: ${new Date(automation.lastRunAt).toLocaleString("en-GB", { timeZone: automation.timezone, dateStyle: "medium", timeStyle: "short" })}.` : "No completed run is reported yet."}{automation.nextEligibleRunAt && ` Next eligible run: ${new Date(automation.nextEligibleRunAt).toLocaleString("en-GB", { timeZone: automation.timezone, dateStyle: "medium", timeStyle: "short" })}.`}</p></div>}
            </div>
             </div>
             {imagery && <figure className="overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/5 shadow-xl">
               <img src={imagery.imageUrl} alt={imagery.imageAlt} width={imagery.width} height={imagery.height} fetchPriority="high" loading="eager" className="aspect-[8/5] w-full object-cover" />
               {imagery.caption && <figcaption className="px-4 py-3 text-xs leading-5 text-primary-foreground/60 sm:px-5">{imagery.caption}</figcaption>}
             </figure>}
          </div>
        </section>
        <section className="container mx-auto max-w-7xl px-5 py-14 md:px-8 sm:py-20">
          <div className="mb-12 flex flex-col gap-5 border-b border-primary/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
             <div><p className="text-sm font-semibold text-secondary">Practical guides from Bali Accounting</p><h2 className="mt-2 text-3xl text-primary sm:text-4xl">Browse the journal</h2></div>
              <label className="relative block sm:w-80"><span className="sr-only">Search articles</span><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" /><input data-testid="input-blog-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search the journal" className="h-12 w-full rounded-full border border-primary/15 bg-background pl-11 pr-5 text-sm outline-none transition-shadow focus:border-secondary focus:ring-4 focus:ring-secondary/10" /></label>
          </div>
          {isLoading && <div data-testid="status-blog-loading" className="grid gap-6 md:grid-cols-2"><div className="h-64 animate-pulse rounded-[1.75rem] bg-primary/5" /><div className="h-64 animate-pulse rounded-[1.75rem] bg-primary/5" /></div>}
          {isError && <div data-testid="status-blog-error" className="rounded-3xl border border-secondary/20 bg-white p-10 text-center"><p className="font-serif text-2xl text-primary">The journal is taking a short pause.</p><p className="mt-2 text-foreground/60">Please try again in a moment.</p><button data-testid="button-blog-retry" onClick={() => refetch()} className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white"><RefreshCw className="h-4 w-4" /> Try again</button></div>}
           {!isLoading && !isError && filtered.length === 0 && <div data-testid="status-blog-empty" className="rounded-3xl border border-primary/10 bg-white p-16 text-center"><BookOpen className="mx-auto h-8 w-8 text-secondary" /><p className="mt-5 font-serif text-2xl text-primary">{search ? "No guides match that search." : "No published guides are available yet."}</p>{search && <button data-testid="button-blog-clear-search" onClick={() => setSearch("")} className="mt-5 text-sm font-semibold text-secondary underline underline-offset-4">Clear search</button>}</div>}
           <div className="grid gap-6 md:grid-cols-2">{filtered.map((post: BlogPostSummary, index) => <BlogCard key={post.slug} post={post} featured={index === 0} />)}</div>
            {!isLoading && !isError && !search && (page > 1 || (posts?.length ?? 0) === 50) && <nav aria-label="Journal pages" className="mt-12 flex items-center justify-between border-t border-primary/10 pt-6"><span>{page > 1 ? <a href={`/blog?page=${page - 1}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/15 px-5 text-sm font-semibold text-primary"><ChevronLeft className="h-4 w-4" />Newer articles</a> : <span aria-disabled="true" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/10 px-5 text-sm text-foreground/35"><ChevronLeft className="h-4 w-4" />Newer articles</span>}</span><span className="text-xs text-foreground/50">Articles {offset + 1}–{offset + (posts?.length ?? 0)}</span>{(posts?.length ?? 0) === 50 ? <a href={`/blog?page=${page + 1}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/15 px-5 text-sm font-semibold text-primary">Older articles<ChevronRight className="h-4 w-4" /></a> : <span aria-disabled="true" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/10 px-5 text-sm text-foreground/35">Older articles<ChevronRight className="h-4 w-4" /></span>}</nav>}
           <div className="mt-12 border-t border-primary/10 pt-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-secondary">Explore the service pages</p><div className="mt-4 flex flex-wrap gap-x-7 gap-y-3 text-sm">{[["OTA payout reconciliation","/airbnb-bookkeeping-bali"],["Owner reporting","/villa-financial-reporting-bali"],["Pricing","/pricing"]].map(([label,href])=><Link key={href} href={href} className="font-semibold text-primary underline underline-offset-4">{label}</Link>)}</div></div>
        </section>
      </section>
      <PageEducation path="/blog" />
    </Layout>
  );
}