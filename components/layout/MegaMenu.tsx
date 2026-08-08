import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";

export interface MegaItem {
  label: string;
  href: string;
  caption?: string;
}

interface MegaMenuProps {
  items: MegaItem[];
  featured?: { image: string; title: string; href: string; caption?: string };
}

/**
 * Dropdown panel for Shop / The Edits. Renders full-width below the header bar.
 * Solid bg-paper ensures no bleed-through from page content.
 */
export function MegaMenu({ items, featured }: MegaMenuProps) {
  const mid = Math.ceil(items.length / 2);
  const col1 = items.slice(0, mid);
  const col2 = items.slice(mid);

  return (
    <div className="absolute inset-x-0 top-full z-50 border-t border-line shadow-lift animate-fade-in">
      <div className="bg-paper">
        <div className="shell grid grid-cols-12 gap-8 py-10">
          <div className="col-span-8 grid grid-cols-2 gap-x-10 gap-y-1">
            {[col1, col2].map((col, ci) => (
              <ul key={ci} className="space-y-0.5">
                {col.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-baseline justify-between gap-4 border-b border-line-soft py-2.5"
                    >
                      <span className="font-sans text-[14px] font-medium text-ink transition-colors group-hover:text-lagoon">
                        {item.label}
                      </span>
                      {item.caption && (
                        <span className="shrink-0 font-sans text-[11px] uppercase tracking-[0.14em] text-muted">
                          {item.caption}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
          {featured?.image && (
            <div className="col-span-4">
              <Link href={featured.href} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <ProductImage
                    src={featured.image}
                    alt={featured.title}
                    className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <p className="mt-3 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-ink">
                  {featured.title}
                </p>
                {featured.caption && (
                  <p className="mt-0.5 text-[13px] text-muted">{featured.caption}</p>
                )}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
