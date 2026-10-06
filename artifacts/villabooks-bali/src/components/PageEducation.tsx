import { Link } from "wouter";
import { pageEducation } from "@/lib/page-education";

export function PageEducation({ path }: { path: string }) {
  const sections = pageEducation[path];
  if (!sections) return null;
  return <section aria-label="Practical information" className="border-t border-primary/10 bg-accent/25">
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 md:px-8 lg:grid-cols-2 sm:py-20">
      {sections.map(section => <div key={section.heading}>
        <h2 className="font-serif text-3xl leading-tight text-primary">{section.heading}</h2>
        {section.paragraphs.map(paragraph => <p key={paragraph} className="mt-5 text-sm leading-7 text-foreground/75">{paragraph}</p>)}
        {!!section.links?.length && <nav aria-label={`More about ${section.heading}`} className="mt-6 flex flex-col items-start gap-4">
          {section.links.map(([label, href]) => <Link key={href} href={href} className="text-sm font-semibold text-primary underline decoration-secondary/60 underline-offset-4">{label}</Link>)}
        </nav>}
      </div>)}
    </div>
  </section>;
}
