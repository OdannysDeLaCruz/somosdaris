import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Limpiar datos existentes (opcional, comentar si no quieres limpiar)
  await prisma.payment.deleteMany()
  await prisma.reservation.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.package.deleteMany()
  await prisma.service.deleteMany()

  // Crear servicio de Limpieza
  const cleaningService = await prisma.service.create({
    data: {
      name: 'Limpieza',
      description: 'Servicio profesional de limpieza para tu hogar u oficina',
      image: 'https://example.com/limpieza.jpg',
    },
  })

  console.log('✅ Servicio de Limpieza creado:', cleaningService)

  // Crear paquetes de horas
  const packages = await prisma.package.createMany({
    data: [
      {
        description: 'Paquete Estándar',
        hours: 4,
        price: 91000,
        restriction: 'Perfecto para casas medianas',
      },
      {
        description: 'Paquete Premium',
        hours: 6,
        price: 130000,
        restriction: 'Para casas grandes o limpieza profunda',
      },
      {
        description: 'Paquete Full',
        hours: 8,
        price: 165000,
        restriction: 'Limpieza completa de espacios grandes',
      },
    ],
  })

  console.log(`✅ ${packages.count} paquetes de horas creados`)

  // Crear cupón de ejemplo
  const coupon = await prisma.coupon.create({
    data: {
      discountCode: 'BIENVENIDA2025',
      discountAmount: 10,
      discountType: 'percentage',
      usageLimit: 100,
      isActive: true,
      expiresAt: new Date('2025-12-31'),
    },
  })

  console.log('✅ Cupón de descuento creado:', coupon)

  // Crear cupón de primera reserva (10% de descuento automático)
  const firstReservationCoupon = await prisma.coupon.create({
    data: {
      discountCode: 'PRIMERA_RESERVA',
      discountAmount: 10,
      discountType: 'percentage',
      usageLimit: 999999, // Sin límite efectivo
      isActive: true,
      isFirstReservationDiscount: true,
      expiresAt: new Date('2099-12-31'), // Prácticamente sin expiración
    },
  })

  console.log('✅ Cupón de primera reserva creado:', firstReservationCoupon)

  console.log('🎉 Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
