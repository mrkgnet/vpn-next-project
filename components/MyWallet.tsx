"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Wallet,
  CreditCard,
  Plus,
  RefreshCw,
  Loader2,
  Copy,
  CheckCircle2,
  ArrowRightLeft,
  ExternalLink,
  AlertCircle,
  PlusCircle,
  X,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";
import { UpdateProfileUser } from "@/actions/userAction";

export default function MyWallet() {
  const { user, isLoading, checkAuth } = useAuth();
  const router = useRouter();

  const [amount, setAmount] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"gateway" | "card">("card");
  const [isCopied, setIsCopied] = useState(false);
  const [isActivePayment, setIsActivePayment] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStateSaveUser, setIsStateSaveUser] = useState(false);
  const [userName, setUserName] = useState("");

  // handle charge when click accept

  // بخش جدید برای هندل کردن ثبت درخواست شارژ کارت به کارت
const handleChargeUserWallet = async () => {
  const cleanUserName = userName.trim();
  if (!cleanUserName.trim()) {
    toast.error("لطفا نام صاحب کارت پرداخت کننده را وارد کنید");
    return;
  }

  try {
    setIsStateSaveUser(true);  
 
    const result = await UpdateProfileUser(user.id,cleanUserName)
    if(result.success){
    toast.success("درخواست شما ثبت شد و پس از تایید مدیریت اعمال می‌شود");
    setIsModalOpen(false);
    setUserName(""); // پاک کردن فیلد پس از موفقیت
    }else {
      toast.error(result.error);
    }
    
    
  } catch (error) {
    toast.error("خطایی در ثبت درخواست رخ داد");
  } finally {
    setIsStateSaveUser(false);
  }
};

  ///---------------------
  const cardDetails = {
    number: "6219861878591683",
    name: "خسروی",
    bank: "بانک سامان",
  };

  // redirect if not register
  const isSubmitHandler = () => {
    if (!user) {
      toast.warn("برای شارژ حساب ابتدا وارد شوید", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      router.push("/auth/login");
    }
  };

  const handleCopy = () => {
    if (!user) {
      toast.info(" ابتدا وارد شوید   ");
      return;
    }

    navigator.clipboard.writeText(cardDetails.number);
    setIsCopied(true);
   toast.success("شماره کارت کپی شد ", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatNumber = (num: string) => {
    return num.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(formatNumber(e.target.value));
  };

  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    try {
      await checkAuth();
    } finally {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  if (isLoading)
    return <div className="p-10 text-center animate-pulse text-gray-400">در حال اتصال به کیف پول شما...</div>;

  return (
    <div className="mx-auto max-w-xl space-y-6 pb-10">
      {/* 💳 کارت موجودی مدرن */}
      <div className="group relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl transition-all hover:shadow-blue-500/10">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-blue-600/20 blur-[80px] transition-all group-hover:bg-blue-600/30" />

        <div className="relative z-10 space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl">
                <Wallet className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">موجودی در دسترس</p>
                <p className="text-sm font-bold text-white">کیف پول اصلی</p>
              </div>
            </div>
            <button
              onClick={handleRefreshBalance}
              disabled={isRefreshing}
              className="rounded-full bg-white/5 p-2.5 transition-all hover:bg-white/10 active:scale-90"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black tracking-tighter">
              {user?.userWallet ? user.userWallet.toLocaleString() : "۰"}
            </span>
            <span className="text-lg font-medium text-gray-400">تومان</span>
          </div>
        </div>
      </div>

      {/* 📥 بخش عملیات شارژ */}
      <div className="rounded-[2rem] border border-gray-100 bg-white p-2 shadow-xl shadow-gray-200/40">
        <div className="flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-100 p-4 animate-pulse">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-sm font-medium text-amber-800 leading-relaxed">
            در حال حاضر شارژ حساب تنها از طریق{" "}
            <span className="underline decoration-amber-300 underline-offset-4">کارت به کارت</span> امکان‌پذیر است.
          </p>
        </div>
        <div className="flex p-1.5 bg-gray-50 rounded-[1.5rem]">
          <button
            onClick={() => setPaymentMethod("gateway")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
              paymentMethod === "gateway" ? "bg-white text-blue-600 shadow-md" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <CreditCard className="h-4 w-4" />
            درگاه مستقیم
          </button>
          <button
            onClick={() => setPaymentMethod("card")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
              paymentMethod === "card" ? "bg-white text-blue-600 shadow-md" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <ArrowRightLeft className="h-4 w-4" />
            کارت به کارت
          </button>
        </div>
        <div className="p-6 space-y-6">
          {paymentMethod === "gateway" ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 mr-2">مبلغ شارژ (تومان)</label>
                <input
                  type="text"
                  value={amount}
                  disabled={isActivePayment}
                  onChange={handleAmountChange}
                  className="w-full rounded-2xl border-none bg-gray-50 px-6 py-5 text-2xl font-black text-gray-800 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  placeholder="۰"
                />
                <div className="flex gap-2">
                  {[50000, 100000, 250000, 300000].map((v) => (
                    <button
                      key={v}
                      onClick={() => setAmount(formatNumber(v.toString()))}
                      className="flex-1 rounded-xl border border-gray-100 py-2 text-xs font-bold text-gray-500 transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100"
                    >
                      {v.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={isSubmitting || !amount}
                onClick={isSubmitHandler}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-blue-600 py-5 font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    {isActivePayment ? <span>درگاه بانکی فعلا فعال نیست</span> : <span>اتصال به درگاه بانکی</span>}

                    <ExternalLink className="h-4 w-4 opacity-70 group-hover:translate-x-[-4px] transition-transform" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="rounded-2xl bg-gray-50 p-5 space-y-4 border border-dashed border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">
                    شماره کارت مقصد
                    {user ? "" : <span className="px-3 text-red-600">(برای مشاهده ابتدا لاگین کنید )</span>}
                  </span>
                  <span className="text-xs font-bold text-blue-600">{cardDetails.bank}</span>
                </div>
                <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <span className="md:text-base text-sm font-black tracking-[0.2em] text-gray-700">
                    {user ? cardDetails.number : "**** **** **** ****"}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                  >
                    {isCopied ? <CheckCircle2 className="text-green-500" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">به نام:</span>
                  <span className="font-bold text-gray-800">{cardDetails.name}</span>
                </div>
              </div>

              <div className="bg-amber-50 flex flex-wrap justify-between border border-amber-100 rounded-xl p-4">
                <p className="text-xs leading-relaxed text-amber-700">⚠️ پس از واریزی روی دکمه شارژ کردم کلیک کنید</p>
                <button
                  onClick={() => openModal()}
                  className="flex text-base  items-center gap-1 text-[10px] bg-blue-50 text-red-600 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors border shadow-sm"
                >
                  <PlusCircle className="h-3 w-3" />
                  شارژ کردم
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">افزایش موجودی</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* <p className="text-sm text-gray-600">
                شارژ کیف پول برای کاربر: <span className="font-bold text-gray-900">{selectedUser}</span>
              </p> */}

              <div>
                <label className="block text-xs text-gray-500 mb-1"> نام و نام خانوادگی کارت پرداخت کننده </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                  placeholder="نام و نام خانوادگی کارت پرداخت کننده"
                  className="w-full md:text-base text-sm border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  انصراف
                </button>

                <button
                  className="flex-1 flex items-center justify-center bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                  onClick={handleChargeUserWallet}
                >
                  {isStateSaveUser ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>شارژ کیف پول</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
