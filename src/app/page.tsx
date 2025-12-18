import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
// import { AuthGate } from '@/components/AuthGate'

export default async function Home() {
  const services = await prisma.service.findMany()

  return (
    // <AuthGate>
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Image
            src="/images/logo-con-lema.png"
            className="mx-auto"
            alt="Daris"
            width={200}
            height={200}
          />
        </div>

        <div>
          <p className="text-xl font-bold text-center text-gray-800 mb-16">
            ¿En que podemos ayudarte hoy?
          </p>
        </div>

        {/* Services Grid */}
        <div className="flex justify-center">
          {services.map(service => (
            <Link
              key={service.id}
              href={`/servicios/${service.id}/reservar`}
              className="flex group bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-all hover:scale-105"
            >
              <div className="flex items-center justify-center p-2">
                {service.image && (
                  <Image
                    src="/images/limpieza.gif"
                    alt={service.name}
                    width={100}
                    height={100}
                  />
                )}
              </div>
              <div className="p-4">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                  {service.name}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  {service.description}
                </p>
                <div className="flex items-center text-zinc-900 dark:text-zinc-50 font-semibold group-hover:translate-x-2 transition-transform">
                  Reservar ahora
                  <ChevronRight className="w-5 h-5 ml-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">
              No hay servicios disponibles en este momento.
            </p>
          </div>
        )}
      </main>
    </div>
    // </AuthGate>
  )
}
