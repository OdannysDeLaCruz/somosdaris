'use client'

import { useState, useEffect } from 'react'

interface Address {
  id: string
  address: string
  label?: string | null
  city: string
  state: string
  country: string
  extra?: string | null
}

interface AddressListProps {
  userId: string
  onSelect: (address: Address) => void
  selectedAddressId?: string
  onAddNew: () => void
}

export function AddressList({ userId, onSelect, selectedAddressId, onAddNew }: AddressListProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetch(`/api/users/${userId}/addresses`)
        .then(res => res.json())
        .then(data => {
          setAddresses(data)
          setLoading(false)
        })
        .catch(error => {
          console.error('Error loading addresses:', error)
          setLoading(false)
        })
    }
  }, [userId])

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => (
          <div key={i} className="h-24 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          No tienes direcciones guardadas
        </p>
        <button
          onClick={onAddNew}
          className="px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          + Agregar nueva dirección
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {addresses.map(address => (
        <button
          key={address.id}
          onClick={() => onSelect(address)}
          className={`
            w-full text-left p-4 rounded-lg border-2 transition-all
            ${selectedAddressId === address.id
              ? 'border-zinc-900 bg-zinc-50 dark:border-zinc-50 dark:bg-zinc-800'
              : 'border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900'
            }
          `}
        >
          {address.label && (
            <div className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
              {address.label}
            </div>
          )}
          <div className="text-zinc-700 dark:text-zinc-300">
            {address.address}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            {address.city}, {address.state}, {address.country}
          </div>
          {address.extra && (
            <div className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
              {address.extra}
            </div>
          )}
        </button>
      ))}

      <button
        onClick={onAddNew}
        className="w-full p-4 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-600 dark:text-zinc-400 hover:border-zinc-900 dark:hover:border-zinc-50 hover:text-zinc-900 dark:hover:text-zinc-50"
      >
        + Agregar nueva dirección
      </button>
    </div>
  )
}
