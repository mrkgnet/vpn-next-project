"use client";

import React, { Suspense, useState } from "react";
import { LayoutDashboard, ShoppingBag, Truck, Headset } from "lucide-react";
import AccountRenewal from "./AccountRenewal";
import { tabsData } from "@/lib/constats";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import MyAccount from "./MyAccount";
import MyWallet from "./MyWallet";
import BuyAccount from "./BuyAccount";
import AllAcountUser from "./AllAcountUser";

export default function Sidebar() {
  const [activeTabId, setActiveTabId] = useState("buyAccount");
  const { isLoggedIn, isLoading, user, logOut } = useAuth();

  // 3. تابع سوییچ برای انتخاب کامپوننت مناسب
  // این تابع تصمیم می‌گیرد کدام کامپوننت الان باید رندر شود
  const renderContent = () => {
    switch (activeTabId) {
      case "allAcountUser":
        return <AllAcountUser />;

      case "buyAccount":
        return <BuyAccount />;

      case "AccountRenewal":
        return <AccountRenewal />;

      case "myWallet":
        return <MyWallet />;  
        
      case "myAccount":
        return <MyAccount />;

      default:
        return <BuyAccount />;
    }
  };

  return (
    // کانتینر اصلی: در موبایل ستونی، در دسکتاپ ردیفی
    <div className="flex min-h-screen my-0   md:my-4 flex-col  md:flex-row">
      {/* ----------------- SIDEBAR (DESKTOP) ----------------- */}
      <aside className="hidden w-64 flex-col  bg-white md:flex sticky top-0 h-fit ml-4 border border-gray-300  overflow-y-auto rounded-xl shadow-lg">
        <nav className="flex-1 space-y-1 py-3 px-3  ">
          <div className="flex h-16 items-center border-b px-6 shrink-0">
            <div className="flex items-center gap-2 font-bold text-md text-blue-700">
              <LayoutDashboard className="h-6 w-6" />
              <span>پنل کاربری</span>
            </div>
          </div>

          {tabsData.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`group relative flex w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200
                ${isActive ? "bg-rose-50 text-rose-600" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"} `}
              >
                <tab.icon />
                <span>{tab.title} </span>

                {/* خط نشانگر سمت راست برای حالت فعال */}
                {isActive && (
                  <div className="absolute right-0 top-1/2 h-6 w-[4px] -translate-y-1/2 rounded-l-full bg-rose-500" />
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ----------------- MAIN CONTENT AREA ----------------- */}
      <div className="flex w-full  flex-col">
        {/* ----------------- TOPBAR (MOBILE) ----------------- */}
        <div className="sticky top-0 z-10 w-full bg-white shadow-sm md:hidden">
          <div className="flex w-full items-center gap-4 overflow-x-auto border-b border-gray-100 px-4 no-scrollbar">
            {tabsData.map((tab) => {
              const isActive = activeTabId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`relative flex min-w-fit cursor-pointer flex-col items-center gap-2 pb-3 pt-4 text-sm font-medium transition-colors duration-200
                  ${isActive ? "text-rose-500" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <tab.icon />
                  <span>{tab.title}</span>
                  {isActive && <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-rose-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ----------------- DYNAMIC CONTENT ----------------- */}
        <div className="">
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-4 text-center">
            {/* نمایش لودر در صورت نیاز */}
            {isLoading ? (
              <p>در حال بررسی...</p>
            ) : !isLoggedIn ? (
              // حالتی که کاربر لاگین نیست
              <div className="flex flex-wrap gap-2 justify-center items-center mb-6">
                <p> شما هنوز وارد نشدید</p>
                <Link href="/auth/login" className="border bg-blue-500 text-white px-4 py-1 rounded-md">
                  برای ورود کلیک کنید
                </Link>
              </div>
            ) : (
              // حالتی که کاربر لاگین است (می‌توانی شماره‌اش را نشان دهی)
              <div className="mb-4 text-green-600 space-x-3.5 flex items-center justify-center">
                سلام کاربر عزیز 👋
                <button
                  type="button"
                  onClick={logOut}
                  className=" cursor-pointer  bg-red-700 hover:from-red-700 hover:to-red-600 text-white  py-1 px-4 rounded-xl shadow-lg  transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  خروج
                </button>
              </div>
            )}

            <h2 className="text-lg font-semibold text-gray-700">{renderContent()}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
