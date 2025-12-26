"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Wallet,
  CreditCard,
  Plus,
  RefreshCw,
  Loader2, // 1. آیکون رفرش
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function MyWallet() {
  // دریافت checkAuth از کانتکست
  const { user, isLoading, checkAuth } = useAuth();
  const router = useRouter();

  const [amount, setAmount] = useState<string>("");
  // 2. استیت برای نمایش انیمیشن چرخش روی دکمه رفرش
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 👈 استیت جدید برای لودینگ دکمه پرداخت
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatNumber = (num: string) => {
    return num.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(formatNumber(e.target.value));
  };

  const handleQuickAdd = (value: number) => {
    setAmount(formatNumber(value.toString()));
  };

  // 3. تابع بروزرسانی موجودی
  const handleRefreshBalance = async () => {
    setIsRefreshing(true); // شروع انیمیشن
    try {
      // صدا زدن مجدد API برای گرفتن اطلاعات تازه کاربر از دیتابیس
      await checkAuth();
    } catch (error) {
      console.error("خطا در بروزرسانی", error);
    } finally {
      // یک وقفه کوتاه (مثلا ۵۰۰ میلی‌ثانیه) می‌گذاریم تا کاربر چرخش را ببیند و حس انجام کار منتقل شود
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center animate-pulse">در حال دریافت موجودی...</div>;
  }

  // اضافه کردن موجودی

  const handlePayment = async () => {

    if (!user) {
      toast.error("برای استفاده از این سرویس باید وارد شوید");
      router.push("/auth/login");
      return;
    }

    if (!amount) return;
    const rawAmount = parseInt(amount.replace(/,/g, ""));
   

    if (!rawAmount || rawAmount < 5000) {
      alert("لطفا مبلغ معتبری وارد کنید (حداقل 5000 تومان)");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/wallet/charge", { amount: rawAmount });

      if(res.data.success == true){
        // 3. اضافه کردن موجودی به موجودی کاربر
        toast.success("موجودی با موفقیت اضافه شد")
      } else {
        toast.error("خطا در شارژ کیف پول")
      }




     
      await checkAuth();
      // 4. تمیزکاری
      setAmount("");
     
    } catch (error) {
      console.error("خطا در شارژ کیف پول", error);
      alert("خطا در شارژ کیف پول");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">کیف پول من</h1>
       
      </div>

      {/* ----------------- کارت موجودی ----------------- */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl shadow-blue-200">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 opacity-90">
              <Wallet className="h-6 w-6" />
              <span className="text-sm font-medium">موجودی کل</span>
            </div>

            {/* دکمه بروزرسانی (سمت چپ بالا) */}
            <button
              onClick={handleRefreshBalance}
              disabled={isRefreshing}
              className="group flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm transition hover:bg-white/20 active:scale-95 disabled:opacity-70"
              title="بروزرسانی موجودی"
            >
              <span className="hidden md:text-base">بروزرسانی</span>
              <RefreshCw
                className={`h-3.5 w-3.5 transition-all duration-700 ${
                  isRefreshing ? "animate-spin" : "group-hover:rotate-180"
                }`}
              />
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            {/* نمایش موجودی */}
            <span className="text-2xl font-bold tracking-tight">
              {user?.userWallet ? user.userWallet.toLocaleString() : "0"}
            </span>

            <span className="text-base opacity-80">تومان</span>
          </div>
        </div>
      </div>

      {/* ----------------- فرم افزایش موجودی ----------------- */}
      <div className="grid gap-6 md:grid-cols-1">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-gray-700">
            <div className="rounded-lg bg-green-50 p-2 text-green-600">
              <Plus className="h-5 w-5" />
            </div>
            <h6 className="font-semibold text-sm md:text-base">افزایش موجودی</h6>
          </div>

          <div className="space-y-4">
            <div>
              <label className="my-3 block text-xs text-gray-500">مبلغ مورد نظر (تومان)</label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="مثلا: ۱۰۰,۰۰۰"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pl-12 text-left text-lg font-bold text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400"> تومان</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[50000, 100000, 200000, 300000].map((val) => (
                <button
                  key={val}
                  onClick={() => handleQuickAdd(val)}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs md:text-base font-medium text-gray-600 transition hover:border-blue-500 hover:text-blue-600"
                >
                  +{val.toLocaleString()}
                </button>
              ))}
            </div>

            <button
              onClick={handlePayment}
              disabled={isSubmitting}
              className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2 md:py-3 font-semibold text-white transition hover:bg-blue-700 shadow-lg "
            >
              <CreditCard className="h-5 w-5" />
             {
              isSubmitting ? (
                <Loader2 className="h-7 w-7 animate-spin" />
              ) :
              <span className="text-xs md:text-base">افزایش موجودی</span>
             
             }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
