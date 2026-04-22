import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Base64 data URIs stored in Neon and any external HTTPS images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
