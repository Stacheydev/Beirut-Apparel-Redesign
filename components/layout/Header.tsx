"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { MegaMenu, type MegaItem } from "@/components/layout/MegaMenu";
import { getCollection, getProduct, MERCHANDISING } from "@/lib/catalog";
import { useCartCount, useCart, useUI } from "@/lib/store-context";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/* Static data (resolved once at module level)                         */
/* ------------------------------------------------------------------ */

function resolveMega(handles: string[]): MegaItem[] {
  const items: MegaItem[] = [];
  for (const h of handles) {
    const col = getCollection(h);
    if (col && (col.productHandles?.length ?? 0) > 0) {
      items.push({
        label: col.title,
        href: `/collections/${col.handle}`,
        caption: String(col.productHandles?.length ?? 0),
      });
    }
  }
  return items;
}

const shopItems = resolveMega(MERCHANDISING.nav.shop ?? []);
const editItems = resolveMega(MERCHANDISING.nav.edits ?? []);
const saleItems = resolveMega(MERCHANDISING.nav.sale ?? []);

const heroProduct = getProduct(MERCHANDISING.homepage?.heroProductHandle ?? "");
const shopFeatured = heroProduct
  ? {
      image: heroProduct.images[0]?.url ?? "",
      title: "The current edit",
      href: "/collections/postcards-from-summer",
      caption: heroProduct.title,
    }
  : undefined;

const editHandle =
  editItems.length > 0
    ? editItems[0].href.split("/").filter(Boolean).at(-1) ?? ""
    : "";
const editFeatured =
  editItems.length > 0
    ? {
        image: getCollection(editHandle)?.image ?? "",
        title: editItems[0].label,
        href: editItems[0].href,
        caption: "Browse the edit",
      }
    : undefined;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function Header() {
  const pathname = usePathname();
  const cartCount = useCartCount();
  const { setCartOpen } = useCart();
  const { setSearchOpen, setMobileMenuOpen } = useUI();
  const [activeMega, setActiveMega] = useState<null | "shop" | "edits">(null);
  const headerRef = useRef<HTMLElement>(null);

  /* ---- Hover tracking via refs (no stale closures, no render cost) ---- */

  const triggerHover = useRef({ shop: false, edits: false });
  const panelHover = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const anyHover = useCallback(
    () => triggerHover.current.shop || triggerHover.current.edits || panelHover.current,
    [],
  );

  const tryClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      if (!anyHover()) setActiveMega(null);
      closeTimer.current = null;
    }, 100);
  }, [anyHover]);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const onTriggerEnter = useCallback(
    (group: "shop" | "edits") => {
      triggerHover.current[group] = true;
      cancelClose();
      setActiveMega(group);
    },
    [cancelClose],
  );

  const onTriggerLeave = useCallback(
    (group: "shop" | "edits") => {
      triggerHover.current[group] = false;
      tryClose();
    },
    [tryClose],
  );

  const onPanelEnter = useCallback(() => {
    panelHover.current = true;
    cancelClose();
  }, [cancelClose]);

  const onPanelLeave = useCallback(() => {
    panelHover.current = false;
    tryClose();
  }, [tryClose]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // Close on route change
  useEffect(() => {
    setActiveMega(null);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!activeMega) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMega(null);
        cancelClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [activeMega, cancelClose]);

  // Close on click outside header
  useEffect(() => {
    if (!activeMega) return;
    const handleClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveMega(null);
        cancelClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [activeMega, cancelClose]);

  /* ---- Render ---- */

  const navClass = (href: string) =>
    cn(
      "font-sans text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors hover:text-lagoon",
      pathname === href ? "text-lagoon" : "text-ink",
    );

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-ink text-paper">
        <div className="shell flex h-9 items-center justify-center gap-3">
          <Link
            href="/collections/postcards-from-summer"
            className="font-sans text-[11px] uppercase tracking-[0.18em] text-paper/85 transition-colors hover:text-paper"
          >
            The Postcards from Summer edit has landed
          </Link>
          <span className="hidden h-1 w-1 rounded-full bg-lagoon sm:block" aria-hidden />
          <span className="hidden font-sans text-[11px] uppercase tracking-[0.18em] text-paper/60 sm:block">
            Free exchange within 7 days
          </span>
        </div>
      </div>

      {/* Header — ref用于点击外部检测，不依赖 onMouseLeave */}
      <header ref={headerRef} className="sticky top-0 z-40 border-b border-line">
        <div className="relative bg-paper">
          <div className="shell relative flex h-16 items-center justify-between gap-4 sm:h-20">
            {/* Left nav (desktop) */}
            <nav className="hidden flex-1 items-center gap-7 lg:flex" aria-label="Primary">
              <div
                className="h-full"
                onMouseEnter={() => onTriggerEnter("shop")}
                onMouseLeave={() => onTriggerLeave("shop")}
              >
                <Link
                  href="/shop"
                  className={cn(navClass("/shop"), "flex h-full items-center")}
                >
                  Shop
                </Link>
              </div>
              <div
                className="h-full"
                onMouseEnter={() => onTriggerEnter("edits")}
                onMouseLeave={() => onTriggerLeave("edits")}
              >
                <Link
                  href="/shop"
                  className={cn(navClass("/shop"), "flex h-full items-center")}
                >
                  The Edits
                </Link>
              </div>
            </nav>

            {/* Mobile menu button */}
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>

            {/* Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Logo />
            </div>

            {/* Right nav (desktop) + icons */}
            <nav className="flex flex-1 items-center justify-end gap-7" aria-label="Secondary">
              <div className="hidden items-center gap-7 lg:flex">
                <Link href="/looks" className={navClass("/looks")}>
                  Looks
                </Link>
                <Link href="/story" className={navClass("/story")}>
                  Our Story
                </Link>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className="p-1.5 text-ink transition-colors hover:text-lagoon"
                >
                  <Search className="h-5 w-5" strokeWidth={1.5} />
                </button>
                <Link
                  href="/wishlist"
                  aria-label="Wishlist"
                  className="hidden p-1.5 text-ink transition-colors hover:text-lagoon sm:block"
                >
                  <Heart className="h-5 w-5" strokeWidth={1.5} />
                </Link>
                <button
                  onClick={() => setCartOpen(true)}
                  aria-label="Open cart"
                  className="relative p-1.5 text-ink transition-colors hover:text-lagoon"
                >
                  <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-bold text-paper">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </nav>
          </div>

          {/* Mega panels — track panel hover independently */}
          {activeMega === "shop" && shopItems.length > 0 && (
            <div onMouseEnter={onPanelEnter} onMouseLeave={onPanelLeave}>
              <MegaMenu items={shopItems} featured={shopFeatured} />
            </div>
          )}
          {activeMega === "edits" && (
            <div onMouseEnter={onPanelEnter} onMouseLeave={onPanelLeave}>
              <MegaMenu items={[...editItems, ...saleItems]} featured={editFeatured} />
            </div>
          )}
        </div>
      </header>
    </>
  );
}
