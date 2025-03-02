import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_MONGODB_URI: process.env.NEXT_MONGODB_URI,
    NEXT_AUTH_SECRET_DEV: process.env.NEXT_AUTH_SECRET_DEV,
    NEXT_AUTH_SECRET_PROD: process.env.NEXT_AUTH_SECRET_PROD
  },
};

export default nextConfig;
