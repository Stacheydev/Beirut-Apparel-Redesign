/**
 * Scrape Beirut Apparel catalog data from the public reference store's
 * Shopify JSON endpoints (beirutapparel.com). This is an independent concept;
 * data is used for demonstration only.
 *
 * Sources (all public, robots.txt-permitted):
 *   - /products.json             -> every product: title, handle, variants
 *                                   (size + price + compare-at + availability),
 *                                   images (public CDN), tags, publish date
 *   - /collections.json          -> every collection: title, handle, count
 *   - /collections/{h}/products.json -> real collection membership
 *   - page JSON-LD descriptions  -> merged from an optional prior page crawl
 *
 * Polite crawl: single concurrency, ~1s delay, retries with backoff, and
 * incremental writes so a partial run is never lost.
 */
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAW_DIR = path.join(__dirname, "..", "data", "raw");
const PRODUCTS_OUT = path.join(RAW_DIR, "products.json");
const COLLECTIONS_OUT = path.join(RAW_DIR, "collections.json");
const PAGE_CRAWL = path.join(RAW_DIR, "scraped-products.json");

const BASE = "https://www.beirutapparel.com";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const CONCURRENCY = 1;
const DELAY_MS = 1400;
const MAX_RETRIES = 4;
const TIMEOUT_MS = 30000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url) {
  let lastErr;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "application/json" },
        signal: ctrl.signal,
        redirect: "follow",
      });
      clearTimeout(timer);
      if (res.ok) return await res.json();
      lastErr = new Error(`HTTP ${res.status} for ${url}`);
      if (res.status === 429) {
        await sleep(8000 * (attempt + 1));
        continue;
      }
    } catch (e) {
      lastErr = e;
    }
    await sleep(DELAY_MS * (attempt + 1) * 2);
  }
  throw lastErr;
}

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function loadJson(p, fallback) {
  if (!(await fileExists(p))) return fallback;
  try {
    return JSON.parse(await readFile(p, "utf8"));
  } catch {
    return fallback;
  }
}

const toCents = (s) => Math.round(Number(s) * 100);

