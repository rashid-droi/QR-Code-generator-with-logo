import type { NextConfig } from "next";

const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Use repository base path only for GitHub Pages CI builds.
  basePath: isGitHubPagesBuild ? "/QR-Code-generator-with-logo" : "",
  trailingSlash: isGitHubPagesBuild,
};

export default nextConfig;