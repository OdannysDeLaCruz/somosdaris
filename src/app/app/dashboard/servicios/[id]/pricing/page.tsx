import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PricingManagementContent from '@/components/dashboard/PricingManagementContent'
import { ROUTES } from '@/lib/routes'

export default async function PricingManagementPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Fetch service with pricing options and formula variables
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      pricingOptions: {
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      },
      formulaVariables: {
        orderBy: { displayOrder: 'asc' },
      },
    },
  })

  if (!service) {
    redirect(ROUTES.DASHBOARD_SERVICIOS)
  }

  return <PricingManagementContent service={service} />
}
