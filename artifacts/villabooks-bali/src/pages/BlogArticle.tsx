import { useEffect, useRef } from "react";
import { updateShareImage } from "@/lib/social-images";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Clock3, MessageCircle, RefreshCw } from "lucide-react";
import { getGetBlogPostQueryKey, useGetBlogPost, useRecordBlogEvent } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { BlogCard } from "@/components/BlogCard";
import { trackEvent } from "@/lib/analytics";
import { journalImagery } from "@/lib/page-imagery";

const WA = "https://wa.me/6281237402292";
const wa = (message: string) => `${WA}?text=${encodeURIComponent(message)}`;

export default function BlogArticle() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError, refetch } = useGetBlogPost(slug, { query: { queryKey: getGetBlogPostQueryKey(slug), enabled: !!slug } });
  const imagery = journalImagery[slug]?.imageUrl === post?.imageUrl ? journalImagery[slug] : undefined;
  const event = useRecordBlogEvent();
  const complete = useRef(false);
  useEffect(() => {
    if (!post) return;
    document.title = `${post.metaTitle || post.title} | Bali Accounting`;
    complete.current = false;
    const canonical = `https://bali-villa-accounting-service.com/blog/${encodeURIComponent(slug)}`;
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonical);
    for (const [property, value] of Object.entries({ "og:title": post.metaTitle, "og:description": post.metaDescription, "og:url": canonical, "og:image": new URL(post.imageUrl, "https://bali-villa-accounting-service.com").href, "og:type": "article" })) {
      document.querySelector(`meta[property="${property}"]`)?.setAttribute("content", value);
    }
    for (const [name, value] of Object.entries({ "twitter:title": post.metaTitle, "twitter:description": post.metaDescription, "twitter:url": canonical, "twitter:image": new URL(post.imageUrl, "https://bali-villa-accounting-service.com").href })) {
      document.querySelector(`meta[name="${name}"]`)?.setAttribute("content", value);
    }
    const description = document.querySelector('meta[name="description"]');
    updateShareImage(`/blog/${slug}`, post);
    description?.setAttribute("content", post.metaDescription || post.excerpt);
    event.mutate({ data: { slug, eventType: "article_view" } });
      trackEvent("blog_view", { page: `/blog/${slug}`, placement: "article" });
    const onScroll = () => {
      if (!complete.current && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 160) {
         complete.current = true; event.mutate({ data: { slug, eventType: "article_scroll_complete" } }); trackEvent("article_completion", { page: `/blog/${slug}`, placement: "article_end" });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // A prerendered article already arrives with BlogPosting in its server JSON-LD block.
    // Appending another here would leave two BlogPosting nodes for one URL.
    const serverRendered = (window as Window & { __BLOG_INITIAL__?: { static?: boolean } }).__BLOG_INITIAL__?.static === true;
    let schema: HTMLScriptElement | undefined;
    if (!serverRendered) {
      schema = document.createElement("script");
      schema.type = "application/ld+json";
      schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.metaDescription, image: new URL(post.imageUrl, "https://bali-villa-accounting-service.com").href, datePublished: post.publishedAt, dateModified: post.updatedAt, author: { "@type": "Organization", name: "Bali Accounting" }, mainEntityOfPage: canonical });
      document.head.appendChild(schema);
    }
    return () => { window.removeEventListener("scroll", onScroll); schema?.remove(); };
  }, [post, slug]);
  if (isLoading) return <Layout><section className="container mx-auto max-w-4xl px-5 pb-24 pt-40"><div className="h-8 w-32 animate-pulse rounded bg-primary/10" /><div className="mt-8 h-28 animate-pulse rounded bg-primary/10" /><div className="mt-10 space-y-3"><div className="h-4 animate-pulse rounded bg-primary/10" /><div className="h-4 animate-pulse rounded bg-primary/10" /><div className="h-4 w-2/3 animate-pulse rounded bg-primary/10" /></div></section></Layout>;
  if (isError || !post) return <Layout><section className="container mx-auto max-w-3xl px-5 pb-24 pt-40 text-center"><p className="font-serif text-3xl text-primary">This guide could not be found.</p><button data-testid="button-article-retry" onClick={() => refetch()} className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white"><RefreshCw className="h-4 w-4" /> Try again</button></section></Layout>;
  const clickWhatsApp = () => { event.mutate({ data: { slug, eventType: "article_cta_click" } }); trackEvent("whatsapp_click", { page: `/blog/${slug}`, placement: "article_cta" }); trackEvent("consultation_click", { page: `/blog/${slug}`, placement: "article_cta" }); };
  const topic = `${post.title} ${post.primaryKeyword} ${post.category}`.toLowerCase();
  const contextualServices: [string, string][] =
    /airbnb|booking|payout|ota|channel/.test(topic)
      ? [["Booking-channel bookkeeping", "/airbnb-bookkeeping-bali"], ["Monthly owner reporting", "/villa-financial-reporting-bali"]]
      : /cleanup|catch.?up|missing record|receipt|reconciliation/.test(topic)
        ? [["Historical bookkeeping cleanup", "/villa-bookkeeping-cleanup-bali"], ["Monthly owner reporting", "/villa-financial-reporting-bali"]]
        : /pt pma|company|entity/.test(topic)
          ? [["PT PMA bookkeeping", "/pt-pma-villa-bookkeeping"], ["Monthly owner reporting", "/villa-financial-reporting-bali"]]
          : /payroll|bpjs|staff/.test(topic)
            ? [["Payroll and BPJS record tracking", "/villa-payroll-records-bali"], ["Monthly owner reporting", "/villa-financial-reporting-bali"]]
            : /report|profit|cash|expense|financial/.test(topic)
              ? [["Monthly owner reporting", "/villa-financial-reporting-bali"], ["See a sample report", "/sample-report"]]
              : [["Explore bookkeeping services", "/services"], ["Compare package pricing", "/pricing"]];
  return <Layout><div className="bg-background">
    <header className="container mx-auto max-w-5xl px-5 pb-14 pt-36 md:px-8">
      <Link href="/blog" data-testid="link-back-blog" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary"><ArrowLeft className="h-4 w-4" /> All guides</Link>
      <div className="mt-10 max-w-4xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">{post.category}</p><h1 data-testid="text-article-title" className="mt-5 text-4xl leading-[1.05] text-primary sm:text-6xl">{post.title}</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-foreground/65">{post.excerpt}</p><div className="mt-7 flex items-center gap-3 text-sm text-foreground/45"><Clock3 className="h-4 w-4" /> {post.readTimeMinutes} minute read <span>·</span> {new Date(post.publishedAt).toLocaleDateString("en-US", { dateStyle: "long", timeZone: "Asia/Makassar" })}</div></div>
       <figure className="mt-10 overflow-hidden rounded-[2rem]">
       <img src={imagery?.imageUrl ?? post.imageUrl} alt={imagery?.imageAlt ?? post.imageAlt} width={imagery?.width ?? 1200} height={imagery?.height ?? 750} fetchPriority="high" loading="eager" className="aspect-[16/9] w-full object-cover" />
       {imagery?.caption && <figcaption className="px-1 pt-4 text-sm leading-6 text-foreground/60">{imagery.caption}</figcaption>}
       </figure>
      <p className="mt-5 text-sm leading-6 text-foreground/60">By Bali Accounting editorial desk · Editorial updated {new Date(post.updatedAt).toLocaleDateString("en-US", { dateStyle: "long", timeZone: "Asia/Makassar" })}. General information, not a claim of licensed professional review.</p>
    </header>
    <div className="container mx-auto grid max-w-7xl gap-14 px-5 pb-24 md:grid-cols-[minmax(0,760px)_280px] md:px-8">
       <div className="min-w-0">
         <article data-testid="article-content" className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-normal prose-headings:text-primary prose-p:leading-8 prose-p:text-foreground/75 prose-a:text-secondary prose-strong:text-primary prose-table:block prose-table:overflow-x-auto" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
         <nav aria-label="Related bookkeeping services" className="mt-10 rounded-2xl border border-primary/10 bg-white p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-secondary">Related support</p><h2 className="mt-2 font-serif text-2xl text-primary">Put this guide into practice</h2><div className="mt-5 flex flex-wrap gap-x-7 gap-y-3">{contextualServices.map(([label, href]) => <Link key={href} href={href} className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline decoration-secondary/50 underline-offset-4 hover:text-secondary">{label}<ArrowRight className="h-4 w-4" /></Link>)}</div></nav>
       </div>
      <aside className="md:pt-3"><div className="sticky top-28 rounded-[1.75rem] bg-primary p-7 text-primary-foreground shadow-xl"><MessageCircle className="mb-6 h-6 w-6 text-secondary" /><h2 className="text-2xl leading-tight">Build a clearer monthly view.</h2><p className="mt-3 text-sm leading-6 text-primary-foreground/65">Speak with Client Advisory about a structured bookkeeping and reporting process for your property.</p><a data-testid="link-article-whatsapp" onClick={clickWhatsApp} href={wa(`Hello Client Advisory, I just read "${post.title}" and have a question about my villa books.`)} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-bold text-white transition-transform hover:-translate-y-0.5"><MessageCircle className="h-4 w-4" /> Request a Consultation</a></div></aside>
    </div>
    {post.relatedPosts?.length > 0 && <section className="border-t border-primary/10 bg-accent/40 py-20"><div className="container mx-auto max-w-7xl px-5 md:px-8"><div className="mb-8 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Keep reading</p><h2 className="mt-2 text-3xl text-primary">More from the ledger</h2></div><ArrowRight className="h-5 w-5 text-secondary" /></div><div className="grid gap-6 md:grid-cols-3">{post.relatedPosts.map((related) => <BlogCard key={related.slug} post={related} />)}</div></div></section>}
   </div></Layout>;
}