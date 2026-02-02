import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/matrix-resource-orchestrator' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/matrix-resource-orchestrator/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
