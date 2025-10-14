import { PrismaClient } from "@prisma/client";
declare global { var __prisma: PrismaClient | undefined; }
export const prisma = global.__prisma ?? new PrismaClient();
if (!global.__prisma) global.__prisma = prisma;
