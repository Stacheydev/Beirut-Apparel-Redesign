import type { Metadata } from "next";
import { CollectionHeader } from "@/components/catalog/CollectionHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { LookCard } from "@/components/looks/LookCard";
import { searchAll } from "@/lib/search";

export const metadata: Metadata = {
  title: "Search",
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const results = searchAll(q, 12);

  return (
    <>
      <CollectionHeader
        eyebrow="Search"
        title={q ? `Results for “${q}”` : "Search Beirut Apparel"}
        description={
          q
            ? `${results.products.length} pieces · ${results.collections.length} edits · ${results.looks.length} looks`
            : "Find pieces, edits and styled looks."
        }
        crumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
      />
      <div className="shell py-12">
        {q.length < 2 ? (
          <p className="py-16 text-center font-sans text-[14px] text-muted">
            Try searching for “linen”, “shimmer”, “abaya” or “beach”.
          </p>
        ) : (
          <div className="space-y-14">
            {results.products.length > 0 && (
              <section>
                <p className="eyebrow mb-6 text-muted">Pieces</p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
                  {results.products.map((p) => (
                    <li key={p.handle}>
                      <ProductCard product={p} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {results.collections.length > 0 && (
              <section>
                <p className="eyebrow mb-6 text-muted">Edits</p>
                <div className="flex flex-wrap gap-3">
                  {results.collections.map((c) => (
                    <a
                      key={c.handle}
                      href={`/collections/${c.handle}`}
                      className="border border-line bg-surface px-5 py-3 font-sans text-[13px] font-medium text-ink transition-colors hover:border-ink"
                    >
                      {c.title}
                    </a>
                  ))}
                </div>
              </section>
            )}

            {results.looks.length > 0 && (
              <section>
                <p className="eyebrow mb-6 text-muted">Looks</p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {results.looks.map((l) => (
                    <LookCard key={l.handle} look={l} />
                  ))}
                </div>
              </section>
            )}

            {results.products.length === 0 &&
              results.collections.length === 0 &&
              results.looks.length === 0 && (
                <p className="py-16 text-center font-sans text-[14px] text-muted">
                  Nothing found for “{q}”.
                </p>
              )}
          </div>
        )}
      </div>
    </>
  );
}
