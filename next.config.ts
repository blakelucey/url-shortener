import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_MONGODB_URI: process.env.NEXT_MONGODB_URI,
    NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
    NEXT_GMAIL: process.env.NEXT_GMAIL,
    NEXT_GMAIL_APP_PASSWORD: process.env.NEXT_GMAIL_APP_PASSWORD,
    NEXT_JAVA_MICROSERVICE_URL: process.env.NEXT_JAVA_MICROSERVICE_URL
  },
};

export default nextConfig;
