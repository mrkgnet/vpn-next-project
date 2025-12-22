import React from 'react';


// ایمپورت آیکون‌ها از مجموعه Lucide (موجود در react-icons)
import { LuUser, LuShoppingCart, LuRefreshCcw, LuWallet } from "react-icons/lu";

type TabItem = {
    id: string;
    title: string;  
    icon: React.ElementType;
        // تایپ صحیح برای پاس دادن آیکون به عنوان کامپوننت
}

export const tabsData: TabItem[] = [

     {
        id: "allAcountUser",
        title: "اکانت های من",       
        icon: LuUser // آیکون کاربر برای حساب‌های کاربری
    },
    {
        id: "myAccount",
        title: "جزئیات اکانت",       
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


export const tabsDataAdminPanel = [
    {
        id: "1",
        title: "مدیریت کاربران",       
        icon: LuUser ,// آیکون کاربر برای حساب‌های کاربری 
        url: "/adminp/user-managment"
    },
    {
        id: "myAccount",
        title: "جزئیات اکانت",
        icon: LuUser ,// آیکون کاربر برای حساب‌های کاربری
        url: "/adminp/myAccount"
    }
]
