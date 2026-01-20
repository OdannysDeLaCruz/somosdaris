'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit2, Trash2, Settings } from 'lucide-react'
import { Service, PricingOption, FormulaVariable, PricingModel } from '@prisma/client'
import AddPricingOptionModal from './AddPricingOptionModal'
import EditPricingOptionModal from './EditPricingOptionModal'
import AddFormulaVariableModal from './AddFormulaVariableModal'
import { ROUTES } from '@/lib/routes'

type ServiceWithRelations = Service & {
  pricingOptions: PricingOption[]
  formulaVariables: FormulaVariable[]
}

interface PricingManagementContentProps {
  service: ServiceWithRelations
}

export default function PricingManagementContent({ service: initialService }: PricingManagementContentProps) {
  const [service, setService] = useState<ServiceWithRelations>(initialService)
  const [isAddOptionModalOpen, setIsAddOptionModalOpen] = useState(false)
  const [isEditOptionModalOpen, setIsEditOptionModalOpen] = useState(false)
  const [isAddVariableModalOpen, setIsAddVariableModalOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<PricingOption | null>(null)
  const [selectedVariable, setSelectedVariable] = useState<FormulaVariable | null>(null)
  const [updatingModel, setUpdatingModel] = useState(false)

  const handleModelChange = async (newModel: PricingModel) => {
    if (!confirm(`¿Estás seguro de cambiar el modelo de cobro a ${newModel}? Esto puede afectar las reservas futuras.`)) {
      return
    }

    try {
      setUpdatingModel(true)
      const response = await fetch(`/api/services/${service.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricingModel: newModel }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al actualizar modelo de cobro')
      }

      const updatedService = await response.json()
      setService({ ...service, pricingModel: updatedService.pricingModel })
    } catch (error) {
      console.error('Error updating pricing model:', error)
      alert(error instanceof Error ? error.message : 'Error al actualizar modelo de cobro')
    } finally {
      setUpdatingModel(false)
    }
  }

  const refreshData = async () => {
    try {
      const response = await fetch(`/api/services/${service.id}/pricing-options`)
      const options = await response.json()

      const variablesResponse = await fetch(`/api/services/${service.id}/formula-variables`)
      const variables = await variablesResponse.json()

      setService({
        ...service,
        pricingOptions: options,
        formulaVariables: variables || [],
      })
    } catch (error) {
      console.error('Error refreshing data:', error)
    }
  }

  const handleDeleteOption = async (option: PricingOption) => {
    if (!confirm(`¿Estás seguro de eliminar la opción "${option.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/services/${service.id}/pricing-options/${option.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al eliminar opción')
      }

      await refreshData()
    } catch (error) {
      console.error('Error deleting option:', error)
      alert(error instanceof Error ? error.message : 'Error al eliminar opción')
    }
  }

  const handleDeleteVariable = async (variable: FormulaVariable) => {
    if (!confirm(`¿Estás seguro de eliminar la variable "${variable.label}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/services/${service.id}/formula-variables/${variable.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al eliminar variable')
      }

      await refreshData()
    } catch (error) {
      console.error('Error deleting variable:', error)
      alert(error instanceof Error ? error.message : 'Error al eliminar variable')
    }
  }

  const handleEditOption = (option: PricingOption) => {
    setSelectedOption(option)
    setIsEditOptionModalOpen(true)
  }

  const pricingModelLabels: Record<PricingModel, string> = {
    PACKAGE_BASED: 'Por Paquetes',
    FORMULA_BASED: 'Por Fórmula',
    ITEM_BASED: 'Por Artículos',
    QUOTE_BASED: 'Por Cotización',
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href={ROUTES.DASHBOARD_SERVICIOS}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Configuración de Precios
            </h1>
            <p className="text-gray-500 mt-1">{service.name}</p>
          </div>
        </div>

        {/* Pricing Model Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={20} className="text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Modelo de Cobro
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['PACKAGE_BASED', 'FORMULA_BASED', 'ITEM_BASED'] as PricingModel[]).map((model) => (
              <button
                key={model}
                onClick={() => handleModelChange(model)}
                disabled={updatingModel || service.pricingModel === model}
                className={`p-4 rounded-lg border-2 transition-all ${
                  service.pricingModel === model
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-400'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="font-semibold text-gray-900 mb-1">
                  {pricingModelLabels[model]}
                </div>
                <div className="text-sm text-gray-600">
                  {model === 'PACKAGE_BASED' && 'Paquetes fijos (ej: 4h, 6h, 8h)'}
                  {model === 'FORMULA_BASED' && 'Cálculo dinámico con variables'}
                  {model === 'ITEM_BASED' && 'Por tipo y cantidad de artículos'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Options */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Opciones de Precio
            </h2>
            <button
              onClick={() => setIsAddOptionModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Agregar Opción
            </button>
          </div>

          {service.pricingOptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay opciones de precio configuradas
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Descripción
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Precio Base
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Orden
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {service.pricingOptions.map((option) => (
                    <tr key={option.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {option.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {option.description || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        ${Number(option.basePrice).toLocaleString('es-CO')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {option.displayOrder}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditOption(option)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteOption(option)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Formula Variables - Only for FORMULA_BASED */}
        {service.pricingModel === 'FORMULA_BASED' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Variables de Fórmula
              </h2>
              <button
                onClick={() => setIsAddVariableModalOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Agregar Variable
              </button>
            </div>

            {service.formulaVariables.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay variables de fórmula configuradas
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Nombre
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Etiqueta
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Tipo
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Multiplicador
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {service.formulaVariables.map((variable) => (
                      <tr key={variable.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-gray-900">
                          {variable.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {variable.label}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {variable.type}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {variable.multiplier ? `×${variable.multiplier}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <button
                            onClick={() => handleDeleteVariable(variable)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddPricingOptionModal
        isOpen={isAddOptionModalOpen}
        onClose={() => setIsAddOptionModalOpen(false)}
        onSuccess={refreshData}
        serviceId={service.id}
        pricingModel={service.pricingModel}
      />

      <EditPricingOptionModal
        isOpen={isEditOptionModalOpen}
        onClose={() => {
          setIsEditOptionModalOpen(false)
          setSelectedOption(null)
        }}
        onSuccess={refreshData}
        serviceId={service.id}
        option={selectedOption}
        pricingModel={service.pricingModel}
      />

      <AddFormulaVariableModal
        isOpen={isAddVariableModalOpen}
        onClose={() => setIsAddVariableModalOpen(false)}
        onSuccess={refreshData}
        serviceId={service.id}
      />
    </>
  )
}
