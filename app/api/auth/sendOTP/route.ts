
// مسیر فایل: app/api/auth/route.ts
import { db } from "@/lib/db";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;

    // Generate a random 5-digit code
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    // Set the expiration time to 60 seconds from now
    const expireTime = (Date.now() + 120 * 1000).toString();

    const response = await fetch("https://edge.ippanel.com/v1/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "YTA2Njk0NzktMzQwNC00ZDU4LTg5MDYtNzNlMGE0ZWM4OGMxY2I2NjhlYzQ4NGRhN2U2MmM3YWVlODc3ZmI3NWUxY2E=",
      },
      body: JSON.stringify({
        sending_type: "pattern",
        from_number: "+983000505",
        code: "ynmxn3w9zh37m3w",
        recipients: [phone],
        params: {
          code: code,
        },
      }),
    });

    if (response.ok) {
      console.log("OTP sent successfully.......");
      const existingUser = await db.user.findUnique({
        where: { phoneNumber: phone },
      })
      let saveUser :User;
      if(existingUser){
        saveUser = await db.user.update({
          where: { phoneNumber: phone },
          data: { otpCode: code, otpExpires: expireTime },
        });
      }else{
        saveUser = await db.user.create({
          data: { phoneNumber: phone, otpCode: code, otpExpires: expireTime },
        })
      }



      return NextResponse.json({
        status: "success",
        message: "شماره با موفقیت در دیتابیس ذخیره شد",
        user: saveUser,
      });
    } else {
      console.error("Failed to send OTP:", response.statusText);
    }
  } catch (error) {
    console.error("خطا:", error);

    return NextResponse.json({ error: "خطا در اسال (لطفا 2 دقیقه دیگه مجدد امتحان کنید)" }, { status: 500 });
  }
}
