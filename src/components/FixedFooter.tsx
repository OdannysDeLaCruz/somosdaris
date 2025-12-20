'use client'

interface Package {
  id: string
  description: string
  hours: number
  price: number
}

interface FixedFooterProps {
  selectedPackage?: Package
  onContinue: () => void
  disabled?: boolean
  applyFirstReservationDiscount?: boolean
}

export function FixedFooter({ selectedPackage, onContinue, disabled, applyFirstReservationDiscount = false }: FixedFooterProps) {
  const discountPercentage = 10
  const basePrice = selectedPackage ? Number(selectedPackage.price) : 0
  const discountAmount = applyFirstReservationDiscount ? basePrice * (discountPercentage / 100) : 0
  const finalPrice = basePrice - discountAmount
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Sección de total */}
          <div className="flex-1">
            {selectedPackage ? (
              <div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  {selectedPackage.description} ({selectedPackage.hours} horas)
                </div>

                {applyFirstReservationDiscount ? (
                  <div className="space-y-0.5">
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 line-through">
                      ${basePrice.toLocaleString('es-CO')}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${finalPrice.toLocaleString('es-CO')}
                      </div>
                      <div className="text-base font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">
                        -{discountPercentage}%
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    ${basePrice.toLocaleString('es-CO')}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-zinc-500 dark:text-zinc-500">
                Selecciona un paquete para continuar
              </div>
            )}
          </div>

          {/* Botón continuar */}
          <button
            onClick={onContinue}
            disabled={disabled || !selectedPackage}
            className="px-8 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-lg font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
