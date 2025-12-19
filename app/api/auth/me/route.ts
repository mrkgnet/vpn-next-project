
import { db } from "@/lib/db";
import { jwtVerify } from "jose";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // ۲. اعتبارسنجی توکن
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback_secret"
    );



    const { payload } = await jwtVerify(token.value, secret);

    const userId = payload.userId as string;

    if(!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }



    const user = await db.user.findUnique({
      where: { 
        id: userId 
      },
      select: {
        id: true,
        phoneNumber: true,
        userWallet: true, // ✅ این چیزی است که نیاز دارید
        // usreAccount: true, // اگر نیاز دارید آنکامنت کنید
        // سایر فیلدهایی که می‌خواهید در فرانت داشته باشید
      }
    });




    return NextResponse.json({
      status: "success",
      user:user ,
    });
  } catch (error) {
    // اگر توکن دستکاری شده یا منقضی شده باشد
    return NextResponse.json(
      { message: "Invalid Token", user: null },
      { status: 401 }
    );
  }
}
