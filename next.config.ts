import type { NextConfig } from "next";

const nextConfig: any = {
  typescript: {
    // نادیده گرفتن خطاهای تایپ‌اسکریپت در زمان بیلد
    ignoreBuildErrors: true,
  },
  eslint: {
    // نادیده گرفتن خطاهای لینتینگ در زمان بیلد
    ignoreDuringBuilds: true,
  },
  // فعال کردن حالت standalone برای لیارا
  output: 'standalone',
};

export default nextConfig;