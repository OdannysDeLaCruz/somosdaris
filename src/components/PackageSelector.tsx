'use client'

import { useState, useEffect } from 'react'

interface Package {
  id: string
  description: string
  hours: number
  price: number
  restriction?: string | null
}

interface PackageSelectorProps {
  onSelect: (pkg: Package) => void
  selectedPackageId?: string
}

export function PackageSelector({ onSelect, selectedPackageId }: PackageSelectorProps) {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/packages')
      .then(res => res.json())
      .then(data => {
        setPackages(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading packages:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Cantidad de horas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-black">
        Cantidad de horas
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.map(pkg => (
          <button
            key={pkg.id}
            onClick={() => onSelect(pkg)}
            className={`
              p-4 rounded-lg border-2 transition-all
              flex flex-col items-center gap-2
              hover:shadow-md
              ${selectedPackageId === pkg.id
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-black'
                : 'border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50'
              }
            `}
          >
            <div className="text-6xl font-bold">{pkg.hours}</div>
            <div className="text-2xl">Horas</div>
            <div className="text-2xl font-bold mt-2">
              ${Number(pkg.price).toLocaleString('es-CO')}
            </div>
            {pkg.restriction && (
              <div className={`text-xl text-center mt-2 ${
                selectedPackageId === pkg.id
                  ? 'text-zinc-200 dark:text-zinc-700'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}>
                {pkg.restriction}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
