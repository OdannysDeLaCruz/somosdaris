'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Mail, Phone, Calendar, Copy, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import AddAllyModal from './AddAllyModal'
import { ROUTES } from '@/lib/routes'
import { User, Role } from '@prisma/client'

type AllyWithDetails = User & {
  role: Role
  _count: {
    allyReservations: number
  }
}

interface AlliesContentProps {
  initialAllies: AllyWithDetails[]
}

export default function AlliesContent({ initialAllies }: AlliesContentProps) {
  const [allies, setAllies] = useState<AllyWithDetails[]>(initialAllies)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copiedAllyId, setCopiedAllyId] = useState<string | null>(null)

  const handleCopyCVU = async (allyId: string) => {
    try {
      const response = await fetch('/api/carnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'cvu', allyId }),
      })

      if (!response.ok) throw new Error('Error al generar enlace')

      const { url } = await response.json()
      await navigator.clipboard.writeText(url)
      setCopiedAllyId(allyId)
      setTimeout(() => setCopiedAllyId(null), 2000)
    } catch (error) {
      console.error('Error copying CVU link:', error)
      alert('Error al copiar el enlace del carnet')
    }
  }

  const handleSuccess = async () => {
    // Reload allies data
    try {
      const response = await fetch('/api/allies')
      if (response.ok) {
        const data = await response.json()
        setAllies(data)
      }
    } catch (error) {
      console.error('Error reloading allies:', error)
      // Fallback: reload the page
      window.location.reload()
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Aliados</h1>
            <p className="text-gray-500 mt-2">
              Gestiona los aliados del sistema
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Agregar Aliado
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total Aliados</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {allies.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Activos</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {allies.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total Servicios</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {allies.reduce((acc, ally) => acc + ally._count.allyReservations, 0)}
            </p>
          </div>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allies.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No hay aliados registrados</p>
            </div>
          ) : (
            allies.map((ally) => (
              <div
                key={ally.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {ally.photo ? (
                      <Image
                        src={ally.photo}
                        alt={ally.name || 'Aliado'}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-lg">
                          {(ally.name || ally.phone).charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {ally.name || 'Sin nombre'}{' '}
                        {ally.lastname || ''}
                      </h3>
                      <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                        Aliado
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={16} />
                    <span>{ally.phone}</span>
                  </div>
                  {ally.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} />
                      <span className="truncate">{ally.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>
                      Desde{' '}
                      {format(new Date(ally.createdAt), 'MMM yyyy', {
                        locale: es,
                      })}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Servicios realizados
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {ally._count.allyReservations}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Link
                    href={ROUTES.DASHBOARD_ALIADO_DETAIL(ally.id)}
                    className="flex-1 px-3 py-2 text-sm text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ver Detalles
                  </Link>
                  <button
                    onClick={() => handleCopyCVU(ally.id)}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Copiar enlace de carnet permanente"
                  >
                    {copiedAllyId === ally.id ? (
                      <>
                        <Check size={14} />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        CVU
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Ally Modal */}
      <AddAllyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  )
}
