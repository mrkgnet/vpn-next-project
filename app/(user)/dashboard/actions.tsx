"use server";

import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import pricing from "@/lib/pricing";
import { PrismaClient } from "@prisma/client";

// جلوگیری از ساخت چندین نمونه Prisma در محیط توسعه
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const CONFIG = {
  baseUrl: "https://net.abznet.top:38590/cYCQNrtDUJmdEOyeAJ",
  username: "mrkgnet",
  password: "56005600",
  endpoints: {
    login: "/login",
    listInbounds: "/panel/api/inbounds/list",
    addClient: "/panel/api/inbounds/addClient",
    updateInbound: "/panel/api/inbounds/update",
    clientTraffic: "/panel/api/inbounds/getClientTraffics/",
  },
};

// --- دریافت کوکی ---
async function getCookie() {
  const loginUrl = `${CONFIG.baseUrl}${CONFIG.endpoints.login}`;
  const formData = new URLSearchParams();
  formData.append("username", CONFIG.username);
  formData.append("password", CONFIG.password);

  const res = await fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0",
    },
    body: formData,
    cache: "no-store",
  });

  const cookie = res.headers.get("set-cookie");
  if (!cookie) throw new Error("Login Failed: No Cookie received");
  return cookie;
}

// --- دریافت لیست (اصلاح شده) ---
export async function getData() {
  try {
    const cookie = await getCookie();
    // اصلاح شد: از listInbounds استفاده شد چون userTraffic در کانفیگ نبود
    const res = await fetch(`${CONFIG.baseUrl}${CONFIG.endpoints.listInbounds}`, {
      headers: { Cookie: cookie, "Content-Type": "application/json" },
      cache: "no-store",
    });
    const json = await res.json();

    let list: any[] = [];
    const rawData = json.obj || json.data || json;

    if (Array.isArray(rawData)) {
      list = rawData;
    } else if (rawData && typeof rawData === "object") {
      list = [rawData];
    }
    return { success: true, list: list };
  } catch (error: any) {
    return { success: false, message: error.message, list: [] };
  }
}

// --- افزودن کاربر ---
export async function addUserAction(formData: FormData) {
  const email = formData.get("username") as string;
  const gbInput = formData.get("totalGB");
  const daysInput = formData.get("days");

  const gb = Number(gbInput);
  const days = Number(daysInput);

  if (!email) return { success: false, message: "نام کاربری الزامی است" };

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { success: false, message: "لطفا ابتدا وارد حساب کاربری شوید" };
  }

  const secret = process.env.JWT_SECRET || "fallback";
  let userPhone: string;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    userPhone = payload.phoneNumber as string;
  } catch (err) {
    return { success: false, message: "نشست کاربری نامعتبر" };
  }

  const currentPrice = pricing(gb, days);
  let user: any;

  try {
    user = await prisma.user.findUnique({
      where: { phoneNumber: userPhone },
    });

    if (!user) return { success: false, message: "کاربر یافت نشد" };
    if (user.userWallet < currentPrice) return { success: false, message: "موجودی کافی نیست" };
  } catch (err) {
    return { success: false, message: "خطا در ارتباط با دیتابیس" };
  }

  const targetPort = 51222;
  let totalBytes = gb > 0 ? gb * 1024 * 1024 * 1024 : 0;
  let expiryTime = days > 0 ? Date.now() + (days * 24 * 60 * 60 * 1000) : 0;

  try {
    const cookie = await getCookie();
    const listRes = await fetch(`${CONFIG.baseUrl}${CONFIG.endpoints.listInbounds}`, {
      headers: { Cookie: cookie, "Content-Type": "application/json" },
      cache: "no-store",
    });
    const listJson = await listRes.json();
    const inbounds = listJson.obj || listJson.data || [];
    const targetInbound = inbounds.find((inb: any) => inb.port === targetPort);

    if (!targetInbound) return { success: false, message: `پورت ${targetPort} پیدا نشد!` };

    const cleanEmail = email.trim();
    let settings = targetInbound.settings;
    if (typeof settings === "string") {
      try { settings = JSON.parse(settings); } catch (e) {}
    }

    const existingClient = settings?.clients?.find((c: any) => c.email === cleanEmail);
    if (existingClient) return { success: false, message: "این کاربر از قبل وجود دارد." };

    const newClient = {
      id: crypto.randomUUID(),
      email: cleanEmail,
      enable: true,
      limitIp: 0,
      totalGB: totalBytes,
      expiryTime: expiryTime,
      flow: targetInbound.streamSettings?.xtlsSettings?.flow || "",
    };

    const postData = new URLSearchParams();
    postData.append("id", targetInbound.id.toString());
    postData.append("settings", JSON.stringify({ clients: [newClient] }));

    const addRes = await fetch(`${CONFIG.baseUrl}${CONFIG.endpoints.addClient}`, {
      method: "POST",
      headers: { Cookie: cookie, "Content-Type": "application/x-www-form-urlencoded" },
      body: postData,
      cache: "no-store",
    });

    const result = await addRes.json();

    if (result.success) {
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: user.id },
          data: { userWallet: { decrement: currentPrice } },
        });

        await tx.purchase.create({
          data: {
            username: cleanEmail,
            gb: gb,
            days: days,
            price: currentPrice,
            userId: user.id,
          },
        });
      });

      revalidatePath("/");
      return { status: 200, success: true, message: "اشتراک با موفقیت خریداری و ساخته شد" };
    } else {
      return { success: false, message: result.msg || "خطا در پنل" };
    }
  } catch (error: any) {
    return { success: false, message: error.message || "خطای ناشناخته سرور" };
  }
}

