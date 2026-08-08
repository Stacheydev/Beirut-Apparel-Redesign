import Link from "next/link";
import { Instagram } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Newsletter } from "@/components/sections/Newsletter";
import { getCollection, MERCHANDISING, SITE } from "@/lib/catalog";

function navItems(handles: string[]) {
  return handles
    .map((h) => getCollection(h))
    .filter((c) => c && (c.productHandles?.length ?? 0) > 0)
    .map((c) => ({
      label: c!.title,
      href: `/collections/${c!.handle}`,
    }));
}

export function Footer() {
  const shop = navItems(MERCHANDISING.nav.shop ?? []);
  const edits = navItems(MERCHANDISING.nav.edits ?? []);
  const sale = navItems(MERCHANDISING.nav.sale ?? []);

  return (
    <footer className="mt-24 border-t border-line bg-ink text-paper">
      <div className="shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo tone="light" />
          <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-paper/60">
            {SITE.footer.about}
          </p>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 border-b border-paper/30 pb-1 font-sans text-[12px] uppercase tracking-[0.16em] text-paper/80 transition-colors hover:border-paper hover:text-paper"
          >
            <Instagram className="h-4 w-4" strokeWidth={1.5} />
            {SITE.footer.socialNote}
          </a>
        </div>

        <div>
          <p className="eyebrow mb-4 text-paper/50">Shop</p>
          <ul className="space-y-2.5">
            {shop.slice(0, 8).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[14px] text-paper/80 transition-colors hover:text-paper"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4 text-paper/50">The Edits</p>
          <ul className="space-y-2.5">
            {edits.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[14px] text-paper/80 transition-colors hover:text-paper"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {sale.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[14px] text-terracotta transition-colors hover:text-paper"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4 text-paper/50">Help</p>
          <ul className="space-y-2.5">
            <li>
              <Link href="/story" className="text-[14px] text-paper/80 transition-colors hover:text-paper">
                Our Story
              </Link>
            </li>
            <li>
              <Link href="/exchange-policy" className="text-[14px] text-paper/80 transition-colors hover:text-paper">
                Exchange Policy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-[14px] text-paper/80 transition-colors hover:text-paper">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/search" className="text-[14px] text-paper/80 transition-colors hover:text-paper">
                Search
              </Link>
            </li>
          </ul>
          <div className="mt-8">
            <Newsletter dark />
          </div>
        </div>
      </div>

      <div className="border-t border-paper/15">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="font-sans text-[12px] text-paper/50">
            © {new Date().getFullYear()} Beirut Apparel · Founded in Beirut, {SITE.store.founded}
          </p>
          <p className="max-w-md text-center font-sans text-[11px] leading-relaxed text-paper/35 sm:text-right">
            {SITE.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
