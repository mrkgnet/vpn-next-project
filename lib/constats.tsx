import React from 'react';


// ایمپورت آیکون‌ها از مجموعه Lucide (موجود در react-icons)
import { LuUser, LuShoppingCart, LuRefreshCcw, LuWallet } from "react-icons/lu";

type TabItem = {
    id: string;
    title: string;  
    icon: React.ElementType;    // تایپ صحیح برای پاس دادن آیکون به عنوان کامپوننت
}

export const tabsData: TabItem[] = [
    {
        id: "myAccount",
        title: "اطلاعات اکانت من",       
        icon: LuUser // آیکون کاربر برای حساب‌های کاربری
    },
    {
        id: "buyAccount",
        title: "خرید اکانت",
       
        icon: LuShoppingCart // آیکون سبد خرید
    },
    {
        id: "AccountRenewal",
        title: "تمدید اکانت",
      
        icon: LuRefreshCcw // آیکون رفرش/چرخش برای تمدید
    },
    {
        id: "myWallet",
        title: " کیف پول من ",
      
        icon: LuWallet // آیکون کیف پول
    }
]