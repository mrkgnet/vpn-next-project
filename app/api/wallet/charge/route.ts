import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ message: "باید ابتدا وارد شوید" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret");

    // 3. اعتبارسنجی توکن
    const { payload } = await jwtVerify(token.value, secret);

    const userId= (payload.userId || payload.phone) as string;

    const {amount} = await request.json();

    if(!amount || typeof amount !== "number"){
      return NextResponse.json({ message: "مقدار باید عدد باشد" }, { status: 400 });
    }

    const updatedUser = await db.user.update({
        where: { id: userId },
        data: {
            userWallet: {
                increment: amount
            }
        }
    })

   
  return NextResponse.json({ 
      success: true, 
      message: 'شارژ با موفقیت انجام شد',
      newBalance: updatedUser.userWallet 
    });


  } catch (error:any) {
    console.error("Wallet Charge Error:", error);

    if (error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
        return NextResponse.json({ message: 'توکن نامعتبر است (لطفا مجدد لاگین کنید)' }, { status: 401 });
    }

    return NextResponse.json({ message: 'خطای سمت سرور' }, { status: 500 });
  }
}
