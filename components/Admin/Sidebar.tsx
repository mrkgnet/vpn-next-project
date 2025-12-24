'use client';

import { useAuth } from '@/context/AuthContext';
import { tabsDataAdminPanel } from '@/lib/constats';
import axios from 'axios';
import { LayoutDashboard, LogOut, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname(); // مستقیم از همین استفاده می‌کنیم
  const router = useRouter();
  const handleLogOut = async ()=>{
    const res = await axios.post('/api/auth/logout');
    if(res.status === 200){
      router.push("/auth/login");
      router.refresh(); // برای آپدیت شدن وضعیت Auth در کل برنامه
    }
  }
  return (
    <div>
      <aside className="hidden w-64 flex-col bg-white md:flex sticky top-0 h-fit ml-4 border border-gray-300 my-6 overflow-y-auto rounded-xl shadow-lg">
        <nav className="flex-1 space-y-1 py-3 px-3">
          <div className="flex h-16 items-center border-b px-6 shrink-0">
            <div className="flex items-center gap-2 font-bold text-md text-blue-700">
              <LayoutDashboard className="h-6 w-6" />
              <Link href={'/adminp'}>داشبورد ادمین</Link>
            </div>
          </div>

          {tabsDataAdminPanel.map((tab) => {
            // به جای State، اینجا چک می‌کنیم که آیا مسیر فعلی با آدرس این تب یکی هست یا نه
            const isActive = pathname === tab.url;

            return (
              <Link
                key={tab.id}
                href={tab.url}
                className={`group relative flex w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200
                ${isActive 
                  ? "bg-rose-50 text-rose-600" 
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.title}</span>

                {isActive && (
                  <div className="absolute right-0 top-1/2 h-6 w-[4px] -translate-y-1/2 rounded-l-full bg-rose-500" />
                )}
              </Link>
            );
          })}

          <button
           onClick={handleLogOut}
            className="group relative flex w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span>خروج</span>
          </button>
        </nav>
      </aside>
    </div>
  );
}