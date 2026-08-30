import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker needs a self-contained server bundle. Vercel builds its own output
  // and breaks if we set this, so leave it off there.
  output: process.env.VERCEL ? undefined : "standalone",
};

export default nextConfig;
