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
  await prisma.role.deleteMany()

  // Crear roles del sistema
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      isActive: true,
    },
  })

  const allyRole = await prisma.role.create({
    data: {
      name: 'ally',
      isActive: true,
    },
  })

  const customerRole = await prisma.role.create({
    data: {
      name: 'customer',
      isActive: true,
    },
  })

  console.log('✅ Roles creados:', { adminRole, allyRole, customerRole })

  // Crear usuario administrador por defecto
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin',
      lastname: 'SomosDaris',
      phone: '+573017953727',
      email: 'admin@somosdaris.com',
      roleId: adminRole.id,
    },
  })

  console.log('✅ Usuario administrador creado:', adminUser)

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
        description: 'Paquete Básico',
        hours: 4,
        price: 91000,
        restriction: 'Perfecto para casas pequeñas (1-2 habitaciones)',
      },
      {
        description: 'Paquete Estándar',
        hours: 6,
        price: 117000,
        restriction: 'Para casas medianas (2-3 habitaciones)',
      },
      {
        description: 'Paquete Premium',
        hours: 8,
        price: 137000,
        restriction: 'Para casas grandes (4+ habitaciones)',
      },
    ],
  })

  console.log(`✅ ${packages.count} paquetes de horas creados`)

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
