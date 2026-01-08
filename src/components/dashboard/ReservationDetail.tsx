'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Decimal } from '@prisma/client/runtime/library'
import { ROUTES } from '@/lib/routes'

type ReservationStatus = 'pending' | 'completed' | 'cancelled'
type ReservationType = 'home' | 'office'

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

interface AllyType {
  id: string
  name: string | null
  lastname: string | null
  phone: string
  email: string | null
}

interface ReservationDetailProps {
  reservation: {
    id: string
    type: ReservationType
    date: Date
    status: ReservationStatus
    createdAt: Date
    finalPrice: number
    pricingData?: PricingData
    user: {
      id: string
      name: string | null
      lastname: string | null
      phone: string
      email: string | null
    }
    ally: AllyType | null
    service: {
      id: string
      name: string
      description: string
    }
    address: {
      id: string
      address: string
      neighborhood: string
      city: string
      state: string
      extra: string | null
    }
    package: {
      id: string
      description: string
      hours: number
      price: number
    } | null
    pricingOption: {
      id: string
      name: string
      description: string | null
      basePrice: number
    } | null
    coupon: {
      id: string
      discountCode: string
      discountAmount: number
      discountType: 'percentage' | 'fixed'
    } | null
    payments: Array<{
      id: string
      amount: Decimal
      paymentMethod: string
      createdAt: Date
    }>
  }
  allies: AllyType[]
}

