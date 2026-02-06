import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AllyDetail from '@/components/dashboard/AllyDetail'

async function getAlly(id: string) {
  const ally = await prisma.user.findUnique({
    where: { id },
    include: {
      role: true,
      allyReservations: {
        include: {
          service: true,
          user: true,
          address: true,
        },
        orderBy: {
          date: 'desc',
        },
      },
    },
  })

  if (!ally || ally.role.name !== 'ally') return null

  return {
    ...ally,
    allyReservations: ally.allyReservations.map((r) => ({
      ...r,
      finalPrice: Number(r.finalPrice),
    })),
  }
}

export default async function AllyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const ally = await getAlly(id)

  if (!ally) {
    notFound()
  }

  return <AllyDetail ally={ally} />
}
