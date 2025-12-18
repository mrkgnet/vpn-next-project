import { status } from "./../../../../node_modules/effect/src/Fiber";
import { jwtVerify } from "jose";
import { effect } from "./../../../../node_modules/effect/src/internal/channel/channelState";
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

    return NextResponse.json({
      status: "success",
      user: payload,
    });
  } catch (error) {
    // اگر توکن دستکاری شده یا منقضی شده باشد
    return NextResponse.json(
      { message: "Invalid Token", user: null },
      { status: 401 }
    );
  }
}
