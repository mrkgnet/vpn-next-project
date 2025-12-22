// import React from "react";

// export default async function PurchaseHistory() {
//   const result = await PurchaseHistory();
//   const purchases = result?.success ? result?.data : [];
//   if (purchases.length === 0) {
//     return <p className="text-xs text-center text-gray-400 py-4">هنوز تراکنشی ثبت نشده است.</p>;
//   }
//   return (
//     <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
//       {purchases.map((item) => (
//         <div
//           key={item.id}
//           className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex justify-between items-center transition-all hover:bg-white hover:shadow-sm"
//         >
//           <div className="text-right">
//             <p className="text-xs font-bold text-gray-800" >
//               {item.username}
//             </p>
//             <p className="text-[10px] text-gray-400 mt-1">
//               {/* تبدیل تاریخ میلادی به شمسی */}
//               {new Date(item.createdAt).toLocaleDateString("fa-IR")}
//             </p>
//           </div>
//           <div className="flex gap-1.5">
//             <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-1 rounded-md border border-emerald-100">
//               {item.totalGB} GB
//             </span>
//             <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-1 rounded-md border border-blue-100">
//               {item.days} روز
//             </span>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
