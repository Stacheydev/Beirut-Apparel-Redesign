/**
 * Instant search over products, collections (edits) and looks.
 * Pure function over the catalog — debouncing lives in the overlay component.
 */
import {
  ALL_COLLECTIONS,
  ALL_LOOKS,
  ALL_PRODUCTS,
} from "@/lib/catalog";
import type { Collection, Look, Product } from "@/types/catalog";

export interface SearchResults {
  products: Product[];
  collections: Collection[];
  looks: Look[];
}

export function searchAll(query: string, limit = 6): SearchResults {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return { products: [], collections: [], looks: [] };

  const hits = (text: string) => text.toLowerCase().includes(q);

  const products = ALL_PRODUCTS.filter(
    (p) =>
      hits(p.title) ||
      hits(p.category) ||
      hits(p.colorFamily ?? "") ||
      hits(p.material ?? "") ||
      p.tags.some((t) => hits(t)),
  ).slice(0, limit);

  const collections = ALL_COLLECTIONS.filter((c) => hits(c.title)).slice(0, 4);

  const looks = ALL_LOOKS.filter(
    (l) => hits(l.title) || hits(l.tagline) || hits(l.mood),
  ).slice(0, 3);

  return { products, collections, looks };
}
