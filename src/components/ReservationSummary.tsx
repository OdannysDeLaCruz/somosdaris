'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { PricingSelection } from './PricingSelector'

interface AddressData {
  address: string
  neighborhood: string
  label?: string
  city: string
  state: string
  country: string
  extra?: string
}

interface UserInfo {
  name: string
  lastname: string
  phone: string
  email?: string
}

interface ReservationSummaryProps {
  pricing: PricingSelection
  date: Date
  address: AddressData
  userInfo: UserInfo
  serviceName: string
  applyFirstReservationDiscount?: boolean
}

export function ReservationSummary({
  pricing,
  date,
  address,
  userInfo,
  serviceName,
  applyFirstReservationDiscount = false,
}: ReservationSummaryProps) {
  const discountPercentage = 10
  const basePrice = pricing.calculatedPrice
  const discountAmount = applyFirstReservationDiscount ? basePrice * (discountPercentage / 100) : 0
  const finalPrice = basePrice - discountAmount
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Resumen de tu reserva
      </h2>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-4">
        {/* Servicio */}
        <div>
          <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Servicio
          </div>
          <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {serviceName}
          </div>
        </div>

        {/* Opción seleccionada */}
        <div>
          <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Opción seleccionada
          </div>
          <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {pricing.displayName}
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-zinc-700 dark:text-zinc-300">Precio base:</span>
              <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                ${basePrice.toLocaleString('es-CO')}
              </span>
            </div>

            {applyFirstReservationDiscount && (
              <>
                <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                  <span className="font-medium">Descuento primera reserva ({discountPercentage}%):</span>
                  <span className="font-semibold">
                    -${discountAmount.toLocaleString('es-CO')}
                  </span>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-700 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Total:</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${finalPrice.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              </>
            )}

            {!applyFirstReservationDiscount && (
              <div className="border-t border-zinc-200 dark:border-zinc-700 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Total:</span>
                  <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    ${basePrice.toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fecha y hora */}
        <div>
          <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Fecha y hora del servicio
          </div>
          <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {format(date, "PPPP 'a las' p", { locale: es })}
          </div>
        </div>

        {/* Dirección */}
        <div>
          <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Dirección del servicio
          </div>
          {address.label && (
            <div className="font-semibold text-zinc-900 dark:text-zinc-50">
              {address.label}
            </div>
          )}
          <div className="text-zinc-700 dark:text-zinc-300">
            {address.address}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            {address.neighborhood}, {address.city}, {address.state}, {address.country}
          </div>
          {address.extra && (
            <div className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
              {address.extra}
            </div>
          )}
        </div>

        {/* Cliente */}
        <div>
          <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Información del cliente
          </div>
          <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {userInfo.name} {userInfo.lastname}
          </div>
          <div className="text-zinc-700 dark:text-zinc-300">
            {userInfo.phone}
          </div>
          {userInfo.email && (
            <div className="text-zinc-700 dark:text-zinc-300">
              {userInfo.email}
            </div>
          )}
        </div>
      </div>

      {applyFirstReservationDiscount && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-md text-green-800 dark:text-green-200">
            <strong>¡Felicidades!</strong> Se ha aplicado automáticamente tu descuento de primera reserva del {discountPercentage}%. Ahorras ${discountAmount.toLocaleString('es-CO')}.
          </p>
        </div>
      )}

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-md text-yellow-800 dark:text-yellow-200">
          <strong>Nota:</strong> Solo te cobramos después de recibir el servicio.
        </p>
      </div>
    </div>
  )
}
