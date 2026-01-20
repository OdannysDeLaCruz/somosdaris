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
  await prisma.formulaVariable.deleteMany()
  await prisma.pricingOption.deleteMany()
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

  // ========================================
  // SERVICIO 1: LIMPIEZA (PACKAGE_BASED)
  // ========================================

  const cleaningService = await prisma.service.create({
    data: {
      name: 'Limpieza del Hogar',
      description: 'Servicio de limpieza profesional para tu hogar u oficina.',
      image: '/images/services/limpieza.gif',
      comingSoon: false,
      pricingModel: 'PACKAGE_BASED',
    },
  })

  console.log('✅ Servicio de Limpieza creado:', cleaningService.name)

  // Crear paquetes de horas (legacy - aún se usan por si hay código antiguo)
  const packages = await prisma.package.createMany({
    data: [
      {
        description: 'Paquete Básico',
        hours: 4,
        price: 78000,
        restriction: 'Perfecto para casas pequeñas (1-2 habitaciones)',
      },
      {
        description: 'Paquete Estándar',
        hours: 6,
        price: 98000,
        restriction: 'Para casas medianas (2-3 habitaciones)',
      },
      {
        description: 'Paquete Premium',
        hours: 8,
        price: 115000,
        restriction: 'Para casas grandes (4+ habitaciones)',
      },
    ],
  })

  console.log(`✅ ${packages.count} paquetes legacy creados`)

  // Crear pricing options para el servicio de Limpieza
  await prisma.pricingOption.createMany({
    data: [
      {
        serviceId: cleaningService.id,
        name: '4 Horas',
        description: 'Perfecto para casas pequeñas (1-2 habitaciones)',
        basePrice: 78000,
        metadata: { hours: 4 },
        displayOrder: 4,
        isActive: true,
      },
      {
        serviceId: cleaningService.id,
        name: '6 Horas',
        description: 'Para casas medianas (2-3 habitaciones)',
        basePrice: 98000,
        metadata: { hours: 6 },
        displayOrder: 6,
        isActive: true,
      },
      {
        serviceId: cleaningService.id,
        name: '8 Horas',
        description: 'Para casas grandes (4+ habitaciones)',
        basePrice: 115000,
        metadata: { hours: 8 },
        displayOrder: 8,
        isActive: true,
      },
    ],
  })

  console.log('✅ Opciones de precio para Limpieza creadas')

  // ========================================
  // SERVICIO 2: LIMPIEZA DE TANQUES (FORMULA_BASED)
  // ========================================

  const tankService = await prisma.service.create({
    data: {
      name: 'Limpieza de Tanques Elevados',
      description: 'Limpieza y desinfección profesional de tanques de agua elevados.',
      image: '/images/services/tanques.webp',
      comingSoon: false,
      pricingModel: 'FORMULA_BASED',
    },
  })

  console.log('✅ Servicio de Tanques creado:', tankService.name)

  // Crear pricing option base para tanques
  await prisma.pricingOption.create({
    data: {
      serviceId: tankService.id,
      name: 'Limpieza de Tanques Elevados',
      description: 'Precio base por tanque, ajustable según cantidad y altura',
      basePrice: 50000,
      displayOrder: 1,
      isActive: true,
    },
  })

  console.log('✅ Opción de precio para Tanques creada')

  // Crear variables de fórmula para tanques
  await prisma.formulaVariable.createMany({
    data: [
      {
        serviceId: tankService.id,
        name: 'cantidad',
        label: 'Número de tanques',
        type: 'number',
        minValue: 1,
        maxValue: 10,
        defaultValue: '1',
        multiplier: 1,
        displayOrder: 1,
      },
      {
        serviceId: tankService.id,
        name: 'altura',
        label: 'Piso donde está el tanque',
        type: 'number',
        minValue: 1,
        maxValue: 10,
        defaultValue: '1',
        multiplier: 5000,
        displayOrder: 2,
      },
    ],
  })

  console.log('✅ Variables de fórmula para Tanques creadas')

  // ========================================
  // SERVICIO 3: LAVADO EN SECO (QUOTE_BASED)
  // ========================================

  await prisma.service.create({
    data: {
      name: 'Lavado en Seco',
      description: 'Limpieza de sofás, sillas, colchones y más con lavado en seco profesional.',
      image: '/images/services/lavado-seco.png',
      comingSoon: false,
      pricingModel: 'QUOTE_BASED',
    },
  })

  console.log('✅ Servicio de Lavado en Seco creado')

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

  console.log('\n🎉 Seed completado exitosamente!')
  console.log('\n📊 Resumen:')
  console.log('   - 3 Roles creados (admin, ally, customer)')
  console.log('   - 1 Usuario admin creado')
  console.log('   - 3 Servicios creados:')
  console.log('     • Limpieza (PACKAGE_BASED) - 3 opciones de precio')
  console.log('     • Limpieza de Tanques (FORMULA_BASED) - 2 variables de fórmula')
  console.log('     • Lavado en Seco (QUOTE_BASED) - cotización por WhatsApp')
  console.log('   - 3 Paquetes legacy creados')
  console.log('   - 1 Cupón de primera reserva creado')
  console.log('\n💡 Puedes iniciar sesión con:')
  console.log('   Email: admin@somosdaris.com')
  console.log('   Teléfono: +573017953727')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
