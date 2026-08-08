/**
 * Build the typed JSON datasets consumed by the storefront.
 *
 * Reads raw scraped reference data (`data/raw/*.json`) and produces
 * `data/products.json`, `data/collections.json` and `data/looks.json` in the
 * shapes defined by `types/catalog.ts` (mirroring Shopify's object model).
 *
 * Classification rules here are merchandising, not invention:
 *   - category / material / color-family are derived from the product's real
 *     collection membership and its real title text.
 *   - edits are the store's real editorial collections.
 *   - looks are curated from real coordinating separates (same color family).
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAW = path.join(__dirname, "..", "data", "raw");
const OUT = path.join(__dirname, "..", "data");

const rawProducts = JSON.parse(await readFile(path.join(RAW, "products.json"), "utf8"));
const rawCollections = JSON.parse(await readFile(path.join(RAW, "collections.json"), "utf8"));
const placeholder = "/placeholder-product.svg";

/* ------------------------------------------------------------------ */
/* Collection classification (merchandising config)                    */
/* ------------------------------------------------------------------ */

// Highest priority first — a product's category is its most specific real grouping.
const CATEGORY_ORDER = [
  ["linen", "Linen"],
  ["satin-sets", "Satin Sets"],
  ["swimsuits", "Swimwear"],
  ["coastal-canvas-swimwear", "Swimwear"],
  ["beach-essentials", "Swimwear"],
  ["abaya-collection", "Abayas"],
  ["ramadan-collection", "Abayas"],
  ["gingham-sets", "Gingham"],
  ["all-gingham-tops", "Gingham"],
  ["poncho-sets", "Poncho Sets"],
  ["beach-cover-ups", "Beach Cover-Ups"],
  ["knitwear", "Knitwear"],
  ["loungewear", "Loungewear"],
  ["fleece", "Fleece"],
  ["sweat-sets", "Sweats"],
  ["sweatpants", "Sweats"],
  ["sweatshirts", "Sweats"],
  ["hoodies-1", "Sweats"],
  ["legging", "Sweats"],
  ["flared-pants", "Sweats"],
  ["yoga-collection", "Yoga"],
  ["yoga-sets", "Yoga"],
  ["blazer-sets", "Blazer Sets"],
  ["denim", "Denim"],
  ["suede", "Suede"],
  ["jackets-1", "Jackets"],
  ["footwear", "Footwear"],
  ["all-clutches-scrunchies", "Clutches & Bags"],
  ["scrunchies", "Clutches & Bags"],
  ["bag-collection", "Clutches & Bags"],
  ["dresses", "Summer Dresses"],
  ["winter-dresses", "Dresses"],
  ["dresses-1", "Dresses"],
  ["evening", "Evening"],
  ["festive-collection", "Festive"],
  ["matching-sets", "Co-Ords"],
  ["foldover-sets-1", "Co-Ords"],
  ["linen-sets-dresses", "Linen Sets"],
  ["all-chemise", "Chemise"],
  ["all-halter-tops", "Halter Tops"],
  ["all-strapless-tops", "Strapless Tops"],
  ["backless-tops", "Backless Tops"],
  ["cropped-tees", "Cropped Tees"],
  ["all-tshirts", "Tees"],
  ["all-shorts", "Shorts"],
  ["all-pants", "Pants"],
  ["all-tops", "Tops"],
  ["all-bottoms", "Bottoms"],
];

// Title-keyword fallback for pieces only grouped into edits/season collections
// (e.g. Shimmer separates). Derived from the product's real title text.
const CATEGORY_KEYWORDS = [
  [/abaya/i, "Abayas"],
  [/bikini|swimsuit|swimwear|one-piece|bandeau/i, "Swimwear"],
  [/dress/i, "Dresses"],
  [/poncho/i, "Poncho Sets"],
  [/jacket|cardigan|coat|blazer/i, "Jackets"],
  [/clutch|bag|scrunch/i, "Clutches & Bags"],
  [/trousers|pants|skirt|shorts/i, "Bottoms"],
  [/hoodie|sweat|legging|jogger/i, "Sweats"],
  [/knit/i, "Knitwear"],
  [/tank|tee|top|chemise|blouse|crop/i, "Tops"],
  [/cap|beanie|hat/i, "Accessories"],
  [/set/i, "Co-Ords"],
];

