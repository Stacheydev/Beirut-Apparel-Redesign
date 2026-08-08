"use client";

import { useEffect, useMemo, useState } from "react";
import { FilterPanel, type ActiveFilters } from "@/components/catalog/FilterPanel";
import { SortSelect } from "@/components/catalog/SortSelect";
import { Pagination } from "@/components/catalog/Pagination";
import { ProductGrid } from "@/components/product/ProductGrid";
import { filterProducts, getFilterOptions, type SortOption } from "@/lib/catalog";

export type CatalogContext =
  | { kind: "collection"; handle: string }
  | { kind: "mood"; categories: string[] }
  | { kind: "all" };

interface CatalogViewProps {
  context: CatalogContext;
  initialSort?: SortOption;
  pageSize?: number;
}

const emptyFilters: ActiveFilters = {
  categories: [],
  colorFamilies: [],
  available: false,
  onSale: false,
  minPrice: null,
  maxPrice: null,
};

export function CatalogView({ context, initialSort = "featured", pageSize = 24 }: CatalogViewProps) {
  const [filters, setFilters] = useState<ActiveFilters>(emptyFilters);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  const options = useMemo(
    () =>
      getFilterOptions(
        context.kind === "collection" ? { collection: context.handle } : undefined,
      ),
    [context],
  );

  const { products, total, totalPages } = useMemo(() => {
    return filterProducts(
      {
        ...(context.kind === "collection" ? { collection: context.handle } : {}),
        ...(context.kind === "mood" ? { collections: context.categories } : {}),
        category: filters.categories,
        colorFamily: filters.colorFamilies,
        available: filters.available || undefined,
        onSale: filters.onSale || undefined,
        minPrice: filters.minPrice ?? undefined,
        maxPrice: filters.maxPrice ?? undefined,
      },
      sort,
      { page, pageSize },
    );
  }, [context, filters, sort, page, pageSize]);

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <aside className="lg:col-span-3">
        <FilterPanel options={options} filters={filters} onChange={setFilters} />
      </aside>

      <div className="lg:col-span-9">
        <div className="mb-8 flex items-center justify-end border-b border-line pb-4">
          <SortSelect value={sort} onChange={setSort} count={total} />
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} cols={3} />
        ) : (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="font-display text-2xl text-ink">Nothing matches those filters</p>
            <p className="text-[14px] text-muted">Try widening the price range or clearing a filter.</p>
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
