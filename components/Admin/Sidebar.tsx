"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // برای انیمیشن نرم
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { tabsDataAdminPanel } from "@/lib/constats";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // بستن منو به محض تغییر آدرس
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogOut = async () => {
    await axios.post("/api/auth/logout");
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <>
      {/* هدر موبایل */}
      <div className="flex items-center justify-between p-4 bg-white border-b md:hidden sticky top-0 z-40">
        <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
        <span className="font-bold text-blue-700">پنل مدیریت</span>
      </div>

      {/* منوی موبایل با Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* لایه تیره پشت منو */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
            />

            {/* خودِ سایدبار کشویی */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="fixed right-0 top-0 h-full w-64 bg-white z-[60] shadow-2xl md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b">
                <div className="flex items-center gap-2 font-bold text-blue-700">
                  <LayoutDashboard className="h-6 w-6" />
                  <span>منوی دسترسی</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <nav className="overflow-y-auto p-4 space-y-2">
                {tabsDataAdminPanel.map((tab) => (
                  <SidebarLink 
                    key={tab.id} 
                    tab={tab} 
                    isActive={pathname === tab.url} 
                    onClick={() => setIsOpen(false)} 
                  />
                ))}
              </nav>

              <div className="p-4 border-t">
                <button
                  onClick={handleLogOut}
                  className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  <span>خروج از حساب</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* سایدبار دسکتاپ (بدون تغییر منطقی، فقط استایل بهتر) */}
      <aside className="hidden md:flex flex-col w-64 bg-white sticky top-6 h-[calc(100vh-3rem)] ml-6 border border-gray-200 my-6 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
           <Link href="/adminp" className="flex items-center gap-2 font-bold text-blue-700">
            <LayoutDashboard className="h-6 w-6" />
            <span>خانه </span>
          </Link>
        </div>
        <nav className=" p-4 space-y-1">
          {tabsDataAdminPanel.map((tab) => (
            <SidebarLink 
              key={tab.id} 
              tab={tab} 
              isActive={pathname === tab.url} 
            />
          ))}
        </nav>
        <div className="p-4 border-t bg-gray-50/50">
           <button onClick={handleLogOut} className="flex  cursor-pointer w-full items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 transition-colors">
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">خروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// کامپوننت داخلی برای لینک‌ها جهت جلوگیری از تکرار کد
function SidebarLink({ tab, isActive, onClick }: any) {
  return (
    <Link
      href={tab.url}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
        isActive 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <tab.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-400"}`} />
      <span>{tab.title}</span>
    </Link>
  );
}