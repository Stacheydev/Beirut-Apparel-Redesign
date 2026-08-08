import type { MetadataRoute } from "next";
import { ALL_COLLECTIONS, ALL_LOOKS, ALL_PRODUCTS, MOODS } from "@/lib/catalog";

const base = "https://beirutapparel-concept.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/shop", "/looks", "/story", "/search", "/wishlist", "/exchange-policy", "/contact"].map(
    (p) => ({
      url: `${base}${p}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.7,
    }),
  );

  const products = ALL_PRODUCTS.map((p) => ({
    url: `${base}/product/${p.handle}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const collections = ALL_COLLECTIONS.map((c) => ({
    url: `${base}/collections/${c.handle}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const looks = ALL_LOOKS.map((l) => ({
    url: `${base}/looks/${l.handle}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const moods = MOODS.map((m) => ({
    url: `${base}/moods/${m.handle}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...products, ...collections, ...looks, ...moods];
}
