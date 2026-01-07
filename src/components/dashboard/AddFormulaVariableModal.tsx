'use client'

import { useState } from 'react'

interface AddFormulaVariableModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  serviceId: string
}

export default function AddFormulaVariableModal({
  isOpen,
  onClose,
  onSuccess,
  serviceId,
}: AddFormulaVariableModalProps) {
  const [name, setName] = useState('')
  const [label, setLabel] = useState('')
  const [type, setType] = useState<'number' | 'select'>('number')
  const [minValue, setMinValue] = useState('')
  const [maxValue, setMaxValue] = useState('')
  const [defaultValue, setDefaultValue] = useState('')
  const [multiplier, setMultiplier] = useState('')
  const [displayOrder, setDisplayOrder] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !label) {
      alert('El nombre y etiqueta son requeridos')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`/api/services/${serviceId}/formula-variables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          label,
          type,
          minValue: minValue ? parseInt(minValue) : null,
          maxValue: maxValue ? parseInt(maxValue) : null,
          defaultValue: defaultValue || null,
          multiplier: multiplier ? parseFloat(multiplier) : null,
          displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al crear variable de fórmula')
      }

      // Reset form
      setName('')
      setLabel('')
      setType('number')
      setMinValue('')
      setMaxValue('')
      setDefaultValue('')
      setMultiplier('')
      setDisplayOrder('')

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error creating formula variable:', error)
      alert(error instanceof Error ? error.message : 'Error al crear variable de fórmula')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 my-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Agregar Variable de Fórmula
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre (clave interna) *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="cantidad"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Solo letras minúsculas, sin espacios (ej: cantidad, altura)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiqueta (mostrada al usuario) *
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Número de tanques"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'number' | 'select')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="number">Número</option>
                <option value="select">Selector</option>
              </select>
            </div>

            {type === 'number' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor mínimo
                    </label>
                    <input
                      type="number"
                      value={minValue}
                      onChange={(e) => setMinValue(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor máximo
                    </label>
                    <input
                      type="number"
                      value={maxValue}
                      onChange={(e) => setMaxValue(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor por defecto
                  </label>
                  <input
                    type="text"
                    value={defaultValue}
                    onChange={(e) => setDefaultValue(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Multiplicador
              </label>
              <input
                type="number"
                value={multiplier}
                onChange={(e) => setMultiplier(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="5000"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">
                Factor por el que se multiplica esta variable en la fórmula
              </p>
            </div>

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
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
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
