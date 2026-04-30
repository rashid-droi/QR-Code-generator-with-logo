import type { NextConfig } from "next";

const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Use project subpath only for GitHub Pages builds.
  basePath: isGitHubPagesBuild ? "/QR-Code-generator-with-logo" : "",
  trailingSlash: isGitHubPagesBuild,
};

export default nextConfig;