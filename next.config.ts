import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/QR-Code-generator-with-logo",
  trailingSlash: true,
};

export default nextConfig;