const EDITS = [
  ["postcards-from-summer", "Postcards from Summer", 1, "A nostalgic and dreamy collection inspired by colorful Lebanese summers by the sea."],
  ["the-shimmer-edit", "The Shimmer Edit", 2, "Bronzed Dune, Midnight Tides and Terra Glow — shimmering separates for golden hour."],
  ["coastal-canvas-edit", "Coastal Canvas Edit", 3, "Soft coastal canvas separates in Aqua Loop, Ocean and Sea Salt."],
  ["the-polka-edit", "The Polka Edit", 4, "Timeless polka dot pieces, made for summer."],
  ["the-white-edit", "The White Edit", 5, "Sun-washed whites for long Lebanese summers."],
  ["ramadan-collection", "Ramadan Collection", 6, "Refined pieces for Ramadan days and evenings."],
  ["festive-collection", "Festive Collection", 7, "Celebration-ready pieces for the festive season."],
  ["fall-collection-2025", "The Fall Edit", 8, "Knits, loungewear, suede and jackets from the fall archive."],
  ["clearance", "Summer Archive", 9, "Past-season favourites from the summer archives."],
];

const SALE = [
  ["discounted-items", "Special Prices"],
  ["black-friday", "Black Friday"],
  ["black-friday-up-to-50-off", "Fall/Winter 2025"],
];

const categoryByHandle = new Map(CATEGORY_ORDER.map(([h, t]) => [h, t]));

/* ------------------------------------------------------------------ */
/* Derivation rules                                                    */
/* ------------------------------------------------------------------ */

const COLOR_FAMILIES = [
  "Bronzed Dune", "Midnight Tides", "Terra Glow",
  "Glazed Pistachio", "Pistachio Cream", "Chocolate Glaze", "Coral Kiss",
  "Sugar Rose", "Sea Glass", "Black Silk", "Champagne Muse", "Sea Salt",
  "Aegean Sea", "Aqua Loop", "Ocean",
  "Apricot", "Cherry", "Blush", "Sand", "Chestnut", "Cloud", "Ivory",
  "Limoncello", "Oat", "Noir", "Anthracite", "Vanille", "Espresso",
  "Bordeaux", "Royal Blue", "Indigo", "Camel", "Navy",
  "Black", "White", "Pink", "Red", "Blue", "Purple", "Green", "Beige",
  "Cream", "Brown", "Grey", "Lime", "Sky",
];

const MATERIALS = [
  [/linen/i, "100% Linen"],
  [/satin crepe|crepe/i, "Satin crepe"],
  [/satin/i, "Satin"],
  [/silk/i, "Silk"],
  [/velvet/i, "Velvet"],
  [/chiffon/i, "Chiffon"],
  [/cotton/i, "Cotton"],
  [/denim/i, "Denim"],
  [/suede/i, "Suede"],
  [/fleece/i, "Fleece"],
  [/knit/i, "Knit"],
];

const EXCLUDE_COLLECTIONS = new Set([
  "frontpage", "home-page", "shop-by-category", "shop-by-collection",
  "all", "new", "sale",
]);

/* ------------------------------------------------------------------ */
/* Product build                                                       */
/* ------------------------------------------------------------------ */

function deriveCategory(handle, membership, title) {
  for (const [h, cat] of CATEGORY_ORDER) {
    if (membership.has(h)) return cat;
  }
  for (const [re, cat] of CATEGORY_KEYWORDS) {
    if (re.test(title)) return cat;
  }
  return "Other";
}

function deriveMaterial(title, description, category) {
  for (const [re, label] of MATERIALS) {
    if (re.test(title) || re.test(description)) return label;
  }
  return null;
}

function deriveColorFamily(title) {
  for (const fam of COLOR_FAMILIES) {
    if (title.toLowerCase().includes(fam.toLowerCase())) return fam;
  }
  return null;
}

const products = [];
const productMembership = {}; // handle -> Set of collection handles

