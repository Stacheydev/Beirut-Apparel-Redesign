import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { formatMoney } from "@/lib/format";

interface CollectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  count?: number;
  priceRange?: { min: number; max: number };
  crumbs?: { label: string; href?: string }[];
}

/** Editorial collection header — magazine-style, not a template banner. */
export function CollectionHeader({
  eyebrow,
  title,
  description,
  count,
  priceRange,
  crumbs,
}: CollectionHeaderProps) {
  return (
    <header className="border-b border-line bg-sand/40">
      <div className="shell pb-10 pt-8 sm:pb-14 sm:pt-12">
        {crumbs && crumbs.length > 0 && (
          <Breadcrumbs crumbs={crumbs} className="mb-8" />
        )}
        <p className="eyebrow mb-4 text-muted">{eyebrow}</p>
        <h1 className="display max-w-3xl text-4xl text-balance text-ink sm:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base">
            {description}
          </p>
        )}
        {(count != null || priceRange) && (
          <p className="mt-5 flex flex-wrap gap-x-6 gap-y-1 font-sans text-[12px] uppercase tracking-[0.14em] text-muted">
            {count != null && <span>{count} pieces</span>}
            {priceRange && priceRange.max > 0 && (
              <span>
                {formatMoney(priceRange.min)} – {formatMoney(priceRange.max)}
              </span>
            )}
          </p>
        )}
      </div>
    </header>
  );
}
