import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  // ۱. اگر کاربر توکن داشت، نقش او را استخراج می‌کنیم
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role;

      // الف) اگر ادمین بود و خواست به صفحات عادی یا لاگین برود -> هدایت به پنل ادمین
      if (role === "admin") {
        if (pathname === "/" || pathname.startsWith("/auth") || pathname.startsWith("/dashboard")) {
          return NextResponse.redirect(new URL("/adminp", request.url));
        }
      } 
      
      // ب) اگر کاربر عادی بود و خواست به مسیر ادمین برود -> هدایت به صفحه اصلی
      else if (role !== "admin" && pathname.startsWith("/adminp")) {
        return NextResponse.redirect(new URL("/", request.url));
      }

    } catch (error) {
      // اگر توکن خراب یا منقضی بود، کوکی را نادیده می‌گیریم (یا می‌توانید پاک کنید)
      if (pathname.startsWith("/adminp") || pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
    }
  } 
  
  // ۲. اگر کاربر اصلاً توکن نداشت و خواست به مسیرهای محافظت شده برود
  else {
    if (pathname.startsWith("/adminp") || pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * تطبیق روی همه مسیرها بجز:
     * 1. api (خروجی‌های ای‌پی‌آی)
     * 2. _next/static (فایل‌های استاتیک نکست)
     * 3. _next/image (تصاویر بهینه شده)
     * 4. favicon.ico (آیکون سایت)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};