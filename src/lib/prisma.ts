import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Configuración para ambientes serverless (Vercel)
    datasourceUrl: process.env.DATABASE_URL,
  })

globalForPrisma.prisma = prisma

// Manejar desconexión en serverless
if (process.env.NODE_ENV === 'production') {
  prisma.$connect()
}
