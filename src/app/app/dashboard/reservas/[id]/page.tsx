import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ReservationDetail from '@/components/dashboard/ReservationDetail'

interface PricingItem {
  name: string
  quantity: number
  price: number
}

interface PricingData {
  cantidad?: number
  altura?: number
  items?: PricingItem[]
}

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
      pricingOption: true,
      coupon: true,
      payments: true,
    },
  })

  if (!reservation) return null

  // Convertir Decimal a number para evitar errores de serialización
  return {
    ...reservation,
    finalPrice: Number(reservation.finalPrice),
    pricingData: reservation.pricingData as PricingData | undefined,
    package: reservation.package ? {
      ...reservation.package,
      price: Number(reservation.package.price),
    } : null,
    pricingOption: reservation.pricingOption ? {
      ...reservation.pricingOption,
      basePrice: Number(reservation.pricingOption.basePrice),
    } : null,
    coupon: reservation.coupon ? {
      ...reservation.coupon,
      discountAmount: Number(reservation.coupon.discountAmount),
    } : null,
  }
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
