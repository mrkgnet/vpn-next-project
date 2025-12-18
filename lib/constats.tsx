import React from 'react';
// ایمپورت کامپوننت‌های شما
import AccountRenewal from "@/components/AccountRenewal";
import BuyAccount from "@/components/BuyAccount";
import MyAccount from "@/components/MyAccount";
import MyWallet from "@/components/MyWallet";

// ایمپورت آیکون‌ها از مجموعه Lucide (موجود در react-icons)
import { LuUser, LuShoppingCart, LuRefreshCcw, LuWallet } from "react-icons/lu";

type TabItem = {
    id: string;
    title: string;
    component: React.ReactNode; // تایپ صحیح برای کامپوننت‌های ری‌اکت
    icon: React.ElementType;    // تایپ صحیح برای پاس دادن آیکون به عنوان کامپوننت
}

export const tabsData: TabItem[] = [
    {
        id: "myAccount",
        title: "اطلاعات اکانت من",
        component: <MyAccount />,
        icon: LuUser // آیکون کاربر برای حساب‌های کاربری
    },
    {
        id: "buyAccount",
        title: "خرید اکانت",
        component: <BuyAccount />,
        icon: LuShoppingCart // آیکون سبد خرید
    },
    {
        id: "AccountRenewal",
        title: "تمدید اکانت",
        component: <AccountRenewal />,
        icon: LuRefreshCcw // آیکون رفرش/چرخش برای تمدید
    },
    {
        id: "myWallet",
        title: " کیف پول من ",
        component: <MyWallet />,
        icon: LuWallet // آیکون کیف پول
    }
]