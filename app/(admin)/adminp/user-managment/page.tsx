import { Suspense } from "react";
import FetchDataUser from "./FetchDataUser";


export default function UserManagementPage() {
  return (
    <div className="p-6">
      {/* این بخش بلافاصله لود می‌شود */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">مدیریت کاربران</h1>
        <p className="text-sm text-gray-500">لیست تمامی کاربران سیستم</p>
      </div>

      {/* این بخش منتظر دیتابیس می‌ماند و لودینگ نشان می‌دهد */}
      <Suspense fallback={<div className="p-10 text-center">در حال دریافت اطلاعات کاربران...</div>}>
        <FetchDataUser />
      </Suspense>
    </div>
  );
}