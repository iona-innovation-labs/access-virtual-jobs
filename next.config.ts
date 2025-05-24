import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "**", // TEMP
      },
    ],
  },
};

export default nextConfig;
