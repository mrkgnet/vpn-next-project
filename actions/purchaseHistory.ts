"use server"; // حتماً باشد

import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache"; // این را ایمپورت کن
export async function getPurchaseHistory() {
   noStore()
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return { success: false, data: [] };

    const secret = process.env.JWT_SECRET || "fallback";
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

    const purchases = await db.purchase.findMany({
      where: { userId: payload.id as string },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: purchases };
  } catch (error) {
    return { success: false, data: [] };
  }
}