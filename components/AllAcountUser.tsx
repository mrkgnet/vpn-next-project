import { getPurchaseHistory } from "@/actions/purchaseHistory";
import { Check, ChevronDown, ChevronUp, Copy, Eye, EyeOff, Loader2 } from "lucide-react";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { getVlessLinkDetailsAction } from "@/app/(user)/dashboard/actions";

export default function AllAcountUser() {
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [userAccount, setUserAccount] = useState<string | null>();
  const [vlessLink, setVlessLink] = useState<string | null>(null);
  const [vlessTraffic, setVlessTraffic] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const formatGB = (bytes: number) => (bytes / 1024 ** 3).toFixed(2);
  // تابع برای باز و بسته کردن (Toggle)
  const toggleDetails = (id: string, email: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setVlessLink(null);
      return;
    }

    setExpandedId(id);
    setVlessLink(null);

    const formData = new FormData();
    formData.append("email", email);

    startTransition(async () => {
      const result = await getVlessLinkDetailsAction(formData);

      console.log("Calling Server Action for email:", email); // لاگ کلاینت

      console.log("Result from server:", result); // ببینید اینجا چه چیزی چاپ می‌شود

      if (result.success) {
        setVlessLink(result.link);
        setVlessTraffic(result.traffic);
      } else {
        console.error(result.message);
      }
    });
  };

  const fetchHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    const result = await getPurchaseHistory();
    if (result?.success) setPurchases(result.data);
    setIsLoadingHistory(false);
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    alert("کپی شد");
  };

  console.log(vlessLink);

  return (
    <div>
      <div className=" mt-4 text-center text-sm text-gray-600 ">
        <hr />

        <div className="bg-white w-full rounded-xl shadow-lg p-6 border border-gray-100">
          <h5 className="text-sm font-bold text-gray-700 mb-4 text-right border-b pb-2">تاریخچه خریدها</h5>

          {isLoadingHistory ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-gray-300" />
            </div>
          ) : purchases.length === 0 ? (
            <p className="text-xs text-center text-gray-400 py-4">تراکنشی یافت نشد.</p>
          ) : (
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1 ">
              {purchases.map((item) => (
                <React.Fragment key={item.id}>
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex flex-wrap justify-between items-center hover:bg-gray-100 transition-colors">
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-800" dir="ltr">
                        {item.username}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(item.createdAt).toLocaleTimeString("fa-IR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        <span className="mx-1">-</span>
                        {new Date(item.createdAt).toLocaleDateString("fa-IR")}
                      </p>
                    </div>
                    {/* <div className="flex flex-col md:flex-row gap-1.5">
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-1 rounded border border-emerald-100">
                      {item.gb}GB
                    </span>
                    <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-1 rounded border border-blue-100">
                      {item.days} روز
                    </span>
                  </div> */}

                    <button
                      onClick={() => toggleDetails(item.id, item.username)}
                      className="bg-gray-50 text-blue-600 text-[10px] px-2 py-1 rounded border border-gray-100
             flex items-center gap-1"
                    >
                      {expandedId === item.id ? (
                        <>
                          <EyeOff size={12} color="red" />
                          <span className="text-red-500"> بستن</span>
                        </>
                      ) : (
                        <>
                          <Eye size={12} />
                          مشاهده جزئیات
                        </>
                      )}
                    </button>
                  </div>

                  {expandedId === item.id && (
  <div className="bg-[#f8fafc] p-6 border-t border-gray-100 animate-in fade-in zoom-in-95 duration-300 rounded-b-xl">
    <div className="flex flex-col gap-6">
      
      {/* هدر جزئیات */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-3">
        <h6 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Service Status</h6>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-emerald-600">اتصال فعال</span>
        </div>
      </div>

      {/* بخش آمار خیره‌کننده */}
      <div className="flex gap-4">
        {/* باکس حجم */}
        <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -mr-6 -mt-6 transition-all group-hover:scale-110"></div>
          <p className="text-[10px] text-gray-400 font-bold mb-1 relative z-10">باقی‌مانده ترافیک</p>
          <div className="flex items-baseline gap-1 relative z-10">
            <span className="text-2xl font-black text-slate-800">
              {isPending ? "..." : vlessTraffic?.remainingGB || "0"}
            </span>
            <span className="text-[10px] text-emerald-500 font-bold">GB</span>
          </div>
        </div>

        {/* باکس زمان */}
        <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-6 -mt-6 transition-all group-hover:scale-110"></div>
          <p className="text-[10px] text-gray-400 font-bold mb-1 relative z-10">اعتبار زمانی</p>
          <div className="flex items-baseline gap-1 relative z-10">
            <span className="text-2xl font-black text-slate-800">
              {isPending ? "..." : vlessTraffic?.remainingDays || "0"}
            </span>
            <span className="text-[10px] text-blue-500 font-bold">روز</span>
          </div>
        </div>
      </div>

      {/* بخش لینک اتصال با دکمه کپی مدرن */}
      <div className="space-y-2">
        <label className="text-[10px] text-gray-400 font-bold block px-1">کانفیگ اختصاصی شما</label>
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl p-2 pl-4 shadow-sm">
            <div className="flex-1 overflow-hidden">
              <p className="text-[11px] font-mono text-slate-600 truncate text-left dir-ltr select-all" dir="ltr">
                {vlessLink || "در حال دریافت اطلاعات از سرور..."}
              </p>
            </div>
            <button
              onClick={() => vlessLink && copyToClipboard(vlessLink)}
              disabled={isPending || !vlessLink}
              className="ml-2 flex items-center justify-center w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* فوتر اطلاعات تکمیلی */}
      <div className="flex justify-between items-center px-1 mt-2">
         <div className="flex flex-col">
            <span className="text-[9px] text-gray-400 font-bold">PROTOCOL</span>
            <span className="text-[10px] font-black text-slate-700">VLESS + TCP</span>
         </div>
         <div className="text-left flex flex-col items-end">
            <span className="text-[9px] text-gray-400 font-bold uppercase">Client ID</span>
            <span className="text-[9px] font-mono text-slate-400">{item.username.slice(0,12)}...</span>
         </div>
      </div>

    </div>
  </div>
)}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


