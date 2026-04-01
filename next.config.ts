import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Игнорировать ошибки типов при сборке
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
