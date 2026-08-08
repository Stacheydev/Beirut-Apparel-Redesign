"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { FilterOptions } from "@/lib/catalog";
import { cn } from "@/lib/cn";

export interface ActiveFilters {
  categories: string[];
  colorFamilies: string[];
  available: boolean;
  onSale: boolean;
  minPrice: number | null;
  maxPrice: number | null;
}

interface FilterPanelProps {
  options: FilterOptions;
  filters: ActiveFilters;
  onChange: (next: ActiveFilters) => void;
  className?: string;
}

function Toggle({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between border px-3 py-2 font-sans text-[12px] uppercase tracking-[0.12em] transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line text-ink hover:border-ink/40",
      )}
      aria-pressed={active}
    >
      <span>{label}</span>
      {count != null && <span className="opacity-60">{count}</span>}
    </button>
  );
}

export function FilterPanel({ options, filters, onChange, className }: FilterPanelProps) {
  const [open, setOpen] = useState(false);

  const toggle = (key: "categories" | "colorFamilies", value: string) => {
    const list = filters[key];
    const next = list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];
    onChange({ ...filters, [key]: next });
  };

  const hasActive =
    filters.categories.length > 0 ||
    filters.colorFamilies.length > 0 ||
    filters.available ||
    filters.onSale ||
    filters.minPrice != null ||
    filters.maxPrice != null;

  const clear = () =>
    onChange({
      categories: [],
      colorFamilies: [],
      available: false,
      onSale: false,
      minPrice: null,
      maxPrice: null,
    });

  const body = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <Toggle
          label="In stock"
          active={filters.available}
          onClick={() => onChange({ ...filters, available: !filters.available })}
          count={options.inStock}
        />
        <Toggle
          label="On sale"
          active={filters.onSale}
          onClick={() => onChange({ ...filters, onSale: !filters.onSale })}
          count={options.onSale}
        />
      </div>

      <fieldset>
        <legend className="eyebrow mb-3 text-muted">Category</legend>
        <ul className="space-y-1.5">
          {options.categories.map((cat) => (
            <li key={cat.name}>
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat.name)}
                    onChange={() => toggle("categories", cat.name)}
                    className="h-4 w-4 accent-lagoon"
                  />
                  <span className="font-sans text-[13px] text-ink">{cat.name}</span>
                </span>
                <span className="font-sans text-[11px] text-muted">{cat.count}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      {options.colorFamilies.length > 1 && (
        <fieldset>
          <legend className="eyebrow mb-3 text-muted">Colour family</legend>
          <ul className="space-y-1.5">
            {options.colorFamilies.map((cf) => (
              <li key={cf.name}>
                <label className="flex cursor-pointer items-center justify-between gap-3">
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={filters.colorFamilies.includes(cf.name)}
                      onChange={() => toggle("colorFamilies", cf.name)}
                      className="h-4 w-4 accent-lagoon"
                    />
                    <span className="font-sans text-[13px] text-ink">{cf.name}</span>
                  </span>
                  <span className="font-sans text-[11px] text-muted">{cf.count}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      )}

      <fieldset>
        <legend className="eyebrow mb-3 text-muted">Price</legend>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={filters.minPrice ?? ""}
            placeholder={String(options.priceBounds.min)}
            onChange={(e) =>
              onChange({
                ...filters,
                minPrice: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="w-full border border-line bg-surface px-3 py-2 font-sans text-[13px] text-ink outline-none focus:border-ink"
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            value={filters.maxPrice ?? ""}
            placeholder={String(options.priceBounds.max)}
            onChange={(e) =>
              onChange({
                ...filters,
                maxPrice: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="w-full border border-line bg-surface px-3 py-2 font-sans text-[13px] text-ink outline-none focus:border-ink"
          />
        </div>
      </fieldset>

      {hasActive && (
        <button
          onClick={clear}
          className="inline-flex items-center gap-1.5 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-terracotta hover:text-terracotta-deep"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} /> Clear all
        </button>
      )}
    </div>
  );

  return (
    <div className={className}>
      {/* Mobile trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="mb-4 inline-flex items-center gap-2 border border-ink px-4 py-2 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-ink lg:hidden"
        aria-expanded={open}
      >
        <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
        Filters{hasActive ? " · " + (filters.categories.length + filters.colorFamilies.length) : ""}
      </button>
      <div className={cn(open ? "block" : "hidden lg:block")}>{body}</div>
    </div>
  );
}
