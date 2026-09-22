import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Search, ArrowRight, BookOpen, RefreshCw } from "lucide-react";
import { useListBlogPosts, useGetBlogAutomationStatus, type BlogPostSummary } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { BlogCard } from "@/components/BlogCard";
import { trackEvent } from "@/lib/analytics";

export default function Blog() {
  const [search, setSearch] = useState("");
  useEffect(() => {
    document.title = "Bali Villa Accounting Guides | Bali Accounting";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Practical Bali villa accounting guides from Denpasar: OTA reconciliation, payroll, reporting, and profitable villa operations.");
  }, []);
  const { data: posts, isLoading, isError, refetch } = useListBlogPosts({ limit: 50 });
  useGetBlogAutomationStatus({ query: { queryKey: ["/api/blog/automation/status"] } });
  const filtered = useMemo(() => (posts ?? []).filter((post) =>
    `${post.title} ${post.excerpt} ${post.category} ${post.primaryKeyword}`.toLowerCase().includes(search.toLowerCase())
  ), [posts, search]);

  return (
    <Layout>
      <main className="bg-background">
        <section className="relative overflow-hidden bg-primary pb-20 pt-36 text-primary-foreground sm:pb-28">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
          <div className="container relative mx-auto max-w-7xl px-5 md:px-8">
            <Link href="/" data-testid="link-blog-home" className="mb-10 inline-flex items-center gap-2 text-sm text-primary-foreground/60 transition-colors hover:text-white">Bali Accounting <ArrowRight className="h-4 w-4" /> Journal</Link>
            <div className="max-w-3xl">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-secondary">The Bali villa ledger</p>
              <h1 data-testid="text-blog-heading" className="text-5xl leading-[1.02] sm:text-7xl">Clear thinking for <span className="italic text-secondary">better villas.</span></h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-primary-foreground/70">Practical guidance on villa bookkeeping, OTA payouts, payroll, and the numbers behind a healthy Bali hospitality business.</p>
            </div>
          </div>
        </section>
        <section className="container mx-auto max-w-7xl px-5 py-14 md:px-8 sm:py-20">
          <div className="mb-12 flex flex-col gap-5 border-b border-primary/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-sm font-semibold text-secondary">Expert guides from Denpasar</p><h2 className="mt-2 text-3xl text-primary sm:text-4xl">The latest thinking</h2></div>
            <label className="relative block sm:w-80"><span className="sr-only">Search articles</span><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" /><input data-testid="input-blog-search" value={search} onChange={(e) => { setSearch(e.target.value); trackEvent("blog_view", { location: "blog_search" }); }} placeholder="Search the journal" className="h-12 w-full rounded-full border border-primary/15 bg-white pl-11 pr-5 text-sm outline-none transition-shadow focus:border-secondary focus:ring-4 focus:ring-secondary/10" /></label>
          </div>
          {isLoading && <div data-testid="status-blog-loading" className="grid gap-6 md:grid-cols-2"><div className="h-64 animate-pulse rounded-[1.75rem] bg-primary/5" /><div className="h-64 animate-pulse rounded-[1.75rem] bg-primary/5" /></div>}
          {isError && <div data-testid="status-blog-error" className="rounded-3xl border border-secondary/20 bg-white p-10 text-center"><p className="font-serif text-2xl text-primary">The journal is taking a short pause.</p><p className="mt-2 text-foreground/60">Please try again in a moment.</p><button data-testid="button-blog-retry" onClick={() => refetch()} className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white"><RefreshCw className="h-4 w-4" /> Try again</button></div>}
          {!isLoading && !isError && filtered.length === 0 && <div data-testid="status-blog-empty" className="rounded-3xl border border-primary/10 bg-white p-16 text-center"><BookOpen className="mx-auto h-8 w-8 text-secondary" /><p className="mt-5 font-serif text-2xl text-primary">No guides match that search.</p><button data-testid="button-blog-clear-search" onClick={() => setSearch("")} className="mt-5 text-sm font-semibold text-secondary underline underline-offset-4">Clear search</button></div>}
          <div className="grid gap-6 md:grid-cols-2">{filtered.map((post: BlogPostSummary, index) => <BlogCard key={post.slug} post={post} featured={index === 0} />)}</div>
        </section>
      </main>
    </Layout>
  );
}