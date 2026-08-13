import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "205.209.110.121",
        port: "3350",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.mtiskari.ge",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
