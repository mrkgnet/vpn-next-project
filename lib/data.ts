// lib/data.ts
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function getWalletBalance() {
  try {
    // ۱. دریافت کوکی‌ها (در نسخه‌های جدید Next.js باید await شود)
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return 0; // کاربر لاگین نیست
    }

    // ۲. اعتبارسنجی توکن (دقیقاً با همان Secret که در API Route استفاده کردید)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
    
    // اگر توکن دستکاری شده باشد یا منقضی باشد، اینجا ارور می‌دهد و به catch می‌رود
    const { payload } = await jwtVerify(token, secret);
    
    // ۳. دریافت ID کاربر از داخل توکن
    const userId = payload.userId as string;

    // ۴. دریافت موجودی از دیتابیس
    const user = await db.user.findUnique({
      where: { 
        id: userId 
      },
      select: { 
        userWallet: true 
      }
    });

    return user?.userWallet ?? 0;

  } catch (error) {
    // اگر توکن نامعتبر باشد یا هر خطای دیگری رخ دهد
    console.error("خطا در دریافت موجودی:", error);
    return 0;
  }
}