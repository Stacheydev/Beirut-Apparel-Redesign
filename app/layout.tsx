import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

import { StoreProvider } from "@/lib/store-context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Toast } from "@/components/layout/Toast";
import { SITE } from "@/lib/catalog";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.store.name} — Sun-washed Pieces for the Everyday`,
    template: `%s | ${SITE.store.name} Concept`,
  },
  description:
    "Independent redesign concept by NorthBound for Beirut Apparel — a Lebanese label founded in 2019. An inspiration-led fashion storefront: linen, satin, swimwear and seasonal edits, built with React, TypeScript and Next.js.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <StoreProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-lagoon focus:px-4 focus:py-2 focus:font-bold focus:text-lagoon-ink"
          >
            Skip to content
          </a>
          <Header />
          <CartDrawer />
          <SearchOverlay />
          <MobileMenu />
          <Toast />
          <main id="main">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
