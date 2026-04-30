import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Local-first setup: serve app from root path to avoid basePath-related 404s.
  basePath: "",
  trailingSlash: false,
};

export default nextConfig;