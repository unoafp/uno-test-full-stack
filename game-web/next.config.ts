import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  images: {
    remotePatterns: [new URL("https://challenge-uno.vercel.app/images/**")],
  },
};

export default nextConfig;
