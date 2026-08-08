"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useUI } from "@/lib/store-context";
import { searchAll } from "@/lib/search";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatMoney } from "@/lib/format";

/** Debounced instant search overlay across products, edits and looks. */
export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUI();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setQuery("");
    setDebounced("");
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [searchOpen, setSearchOpen]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 180);
    return () => clearTimeout(t);
  }, [query]);

  if (!searchOpen) return null;

  const results = searchAll(debounced);

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-ink/40 px-4 pt-0 animate-fade-in sm:pt-24">
      <div className="h-full w-full max-w-3xl animate-fade-up bg-paper shadow-lift">
        <div className="flex items-center gap-4 border-b border-line px-5 py-4">
          <Search className="h-5 w-5 shrink-0 text-muted" strokeWidth={1.5} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search linen, satin, abayas, looks…"
            aria-label="Search"
            className="w-full bg-transparent font-display text-xl text-ink outline-none placeholder:text-muted/60"
          />
          <button
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            className="p-1.5 text-muted hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
          {debounced.length < 2 ? (
            <p className="py-10 text-center font-sans text-[13px] text-muted">
              Try “linen”, “shimmer”, “abaya” or “beach”…
            </p>
          ) : (
            <div className="space-y-6">
              {results.products.length > 0 && (
                <div>
                  <p className="eyebrow mb-3 text-muted">Pieces</p>
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {results.products.map((p) => (
                      <li key={p.handle}>
                        <Link
                          href={`/product/${p.handle}`}
                          onClick={() => setSearchOpen(false)}
                          className="group flex items-center gap-3 border border-line-soft bg-surface p-2 transition-colors hover:border-ink/30"
                        >
                          <div className="relative aspect-[3/4] w-12 shrink-0 overflow-hidden bg-sand">
                            {p.images[0] && (
                              <ProductImage
                                src={p.images[0].url}
                                alt={p.title}
                                className="h-full w-full"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-sans text-[13px] font-medium text-ink">
                              {p.title}
                            </p>
                            <p className="text-[12px] text-muted">
                              {formatMoney(p.price.amount)}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(results.collections.length > 0 || results.looks.length > 0) && (
                <div className="grid gap-6 sm:grid-cols-2">
                  {results.collections.length > 0 && (
                    <div>
                      <p className="eyebrow mb-3 text-muted">Edits</p>
                      <ul className="space-y-2">
                        {results.collections.map((c) => (
                          <li key={c.handle}>
                            <Link
                              href={`/collections/${c.handle}`}
                              onClick={() => setSearchOpen(false)}
                              className="text-[14px] text-ink underline-offset-4 hover:text-lagoon hover:underline"
                            >
                              {c.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {results.looks.length > 0 && (
                    <div>
                      <p className="eyebrow mb-3 text-muted">Looks</p>
                      <ul className="space-y-2">
                        {results.looks.map((l) => (
                          <li key={l.handle}>
                            <Link
                              href={`/looks/${l.handle}`}
                              onClick={() => setSearchOpen(false)}
                              className="text-[14px] text-ink underline-offset-4 hover:text-lagoon hover:underline"
                            >
                              {l.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {results.products.length === 0 &&
                results.collections.length === 0 &&
                results.looks.length === 0 && (
                  <p className="py-10 text-center font-sans text-[13px] text-muted">
                    Nothing found for “{debounced}”.
                  </p>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
