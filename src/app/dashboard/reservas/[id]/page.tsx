import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ReservationDetail from '@/components/dashboard/ReservationDetail'

async function getReservation(id: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          role: true,
        },
      },
      ally: {
        include: {
          role: true,
        },
      },
      service: true,
      address: true,
      package: true,
      coupon: true,
      payments: true,
    },
  })

  return reservation
}

async function getAllies() {
  const allies = await prisma.user.findMany({
    where: {
      role: {
        name: 'ally',
      },
    },
    select: {
      id: true,
      name: true,
      lastname: true,
      phone: true,
      email: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  return allies
}

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [reservation, allies] = await Promise.all([
    getReservation(id),
    getAllies(),
  ])

  if (!reservation) {
    notFound()
  }

  return <ReservationDetail reservation={reservation} allies={allies} />
}
