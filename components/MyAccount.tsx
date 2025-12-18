'use client'

import { getVlessLinkAction } from '@/app/(user)/dashboard/actions';
import React, { useState } from 'react'
import { Link, Copy, Check, Search, Mail, AlertCircle, Loader2 } from 'lucide-react';

const MyAccount = () => {
    const [link, setLink] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    
    // 1. اضافه کردن state برای مقدار اینپوت
    const [inputValue, setInputValue] = useState("");
    // استیت برای نمایش تیک سبز روی تگ vipsah
    const [isTagCopied, setIsTagCopied] = useState(false);

    async function handleSubmit(formData: FormData) {
        setMessage(null);
        setLink(null);

        try {
            const result = await getVlessLinkAction(formData);
            setLoading(true);
            if (result.success && result.link) {
                setLink(result.link);
                setMessage(null);
            } else {
                setMessage(result.message || "خطا در دریافت لینک");
            }
        } catch (error) {
            setMessage("خطای غیرمنتظره رخ داد.");
        } finally {
            setLoading(false);
        }
    }

    const handleCopy = async () => {
        if (link) {
            await navigator.clipboard.writeText(link);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    }

    // 2. تابعی برای هندل کردن کلیک روی تگ (پر کردن اینپوت + کپی)
    const handleTagClick = async (text: string) => {
        // پر کردن اینپوت
        setInputValue(text);
        
        // کپی کردن در کلیپ‌بورد
        await navigator.clipboard.writeText(text);
        
        // نمایش وضعیت کپی شد
        setIsTagCopied(true);
        setTimeout(() => setIsTagCopied(false), 1500);
    };

    return (
        <div className="flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">

                {/* هدر رنگی */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 transform -skew-y-6"></div>
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                            <Link size={28} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold tracking-wide">دریافت کانفیگ اختصاصی</h2>
                        <p className="text-indigo-100 text-xs font-light">لینک اتصال VLESS خود را دریافت کنید</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <form action={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1.5 mr-1">نام کاربری (اشتراک)</label>
                            <div className="relative group">
                                <span className="absolute right-3 top-3 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="text"
                                    name="email"
                                    // 3. اتصال اینپوت به State
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="vipseas نام کاربری اشتراک مثلا "
                                    required
                                    className="w-full pr-10 pl-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm font-medium text-gray-700"
                                    dir="ltr"
                                />
                            </div>
                            
                            {/* 4. بخش تگ‌های قابل کلیک */}
                            <div className='font_xs flex flex-wrap item-left gap-2 mt-2'>
                                <button
                                    type="button" // مهم: تایپ باید button باشد تا فرم را سابمیت نکند
                                    onClick={() => handleTagClick('vipsah')}
                                    className={`
                                        flex items-center gap-1 border p-1 px-2 rounded-2xl text-xs transition-all cursor-pointer
                                        ${isTagCopied 
                                            ? 'border-green-500 bg-green-50 text-green-700' 
                                            : 'border-gray-300 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 text-gray-600'
                                        }
                                    `}
                                >
                                    <span>{inputValue}</span>
                                    {isTagCopied ? <Check size={12} /> : <Copy size={12} className="opacity-50"/>}
                                </button>
                            </div>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>در حال پردازش...</span>
                                </>
                            ) : (
                                <>
                                    <Search size={18} />
                                    <span>دریافت لینک</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* نمایش پیام خطا */}
                    {message && (
                        <div className="animate-in fade-in slide-in-from-top-2 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                            <AlertCircle size={18} />
                            <span>{message}</span>
                        </div>
                    )}

                    {/* جداکننده */}
                    {link && <div className="h-px w-full bg-gray-100 my-2"></div>}

                    {/* نمایش لینک */}
                    {link && (
                        <div className="animate-in zoom-in-95 duration-300">
                            <div className="flex justify-between items-end mb-2">
                                <label className="text-xs font-bold text-gray-500 mr-1">کد اتصال شما:</label>
                                <button
                                    onClick={handleCopy}
                                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded-md transition-all ${isCopied
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {isCopied ? (
                                        <>
                                            <Check size={14} />
                                            <span>کپی شد</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            <span>کپی کد</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="relative group">
                                <textarea
                                    readOnly
                                    value={link}
                                    className="w-full h-32 p-3 text-[11px] leading-relaxed border border-gray-200 rounded-xl bg-slate-800 text-slate-300 break-all text-left font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all custom-scrollbar selection:bg-indigo-500 selection:text-white"
                                    dir="ltr"
                                />
                                <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 pointer-events-none bg-slate-800/80 px-2 rounded">
                                    VLESS CONFIG
                                </div>
                            </div>
                            <p className="text-[10px] text-center text-gray-400 mt-2">
                                این کد را کپی کرده و در نرم‌افزار V2Ray یا مشابه وارد کنید.
                            </p>
                        </div>
                    )}
                </div>

                
            </div>
        </div>
    );
}

export default MyAccount;