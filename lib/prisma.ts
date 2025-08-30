import { PrismaClient } from '@prisma/client'

// Ensure a single PrismaClient instance across hot reloads in Next.js
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export type { Prisma } from '@prisma/client'
