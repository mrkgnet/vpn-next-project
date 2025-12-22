"use client";

import React, { useState } from "react";
import { Trash2, UserCheck, UserX, Wallet, Search, Phone, PlusCircle, X } from "lucide-react";

export default function UserManagment() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState([
    { id: 1, phone: "09123456789",loginData:"1402/09/15", joinDate: "1402/09/15", isActive: true, balance: 50000 },
    { id: 2, phone: "09987654321",loginData:"1402/09/15", joinDate: "1402/10/02", isActive: false, balance: 0 },
  ]);

  // تابع تغییر وضعیت فعال/غیرفعال
  const toggleUserStatus = (id: number) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, isActive: !user.isActive } : user)));
  };

  const openChargeModal = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
                <td className="px-6 py-4 text-sm font-medium text-gray-700">{user.phone}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700">{user.loginData}</td>

                {/* کیف پول با دکمه شارژ */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-700">{user.balance.toLocaleString("fa-IR")}</span>
                    <button
                      onClick={() => openChargeModal(user)}
                      className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <PlusCircle className="h-3 w-3" />
                      شارژ
                    </button>
                  </div>
                </td>

                {/* Toggle Button برای فعال/غیرفعال */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">افزایش موجودی</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                شارژ کیف پول برای کاربر: <span className="font-bold text-gray-900">{selectedUser?.phone}</span>
              </p>

              <div>
                <label className="block text-xs text-gray-500 mb-1">مبلغ شارژ (تومان)</label>
                <input
                  type="number"
                  placeholder="مثلا ۵۰,۰۰۰"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  تایید و شارژ
                </button>
                <button
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
