import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Required for ScoutOS Live deployment
  // Disable compression to avoid CDN Content-Encoding mismatch
  compress: false,
};

export default nextConfig;