export default function ReservationDetail({ reservation: initialReservation, allies }: ReservationDetailProps) {
  const [reservation, setReservation] = useState(initialReservation)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ReservationStatus
    if (newStatus === reservation.status) return

    setIsUpdating(true)

    try {
      const response = await fetch(`/api/reservations/${reservation.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el estado')
      }

      const updatedReservation = await response.json()
      setReservation(updatedReservation)
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error al actualizar el estado de la reserva')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAllyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAllyId = e.target.value || null
    if (newAllyId === reservation.ally?.id) return

    setIsUpdating(true)

    try {
      const response = await fetch(`/api/reservations/${reservation.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ allyId: newAllyId }),
      })

      if (!response.ok) {
        throw new Error('Error al asignar el aliado')
      }

      const updatedReservation = await response.json()
      setReservation(updatedReservation)
    } catch (error) {
      console.error('Error assigning ally:', error)
      alert('Error al asignar el aliado a la reserva')
    } finally {
      setIsUpdating(false)
    }
  }

  const getTypeLabel = (type: ReservationType) => {
    return type === 'home' ? 'Casa' : 'Oficina'
  }

  const calculateTotal = () => {
    return reservation.finalPrice
  }

  const getBasePrice = () => {
    if (reservation.pricingOption) {
      return reservation.pricingOption.basePrice
    }
    // Fallback a finalPrice si no hay pricing option
    return reservation.finalPrice
  }

  const discount = reservation.coupon
    ? getBasePrice() - calculateTotal()
    : 0

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={ROUTES.DASHBOARD_RESERVAS}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detalle de Reserva</h1>
          <p className="text-sm text-gray-500">ID: {reservation.id.slice(0, 8)}...</p>
        </div>
      </div>

      {/* Form-like List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
        {/* Estado */}
        <div className="p-4 hover:bg-gray-50 transition-colors">
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Estado
          </label>
          <select
            value={reservation.status}
            onChange={handleStatusChange}
            disabled={isUpdating}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-900 font-medium"
          >
            <option value="pending">Pendiente</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>

        {/* Aliado Asignado */}
        <div className="p-4 hover:bg-gray-50 transition-colors">
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Profesional Asignado
          </label>
          <select
            value={reservation.ally?.id || ''}
            onChange={handleAllyChange}
            disabled={isUpdating}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-900 font-medium"
          >
            <option value="">Sin asignar</option>
            {allies.map((ally) => (
              <option key={ally.id} value={ally.id}>
                {ally.name || 'Sin nombre'} {ally.lastname || ''} - {ally.phone}
              </option>
            ))}
          </select>
          {reservation.ally && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Contacto:</span> {reservation.ally.phone}
              {reservation.ally.email && ` | ${reservation.ally.email}`}
            </p>
          )}
        </div>

        <div className="p-4 hover:bg-gray-50 transition-colors">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Cliente
          </label>
          <p className="text-base text-gray-900">
            {reservation.user.name || 'Sin nombre'} {reservation.user.lastname || ''}
          </p>
        </div>

        <div className="p-4 hover:bg-gray-50 transition-colors">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Teléfono
          </label>
          <p className="text-base text-gray-900">{reservation.user.phone}</p>
        </div>

        {reservation.user.email && (
          <div className="p-4 hover:bg-gray-50 transition-colors">
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Email
            </label>
            <p className="text-base text-gray-900">{reservation.user.email}</p>
          </div>
        )}

        <div className="p-4 hover:bg-gray-50 transition-colors">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Servicio
          </label>
          <p className="text-base text-gray-900">{reservation.service.name}</p>
        </div>

        <div className="p-4 hover:bg-gray-50 transition-colors">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Tipo
          </label>
          <p className="text-base text-gray-900">{getTypeLabel(reservation.type)}</p>
        </div>

        <div className="p-4 hover:bg-gray-50 transition-colors">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Fecha y Hora
          </label>
          <p className="text-base text-gray-900">
            {format(new Date(reservation.date), 'EEEE, d MMMM yyyy - h:mm a', { locale: es })}
          </p>
        </div>

        <div className="p-4 hover:bg-gray-50 transition-colors">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Dirección
          </label>
          <p className="text-base text-gray-900">{reservation.address.address}</p>
          <p className="text-sm text-gray-600 mt-1">
            {reservation.address.neighborhood}, {reservation.address.city}, {reservation.address.state}
          </p>
          {reservation.address.extra && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Nota:</span> {reservation.address.extra}
            </p>
          )}
        </div>

        {reservation.pricingOption && (
          <div className="p-4 hover:bg-gray-50 transition-colors">
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Opción Seleccionada
            </label>
            <p className="text-base text-gray-900 font-medium">
              {reservation.pricingOption.name}
            </p>
            {reservation.pricingOption.description && (
              <p className="text-sm text-gray-600 mt-1">
                {reservation.pricingOption.description}
              </p>
            )}
          </div>
        )}

        {/* Datos de Pricing (para fórmulas) */}
        {reservation.pricingData && (
          <div className="p-4 hover:bg-gray-50 transition-colors">
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Detalles del Servicio
            </label>
            <div className="space-y-2">
              {reservation.pricingData.cantidad !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Número de tanques:</span>
                  <span className="text-base text-gray-900 font-medium">{reservation.pricingData.cantidad}</span>
                </div>
              )}
              {reservation.pricingData.altura !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Piso donde está el tanque:</span>
                  <span className="text-base text-gray-900 font-medium">{reservation.pricingData.altura}</span>
                </div>
              )}
              {reservation.pricingData.items && reservation.pricingData.items.length > 0 && (
                <div className="space-y-1">
                  <span className="text-sm text-gray-600">Items:</span>
                  {reservation.pricingData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center ml-4">
                      <span className="text-sm text-gray-900">{item.name} (x{item.quantity})</span>
                      <span className="text-base text-gray-900 font-medium">${item.price.toLocaleString('es-CO')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Precio Base */}
        {/* <div className="p-4 hover:bg-gray-50 transition-colors">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Precio Base
          </label>
          <p className="text-base text-gray-900">
            ${getBasePrice().toLocaleString('es-CO')}
          </p>
        </div> */}

        {/* Cupón */}
        {/* {reservation.coupon && (
          <>
            <div className="p-4 hover:bg-gray-50 transition-colors">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Cupón Aplicado
              </label>
              <p className="text-base text-green-600 font-medium">
                {reservation.coupon.discountCode}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {reservation.coupon.discountType === 'percentage'
                  ? `${reservation.coupon.discountAmount}% de descuento`
                  : `$${Number(reservation.coupon.discountAmount).toLocaleString()} de descuento`}
              </p>
            </div>

            <div className="p-4 hover:bg-gray-50 transition-colors">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Descuento
              </label>
              <p className="text-base text-green-600">
                -${discount.toLocaleString()}
              </p>
            </div>
          </>
        )} */}

        {/* Total */}
        {/* <div className="p-4 bg-blue-50 hover:bg-blue-100 transition-colors">
          <label className="block text-sm font-medium text-blue-700 mb-1">
            Total
          </label>
          <p className="text-2xl font-bold text-blue-900">
            ${calculateTotal().toLocaleString()}
          </p>
        </div> */}

        {/* Fecha de Creación */}
        {/* <div className="p-4 hover:bg-gray-50 transition-colors">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Fecha de Creación
          </label>
          <p className="text-base text-gray-900">
            {format(new Date(reservation.createdAt), 'PPP p', { locale: es })}
          </p>
        </div> */}

        {/* Pagos */}
        {/* {reservation.payments.length > 0 && (
          <div className="p-4 hover:bg-gray-50 transition-colors">
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Pagos Registrados
            </label>
            <div className="space-y-2">
              {reservation.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center text-sm"
                >
                  <div>
                    <span className="font-medium text-gray-900">
                      ${Number(payment.amount).toLocaleString()}
                    </span>
                    <span className="text-gray-500 ml-2">
                      via {payment.paymentMethod}
                    </span>
                  </div>
                  <span className="text-gray-500">
                    {format(new Date(payment.createdAt), 'PP', { locale: es })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  )
}
