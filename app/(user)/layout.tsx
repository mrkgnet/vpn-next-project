import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
// اگر فایل Topbar پیدا نمی‌شود، ابتدا نام فایل را در پوشه components چک کنید 
// که دقیقاً با حروف کوچک و بزرگ یکسان باشد. 
// اگر هنوز مشکل دارد، خط زیر را موقتاً کامنت کنید:
import Sidebar from "@/components/Sidebar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "داشبورد کاربری",
  description: "مدیریت سرویس‌های من",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <div className="flex min-h-screen bg-gray-50" dir="rtl">
       
        <div className="flex-1 flex flex-col">
         
          {/* محتوای اصلی صفحات */}
          <main className="p-4 md:p-6 lg:p-8">
            <div className="container mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}