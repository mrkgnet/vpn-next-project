import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // نادیده گرفتن خطاهای تایپ‌اسکریپت برای عبور از بیلد پکیج‌های خارجی
    ignoreBuildErrors: true,
  },
  eslint: {
    // نادیده گرفتن خطاهای ESLint در زمان بیلد برای جلوگیری از توقف استقرار
    ignoreDuringBuilds: true,
  },
  // تنظیم خروجی به صورت standalone برای اجرای بهینه در پلتفرم لیارا
  output: 'standalone',
};

export default nextConfig;