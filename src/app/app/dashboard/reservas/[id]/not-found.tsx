import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/lib/routes'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">
          Reserva no encontrada
        </h2>
        <p className="text-gray-500 mt-2">
          La reserva que estás buscando no existe o ha sido eliminada.
        </p>
      </div>

      <Link
        href={ROUTES.DASHBOARD_RESERVAS}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Volver a Reservas
      </Link>
    </div>
  )
}
