import { PrismaClient } from "@prisma/client";

/**
 * https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices#solution
 */
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({});

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
