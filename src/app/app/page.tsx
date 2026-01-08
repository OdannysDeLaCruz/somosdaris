import { prisma } from '@/lib/prisma'
// import Image from 'next/image'
import type { Metadata } from 'next'
import { AuthRedirect } from '@/components/AuthRedirect'
import FirstReservationBanner from '@/components/FirstReservationBanner'
import ServiceCard from '@/components/ServiceCard'
import FirstReservationTag from '@/components/FirstReservationTag'

export const metadata: Metadata = {
  title: "SomosDaris - Servicios",
  description: "Reserva servicios de limpieza profesional en Valledupar. Paquetes por horas, precios competitivos y servicio garantizado.",
  openGraph: {
    title: "SomosDaris - Servicios de Limpieza en Valledupar",
    description: "Reserva servicios de limpieza profesional en Valledupar. Paquetes por horas, precios competitivos.",
  }
}

export default async function Home() {
  const activesServices = await prisma.service.findMany({
    where: {
      comingSoon: false
    }
  })

  const comingSoonServices = await prisma.service.findMany({
    where: {
      comingSoon: true
    }
  })

  return (
    <AuthRedirect>
      {/* First Reservation Banner */}
      <FirstReservationBanner />

      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mb-24">
          {/* First Reservation Discount Tag */}
          <FirstReservationTag />
          
          <div>
            <p className="text-xl font-bold text-center text-gray-800 mb-8 mt-8">
              ¿En que podemos ayudarte hoy?
            </p>
          </div>

          {/* Services Grid */}
          <div className="flex flex-col gap-4 justify-center mb-8 max-w-128 mx-auto">
            {activesServices.map(service => (
              <ServiceCard
                key={service.id}
                id={service.id}
                name={service.name}
                description={service.description}
                image={service.image}
                comingSoon={service.comingSoon}
              />
            ))}
          </div>

          {activesServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">
                No hay servicios disponibles en este momento.
              </p>
            </div>
          )}

          { comingSoonServices.length > 0 && (
            <div>
              <div className="mt-12">
                <p className="font-bold text-blue-600 dark:text-blue-400 mb-4 text-center bg-blue-100 dark:bg-blue-900/20 px-5 rounded-full w-fit mx-auto">
                  Próximos servicios
                </p>
              </div>

              <div className="flex flex-col gap-4 justify-center mb-8 max-w-128 mx-auto">
                {comingSoonServices.map(service => (
                  <ServiceCard
                    key={service.id}
                    id={service.id}
                    name={service.name}
                    description={service.description}
                    image={service.image}
                    comingSoon={service.comingSoon}
                  />
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </AuthRedirect>
  )
}
