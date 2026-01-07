'use client'

import { PricingSelection } from '../PricingSelector'

interface PricingOption {
  id: string
  name: string
  description: string | null
  basePrice: number
  metadata?: unknown
}

interface PackageBasedSelectorProps {
  options: PricingOption[]
  onSelect: (selection: PricingSelection) => void
  selectedId?: string
}

export default function PackageBasedSelector({
  options,
  onSelect,
  selectedId
}: PackageBasedSelectorProps) {
  const handleSelect = (option: PricingOption) => {
    const metadata = option.metadata as { hours?: number } | undefined
    const hours = metadata?.hours || 0

    onSelect({
      pricingOptionId: option.id,
      pricingData: { hours },
      calculatedPrice: Number(option.basePrice),
      displayName: option.name,
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-black dark:text-zinc-50">
        Cantidad de horas
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {options.map(option => {
          const metadata = option.metadata as { hours?: number } | undefined
          const hours = metadata?.hours || 0

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              className={`
                p-4 rounded-lg border transition-all
                flex flex-col items-center
                hover:shadow-md
                ${selectedId === option.id
                  ? 'border-blue-500 bg-blue-200 dark:border-zinc-50 dark:bg-zinc-50 dark:text-black'
                  : 'border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50'
                }
              `}
            >
              <div className="text-5xl font-bold">{hours}</div>
              <div className="text-xl mb-1">Horas</div>
              <div className="text-2xl font-bold mb-2">
                ${Number(option.basePrice).toLocaleString('es-CO')}
              </div>
              {option.description && (
                <div className={`text-lg text-center ${
                  selectedId === option.id
                    ? 'text-black'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}>
                  <p className='leading-6'>
                    {option.description}
                  </p>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
