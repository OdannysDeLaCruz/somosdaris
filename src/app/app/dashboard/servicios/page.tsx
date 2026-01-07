import { prisma } from '@/lib/prisma'
import ServicesContent from '@/components/dashboard/ServicesContent'

async function getServices() {
  const services = await prisma.service.findMany({
    include: {
      _count: {
        select: {
          reservations: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return services
}

export default async function ServiciosPage() {
  const services = await getServices()

  return <ServicesContent initialServices={services} />
}
