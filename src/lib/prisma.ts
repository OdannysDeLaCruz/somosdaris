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


// import { PrismaClient } from '@prisma/client'

// const prismaClientSingleton = () => {
//   return new PrismaClient({
//     log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
//     // datasourceUrl se toma automáticamente de DATABASE_URL si no se especifica, 
//     // pero dejarlo explícito está bien.
//     datasourceUrl: process.env.DATABASE_URL,
//   })
// }

// type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClientSingleton | undefined
// }

// export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma