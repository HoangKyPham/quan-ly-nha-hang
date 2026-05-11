import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    qualities: [100, 75],
    remotePatterns: [
       {
        hostname: 'localhost',
        pathname: '/**'
      },
      {
        hostname: "via.placeholder.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
