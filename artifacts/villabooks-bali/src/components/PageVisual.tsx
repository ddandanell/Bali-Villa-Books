import type { PageImagery } from "@/lib/page-imagery";

type PageVisualProps = {
  imagery?: PageImagery;
  priority?: boolean;
  className?: string;
};

export function PageVisual({ imagery, priority = false, className = "" }: PageVisualProps) {
  if (!imagery) return null;
  return (
    <figure className={`overflow-hidden rounded-[1.75rem] border border-primary-foreground/15 bg-primary/20 shadow-xl ${className}`}>
      <img
        src={imagery.imageUrl}
        alt={imagery.imageAlt}
        width={imagery.width}
        height={imagery.height}
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        className="aspect-[8/5] w-full object-cover"
      />
      {imagery.caption && (
        <figcaption className="bg-primary/90 px-4 py-3 text-xs leading-5 text-primary-foreground/65 sm:px-5">
          {imagery.caption}
        </figcaption>
      )}
    </figure>
  );
}