/** Normalize a Shopify product JSON record into our raw shape. */
function normalizeProduct(sf) {
  const images = (sf.images ?? [])
    .map((img) => {
      const src = (img.src ?? img.url ?? "").replace(/^http:\/\//, "https://");
      return src.split("?")[0];
    })
    .filter((u) => u && !/(logo|placeholder|removebg|transparent|Untitled_design|icon)/i.test(u));

  const variants = (sf.variants ?? []).map((v) => ({
    id: String(v.id),
    title: v.title,
    option1: v.option1,
    price: toCents(v.price),
    compareAtPrice: v.compare_at_price != null && v.compare_at_price !== "" ? toCents(v.compare_at_price) : null,
    available: v.available === true,
  }));

  const available = variants.some((v) => v.available);
  const prices = variants.map((v) => v.price);
  const compares = variants
    .map((v) => v.compareAtPrice)
    .filter((v) => v != null && v > 0);

  return {
    id: String(sf.id),
    handle: sf.handle,
    title: sf.title,
    product_type: (sf.product_type ?? "").trim(),
    tags: (sf.tags ?? []).filter(Boolean),
    description: "", // merged later from page JSON-LD crawl
    images,
    variants,
    availableForSale: variants.length === 0 ? true : available,
    priceMinCents: prices.length ? Math.min(...prices) : null,
    priceMaxCents: prices.length ? Math.max(...prices) : null,
    compareAtCents: compares.length ? Math.min(...compares) : null,
    sizeOptions: [...new Set(variants.map((v) => v.option1))],
    publishedAt: sf.published_at ?? null,
  };
}

/** Fetch every product via /products.json pagination. */
async function fetchAllProducts() {
  const out = {};
  let page = 1;
  while (true) {
    const data = await fetchJson(`${BASE}/products.json?limit=250&page=${page}`);
    const items = data?.products ?? [];
    if (!items.length) break;
    for (const sf of items) out[sf.handle] = normalizeProduct(sf);
    console.log(`  products page ${page}: ${items.length}`);
    if (items.length < 250) break;
    page++;
    await sleep(DELAY_MS);
  }
  return out;
}

/** Fetch every collection via /collections.json. */
async function fetchAllCollections() {
  const out = {};
  const data = await fetchJson(`${BASE}/collections.json?limit=250`);
  for (const c of data?.collections ?? []) {
    out[c.handle] = {
      handle: c.handle,
      title: c.title,
      description: c.description ?? "",
      productsCount: c.products_count ?? 0,
      image: c.image?.src ?? null,
      productHandles: [],
    };
  }
  return out;
}

/** Fetch membership for a collection via /collections/{h}/products.json. */
async function fetchCollectionMembership(handle) {
  const handles = [];
  let page = 1;
  while (true) {
    const data = await fetchJson(
      `${BASE}/collections/${handle}/products.json?limit=250&page=${page}`,
    );
    const items = data?.products ?? [];
    if (!items.length) break;
    for (const sf of items) handles.push(sf.handle);
    if (items.length < 250) break;
    page++;
    await sleep(DELAY_MS);
  }
  return [...new Set(handles)];
}

/** Merge real page JSON-LD descriptions from an earlier page crawl. */
async function mergeDescriptions(products) {
  if (!(await fileExists(PAGE_CRAWL))) return;
  try {
    const pageCrawl = JSON.parse(await readFile(PAGE_CRAWL, "utf8"));
    let merged = 0;
    for (const [handle, p] of Object.entries(products)) {
      const page = pageCrawl[handle];
      if (page?.description) {
        products[handle].description = page.description.trim();
        merged++;
      }
    }
    console.log(`Merged ${merged} descriptions from page crawl.`);
  } catch {
    /* keep going without merges */
  }
}

async function main() {
  await mkdir(RAW_DIR, { recursive: true });

  const products = await loadJson(PRODUCTS_OUT, {});
  const collections = await loadJson(COLLECTIONS_OUT, {});
  const existingCount = Object.keys(products).length;

  if (existingCount < 200) {
    console.log("Fetching all products via /products.json…");
    const all = await fetchAllProducts();
    Object.assign(products, all);
    await writeFile(PRODUCTS_OUT, JSON.stringify(products, null, 1));
    console.log(`Saved ${Object.keys(products).length} products.`);
  } else {
    console.log(`Using ${existingCount} cached products.`);
  }

  if (Object.keys(collections).length < 10) {
    console.log("Fetching collections via /collections.json…");
    const all = await fetchAllCollections();
    Object.assign(collections, all);
    await writeFile(COLLECTIONS_OUT, JSON.stringify(collections, null, 1));
    console.log(`Saved ${Object.keys(collections).length} collections.`);
  }

  // Fill membership for collections that don't have it yet.
  const pending = Object.entries(collections).filter(
    ([, c]) => (c.productHandles ?? []).length === 0,
  );
  console.log(`Fetching membership for ${pending.length} collections…`);
  let done = 0;
  for (const [handle, col] of pending) {
    try {
      const handles = await fetchCollectionMembership(handle);
      col.productHandles = handles;
    } catch (e) {
      console.warn(`  failed ${handle}: ${e.message}`);
    }
    done++;
    if (done % 10 === 0) {
      await writeFile(COLLECTIONS_OUT, JSON.stringify(collections, null, 1));
      console.log(`  collections ${done}/${pending.length}`);
    }
    await sleep(DELAY_MS);
  }
  await writeFile(COLLECTIONS_OUT, JSON.stringify(collections, null, 1));

  await mergeDescriptions(products);
  await writeFile(PRODUCTS_OUT, JSON.stringify(products, null, 1));

  console.log("Scrape complete.");
}

const isEntry =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isEntry) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
