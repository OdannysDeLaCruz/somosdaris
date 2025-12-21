import { prisma } from '@/lib/prisma'
import AlliesContent from '@/components/dashboard/AlliesContent'

async function getAllies() {
  const allies = await prisma.user.findMany({
    where: {
      role: {
        name: 'ally',
      },
    },
    include: {
      role: true,
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

  return allies
}

export default async function AliadosPage() {
  const allies = await getAllies()

  return <AlliesContent initialAllies={allies} />
}
