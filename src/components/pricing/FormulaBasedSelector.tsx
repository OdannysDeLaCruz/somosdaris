'use client'

import { useState, useMemo, useEffect } from 'react'
import { PricingSelection } from '../PricingSelector'
import { FormulaVariable, PricingOption } from '@/types'
import { MinusIcon, PlusIcon } from 'lucide-react'

interface FormulaBasedSelectorProps {
  options: PricingOption[]
  variables: FormulaVariable[]
  onSelect: (selection: PricingSelection) => void
}

export default function FormulaBasedSelector({
  options,
  variables,
  onSelect
}: FormulaBasedSelectorProps) {
  const [selections, setSelections] = useState<Record<string, string | number>>(() => {
    const defaults: Record<string, string | number> = {}
    variables.forEach(variable => {
      if (variable.defaultValue) {
        defaults[variable.name] = variable.type === 'number'
          ? parseInt(variable.defaultValue)
          : variable.defaultValue
      } else if (variable.type === 'number') {
        defaults[variable.name] = variable.minValue || 1
      }
    })
    return defaults
  })

  const handlerDecrement = (varName: string, value: number, minValue: number) => {
    // console.log("Variables", variables)
    if (Number(selections[varName]) > minValue) {
      setSelections(prev => ({ ...prev, [varName]: Number(value) - 1 }))
      // console.log("Selections", selections)
    }
  }
  
  const handlerIncrement = (varName: string, value: number, maxValue: number) => {
    if (Number(selections[varName]) < Number(maxValue)) {
      setSelections(prev => ({ ...prev, [varName]: Number(value) + 1 }))
      // console.log("Selections", selections)
    }
  }

  // Calcular precio y generar display name usando useMemo
  const { calculatedPrice, displayName } = useMemo(() => {
    if (options.length === 0) {
      return { calculatedPrice: 0, displayName: 'Servicio configurado' }
    }

    const basePrice = Number(options[0].basePrice)
    let total = basePrice

    // Aplicar fórmula para cada variable
    variables.forEach(variable => {
      const value = selections[variable.name]
      if (value !== undefined && variable.multiplier) {
        const numValue = typeof value === 'number' ? value : parseInt(value)

        if (variable.name === 'cantidad') {
          // Para cantidad: multiplicar precio base
          total = basePrice * numValue
        } else if (variable.name === 'altura') {
          // console.log('ALTURA', variable)
          // console.log('SELECTION', selections)
          // if (Number(selections.altura) > 2) {
          //   // Para altura: agregar ajuste por cada piso adicional
          //   const adjustment = Number(variable.multiplier) * (Number(selections.altura) - 2)
          //   total += adjustment
          // }
        }
      }
    })

    // Generar display name
    const displayParts: string[] = []
    variables.forEach(variable => {
      const value = selections[variable.name]
      if (value !== undefined) {
        if (variable.name === 'cantidad') {
          displayParts.push(`${value} tanque(s)`)
        } else if (variable.name === 'altura') {
          displayParts.push(`Piso ${value}`)
        }
      }
    })

    return {
      calculatedPrice: total,
      displayName: displayParts.join(' - ') || 'Servicio configurado'
    }
  }, [selections, options, variables])

  // Notificar al padre cuando cambia el cálculo
  useEffect(() => {
    if (options[0]) {
      onSelect({
        pricingOptionId: options[0].id,
        pricingData: selections,
        calculatedPrice,
        displayName,
      })
    }
  }, [selections, calculatedPrice, displayName, options, onSelect])

  const handleVariableChange = (varName: string, value: string | number) => {
    setSelections(prev => ({ ...prev, [varName]: value }))
  }

  return (
    <div className="space-y-10 mb-16">
      {/* <h3 className="text-2xl font-bold text-black dark:text-zinc-50">
        Configura tu servicio
      </h3> */}

      <div className='flex flex-col lg:grid lg:grid-cols-2 gap-10'>
        {variables.map((variable: FormulaVariable) => (
          <div key={variable.id} className="space-y-2 w-full">
            <label className="block text-2xl font-semibold text-black">
              {variable.label}
            </label>

            {variable.type === 'select' && variable.options && (
              <select
                value={selections[variable.name] || variable.defaultValue || ''}
                onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
              >
                {variable.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {variable.type === 'number' && (
              <div className="flex justify-center gap-2">
                <button onClick={() => handlerDecrement(variable.name, Number(selections[variable.name] || variable.defaultValue || 1), Number(variable.minValue || 1))} className="px-4 py-3 w-16 flex justify-center items-center rounded-lg bg-blue-600 text-white">
                  <MinusIcon className="w-6 h-6" />
                </button>
                <input
                  type="number"
                  min={variable.minValue || undefined}
                  max={variable.maxValue || undefined}
                  value={selections[variable.name] || variable.defaultValue || 1}
                  onChange={(e) => handleVariableChange(variable.name, parseInt(e.target.value))}
                  className="w-full px-4 py-3 text-xl font-bold border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 text-center disabled:bg-white"
                  disabled
                />
                <button onClick={() => handlerIncrement(variable.name, Number(selections[variable.name] || variable.defaultValue || 1), Number(variable.maxValue || 1))} className="px-4 py-3 w-16 flex justify-center items-center rounded-lg bg-blue-600 text-white">
                  <PlusIcon className="w-6 h-6" /> 
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