for (const [handle, raw] of Object.entries(rawProducts)) {
  const membership = new Set();
  for (const [cHandle, col] of Object.entries(rawCollections)) {
    if ((col.productHandles ?? []).includes(handle)) membership.add(cHandle);
  }
  productMembership[handle] = membership;

  const category = deriveCategory(handle, membership, raw.title);
  const material = deriveMaterial(raw.title, raw.description, category);
  const colorFamily = deriveColorFamily(raw.title);

  const variants = (raw.variants ?? []).map((v) => ({
    id: v.id,
    title: v.option1 ?? v.title ?? "One Size",
    sku: null,
    size: v.option1 ?? "One Size",
    availableForSale: v.available !== false,
    price: { amount: v.price, currencyCode: "USD" },
    compareAtPrice:
      v.compareAtPrice && v.compareAtPrice > 0
        ? { amount: v.compareAtPrice, currencyCode: "USD" }
        : null,
  }));

  const inStockVariant = variants.find((v) => v.availableForSale);
  const price =
    (inStockVariant?.price.amount ?? raw.priceMinCents ?? variants[0]?.price.amount) || 0;
  const compareAt = variants.find((v) => v.compareAtPrice)?.compareAtPrice ?? null;

  // "new" = recent publish OR listed in the store's "New" collection.
  let isNew = membership.has("new");
  if (!isNew && raw.publishedAt) {
    const days = (Date.now() - new Date(raw.publishedAt).getTime()) / 86400000;
    if (days <= 90) isNew = true;
  }

  const images = (raw.images ?? []).filter(Boolean);
  products.push({
    id: raw.id ?? handle,
    title: raw.title,
    handle,
    category,
    material,
    colorFamily,
    description: raw.description ?? "",
    price: { amount: price, currencyCode: "USD" },
    compareAtPrice: compareAt,
    images: images.map((url) => ({ url, altText: raw.title })),
    variants,
    tags: [
      ...(isNew ? ["new"] : []),
      ...(membership.has("black-friday") || membership.has("black-friday-up-to-50-off")
        ? ["sale-season"]
        : []),
    ],
    collections: [...membership].filter((h) => !EXCLUDE_COLLECTIONS.has(h)),
    availableForSale: raw.availableForSale !== false && variants.some((v) => v.availableForSale),
    sourceUrl: `https://www.beirutapparel.com/products/${handle}`,
  });
}

/* ------------------------------------------------------------------ */
/* Collections build                                                   */
/* ------------------------------------------------------------------ */

function firstImage(handles) {
  for (const h of handles) {
    const p = products.find((x) => x.handle === h);
    if (p && p.images[0] && p.availableForSale) return p.images[0].url;
  }
  for (const h of handles) {
    const p = products.find((x) => x.handle === h);
    if (p && p.images[0]) return p.images[0].url;
  }
  return null;
}

function buildCollections(kind, list) {
  const out = [];
  for (let i = 0; i < list.length; i++) {
    const [handle, title, sort, description] = list[i];
    const raw = rawCollections[handle];
    if (!raw) {
      console.warn(`  collection ${handle} not in raw data`);
      continue;
    }
    const members = raw.productHandles ?? [];
    if (kind === "category" && members.length === 0) continue;
    out.push({
      id: `collection-${handle}`,
      title: title ?? raw.title,
      handle,
      type: kind,
      description: description ?? raw.description ?? undefined,
      image: firstImage(members),
      productHandles: members,
      sort,
    });
  }
  return out;
}

const collections = [
  ...buildCollections("category", CATEGORY_ORDER),
  ...buildCollections("edit", EDITS),
  ...buildCollections("sale", SALE),
];

/* ------------------------------------------------------------------ */
/* Looks build (curated from real coordinating separates)              */
/* ------------------------------------------------------------------ */

function lookImage(productHandle) {
  const p = products.find((x) => x.handle === productHandle);
  return p?.images[0]?.url ?? placeholder;
}

