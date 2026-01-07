'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/components/AuthProvider'
import LoginPrompt from '@/components/LoginPrompt'
import EmptyState from '@/components/EmptyState'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { fetchWithAuth } from '@/lib/fetchWithAuth'

interface Reservation {
  id: string
  type: string
  date: string
  status: string
  service: {
    name: string
    description: string
  }
  package: {
    description: string
    hours: number
    price: number
  }
  address: {
    address: string
    neighborhood: string
    city: string
  }
  coupon?: {
    discountCode: string
    discountAmount: number
    discountType: string
  } | null
  ally?: {
    id: string
    name: string
    lastname: string
    phone: string
    photo: string | null
  } | null
  createdAt: string
}

export default function HistorialPage() {
  const { user, loading } = useAuth()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user) {
      fetchReservations()
    } else if (!loading && !user) {
      setIsLoading(false)
    }
  }, [user, loading])

  const fetchReservations = async () => {
    try {
      setIsLoading(true)
      const response = await fetchWithAuth('/api/reservations')

      if (!response.ok) {
        throw new Error('Error al cargar las reservas')
      }

      const data = await response.json()
      setReservations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <LoginPrompt
        title="Inicia sesión para ver tu historial"
        message="Para ver tus reservas anteriores, necesitas iniciar sesión en tu cuenta."
        icon={
          <svg
            className="w-20 h-20 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        }
      />
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      </div>
    )
  }

  if (reservations.length === 0) {
    return (
      <EmptyState
        icon={
          <svg
            className="w-24 h-24 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
          </svg>
        }
        title="No tienes reservas aún"
        message="Cuando realices tu primera reserva, aparecerá aquí en tu historial."
      />
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente'
      case 'confirmed':
        return 'Confirmada'
      case 'completed':
        return 'Completada'
      case 'cancelled':
        return 'Cancelada'
      default:
        return status
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 mb-20 md:mb-0">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Historial de reservas
      </h1>

      <div className="space-y-4">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {reservation.service.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {format(new Date(reservation.date), "EEEE, d 'de' MMMM 'a las' HH:mm", {
                    locale: es,
                  })}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  reservation.status
                )}`}
              >
                {getStatusLabel(reservation.status)}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div className="flex items-center gap-2">
                  <span>{reservation.package.hours} horas</span>
                  {reservation.coupon ? (
                    <>
                      <span className="text-gray-400 line-through">
                        ${Number(reservation.package.price).toLocaleString('es-CO')}
                      </span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ${(
                          Number(reservation.package.price) -
                          (reservation.coupon.discountType === 'percentage'
                            ? Number(reservation.package.price) * (Number(reservation.coupon.discountAmount) / 100)
                            : Number(reservation.coupon.discountAmount))
                        ).toLocaleString('es-CO')}
                      </span>
                      <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded">
                        -{reservation.coupon.discountAmount}
                        {reservation.coupon.discountType === 'percentage' ? '%' : ' COP'}
                      </span>
                    </>
                  ) : (
                    <span className="font-semibold">
                      ${Number(reservation.package.price).toLocaleString('es-CO')}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-start text-gray-700 dark:text-gray-300">
                <svg
                  className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>
                  {reservation.address.address}
                  {reservation.address.neighborhood && `, ${reservation.address.neighborhood}`}
                  {', '}
                  {reservation.address.city}
                </span>
              </div>
              {reservation.ally && (
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  {reservation.ally.photo ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
                      <Image
                        src={reservation.ally.photo}
                        alt={`${reservation.ally.name} ${reservation.ally.lastname}`}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        style={{ width: 'auto', height: 'auto' }}
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold shadow-sm">
                      {reservation.ally.name.charAt(0)}{reservation.ally.lastname.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Profesional asignado
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {reservation.ally.name} {reservation.ally.lastname}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
