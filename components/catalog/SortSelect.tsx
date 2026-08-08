"use client";

import { ChevronDown } from "lucide-react";
import type { SortOption } from "@/lib/catalog";

const options: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "name-asc", label: "Alphabetically, A–Z" },
  { value: "name-desc", label: "Alphabetically, Z–A" },
];

export function SortSelect({
  value,
  onChange,
  count,
}: {
  value: SortOption;
  onChange: (v: SortOption) => void;
  count: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="hidden font-sans text-[12px] text-muted sm:inline">
        {count} pieces
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          aria-label="Sort products"
          className="appearance-none border border-line bg-surface py-2 pl-4 pr-9 font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-ink outline-none transition-colors hover:border-ink focus:border-ink"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}
