import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  // پاک کردن کوکی با ست کردن انقضا در گذشته
  cookieStore.delete("token");

  return NextResponse.json({ message: "Logged out successfully"  , status: 200 });
}
