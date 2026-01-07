'use client'

import { useState } from 'react'
import { PricingModel } from '@prisma/client'

interface AddPricingOptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  serviceId: string
  pricingModel: PricingModel
}

export default function AddPricingOptionModal({
  isOpen,
  onClose,
  onSuccess,
  serviceId,
  pricingModel,
}: AddPricingOptionModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [displayOrder, setDisplayOrder] = useState('')
  const [hours, setHours] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !basePrice) {
      alert('El nombre y precio base son requeridos')
      return
    }

    try {
      setLoading(true)

      // Build metadata based on pricing model
      const metadata: Record<string, unknown> = {}
      if (pricingModel === 'PACKAGE_BASED' && hours) {
        metadata.hours = parseInt(hours)
      }

      const response = await fetch(`/api/services/${serviceId}/pricing-options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description: description || null,
          basePrice: parseFloat(basePrice),
          displayOrder: displayOrder ? parseInt(displayOrder) : 0,
          metadata: Object.keys(metadata).length > 0 ? metadata : null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al crear opción de precio')
      }

      // Reset form
      setName('')
      setDescription('')
      setBasePrice('')
      setDisplayOrder('')
      setHours('')

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error creating pricing option:', error)
      alert(error instanceof Error ? error.message : 'Error al crear opción de precio')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Agregar Opción de Precio
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={pricingModel === 'PACKAGE_BASED' ? 'Ej: 4 Horas' : 'Ej: Tanque Básico'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Descripción opcional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio Base (COP) *
              </label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="50000"
                min="0"
                step="1000"
                required
              />
            </div>

            {pricingModel === 'PACKAGE_BASED' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horas
                </label>
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="4"
                  min="1"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orden de visualización
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
