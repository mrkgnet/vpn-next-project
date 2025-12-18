// مسیر فایل: lib/connectDB.ts (یا lib/db.ts)
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// متغیر را db نام‌گذاری می‌کنیم
export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db