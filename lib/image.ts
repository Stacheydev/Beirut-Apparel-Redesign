/**
 * Shopify CDN image helpers — generates properly-sized, WebP-optimized URLs
 * from the original product image path. No build-time fetching needed;
 * the CDN serves on-demand resized images with WebP.
 *
 * Shopify CDN accepts: ?width=N  — resizes server-side
 *                      ?format=webp — serves WebP variant
 */

const WIDTHS = [480, 768, 1080, 1600] as const;

/** Build a CDN URL with width/format params. */
export function shopifyImg(
  url: string,
  width?: number,
  format?: "webp" | "avif" | "jpg" | "png",
): string {
  const base = url.split("?")[0];
  const params: string[] = [];
  if (width) params.push(`width=${width}`);
  if (format && format !== "jpg") params.push(`format=${format}`);
  return params.length ? `${base}?${params.join("&")}` : base;
}

/** WebP srcSet string (for <source type="image/webp">). */
export function webpSrcSet(url: string): string {
  return WIDTHS.map((w) => `${shopifyImg(url, w, "webp")} ${w}w`).join(", ");
}

/** JPG/AVIF fallback srcSet string (for the <img> fallback). */
export function fallbackSrcSet(url: string): string {
  return WIDTHS.map((w) => `${shopifyImg(url, w)} ${w}w`).join(", ");
}

/** Default sizes attribute — responsive breakpoints. */
export const DEFAULT_SIZES =
  "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";
