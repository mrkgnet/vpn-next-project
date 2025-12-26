"use client";

import { useAuth } from "@/context/AuthContext";
import { tabsDataAdminPanel } from "@/lib/constats";
import axios from "axios";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react"; // اضافه کردن آیکون منو و بستن
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // استیت برای کنترل منوی موبایل

  const handleLogOut = async () => {
    const res = await axios.post("/api/auth/logout");
    if (res.status === 200) {
      router.push("/auth/login");
      router.refresh();
    }
  };

  // تابعی برای بستن منو بعد از کلیک روی لینک‌ها در موبایل
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* دکمه همبرگری - فقط در موبایل (md:hidden) نمایش داده می‌شود */}
      <div className="flex items-center justify-between p-4 bg-white border-b md:hidden">
        <button onClick={() => setIsOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* منوی موبایل (Drawer) */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMenu}
      >
        <aside
          className={`fixed right-0 top-0 h-full w-64 bg-white shadow-2xl transition-transform duration-200 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()} // جلوگیری از بسته شدن موقع کلیک داخل منو
        >
          <div className="flex items-center justify-between p-5 border-b">
            <Link onClick={()=>setIsOpen(false)}  href="/adminp"  className="font-bold text-blue-700">خانه </Link>
            <button onClick={closeMenu}>
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <nav className="p-4 space-y-2">{renderLinks(pathname, closeMenu, handleLogOut)}</nav>
        </aside>
      </div>

      {/* منوی دسکتاپ - در موبایل مخفی است (hidden md:flex) */}
      <aside className="hidden md:flex flex-col w-64 bg-white sticky top-6 h-[calc(100vh-3rem)] ml-4 border border-gray-300 my-6 overflow-y-auto rounded-xl shadow-lg">
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-2 font-bold text-md text-blue-700">
            <LayoutDashboard className="h-6 w-6" />
            <Link href={"/adminp"}>داشبورد ادمین</Link>
          </div>
        </div>
        <nav className="flex-1 space-y-1 py-3 px-3">{renderLinks(pathname, null, handleLogOut)}</nav>
      </aside>
    </>
  );
}

// تابع کمکی برای جلوگیری از تکرار کد لینک‌ها
function renderLinks(pathname: string, onClick: any, handleLogOut: any) {
  return (
    <>
      {tabsDataAdminPanel.map((tab) => {
        const isActive = pathname === tab.url;
        return (
          <Link
            key={tab.id}
            href={tab.url}
            onClick={onClick}
            className={`group relative flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all
              ${isActive ? "bg-rose-50 text-rose-600" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}
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
        onClick={() => {
          if (onClick) onClick();
          handleLogOut();
        }}
        className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100"
      >
        <LogOut className="h-5 w-5" />
        <span>خروج</span>
      </button>
    </>
  );
}
