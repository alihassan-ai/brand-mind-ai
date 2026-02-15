import type { NextConfig } from "next";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const nextConfig: NextConfig = {
  transpilePackages: [
    '@brandmind/shared',
    '@brandmind/backend',
    '@brandmind/brain',
    '@brandmind/admin',
  ],
  turbopack: {
    resolveAlias: {
      '@brandmind/shared': '../shared/src/index.ts',
      '@brandmind/backend': '../backend/src/index.ts',
      '@brandmind/brain': '../brain/src/index.ts',
      '@brandmind/admin': '../admin/src/index.ts',
    },
  },
};

export default nextConfig;
