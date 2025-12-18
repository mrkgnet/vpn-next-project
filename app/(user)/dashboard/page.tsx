// app/products/page.tsx
import EditAcount from '@/components/AccountRenewal';

import { getData, addUserAction, updateUserAction } from './actions';



export const dynamic = "force-dynamic";

function formatBytes(bytes: number) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default async function ProductsPage() {
    const data = await getData();
    const products = data.list;

    return (
        <div className="p-8 font-sans max-w-6xl mx-auto space-y-8 text-right" dir="rtl">

            {/* گرید 3 ستونه برای فرم‌ها */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* --- 1. فرم افزودن کاربر (آبی) --- */}
                

                
              

            </div>

            {/* --- لیست کاربران --- */}
            
        </div>
    );
}