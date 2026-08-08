/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Reference-store photos are already served from Shopify's CDN at the
    // right size — skip Next's optimizer so the concept runs on real URLs
    // with no build-time image fetching.
    unoptimized: true,
  },
};

export default nextConfig;
