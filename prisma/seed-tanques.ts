import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Creando servicio de Limpieza de Tanques Elevados...')

  // 1. Crear el servicio
  const service = await prisma.service.create({
    data: {
      name: 'Limpieza de Tanques Elevados',
      description: 'Servicio especializado en limpieza y desinfección de tanques elevados de agua potable. Incluye lavado, desinfección y certificado sanitario.',
      image: '/images/tanques.jpg',
      comingSoon: false,
      pricingModel: 'FORMULA_BASED',
    },
  })

  console.log('✅ Servicio creado:', service.name)

  // 2. Crear la opción de precio base
  const pricingOption = await prisma.pricingOption.create({
    data: {
      serviceId: service.id,
      name: 'Limpieza de Tanque',
      description: 'Precio base por tanque, ajustable según cantidad y altura',
      basePrice: 50000,
      displayOrder: 1,
      isActive: true,
      metadata: {},
    },
  })

  console.log('✅ Opción de precio creada:', pricingOption.name)

  // 3. Crear variable de cantidad
  const cantidadVariable = await prisma.formulaVariable.create({
    data: {
      serviceId: service.id,
      name: 'cantidad',
      label: 'Número de tanques',
      type: 'number',
      minValue: 1,
      maxValue: 10,
      defaultValue: '1',
      multiplier: 1,
      displayOrder: 1,
    },
  })

  console.log('✅ Variable "cantidad" creada')

  // 4. Crear variable de altura
  const alturaVariable = await prisma.formulaVariable.create({
    data: {
      serviceId: service.id,
      name: 'altura',
      label: 'Piso donde está el tanque',
      type: 'number',
      minValue: 1,
      maxValue: 10,
      defaultValue: '1',
      multiplier: 5000,
      displayOrder: 2,
    },
  })

  console.log('✅ Variable "altura" creada')

  console.log('\n🎉 ¡Servicio de Limpieza de Tanques configurado exitosamente!')
  console.log('\n📊 Resumen:')
  console.log(`   - Servicio ID: ${service.id}`)
  console.log(`   - Modelo de cobro: ${service.pricingModel}`)
  console.log(`   - Precio base: $${Number(pricingOption.basePrice).toLocaleString('es-CO')}`)
  console.log(`   - Variables de fórmula: ${cantidadVariable.name}, ${alturaVariable.name}`)
  console.log('\n💡 Fórmula de cálculo:')
  console.log('   Precio = 50,000 × cantidad + 5,000 × (altura - 1)')
  console.log('\n📝 Ejemplos:')
  console.log('   - 1 tanque, piso 1: $50,000')
  console.log('   - 2 tanques, piso 3: $110,000')
  console.log('   - 3 tanques, piso 5: $170,000')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
