'use client'

import { useRef, useState, KeyboardEvent, ClipboardEvent } from 'react'

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function OtpInput({ value, onChange, error }: OtpInputProps) {
  const [otp, setOtp] = useState(value.split('').concat(Array(6 - value.length).fill('')))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, digit: string) => {
    // Only allow digits
    if (digit && !/^\d$/.test(digit)) return

    const newOtp = [...otp]
    newOtp[index] = digit

    setOtp(newOtp)
    onChange(newOtp.join(''))

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6)

    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''))
    setOtp(newOtp)
    onChange(newOtp.join(''))

    // Focus last filled input or first empty
    const focusIndex = Math.min(pastedData.length, 5)
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
        Código de verificación
      </label>
      <div className="flex gap-2 justify-center">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-14 text-center text-2xl font-semibold bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
      )}
    </div>
  )
}
