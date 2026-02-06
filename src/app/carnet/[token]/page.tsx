import { verifyCarnetToken } from '@/lib/carnet'
import { prisma } from '@/lib/prisma'
import CarnetCard from '@/components/CarnetCard'
import Image from 'next/image'

interface CarnetPageProps {
  params: Promise<{ token: string }>
}

export default async function CarnetPage({ params }: CarnetPageProps) {
  const { token } = await params
  const payload = verifyCarnetToken(decodeURIComponent(token))

  if (!payload) {
    return <CarnetError message="Enlace inválido" />
  }

  if (payload.type === 'cvt') {
    return <CVTCarnet reservationId={payload.reservationId} />
  }

  return <CVUCarnet allyId={payload.allyId} />
}

async function CVTCarnet({ reservationId }: { reservationId: string }) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      ally: true,
      service: true,
    },
  })

  if (!reservation || !reservation.ally) {
    return <CarnetError message="Carnet no disponible" />
  }

  if (reservation.status !== 'pending' && reservation.status !== 'in_progress') {
    return <CarnetError message="Este carnet temporal ya no está vigente" />
  }

  const ally = reservation.ally
  const allyName = [ally.name, ally.lastname].filter(Boolean).join(' ') || 'Sin nombre'

  return (
    <CarnetLayout>
      <CarnetCard
        type="cvt"
        allyName={allyName}
        allyPhoto={ally.photo}
        identificationNumber={ally.identificationNumber}
        serviceName={reservation.service.name}
      />
    </CarnetLayout>
  )
}

async function CVUCarnet({ allyId }: { allyId: string }) {
  const ally = await prisma.user.findUnique({
    where: { id: allyId },
    include: {
      role: true,
    },
  })

  if (!ally || ally.role.name !== 'ally') {
    return <CarnetError message="Carnet no disponible" />
  }

  // Get distinct service names from ally's reservations
  const reservations = await prisma.reservation.findMany({
    where: { allyId: ally.id },
    select: { service: { select: { name: true } } },
    distinct: ['serviceId'],
  })

  const serviceNames = reservations.map((r) => r.service.name)
  const allyName = [ally.name, ally.lastname].filter(Boolean).join(' ') || 'Sin nombre'

  return (
    <CarnetLayout>
      <CarnetCard
        type="cvu"
        allyName={allyName}
        allyPhoto={ally.photo}
        identificationNumber={ally.identificationNumber}
        serviceName={serviceNames.length > 0 ? serviceNames : ['Sin servicios asignados']}
      />
    </CarnetLayout>
  )
}

function CarnetLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      {children}
    </div>
  )
}

function CarnetError({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-sm w-full text-center space-y-4">
        <Image
          src="/images/logo-azul.png"
          alt="SomosDaris"
          width={140}
          height={35}
          className="mx-auto"
        />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}
