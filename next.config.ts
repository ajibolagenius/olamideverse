import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the home directory confuses workspace inference.
  turbopack: { root: __dirname },
};

export default nextConfig;
