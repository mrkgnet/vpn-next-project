"use server";

import { revalidatePath } from "next/cache";
import crypto, { verify } from "crypto";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import pricing from "@/lib/pricing";
import { PrismaClient } from "@prisma/client";
import { useAuth } from "@/context/AuthContext";

const prisma = new PrismaClient();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const CONFIG = {
  baseUrl: "https://net.abznet.top:38590/cYCQNrtDUJmdEOyeAJ",
  username: "mrkgnet",
  password: "56005600",
  endpoints: {
    login: "/login",
    listInbounds: "/panel/api/inbounds/list",
    addClient: "/panel/api/inbounds/addClient",
    updateInbound: "/panel/api/inbounds/update", // مسیر جدید برای آپدیت کل اینباند
    // userTraffic: "/panel/api/inbounds/getClientTraffics/vipsha"
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

// --- دریافت لیست ---
export async function getData() {
  try {
    const cookie = await getCookie();
    const res = await fetch(`${CONFIG.baseUrl}${CONFIG.endpoints.userTraffic}`, {
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
  const { user, isLoading, checkAuth } = useAuth();
  if (!user) {
    return { success: false, message: "لطفا ابتدا وارد حساب کاربری شوید" };
  }
  const email = formData.get("email") as string;
  const gbInput = formData.get("totalGB") as string;
  const daysInput = formData.get("days") as string;
  console.log(email + "-" + gbInput + "-" + daysInput);

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value; // اسم کوکی توکن شما

  if (!token) {
    return { success: false, message: "لطفا ابتدا وارد حساب کاربری شوید" };
  }

  const secret = process.env.JWT_SECRET || "fallback";
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  const currentPrice = pricing(parseInt(gbInput), parseInt(daysInput));
  
  if(currentPrice < user.userWallet) 
  {
      return { success: false, message: "موجودی حساب شما کافی نیست" };
  }


  

  //
  const targetPort = 51222;

  if (!email) return { success: false, message: "ایمیل الزامی است" };

  let totalBytes = 0;
  if (gbInput && Number(gbInput) > 0) {
    totalBytes = Number(gbInput) * 1024 * 1024 * 1024;
  }

  let expiryTime = 0;
  if (daysInput && Number(daysInput) > 0) {
    const now = Date.now();
    const daysInMillis = Number(daysInput) * 24 * 60 * 60 * 1000;
    expiryTime = now + daysInMillis;
  }

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
      try {
        settings = JSON.parse(settings);
      } catch (e) {}
    }

    const existingClient = settings?.clients?.find((c: any) => c.email === cleanEmail);
    if (existingClient)
      return { success: false, message: "این کاربر از قبل وجود دارد، لطفا از بخش آپدیت استفاده کنید." };

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
      revalidatePath("/products");
      return { success: true, message: "کاربر با موفقیت ساخته شد" };
    } else {
      return { success: false, message: result.msg || "خطا در پنل" };
    }
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// --- اکشن آپدیت کاربر (روش نهایی: آپدیت کل اینباند) ---
export async function updateUserAction(formData: FormData) {
  const email = formData.get("email") as string;
  const gbInput = formData.get("totalGB") as string;
  const daysInput = formData.get("days") as string;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value; // اسم کوکی توکن شما

  if (!token) {
    // اگر توکن نبود، یعنی کاربر لاگین نیست
    return { success: false, message: "لطفا ابتدا وارد حساب کاربری شوید" };
  }

  const secret = process.env.JWT_SECRET || "default_secret_key_change_me";
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

  const { phoneNumber } = payload as { phoneNumber: string };

  const currentPrice = pricing(parseInt(gbInput), parseInt(daysInput));

  const cleanEmail = email ? email.trim() : "";

  if (!cleanEmail) return { success: false, message: "ایمیل الزامی است" };

  try {
    const user = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (!user) {
      return { success: false, message: "کاربر پیدا نشد" };
    }

    if (user.userWallet < currentPrice) {
      return { success: false, message: "موجودی حساب شما کافی نیست" };
    }

    await prisma.$transaction(async (tx) => {
      // الف: کسر پول
      await tx.user.update({
        where: { id: user.id },
        data: { userWallet: { decrement: currentPrice } },
      });
    });

    // ب: آپدیت کاربر
    const cookie = await getCookie();

    // 1. دریافت لیست کامل اینباندها
    const listRes = await fetch(`${CONFIG.baseUrl}${CONFIG.endpoints.listInbounds}`, {
      headers: { Cookie: cookie, "Content-Type": "application/json" },
      cache: "no-store",
    });
    const listJson = await listRes.json();
    const inbounds = listJson.obj || listJson.data || [];

    // 2. پیدا کردن اینباند و کلاینت مورد نظر
    let targetInbound = null;
    let clientIndex = -1;

    for (const inbound of inbounds) {
      // پارس کردن تنظیمات (چون معمولاً استرینگ هستند)
      if (typeof inbound.settings === "string") {
        try {
          inbound.settings = JSON.parse(inbound.settings);
        } catch (e) {}
      }
      // پارس کردن تنظیمات استریم (مهم)
      if (typeof inbound.streamSettings === "string") {
        try {
          inbound.streamSettings = JSON.parse(inbound.streamSettings);
        } catch (e) {}
      }
      // پارس کردن تنظیمات اسنیفینگ
      if (typeof inbound.sniffing === "string") {
        try {
          inbound.sniffing = JSON.parse(inbound.sniffing);
        } catch (e) {}
      }

      const clients = inbound.settings?.clients || [];
      const index = clients.findIndex((c: any) => c.email === cleanEmail);

      if (index !== -1) {
        targetInbound = inbound;
        clientIndex = index;
        break;
      }
    }

    if (!targetInbound || clientIndex === -1) {
      console.error(`❌ کاربر ${cleanEmail} در هیچ پورتی پیدا نشد.`);
      return { success: false, message: `کاربر ${cleanEmail} پیدا نشد!` };
    }

    // console.log(`✅ کاربر در پورت ${targetInbound.port} پیدا شد.`);

    // 3. اعمال تغییرات روی کلاینت مورد نظر (داخل حافظه)
    const clientToUpdate = targetInbound.settings.clients[clientIndex];

    if (gbInput !== null && gbInput !== "") {
      const newGb = Number(gbInput) * 1024 * 1024 * 1024;
      clientToUpdate.totalGB = newGb;
      console.log(`✏️ تغییر حجم به: ${newGb}`);
    }

    if (daysInput !== null && daysInput !== "") {
      if (Number(daysInput) === 0) {
        clientToUpdate.expiryTime = 0;
      } else {
        const now = Date.now();
        const daysInMillis = Number(daysInput) * 24 * 60 * 60 * 1000;
        clientToUpdate.expiryTime = now + daysInMillis;
      }
      //  console.log(`✏️ تغییر زمان به: ${clientToUpdate.expiryTime}`);
    }

    // بروزرسانی آرایه کلاینت‌ها در اینباند
    targetInbound.settings.clients[clientIndex] = clientToUpdate;

    // 4. آماده‌سازی پکیج برای ارسال به /inbounds/update/:id
    // ما باید تمام فیلدهای اینباند را برگردانیم
    const updateUrl = `${CONFIG.baseUrl}${CONFIG.endpoints.updateInbound}/${targetInbound.id}`;

    // console.log(`🌐 ارسال آپدیت کلی به: ${updateUrl}`);

    const postData = new URLSearchParams();

    // افزودن فیلدهای اصلی اینباند
    postData.append("enable", targetInbound.enable.toString());
    postData.append("remark", targetInbound.remark);
    postData.append("port", targetInbound.port.toString());
    postData.append("protocol", targetInbound.protocol);
    postData.append("listen", targetInbound.listen || "");
    postData.append("up", targetInbound.up.toString());
    postData.append("down", targetInbound.down.toString());
    postData.append("total", targetInbound.total.toString());

    // تبدیل آبجکت‌های پیچیده به رشته JSON
    postData.append("settings", JSON.stringify(targetInbound.settings));
    postData.append("streamSettings", JSON.stringify(targetInbound.streamSettings));
    postData.append("sniffing", JSON.stringify(targetInbound.sniffing));

    const updateRes = await fetch(updateUrl, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: postData,
      cache: "no-store",
    });

    // خواندن نتیجه
    let result;
    const text = await updateRes.text();
    try {
      result = JSON.parse(text);
    } catch {
      result = { success: updateRes.ok, msg: text };
    }

    // console.log("📄 نتیجه سرور:", JSON.stringify(result));

    if (result.success) {
      revalidatePath("/products");
      return {
        success: true,
        message: `کاربر ${cleanEmail} با موفقیت تمدید شد`,
      };
    } else {
      return { success: false, message: result.msg || "خطا در عملیات" };
    }
  } catch (error: any) {
    console.error("💥 خطای سیستم:", error);
    return { success: false, message: error.message };
  }
}

// --- اکشن دریافت لینک VLESS ---
export async function getVlessLinkAction(formData: FormData) {
  const email = formData.get("email") as string;
  const cleanEmail = email ? email.trim() : "";

  if (!cleanEmail) return { success: false, message: "ایمیل الزامی است" };

  try {
    const cookie = await getCookie();

    // 1. دریافت لیست کل اینباندها (متد GET)
    const listRes = await fetch(`${CONFIG.baseUrl}${CONFIG.endpoints.listInbounds}`, {
      headers: { Cookie: cookie, "Content-Type": "application/json" },
      cache: "no-store",
    });
    const listJson = await listRes.json();
    const inbounds = listJson.obj || listJson.data || [];

    // 2. جستجوی کاربر
    let foundClient = null;
    let foundInbound = null;

    for (const inbound of inbounds) {
      // پارس کردن تنظیمات برای دسترسی به کلاینت‌ها
      if (typeof inbound.settings === "string") {
        try {
          inbound.settings = JSON.parse(inbound.settings);
        } catch (e) {}
      }
      // پارس کردن تنظیمات شبکه برای ساخت لینک صحیح
      if (typeof inbound.streamSettings === "string") {
        try {
          inbound.streamSettings = JSON.parse(inbound.streamSettings);
        } catch (e) {}
      }

      const clients = inbound.settings?.clients || [];
      const client = clients.find((c: any) => c.email === cleanEmail);

      if (client) {
        foundClient = client;
        foundInbound = inbound;
        break;
      }
    }

    if (!foundClient || !foundInbound) {
      return { success: false, message: "کاربر پیدا نشد" };
    }

    // 3. ساخت لینک VLESS
    // استخراج آدرس هاست از کانفیگ بیس
    const hostUrl = new URL(CONFIG.baseUrl);
    const address = hostUrl.hostname; // مثلا net.abznet.top
    const port = foundInbound.port;
    const uuid = foundClient.id;
    const type = foundInbound.streamSettings?.network || "tcp";
    const security = foundInbound.streamSettings?.security || "none";
    const flow = foundClient.flow || ""; // برای xtls/reality

    let query = `type=${type}&security=${security}`;

    // اضافه کردن تنظیمات اختصاصی (Path برای WS و ...)
    if (type === "ws") {
      const path = foundInbound.streamSettings?.wsSettings?.path || "/";
      query += `&path=${encodeURIComponent(path)}`;
      const host = foundInbound.streamSettings?.wsSettings?.headers?.Host || "";
      if (host) query += `&host=${host}`;
    }

    if (flow) {
      query += `&flow=${flow}`;
    }

    // ساخت لینک نهایی
    const vlessLink = `vless://${uuid}@${address}:${port}?${query}#${cleanEmail}`;

    return { success: true, link: vlessLink, message: "لینک دریافت شد" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
