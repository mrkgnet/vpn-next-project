import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isUserPage = pathname.startsWith("/dashboard");
  const isAdminPage = pathname.startsWith("/adminp");

  // ۱. اگر مسیر ادمین بود، سخت‌گیری کامل (باید حتماً توکن و رول ادمین داشته باشد)
  if (isAdminPage) {
    if (!token) return NextResponse.redirect(new URL("/auth/login", request.url));
    
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // ۲. اگر مسیر داشبورد بود، فقط اگر توکن داشت رولش را چک کن
  // اگر توکن نداشت، رها کن تا صفحه رندر شود (چون خودت در کامپوننت مدیریت می‌کنی)
  if (isUserPage && token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
      // اگر کسی با رول ادمین خواست بیاید داشبورد یوزر، بفرستش پنل خودش
      if (payload.role === "admin") {
        return NextResponse.redirect(new URL("/adminp", request.url));
      }
    } catch (error) {
      // اگر توکن خراب بود، کوکی را نادیده بگیر یا پاک کن (اختیاری)
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/adminp/:path*"],
};