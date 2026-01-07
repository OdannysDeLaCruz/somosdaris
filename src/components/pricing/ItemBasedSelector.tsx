'use client'

import { useState } from 'react'
import { PricingSelection } from '../PricingSelector'

interface PricingOption {
  id: string
  name: string
  description: string | null
  basePrice: number
  metadata?: unknown
}

interface ItemBasedSelectorProps {
  options: PricingOption[]
  onSelect: (selection: PricingSelection) => void
}

export default function ItemBasedSelector({
  options,
  onSelect
}: ItemBasedSelectorProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const handleQuantityChange = (optionId: string, quantity: number) => {
    const newQuantities = { ...quantities, [optionId]: Math.max(0, quantity) }
    setQuantities(newQuantities)

    // Calcular precio total
    let total = 0
    const selectedItems: Array<{ name: string; quantity: number; price: number }> = []

    options.forEach(option => {
      const qty = newQuantities[option.id] || 0
      if (qty > 0) {
        total += Number(option.basePrice) * qty
        selectedItems.push({
          name: option.name,
          quantity: qty,
          price: Number(option.basePrice)
        })
      }
    })

    // Generar display name
    const displayName = selectedItems.length > 0
      ? selectedItems.map(item => `${item.quantity}x ${item.name}`).join(', ')
      : 'Selecciona artículos'

    onSelect({
      pricingOptionId: options[0]?.id,
      pricingData: { items: selectedItems },
      calculatedPrice: total,
      displayName,
    })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-black dark:text-zinc-50">
        Selecciona los artículos
      </h3>

      <div className="space-y-4">
        {options.map(option => (
          <div
            key={option.id}
            className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">
                  {option.name}
                </h4>
                {option.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    {option.description}
                  </p>
                )}
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-2">
                  ${Number(option.basePrice).toLocaleString('es-CO')} c/u
                </p>
              </div>

              <div className="flex items-center gap-3 ml-4">
                <button
                  onClick={() => handleQuantityChange(option.id, (quantities[option.id] || 0) - 1)}
                  className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-50 font-bold transition-colors"
                  disabled={(quantities[option.id] || 0) === 0}
                >
                  -
                </button>
                <span className="w-12 text-center text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {quantities[option.id] || 0}
                </span>
                <button
                  onClick={() => handleQuantityChange(option.id, (quantities[option.id] || 0) + 1)}
                  className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Precio total:
          </span>
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            ${Object.entries(quantities).reduce((total, [optionId, qty]) => {
              const option = options.find(o => o.id === optionId)
              return total + (option ? Number(option.basePrice) * qty : 0)
            }, 0).toLocaleString('es-CO')}
          </span>
        </div>
      </div>
    </div>
  )
}
