/**
 * Catalog domain types — the single source of truth for how the UI consumes
 * Beirut Apparel product data. These mirror Shopify's object model (Product /
 * Variant / Collection / Money / CartLine) so the mock data layer in
 * `lib/catalog.ts` can later be re-implemented against the Shopify Storefront
 * API without touching any UI component.
 */

/** ISO 4217 currency codes used by the store. */
export type CurrencyCode = "USD";

/** Money value with its currency. Amounts are in the minor unit (cents). */
export interface Money {
  amount: number;
  currencyCode: CurrencyCode;
}

/** Price pair used for sale/compare-at display. */
export interface Price {
  /** Current selling price (the from-price when variants differ). */
  price: Money;
  /** Optional strikethrough / original price. */
  compareAtPrice?: Money | null;
}

/** A single product image. */
export interface ProductImage {
  /** Absolute URL to the image asset. */
  url: string;
  /** Short descriptive alt text. */
  altText: string | null;
}

/**
 * Available product variants. Beirut Apparel's real sizing model is a small
 * set of buckets — typically "XS-S" and "M-L" (sometimes One Size; swimwear
 * uses S / M / L). Option1 is the size label.
 */
export interface ProductVariant {
  id: string;
  title: string;
  sku?: string | null;
  /** Size bucket label, e.g. "XS-S" | "M-L" | "One Size". */
  size: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice?: Money | null;
}

/** A product in the catalog. Fields map 1:1 onto Shopify `Product`. */
export interface Product {
  id: string;
  /** Human-readable name. */
  title: string;
  /** URL-safe identifier: `/products/[handle]`. */
  handle: string;
  /** Primary category, e.g. "Linen" | "Swimwear" | "Abayas". */
  category: string;
  /** Real fabric family derived from the reference listing, e.g. "100% Linen". */
  material?: string | null;
  /** Coordinating color family derived from real titles, e.g. "Bronzed Dune". */
  colorFamily?: string | null;
  /** Short plain-text description from the reference store. May be empty. */
  description: string;
  price: Money;
  compareAtPrice?: Money | null;
  /** Always contains at least one image (placeholder used when missing). */
  images: ProductImage[];
  variants: ProductVariant[];
  /** Free-form tags, e.g. ["best-seller", "new", "sale"]. */
  tags: string[];
  /** Collections (edits) this product belongs to, by collection handle. */
  collections: string[];
  availableForSale: boolean;
  /** Canonical source URL on the reference store. */
  sourceUrl?: string;
}

/** A collection: category, edit (editorial drop) or sale grouping. */
export interface Collection {
  id: string;
  title: string;
  handle: string;
  type: "category" | "edit" | "sale";
  /** Real editorial intro text from the reference store. */
  description?: string;
  /** Curated cover image (product photo or edit key visual). */
  image?: string;
  /** Product handles in this collection. */
  productHandles?: string[];
  /** Suggested nav ordering within a group. */
  sort?: number;
}

/* ------------------------------------------------------------------ */
/* Looks / Shop-the-Look                                               */
/* ------------------------------------------------------------------ */

/** Role of a product within an outfit — drives "Complete the look". */
export type LookRole =
  | "top"
  | "bottom"
  | "set"
  | "dress"
  | "outer"
  | "swim"
  | "abaya"
  | "accessory";

export interface LookItem {
  productHandle: string;
  role: LookRole;
  /** Optional stylist note for this piece. */
  note?: string;
}

/** An outfit composition built from real coordinating separates. */
export interface Look {
  id: string;
  title: string;
  handle: string;
  /** Editorial one-liner shown on the look card. */
  tagline: string;
  /** Longer editorial copy for the look page. */
  description: string;
  mood: string;
  /** Cover image (the editorial outfit shot). */
  image: string;
  /** Ordered pieces that compose the outfit. */
  items: LookItem[];
}

/** A mood/occasion discovery path — maps to real categories. */
export interface Mood {
  id: string;
  title: string;
  handle: string;
  tagline: string;
  description: string;
  /** Category handles that back this mood. */
  categories: string[];
}

/* ------------------------------------------------------------------ */
/* Cart                                                                */
/* ------------------------------------------------------------------ */

export interface CartLine {
  id: string;
  productId: string;
  productHandle: string;
  variantId?: string;
  title: string;
  size?: string;
  image?: ProductImage;
  quantity: number;
  price: Money;
  compareAtPrice?: Money | null;
}

export interface Cart {
  id: string;
  lines: CartLine[];
  subtotal: Money;
  totalQuantity: number;
  note?: string;
}

/* ------------------------------------------------------------------ */
/* Recommendations                                                     */
/* ------------------------------------------------------------------ */

export type RecommendationType =
  | "complete-the-look"
  | "related"
  | "best-sellers"
  | "new-arrivals";

export interface ProductRecommendation {
  type: RecommendationType;
  productId: string;
  score?: number;
}
