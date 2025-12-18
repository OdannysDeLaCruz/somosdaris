'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

function ConfirmacionContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reservationId = searchParams.get('id')

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!reservationId) {
      router.push('/')
      return
    }

    // En un caso real, harías fetch a la API para obtener los detalles
    // Por ahora simulamos con un timeout
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [reservationId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            ¡Reserva exitosa!
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Tu reserva ha sido creada correctamente
          </p>
        </div>

        {/* Information Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Detalles de la reserva
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">ID de reserva:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                #{reservationId?.substring(0, 8)}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Próximos pasos
          </h3>
          <ul className="list-disc list-inside space-y-2 text-blue-800 dark:text-blue-200">
            <li>Nos pondremos en contacto contigo para confirmar tu reserva</li>
            <li>Recibirás una llamada o mensaje en el teléfono proporcionado</li>
            <li>El pago se realizará después de recibir el servicio</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-lg text-center font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            Volver al inicio
          </Link>
          <Link
            href="/"
            className="flex-1 px-6 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg text-center text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Hacer otra reserva
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <p>¿Tienes alguna pregunta?</p>
          <p className="mt-1">Contáctanos o revisa el estado de tu reserva</p>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Cargando...</div>
      </div>
    }>
      <ConfirmacionContent />
    </Suspense>
  )
}
