"use client";
import { addUserAction } from "@/app/(user)/dashboard/actions";
import { useAuth } from "@/context/AuthContext";
import pricing from "@/lib/pricing";
import {  Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const BuyAccount = () => {
  const { user, isLoading, checkAuth } = useAuth();
  const router = useRouter();

  const [traffic, setTraffic] = useState(10);
  const [month, setMonth] = useState(31);

  const [inviteCode, setInviteCode] = useState("");
  // const [isCopied, setIsCopied] = useState(false);
  // const [purchasedAccounts, setPurchasedAccounts] = useState([
  //   {
  //     id: 1,
  //     username: inviteCode,
  //     gb: traffic,
  //     days: month,
  //     date: new Date().toISOString(),
  //   },
  // ]);

  //استیت برای لودینگ
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChangeGB(e) {
    const val = Number(e.target.value);
    setTraffic(val);
  }

  function handleChangeMonth(e) {
    const val = Number(e.target.value);
    setMonth(val);
  }

  // آیکون‌ها برای تمیزی کد اینجا تعریف شده‌اند
  const Icons = {
    User: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    Database: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s 9-1.34 9-3V5" />
      </svg>
    ),
    Calendar: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="22" y1="10" y2="10" />
      </svg>
    ),
    ChevronDown: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    ),
    Refresh: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M8 16H3v5" />
      </svg>
    ),
  };

  // تابع تولید کد ۷ رقمی (حروف و اعداد)
  const generateCode = () => {
    const characters = "abcdefghijklmnopqrstuvwxyz";
    let result = "";
    const length = 8;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setInviteCode(result);
  };

  // تولید کد هنگام لود شدن کامپوننت
  useEffect(() => {
    generateCode();
  }, []);

  const currentPrice = pricing(traffic, month);

  // تابع تبدیل تاریخ میلادی به شمسی
  const toPersianDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 🔴 چک کردن وضعیت لاگین قبل از هر کاری
    if (!user) {
      toast.warn("برای خرید اشتراک ابتدا باید وارد حساب کاربری خود شوید.");
      // هدایت به صفحه لاگین
      router.push(`/auth/login?redirect=/`);
      // جلوگیری از ادامه اجرای تابع
      return;
    }


    if(user.userWallet < currentPrice){
      toast.warn("موجودی کیف پول شما کافی نیست.");
      return;
    } 

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("username", inviteCode);
    formData.append("totalGB", traffic.toString());
    formData.append("days", month.toString());

    try {
      const result = await addUserAction(formData);
      if (result.success == true) {
        toast.success("اشتراک با موفقیت خریداری شد");
      } else {
        toast.error("خطا در انجام عملیات");
      }
    } catch (error) {
      console.error("Error buying account:", error);
    } finally {
      setIsSubmitting(false); // پایان لودینگ
    }
  };

  return (
    <div className=" flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-gray-100">
        {/* هدر کارت */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-800 p-4 text-white flex items-center justify-between">
          <div>
            <h2 className=" font-bold flex items-center gap-2">
              <Icons.Refresh />
              خرید اشتراک جدید
            </h2>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleClick} className="flex flex-col gap-5">
            {/* ورودی نام کاربری */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 mr-1">نام کاربری</label>
              <div className="relative flex items-center group">
                <input
                  type="text"
                  value={inviteCode}
                  readOnly
                  name="email"
                  className="w-full pr-12 pl-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-sm font-bold text-gray-700 tracking-widest text-center"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* انتخاب حجم */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 mr-1">حجم (گیگ)</label>
                <div className="relative">
                  <div className="absolute right-3 top-3.5 text-gray-400 pointer-events-none">
                    <Icons.Database />
                  </div>
                  <select
                    name="totalGB"
                    value={traffic}
                    onChange={handleChangeGB}
                    className="appearance-none w-full pr-10 pl-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-sm text-gray-700 cursor-pointer"
                  >
                    <option value="10">10 گیگ</option>
                    <option value="20">20 گیگ</option>
                    <option value="30">30 گیگ</option>
                    <option value="40">40 گیگ</option>
                    <option value="80">80 گیگ</option>
                    <option value="100">100 گیگ</option>
                    <option value="200">200 گیگ</option>
                  </select>
                  <div className="absolute left-3 top-4 text-gray-400 pointer-events-none">
                    <Icons.ChevronDown />
                  </div>
                </div>
              </div>

              {/* انتخاب زمان */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 mr-1">زمان (روز)</label>
                <div className="relative">
                  <div className="absolute right-3 top-3.5 text-gray-400 pointer-events-none">
                    <Icons.Calendar />
                  </div>
                  <select
                    name="days"
                    value={month}
                    onChange={handleChangeMonth}
                    className="appearance-none w-full pr-10 pl-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-sm text-gray-700 cursor-pointer"
                  >
                    <option value="31">31 روزه</option>
                    <option value="61">61 روزه</option>
                  </select>
                  <div className="absolute left-3 top-4 text-gray-400 pointer-events-none">
                    <Icons.ChevronDown />
                  </div>
                </div>
              </div>
            </div>

            {/* کارت محاسبه مبلغ */}
            <div className="mt-2 p-4 rounded-xl bg-amber-50 border border-amber-100 flex flex-col items-center justify-center gap-1">
              <p className="text-amber-800/70 text-xs font-medium">مبلغ قابل پرداخت</p>
              <div className="flex items-baseline gap-1 text-amber-900">
                <span className="text-2xl font-black tracking-tight">{currentPrice}</span>

                <span className="text-sm font-medium">تومان</span>
              </div>
              <hr />
              <span className="text-xs border-t-2 py-1.5 text-gray-500">
                {user?.userWallet ? `موجودی کیف پول: ${user.userWallet} تومان` : ""}
              </span>
            </div>

            {/* دکمه ارسال */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 cursor-pointer bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-2.5 px-4 rounded-xl shadow  transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin h-7 w-7" /> : <span>خرید</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyAccount;
