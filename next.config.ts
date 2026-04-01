import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Игнорировать ошибки типов при сборке
    ignoreBuildErrors: true,
  },
  eslint: {
    // Можно также добавить это, чтобы билд не падал из-за правил оформления кода
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
