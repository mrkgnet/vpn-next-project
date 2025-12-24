// import FetchUser from "@/actions/userAction";
// import { PlusCircle, Trash2 } from "lucide-react";
// import { useEffect } from "react";

// export default function InfoUserData( {users, openChargeModal, toggleUserStatus}) {
//  const [users, setUsers] = useState<any>([]);
//     if (!users || !Array.isArray(users)) return null;

//   // fetch data
//   useEffect(() => {
//     async function loadData() {
//       const result = await FetchUser();
//       if (result.success) {
//         setUsers(result.data);
//       } else {
//         console.log(result.data);
//       }
//     }
//     loadData();
//   }, []);


//   return(
//     <>
//     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//         <table className="w-full text-right border-collapse">
//           <thead>
//             <tr className="bg-gray-50 border-b border-gray-100">
//               <th className="px-6 py-4 text-sm font-semibold text-gray-600">ردیف</th>
//               <th className="px-6 py-4 text-sm font-semibold text-gray-600">شماره تلفن</th>
//               <th className="px-6 py-4 text-sm font-semibold text-gray-600">تاریخ ورود</th>

//               <th className="px-6 py-4 text-sm font-semibold text-gray-600">کیف پول</th>
//               <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">وضعیت</th>
//               <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">عملیات</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-50">
//             {users.map((user, index) => (
//               <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
//                 <td className="px-6 py-4 text-sm text-gray-500">{(index + 1).toLocaleString("fa-IR")}</td>
//                 <td className="px-6 py-4 text-sm font-medium text-gray-700">{user.phoneNumber}</td>
//                 <td className="px-6 py-4 text-sm font-medium text-gray-700">
//                   {new Date(user.createdAt).toLocaleDateString("fa-IR")}
//                 </td>

//                 {/* کیف پول با دکمه شارژ */}
//                 <td className="px-6 py-4">
//                   <div className="flex items-center gap-3">
//                     <span className="text-sm font-bold text-gray-700">{user.userWallet.toLocaleString("fa-IR")}</span>
//                     <button
//                       onClick={() => openChargeModal(user)}
//                       className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors"
//                     >
//                       <PlusCircle className="h-3 w-3" />
//                       شارژ
//                     </button>
//                   </div>
//                 </td>

//                 {/* Toggle Button برای فعال/غیرفعال */}
//                 <td className="px-6 py-4">
//                   <div className="flex justify-center">
//                     <button
//                       onClick={() => toggleUserStatus(user.id)}
//                       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
//                         user.isActive ? "bg-emerald-500" : "bg-gray-300"
//                       }`}
//                     >
//                       <span
//                         className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                           user.isActive ? "-translate-x-6" : "-translate-x-1"
//                         }`}
//                       />
//                     </button>
//                   </div>
//                 </td>

//                 <td className="px-6 py-4 text-center">
//                   <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   )
// }