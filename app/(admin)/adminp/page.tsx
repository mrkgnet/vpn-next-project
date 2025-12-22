import { ArrowUpRight, DollarSign, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {


  const stats = [
    {
      id: 1,
      title: 'تعداد کل کاربران',
      value: '۱,۲۸۴',
      change: '+۱۲٪',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 2,
      title: 'میزان فروش کل',
      value: '۴۵,۲۰۰,۰۰۰ تومان',
      change: '+۸.۵٪',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      id: 3,
      title: 'سود خالص',
      value: '۱۲,۴۰۰,۰۰۰ تومان',
      change: '+۲۳٪',
      icon: TrendingUp,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100',
    },
  ];


  return(
    <div className="mx-auto ">
    <div className="p-6  ">
      {/* هدر صفحه */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">داشبورد مدیریت</h1>
        <p className="text-gray-500 mt-1">خلاصه‌ای از وضعیت کسب‌وکار شما در یک نگاه</p>
      </div>

      {/* بخش کارت‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item) => (
          <div 
            key={item.id} 
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${item.bgColor} p-3 rounded-xl`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium py-1 px-2 rounded-full bg-green-50 text-green-600">
                {item.change}
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">{item.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1 mt-2 tracking-tight">
                {item.value}
              </h3>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-50">
              <Link href={'adminp/user-managment'} className="text-xs text-blue-600 font-semibold hover:underline">
                مشاهده جزئیات بیشتر
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* بخش پیش‌نمایش نمودار یا لیست (اختیاری) */}
      <div className="mt-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="h-40 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
          <p className="text-gray-400">محل قرارگیری نمودار فروش (Chart.js / Recharts)</p>
        </div>
      </div>
    </div>
  );
    </div>
  )
}