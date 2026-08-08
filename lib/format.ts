import type { Money } from "@/types/catalog";

/** Format cents as USD, e.g. 4800 -> "$48.00". */
export function formatMoney(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function formatMoneyObj(money: Money | undefined | null): string {
  if (!money) return "";
  return formatMoney(money.amount);
}

/** "% off" between compare-at and sale price. */
export function discountPercent(priceCents: number, compareAtCents?: number | null): number | null {
  if (compareAtCents == null || compareAtCents <= 0 || priceCents >= compareAtCents) {
    return null;
  }
  return Math.round((1 - priceCents / compareAtCents) * 100);
}

/** Slugify a string for URL handles. */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
