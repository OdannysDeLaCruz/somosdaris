'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'

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
    <div className="space-y-2">
      {/* <label className="block text-center text-sm text-gray-400">
        Te enviaremos un código por mensaje
      </label> */}
      <div className="flex items-center border border-zinc-400 rounded-lg overflow-hidden">
        <div className="flex items-center px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border-r border-zinc-300 dark:border-zinc-700 h-10">
          <span className="text-zinc-900 dark:text-zinc-50 font-medium">+57</span>
        </div>
        <Input
          type="tel"
          value={displayValue}
          onChange={handleChange}
          placeholder="300 1234 567"
          className="flex-1 py-5 border-none outline-none focus-visible:ring-0"
        />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}
