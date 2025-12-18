"use client";

import React, { useState } from "react";
import { 
  Wallet, 
  CreditCard, 
  Plus, 
  History, 
  ArrowUpRight, 
  TrendingUp,
  AlertCircle
} from "lucide-react";

export default function MyWallet() {
  const [amount, setAmount] = useState<string>("");

  // تابع فرمت کردن اعداد (سه رقم سه رقم)
  const formatNumber = (num: string) => {
    return num.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(formatNumber(e.target.value));
  };

  const handleQuickAdd = (value: number) => {
    setAmount(formatNumber(value.toString()));
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* هدر ساده */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">کیف پول من</h1>
        <span className="text-sm text-gray-400">تاریخ امروز: ۱۴۰۳/۰۹/۲۴</span>
      </div>

      {/* ----------------- کارت موجودی (Wallet Card) ----------------- */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl shadow-blue-200">
        {/* پترن پس‌زمینه تزئینی */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 opacity-90">
              <Wallet className="h-6 w-6" />
              <span className="text-sm font-medium">موجودی کل</span>
            </div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              فعال
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight">220</span>
            <span className="text-lg opacity-80">تومان</span>
          </div>

          
        </div>
      </div>

      {/* ----------------- بخش افزایش موجودی (Action Section) ----------------- */}
      <div className="grid gap-6 md:grid-cols-1">
        {/* فرم افزایش */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-gray-700">
            <div className="rounded-lg bg-green-50 p-2 text-green-600">
              <Plus className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">افزایش موجودی</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-gray-500">مبلغ مورد نظر (تومان)</label>
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

            {/* دکمه‌های انتخاب سریع */}
            <div className="flex flex-wrap gap-2">
              {[50000, 100000, 200000,300000].map((val) => (
                <button
                  key={val}
                  onClick={() => handleQuickAdd(val)}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 transition hover:border-blue-500 hover:text-blue-600"
                >
                  +{val.toLocaleString()}
                </button>
              ))}
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 shadow-lg shadow-blue-200">
              <CreditCard className="h-5 w-5" />
              <span>پرداخت و شارژ کیف پول</span>
            </button>
          </div>
        </div>

       
      </div>
    </div>
  );
}