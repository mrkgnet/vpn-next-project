// مسیر: app/api/auth/verifyOTP/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, code } = body;

    // ۱. بررسی اینکه ورودی‌ها خالی نباشند
    if (!phone || !code) {
      return NextResponse.json(
        { error: "شماره و کد الزامی است" },
        { status: 400 }
      );
    }

    // ۲. یافتن کاربر
    const user = await db.user.findUnique({
      where: { phoneNumber: phone },
    });

    if (!user) {
      return NextResponse.json(
        { error: "کاربری با این شماره یافت نشد" },
        { status: 404 }
      );
    }

    // ۳. بررسی صحت کد (مهم: اگر این شرط برقرار نباشد، باید پاسخ خطا بدهیم)
    if (user.otpCode !== code) {
      return NextResponse.json(
        { error: "کد وارد شده اشتباه است" },
        { status: 400 } // <--- این خط احتمالا قبلا نبوده
      );
    }

    // ۴. بررسی انقضا
    const now = Date.now();
    const expiryTime = parseInt(user.otpExpires || '0');
    
    if (now > expiryTime) {
         return NextResponse.json(
        { error: "کد منقضی شده است" },
        { status: 400 }
      );
    }

    // ۵. اگر همه چیز درست بود (ساخت توکن)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
    const token = await new SignJWT({ userId: user.id, phoneNumber: user.phoneNumber })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    const response = NextResponse.json({
      status: 'success',
      message: "ورود موفقیت آمیز بود",
    });

    // تنظیم کوکی
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    // پاک کردن کد مصرف شده (اختیاری ولی توصیه شده)
    await db.user.update({
        where: { phoneNumber: phone },
        data: { otpCode: null }
    });

    return response; // <--- بازگشت نهایی موفقیت

  } catch (error) {
    console.error("verify error:", error);
    // ۶. بازگشت پاسخ در صورت بروز هرگونه خطا
    return NextResponse.json(
      { error: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}