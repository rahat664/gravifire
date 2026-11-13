import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep compile/runtime errors available while removing the route indicator from screenshots.
  devIndicators: false,
};

export default nextConfig;
