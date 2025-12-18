'use client'

import { useState } from 'react'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const cleaned = e.target.value.replace(/\D/g, '')

    // Limit to 10 digits (Colombian phone number without country code)
    const limited = cleaned.slice(0, 10)

    setDisplayValue(limited)
    onChange(limited)
  }

  return (
    <div className="space-y-2 bg-red-200">
      <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
        Número de teléfono
      </label>
      <div className="flex items-center gap-2">
        <div className="flex items-center px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg">
          <span className="text-zinc-900 dark:text-zinc-50 font-medium">+57</span>
        </div>
        <input
          type="tel"
          value={displayValue}
          onChange={handleChange}
          placeholder="3001234567"
          className="flex-1 px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
