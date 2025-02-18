import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // ✅ Disables source maps to reduce build size
};

export default nextConfig;
