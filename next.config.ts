import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true, // ✅ Uses SWC minifier to reduce JS size
  webpack(config) {
    config.optimization.splitChunks = {
      chunks: "all",
      maxSize: 2000000, // ✅ Limit chunk size to 2MB (Cloudflare limit is 25MB)
    };
    return config;
  },
};

export default nextConfig;
