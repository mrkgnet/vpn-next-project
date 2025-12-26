  "use client";

  import React, { useEffect, useState } from "react";
  import { Trash2, UserCheck, UserX, Wallet, Search, Phone, PlusCircle, X, Loader2 } from "lucide-react";
  import FetchUser, { ChargeUserWallet, UpdateUser } from "@/actions/userAction";

  export default function UserData({ initialUsers }: { initialUsers: any[] }) {
    const [isActiveUser, setIsActiveUser] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [users, setUsers] = useState<any[]>(initialUsers); // تعیین تایپ آرایه برای استیت
    const [chargeAmount, setChargeAmount] = useState<number>(0);
    const [isCharging, setIsCharging] = useState(false);

    // بستن مودال با دکمه Esc
    useEffect(() => {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === "Escape") setIsModalOpen(false);
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    // باز کردن مودال شارژ
    const openChargeModal = (user: any) => {
      setSelectedUser(user.phoneNumber);
      setIsModalOpen(true);
    };

    const handleChargeUserWallet = async () => {
      if (chargeAmount <= 0) return alert("مقدار شارژ را وارد کنید");
      if (!selectedUser) return alert("شماره تلفن را وارد کنید");

      setIsCharging(true);
      try {
        const result = await ChargeUserWallet(selectedUser, chargeAmount);
        if (result.success) {
          // اصلاح تایپ prevUsers برای رفع خطای بیلد
          setUsers((prevUsers: any[]) =>
            prevUsers.map((user) => (user.phoneNumber === selectedUser ? { ...user, userWallet: user.userWallet +chargeAmount } : user))
          );
          setIsModalOpen(false);
          setChargeAmount(0);
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert("خطایی رخ داد");
      } finally {
        setIsCharging(false);
      }
    };

    useEffect(() =>{
      setUsers(initialUsers)
    },[initialUsers])

    // تغییر وضعیت کاربر (فعال/غیرفعال)
    const toggleUserStatus = async (userID: any) => {
      const currentUser = users.find((u) => u.id === userID);
      if (!currentUser) return;

      const newStatus = !currentUser.isActive;

      setUsers((prevUsers: any[]) =>
        prevUsers.map((user) => (user.id === userID ? { ...user, isActive: newStatus } : user))
      );

      const result = await UpdateUser(userID, newStatus);
      if (!result.success) {
        alert("خطا در تغییر وضعیت");
        // در صورت خطا، وضعیت را به حالت قبل برگردانید
        setUsers((prevUsers: any[]) =>
          prevUsers.map((user) => (user.id === userID ? { ...user, isActive: !newStatus } : user))
        );
      }
    };

    // اصلاح تابع فرمت قیمت (رفع خطای Property replace does not exist on type number)
    const formatPrice = (price: any) => {
      if (!price && price !== 0) return "";
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
      <div className="p-6 relative">
        {/* هدر */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">مدیریت کاربران</h1>
            <p className="text-sm text-gray-500 mt-1">لیست تمامی کاربران سیستم</p>
          </div>
        </div>

        <div className="bg-white max-h-screen overflow-scroll rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">ردیف</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">شماره تلفن</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">تاریخ ورود</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">کیف پول</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">وضعیت</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">{(index + 1).toLocaleString("fa-IR")}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{user.phoneNumber}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">
                    {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-700">{user.userWallet.toLocaleString("fa-IR")}</span>
                      <button
                        onClick={() => openChargeModal(user)}
                        className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <PlusCircle className="h-3 w-3" />
                        شارژ
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          user.isActive ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            user.isActive ? "-translate-x-6" : "-translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* مودال شارژ کیف پول */}
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
                <p className="text-sm text-gray-600">
                  شارژ کیف پول برای کاربر: <span className="font-bold text-gray-900">{selectedUser}</span>
                </p>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">مبلغ شارژ (تومان)</label>
                  <input
                    type="text"
                    // استفاده از تابع فرمت شده برای نمایش
                    value={chargeAmount ? formatPrice(chargeAmount) : ""}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, "");
                      if (!isNaN(Number(rawValue))) {
                        setChargeAmount(Number(rawValue));
                      }
                    }}
                    placeholder="مثلا ۵۰,۰۰۰"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                    {isCharging ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>شارژ کیف پول</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
