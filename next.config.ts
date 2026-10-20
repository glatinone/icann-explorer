import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  experimental: { globalNotFound: true },
  images: { unoptimized: true },
};

export default nextConfig;
