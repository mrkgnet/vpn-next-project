"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // برای انیمیشن
import { Smartphone, Lock, ArrowRight, CheckCircle, RefreshCcw, Loader2 } from "lucide-react"; // آیکون‌ها
import "react-toastify/dist/ReactToastify.css";
// 1. ایمپورت کردن هوک کانتکست (مسیر را بر اساس ساختار پوشه‌بندی خود تنظیم کنید)
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";


const AuthPage = () => {
  // --- State ---
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [step, setStep] = useState("phone"); // 'phone' | 'verify' | 'done'
  const [code, setCode] = useState("");
  const router = useRouter();

  // 2. دریافت تابع checkAuth از کانتکست
  const { checkAuth } = useAuth();

  // --- Timer Logic ---
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  // --- Format Timer (mm:ss) ---
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // --- Handlers ---
  const sendOtp = async () => {
    if (!phone) return toast.error("لطفا شماره موبایل را وارد کنید");

    if (phone.length !== 11 || !phone.startsWith("09")) return toast.error("فرمت شماره موبایل صحیح نیست");

    setIsLoading(true);

    try {
      const res = await axios.post("/api/auth/sendOTP", { phone });
      if (res.data.status === "success") {
        setStep("verify");
        setTimer(60);
        toast.success("کد تأیید ارسال شد");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "خطا در برقراری ارتباط";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const reSendOtp = async () => {
    if (timer > 0) return;
    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/sendOTP", { phone });
      if (res.data.status === "success") {
        setTimer(60);
        toast.success("کد مجدداً ارسال شد");
      }
    } catch (error) {
      toast.error("خطا در ارسال مجدد");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!code) return toast.error("کد وارد نشده است");
    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/verifyOTP", { phone, code });
      console.log(res);

      if (res.data.status === "success") {
        


        setStep("done");
        toast.success("خوش آمدید!");
        // 3. ★ نکته کلیدی اینجاست ★
        // فراخوانی دستی برای آپدیت شدن استیت‌های کانتکست
        await checkAuth();
        // حالا که استیت آپدیت شد، ریدایرکت کنید (بدون نیاز به رفرش)
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (error) {
      const msg = error.response?.data?.error || "کد اشتباه است";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 relative    overflow-hidden font-[family-name:var(--font-geist-sans)]">
      {/* Background Decor (Blobs) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <ToastContainer rtl theme="colored" transition={Bounce} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px] z-10 p-4"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          {/* Header */}
          <div className="pt-8 pb-4 px-8 text-center">
            <div className="grid grid-cols-2">
              <span></span>
              <Link href={"/dashboard"}>برگشت به خانه</Link>
            </div>

            <div className="w-16 h-16 bg-gradient-to-tr from-rose-500 to-orange-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-rose-500/30 mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              {step === "phone" ? "ورود به حساب" : step === "verify" ? "تأیید شماره" : "خوش آمدید"}
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              {step === "phone" && "برای ورود یا ثبت‌نام شماره خود را وارد کنید."}
              {step === "verify" && `کد ارسال شده به ${phone} را وارد کنید.`}
              {step === "done" && "ورود شما با موفقیت انجام شد."}
            </p>
          </div>

          <div className="p-8 pt-2">
            <AnimatePresence mode="wait">
              {/* STEP 1: PHONE */}
              {step === "phone" && (
                <motion.div
                  key="phone-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="relative group">
                    <Smartphone className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09123456789"
                      className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-400 focus:bg-white focus:border-rose-500 rounded-xl outline-none transition-all duration-300 font-medium text-gray-700 text-left placeholder:text-right"
                      dir="ltr"
                    />
                  </div>

                  <button
                    onClick={sendOtp}
                    disabled={isLoading}
                    className="w-full py-3.5 text-white bg-blue-800  rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        ارسال کد تأیید <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              {/* STEP 2: VERIFY */}
              {step === "verify" && (
                <motion.div
                  key="verify-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="- - - - -"
                      className="w-full py-2 bg-gray-50 border border-gray-300 focus:bg-white focus:border-rose-500 rounded-xl outline-none transition-all text-center text-xl tracking-[0.5em] font-bold text-gray-600 placeholder:text-gray-300 focus:shadow-xl focus:shadow-rose-500/10"
                      dir="ltr"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      onClick={reSendOtp}
                      disabled={timer > 0 || isLoading}
                      className={`flex items-center gap-1 transition-colors ${
                        timer > 0 ? "text-gray-400 cursor-default" : "text-rose-600 font-medium hover:text-rose-700"
                      }`}
                    >
                      {timer > 0 ? (
                        <>
                          <span>{formatTime(timer)}</span> تا ارسال مجدد
                        </>
                      ) : (
                        <>
                          <RefreshCcw className="w-4 h-4" /> ارسال مجدد کد
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setStep("phone");
                        setTimer(0);
                        setCode("");
                      }}
                      className="text-gray-500 hover:text-gray-800 transition-colors"
                    >
                      ویرایش شماره
                    </button>
                  </div>

                  <button
                    onClick={verifyOtp}
                    disabled={isLoading}
                    className="w-full py-3.5 bg-blue-800 text-white rounded-xl font-bold  shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : "تأیید و ورود"}
                  </button>
                </motion.div>
              )}

              {/* STEP 3: DONE */}
              {step === "done" && (
                <motion.div
                  key="done-step"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="text-center py-6 space-y-6"
                >
                  <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <p className="text-gray-600">در حال انتقال به داشبورد...</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-sm text-gray-400 hover:text-gray-600 underline"
                  >
                    اگر منتقل نشدید کلیک کنید
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer / Terms */}
          <div className="bg-gray-50/50 p-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400">
              با ورود به سایت، <span className="text-rose-500 cursor-pointer">قوانین و مقررات</span> را می‌پذیرید.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
