'use client'; // حتما این را اضافه کنید چون از هوک استفاده می‌کنیم

import { tabsDataAdminPanel } from '@/lib/constats';
import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // استفاده از هوک مسیر

export default function Sidebar() {
  const pathname = usePathname(); // مسیر فعلی مرورگر را می‌گیرد

  return (
    <div>
      <aside className="hidden w-64 flex-col bg-white md:flex sticky top-0 h-fit ml-4 border border-gray-300 my-6 overflow-y-auto rounded-xl shadow-lg">
        <nav className="flex-1 space-y-1 py-3 px-3">
          <div className="flex h-16 items-center border-b px-6 shrink-0">
            <div className="flex items-center gap-2 font-bold text-md text-blue-700">
              <LayoutDashboard className="h-6 w-6" />
              <Link href={'/adminp'}>خانه</Link>
            </div>
          </div>

          {tabsDataAdminPanel.map((tab) => {
            // بررسی اینکه آیا این تب فعال است یا خیر
            const active = pathname === tab.url;

            return (
              <Link
                key={tab.id}
                href={tab.url}
                className={`group relative flex w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200
                ${active 
                  ? "bg-rose-50 text-rose-600" 
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.title}</span>

                {/* خط نشانگر سمت راست برای حالت فعال */}
                {active && (
                  <div className="absolute right-0 top-1/2 h-6 w-[4px] -translate-y-1/2 rounded-l-full bg-rose-500" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}