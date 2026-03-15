import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000'
      },
      {
        hostname: 'via.placeholder.com',
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;
