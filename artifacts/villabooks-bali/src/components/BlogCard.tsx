import { ArrowUpRight, Clock3 } from "lucide-react";
import { Link } from "wouter";
import type { BlogPostSummary } from "@workspace/api-client-react";
import { journalImagery } from "@/lib/page-imagery";

// The card declares the file it actually serves: local journal heroes are 1200x750 WebP.
// Remote thumbnails have no declared size here, so no width/height attributes are emitted.
function cardVisual(post: BlogPostSummary) {
  const local = journalImagery[post.slug];
  if (local?.imageUrl) return { src: local.imageUrl, alt: local.imageAlt || post.imageAlt, width: local.width, height: local.height };
  if (post.imageUrl.startsWith("/")) return { src: post.imageUrl, alt: post.imageAlt, width: 1200, height: 750 };
  return { src: post.imageUrl, alt: post.imageAlt, width: undefined as number | undefined, height: undefined as number | undefined };
}

export function BlogCard({ post, featured = false }: { post: BlogPostSummary; featured?: boolean }) {
  const visual = cardVisual(post);
  return (
    <article data-testid={`card-blog-${post.slug}`} className={`group ${featured ? "md:col-span-2" : ""}`}>
      <Link href={`/blog/${post.slug}`} data-testid={`link-blog-${post.slug}`} className="block h-full">
        <div className={`relative h-full overflow-hidden rounded-[1.75rem] border border-primary/10 bg-white p-6 transition-all duration-500 group-hover:-translate-y-1 group-hover:border-secondary/40 group-hover:shadow-xl ${featured ? "md:p-8" : ""}`}>
          <img src={visual.src} alt={visual.alt} {...(visual.width ? { width: visual.width, height: visual.height } : {})} loading="lazy" className="mb-6 aspect-[16/9] w-full rounded-2xl object-cover" />
          <div className="mb-8 flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-secondary">
            <span>{post.category}</span>
            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
          <h3 className={`max-w-2xl font-serif leading-tight text-primary ${featured ? "text-3xl sm:text-4xl" : "text-2xl"}`}>{post.title}</h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/65 sm:text-base">{post.excerpt}</p>
          <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-foreground/45">
            <Clock3 className="h-4 w-4" /> {post.readTimeMinutes} min read <span className="mx-1">·</span>
            {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>
      </Link>
    </article>
  );
}