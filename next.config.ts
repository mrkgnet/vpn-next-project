import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // این تنظیم باعث می‌شود که خطاهای تایپ‌اسکریپت مانع از Build پروژه نشوند
    ignoreBuildErrors: true,
  },
  eslint: {
    // این تنظیم باعث می‌شود خطاهای Linting هم در زمان بیلد نادیده گرفته شوند
    ignoreDuringBuilds: true,
  },
  output: 'standalone', // لیارا به این گزینه نیاز دارد
  // سایر تنظیمات در صورت نیاز اینجا اضافه شوند
};

export default nextConfig;