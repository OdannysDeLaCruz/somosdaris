import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migratePackagesToPricingOptions() {
  try {
    console.log('Iniciando migración de paquetes a pricing options...')

    // Buscar el servicio de "Limpieza"
    const cleaningService = await prisma.service.findFirst({
      where: { name: 'Limpieza' }
    })

    if (!cleaningService) {
      console.log('Servicio "Limpieza" no encontrado. Creando...')
      // Aquí podrías crear el servicio si no existe
      return
    }

    console.log(`Servicio "Limpieza" encontrado: ${cleaningService.id}`)

    // Actualizar el servicio con pricingModel
    await prisma.service.update({
      where: { id: cleaningService.id },
      data: { pricingModel: 'PACKAGE_BASED' }
    })

    console.log('PricingModel actualizado a PACKAGE_BASED')

    // Verificar si ya existen pricing options para este servicio
    const existingOptions = await prisma.pricingOption.findMany({
      where: { serviceId: cleaningService.id }
    })

    if (existingOptions.length > 0) {
      console.log(`Ya existen ${existingOptions.length} pricing options para este servicio. Saltando migración.`)
      return
    }

    // Obtener todos los paquetes
    const packages = await prisma.package.findMany({
      orderBy: { hours: 'asc' }
    })

    console.log(`Encontrados ${packages.length} paquetes para migrar`)

    // Migrar cada paquete a pricing option
    for (const pkg of packages) {
      const pricingOption = await prisma.pricingOption.create({
        data: {
          serviceId: cleaningService.id,
          name: `${pkg.hours} Horas`,
          description: pkg.restriction || pkg.description,
          basePrice: pkg.price,
          metadata: {
            hours: pkg.hours,
            packageId: pkg.id, // Guardar referencia para backward compatibility
          },
          displayOrder: pkg.hours,
          isActive: true,
        }
      })

      console.log(`✓ Migrado: ${pricingOption.name} (${pkg.hours}h - $${pkg.price})`)
    }

    console.log('\n✅ Migración completada exitosamente!')
    console.log(`Total: ${packages.length} paquetes migrados a pricing options`)

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar la migración
migratePackagesToPricingOptions()
  .then(() => {
    console.log('\nProceso terminado.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error fatal:', error)
    process.exit(1)
  })