// --- اکشن آپدیت کاربر ---
export async function updateUserAction(formData: FormData) {
  const email = formData.get("email") as string;
  const gbInput = formData.get("totalGB") as string;
  const daysInput = formData.get("days") as string;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return { success: false, message: "لطفا ابتدا وارد حساب کاربری شوید" };

  const secret = process.env.JWT_SECRET || "fallback";
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  const { phoneNumber } = payload as { phoneNumber: string };

  const currentPrice = pricing(parseInt(gbInput || "0"), parseInt(daysInput || "0"));
  const cleanEmail = email ? email.trim() : "";

  try {
    const user = await prisma.user.findUnique({ where: { phoneNumber } });
    if (!user) return { success: false, message: "کاربر پیدا نشد" };
    if (user.userWallet < currentPrice) return { success: false, message: "موجودی کافی نیست" };

    const cookie = await getCookie();
    const listRes = await fetch(`${CONFIG.baseUrl}${CONFIG.endpoints.listInbounds}`, {
      headers: { Cookie: cookie, "Content-Type": "application/json" },
      cache: "no-store",
    });
    const listJson = await listRes.json();
    const inbounds = listJson.obj || listJson.data || [];

    let targetInbound: any = null;
    let clientIndex = -1;

    for (const inbound of inbounds) {
      const settings = typeof inbound.settings === "string" ? JSON.parse(inbound.settings) : inbound.settings;
      const index = settings?.clients?.findIndex((c: any) => c.email === cleanEmail);
      if (index !== -1) {
        targetInbound = { ...inbound, settings };
        clientIndex = index;
        break;
      }
    }

    if (!targetInbound) return { success: false, message: "کاربر یافت نشد" };

    const clientToUpdate = targetInbound.settings.clients[clientIndex];
    if (gbInput) clientToUpdate.totalGB = Number(gbInput) * 1024 * 1024 * 1024;
    if (daysInput) {
      clientToUpdate.expiryTime = Number(daysInput) === 0 ? 0 : Date.now() + (Number(daysInput) * 24 * 60 * 60 * 1000);
    }

    const postData = new URLSearchParams();
    postData.append("enable", targetInbound.enable.toString());
    postData.append("remark", targetInbound.remark);
    postData.append("port", targetInbound.port.toString());
    postData.append("protocol", targetInbound.protocol);
    postData.append("settings", JSON.stringify(targetInbound.settings));
    postData.append("streamSettings", typeof targetInbound.streamSettings === 'string' ? targetInbound.streamSettings : JSON.stringify(targetInbound.streamSettings));
    postData.append("sniffing", typeof targetInbound.sniffing === 'string' ? targetInbound.sniffing : JSON.stringify(targetInbound.sniffing));

    const updateRes = await fetch(`${CONFIG.baseUrl}${CONFIG.endpoints.updateInbound}/${targetInbound.id}`, {
      method: "POST",
      headers: { Cookie: cookie, "Content-Type": "application/x-www-form-urlencoded" },
      body: postData,
    });

    if (updateRes.ok) {
        await prisma.user.update({
            where: { id: user.id },
            data: { userWallet: { decrement: currentPrice } },
        });
      revalidatePath("/");
      return { success: true, message: "تمدید با موفقیت انجام شد" };
    }
    return { success: false, message: "خطا در آپدیت پنل" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// --- دریافت لینک VLESS و جزئیات ---
export async function getVlessLinkDetailsAction(formData: FormData) {
  const email = formData.get("email") as string;
  const cleanEmail = email ? email.trim() : "";

  if (!cleanEmail) return { success: false, message: "ایمیل الزامی است" };

  try {
    const cookie = await getCookie();
    const listRes = await fetch(`${CONFIG.baseUrl}${CONFIG.endpoints.listInbounds}`, {
      headers: { Cookie: cookie, "Content-Type": "application/json" },
      cache: "no-store",
    });
    const listJson = await listRes.json();
    const inbounds = listJson.obj || [];

    let foundClient: any = null;
    let foundInbound: any = null;
    let foundStats: any = null;

    for (const inbound of inbounds) {
      const settings = typeof inbound.settings === "string" ? JSON.parse(inbound.settings) : inbound.settings;
      const client = settings?.clients?.find((c: any) => c.email === cleanEmail);
      if (client) {
        foundClient = client;
        foundInbound = inbound;
        foundStats = inbound.clientStats?.find((s: any) => s.email === cleanEmail);
        break;
      }
    }

    if (!foundClient) return { success: false, message: "کاربر یافت نشد" };

    const hostUrl = new URL(CONFIG.baseUrl);
    const vlessLink = `vless://${foundClient.id}@${hostUrl.hostname}:${foundInbound.port}?type=tcp&security=none#${cleanEmail}`;

    const consumedBytes = (foundStats?.up || 0) + (foundStats?.down || 0);
    const totalBytes = foundClient.totalGB || 0;

    return {
      success: true,
      link: vlessLink,
      traffic: {
        remainingGB: totalBytes > 0 ? ((totalBytes - consumedBytes) / (1024 ** 3)).toFixed(2) : "نامحدود",
        remainingDays: foundClient.expiryTime > 0 ? Math.ceil((foundClient.expiryTime - Date.now()) / (1000 * 60 * 60 * 24)).toString() : "نامحدود",
        consumedGB: (consumedBytes / (1024 ** 3)).toFixed(2),
        isExpired: foundClient.enable === false || (totalBytes > 0 && (totalBytes - consumedBytes) <= 0)
      },
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}