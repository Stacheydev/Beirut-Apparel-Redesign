// Probe: extract images + variant data from a fetched product HTML file.
import fs from "node:fs";

const file = process.argv[2];
const html = fs.readFileSync(file, "utf-8");

// All cdn image URLs (shopify cdn subdomains or same-domain /cdn/shop/)
const imgRe = /(?:https?:)?\/\/(?:[a-z0-9.\-]*cdn\.shopify\.com|www\.beirutapparel\.com)\/cdn\/shop\/[^\s"'\\]+\.(?:jpg|jpeg|png|webp|avif)(?:\?[^\s"'\\]*)?/gi;
const imgs = [...new Set(html.match(imgRe) ?? [])];
console.log("=== IMAGES (%d) ===", imgs.length);
imgs.slice(0, 15).forEach((u) => console.log(u.split("?")[0]));

// Parse variant JSON: Shopify embeds a product JSON. Find the largest object
// containing "option1" and "variants".
const m = html.match(/\{[\s\S]*?"variants":\[[\s\S]*?\][\s\S]*?\}\s*,\s*"options"/);
if (m) {
  try {
    const data = JSON.parse(m[0]);
    const vars = (data.variants ?? []).map((v) => ({
      title: v.title,
      option1: v.option1,
      price: v.price,
      compareAtPrice: v.compare_at_price,
      available: v.available,
    }));
    console.log("\n=== VARIANTS (%d) ===", vars.length);
    console.log(JSON.stringify(vars, null, 1).slice(0, 2000));
    console.log("\n=== OPTIONS ===", JSON.stringify(data.options));
    console.log("\n=== DESCRIPTION ===", (data.description ?? "").slice(0, 500));
    console.log("\n=== PRICE RANGE ===", data.price, "min /", data.price_max, "max");
    console.log("=== TAGS ===", data.tags);
  } catch (e) {
    console.log("JSON parse failed:", e.message);
  }
} else {
  console.log("\n=== no variants+options blob found ===");
  // fallback: find any large JSON with option1
  const m2 = html.match(/\{[\s\S]*?"option1":"[^"]+"[\s\S]{0,400}/);
  if (m2) console.log("hint:", m2[0].slice(0, 600));
}