const LOOKS = [
  {
    title: "Bronzed Dune",
    tagline: "Sun-dried separates in warm bronze.",
    mood: "Golden Hour",
    description:
      "The Shimmer Edit's Bronzed Dune family — a poncho top, fluid trousers and a tank, layered for golden hour by the sea.",
    items: [
      { productHandle: "bronzed-dune-poncho-top", role: "top", note: "poncho" },
      { productHandle: "bronzed-dune-trousers", role: "bottom" },
      { productHandle: "bronzed-dune-tank-top", role: "top", note: "underneath" },
    ],
  },
  {
    title: "Terra Glow",
    tagline: "Warm terracotta tones for long evenings.",
    mood: "Golden Hour",
    description:
      "Terra Glow separates from the Shimmer Edit — a poncho top and trousers with the tank worn beneath.",
    items: [
      { productHandle: "terra-glow-poncho-top", role: "top" },
      { productHandle: "terra-glow-trousers", role: "bottom" },
      { productHandle: "terra-glow-tank-top", role: "top", note: "underneath" },
    ],
  },
  {
    title: "Midnight Tides",
    tagline: "Deep blue separates that drift day to dusk.",
    mood: "Golden Hour",
    description:
      "Midnight Tides — the Shimmer Edit's darkest family, paired into an easy two-piece.",
    items: [
      { productHandle: "midnight-tides-poncho-top", role: "top" },
      { productHandle: "midnight-tides-trousers", role: "bottom" },
    ],
  },
  {
    title: "Sea Salt",
    tagline: "Beach to bar in soft coastal canvas.",
    mood: "By the Sea",
    description:
      "A Sea Salt cover-up set over the Ocean bikini — throw it on and stay out late.",
    items: [
      { productHandle: "sea-salt-cover-up-set", role: "set" },
      { productHandle: "ocean-bikini-top", role: "swim" },
      { productHandle: "ocean-bikini-bottom", role: "swim" },
    ],
  },
  {
    title: "Postcard Evening",
    tagline: "A satin set, finished in 24K gold.",
    mood: "Golden Hour",
    description:
      "The Glazed Pistachio satin set from Postcards from Summer, paired with the 24K Magic clutch.",
    items: [
      { productHandle: "glazed-pistachio-strapless-satin-set", role: "set" },
      { productHandle: "24k-magic-clutch-medium-size", role: "accessory", note: "24K Magic" },
    ],
  },
  {
    title: "Linen Day",
    tagline: "The label's signature, worn as a set.",
    mood: "Everyday Linen",
    description:
      "100% linen at its easiest — the Signature Pink Linen Halter Top with Signature Black Linen Pants.",
    items: [
      { productHandle: "pink-linen-halter-top", role: "top" },
      { productHandle: "signature-black-linen-pants", role: "bottom" },
    ],
  },
  {
    title: "Ramadan Elegance",
    tagline: "Refined satin crepe for days and evenings.",
    mood: "Ramadan & Modest",
    description:
      "The Amara beige abaya with delicate lace cuffs, accessorized with the 24K Magic clutch.",
    items: [
      { productHandle: "amara-beige-abaya", role: "abaya" },
      { productHandle: "24k-magic-clutch-small-size", role: "accessory", note: "24K Magic" },
    ],
  },
  {
    title: "Sunset Satin",
    tagline: "Champagne satin for golden-hour dressing.",
    mood: "Golden Hour",
    description:
      "The Champagne Muse strapless satin set — an easy evening silhouette from the summer edit.",
    items: [
      { productHandle: "champagne-muse-strapless-satin-set", role: "set" },
      { productHandle: "24k-magic-clutch-medium-size", role: "accessory", note: "24K Magic" },
    ],
  },
];

const looks = [];
for (let i = 0; i < LOOKS.length; i++) {
  const l = LOOKS[i];
  const validItems = l.items.filter((item) =>
    products.some((p) => p.handle === item.productHandle),
  );
  const missing = l.items.filter(
    (item) => !products.some((p) => p.handle === item.productHandle),
  );
  if (missing.length) {
    console.warn(`  look "${l.title}" missing: ${missing.map((m) => m.productHandle).join(", ")}`);
  }
  looks.push({
    id: `look-${i + 1}`,
    title: l.title,
    handle: l.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    tagline: l.tagline,
    description: l.description,
    mood: l.mood,
    image: lookImage(validItems[0]?.productHandle),
    items: validItems,
  });
}

/* ------------------------------------------------------------------ */
/* Write                                                               */
/* ------------------------------------------------------------------ */

await writeFile(path.join(OUT, "products.json"), JSON.stringify(products, null, 1));
await writeFile(path.join(OUT, "collections.json"), JSON.stringify(collections, null, 1));
await writeFile(path.join(OUT, "looks.json"), JSON.stringify(looks, null, 1));

// Summary
const cats = new Map();
for (const p of products) cats.set(p.category, (cats.get(p.category) ?? 0) + 1);
const withImage = products.filter((p) => p.images.length).length;
const withDesc = products.filter((p) => p.description).length;
const withColor = products.filter((p) => p.colorFamily).length;
const inStock = products.filter((p) => p.availableForSale).length;
const onSale = products.filter((p) => p.compareAtPrice).length;

console.log("\n=== DATASET BUILD ===\n");
console.log(`products:       ${products.length}`);
console.log(`  in stock:     ${inStock}`);
console.log(`  on sale:      ${onSale}`);
console.log(`  with images:  ${withImage}`);
console.log(`  with desc:    ${withDesc}`);
console.log(`  color family: ${withColor}`);
console.log(`collections:    ${collections.length}`);
console.log(`  categories:   ${collections.filter((c) => c.type === "category").length}`);
console.log(`  edits:        ${collections.filter((c) => c.type === "edit").length}`);
console.log(`  sale:         ${collections.filter((c) => c.type === "sale").length}`);
console.log(`looks:          ${looks.length}`);
console.log(`\ncategories:`);
for (const [name, count] of [...cats.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${name.padEnd(22)} ${String(count).padStart(4)}`);
}
