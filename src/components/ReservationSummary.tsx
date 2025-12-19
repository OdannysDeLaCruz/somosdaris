'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Package {
  id: string
  description: string
  hours: number
  price: number
}

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
  package: Package
  date: Date
  address: AddressData
  userInfo: UserInfo
  serviceName: string
}

export function ReservationSummary({
  package: pkg,
  date,
  address,
  userInfo,
  serviceName,
}: ReservationSummaryProps) {
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

        {/* Paquete */}
        <div>
          <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Paquete seleccionado
          </div>
          <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {pkg.description} - {pkg.hours} horas
          </div>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
            ${Number(pkg.price).toLocaleString('es-CO')}
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

      <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          <strong>Nota:</strong> El pago se realizará después de recibir el servicio.
          Nos pondremos en contacto contigo para confirmar la reserva.
        </p>
      </div>
    </div>
  )
}
