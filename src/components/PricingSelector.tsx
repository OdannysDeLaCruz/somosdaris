'use client'

import { useState, useEffect } from 'react'
import PackageBasedSelector from './pricing/PackageBasedSelector'
import FormulaBasedSelector from './pricing/FormulaBasedSelector'
import ItemBasedSelector from './pricing/ItemBasedSelector'
import QuoteBasedSelector from './pricing/QuoteBasedSelector'
import { FormulaVariable, PricingOption } from '@/types'

interface Service {
  id: string
  name: string
  pricingModel: 'PACKAGE_BASED' | 'FORMULA_BASED' | 'ITEM_BASED' | 'QUOTE_BASED'
}

interface PricingSelectorProps {
  serviceId: string
  onSelect: (selection: PricingSelection) => void
  selectedId?: string
}

export interface PricingSelection {
  pricingOptionId?: string
  pricingData: unknown
  calculatedPrice: number
  displayName: string
}

export function PricingSelector({ serviceId, onSelect, selectedId }: PricingSelectorProps) {
  const [service, setService] = useState<Service | null>(null)
  const [pricingOptions, setPricingOptions] = useState<PricingOption[]>([])
  const [formulaVariables, setFormulaVariables] = useState<FormulaVariable[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPricingData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [serviceData, optionsData, variablesData] = await Promise.all([
          fetch(`/api/services/${serviceId}`).then(res => {
            if (!res.ok) throw new Error('Error al cargar servicio')
            return res.json()
          }),
          fetch(`/api/services/${serviceId}/pricing-options`).then(res => {
            if (!res.ok) throw new Error('Error al cargar opciones de precio')
            return res.json()
          }),
          fetch(`/api/services/${serviceId}/formula-variables`).then(res => {
            if (!res.ok) return []
            return res.json()
          }),
        ])

        setService(serviceData)
        setPricingOptions(optionsData)
        setFormulaVariables(variablesData || [])
      } catch (err) {
        console.error('Error loading pricing data:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    loadPricingData()
  }, [serviceId])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando opciones...</p>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">
          {error || 'Error al cargar las opciones de precio'}
        </p>
      </div>
    )
  }

  // QUOTE_BASED doesn't need pricing options - it goes directly to WhatsApp
  if (service.pricingModel === 'QUOTE_BASED') {
    return <QuoteBasedSelector />
  }

  if (pricingOptions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          No hay opciones de precio disponibles para este servicio.
        </p>
      </div>
    )
  }

  switch (service.pricingModel) {
    case 'PACKAGE_BASED':
      return (
        <PackageBasedSelector
          options={pricingOptions}
          onSelect={onSelect}
          selectedId={selectedId}
        />
      )

    case 'FORMULA_BASED':
      return (
        <FormulaBasedSelector
          options={pricingOptions}
          variables={formulaVariables}
          onSelect={onSelect}
        />
      )

    case 'ITEM_BASED':
      return (
        <ItemBasedSelector
          options={pricingOptions}
          onSelect={onSelect}
        />
      )

    default:
      return (
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">
            Modelo de cobro no soportado: {service.pricingModel}
          </p>
        </div>
      )
  }
}
