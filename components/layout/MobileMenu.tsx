"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useUI } from "@/lib/store-context";
import { getCollection, getProduct, MERCHANDISING, MOODS } from "@/lib/catalog";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/cn";

function validCollection(handle: string) {
  const c = getCollection(handle);
  return c && (c.productHandles?.length ?? 0) > 0 ? c : null;
}

/** Full-screen mobile menu: primary links, category accordions, moods. */
export function MobileMenu() {
  const { mobileMenuOpen, setMobileMenuOpen } = useUI();

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  if (!mobileMenuOpen) return null;

  const shopLinks = (MERCHANDISING.nav.shop ?? [])
    .map(validCollection)
    .filter(Boolean) as NonNullable<ReturnType<typeof validCollection>>[];

  const editLinks = (MERCHANDISING.nav.edits ?? [])
    .map(validCollection)
    .filter(Boolean) as NonNullable<ReturnType<typeof validCollection>>[];

  const saleCollection = validCollection(MERCHANDISING.nav.sale?.[0] ?? "");
  const heroProduct = getProduct(MERCHANDISING.homepage?.heroProductHandle ?? "");

  const row = (label: string, href: string, active?: boolean) => (
    <Link
      href={href}
      onClick={() => setMobileMenuOpen(false)}
      className={cn(
        "flex items-center justify-between border-b border-line-soft py-4",
        active ? "text-lagoon" : "text-ink",
      )}
    >
      <span className="font-sans text-[15px] font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-paper animate-fade-in lg:hidden">
      <div className="flex h-16 items-center justify-between border-b border-line px-5">
        <Logo />
        <button
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
          className="p-1.5 text-ink"
        >
          <X className="h-6 w-6" strokeWidth={1.5} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-5 pb-8 pt-2" aria-label="Mobile">
        {row("Shop", "/shop")}
        <div className="pl-4">
          {shopLinks.map((c) => (
            <Link
              key={c.handle}
              href={`/collections/${c.handle}`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between border-b border-line-soft/70 py-3"
            >
              <span className="font-sans text-[14px] text-muted">{c.title}</span>
              <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-muted/70">
                {c.productHandles?.length}
              </span>
            </Link>
          ))}
        </div>

        {row("The Edits", "/shop")}
        <div className="pl-4">
          {editLinks.map((c) => (
            <Link
              key={c.handle}
              href={`/collections/${c.handle}`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between border-b border-line-soft/70 py-3"
            >
              <span className="font-sans text-[14px] text-muted">{c.title}</span>
              <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-muted/70">
                {c.productHandles?.length}
              </span>
            </Link>
          ))}
          {saleCollection && (
            <Link
              href={`/collections/${saleCollection.handle}`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between border-b border-line-soft/70 py-3"
            >
              <span className="font-sans text-[14px] font-medium text-terracotta">
                {saleCollection.title}
              </span>
            </Link>
          )}
        </div>

        {row("Looks", "/looks")}
        {row("Our Story", "/story")}

        {/* Moods */}
        <p className="eyebrow mt-8 mb-2 text-muted">Shop the moment</p>
        <div className="grid grid-cols-2 gap-2">
          {MOODS.map((mood) => (
            <Link
              key={mood.handle}
              href={`/moods/${mood.handle}`}
              onClick={() => setMobileMenuOpen(false)}
              className="border border-line bg-surface p-3"
            >
              <span className="block font-sans text-[13px] font-semibold text-ink">
                {mood.title}
              </span>
              <span className="mt-0.5 block text-[11px] text-muted">{mood.tagline}</span>
            </Link>
          ))}
        </div>

        {heroProduct && (
          <Link
            href={`/product/${heroProduct.handle}`}
            onClick={() => setMobileMenuOpen(false)}
            className="mt-6 block"
          >
            <span className="eyebrow text-muted">Featured piece</span>
            <span className="mt-1 block font-display text-xl text-ink">
              {heroProduct.title}
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
}
