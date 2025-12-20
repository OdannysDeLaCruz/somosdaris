'use client'

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

interface OtpInputFieldProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function OtpInputField({ value, onChange, error }: OtpInputFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-center">
        <InputOTP maxLength={6} value={value} onChange={onChange}>
          <InputOTPGroup className="gap-1">
            <InputOTPSlot index={0} className="w-10 h-12 text-xl shadow-none border border-gray-500 rounded-md" />
            <InputOTPSlot index={1} className="w-10 h-12 text-xl shadow-none border border-gray-500 rounded-md" />
            <InputOTPSlot index={2} className="w-10 h-12 text-xl shadow-none border border-gray-500 rounded-md" />
            <InputOTPSlot index={3} className="w-10 h-12 text-xl shadow-none border border-gray-500 rounded-md" />
            <InputOTPSlot index={4} className="w-10 h-12 text-xl shadow-none border border-gray-500 rounded-md" />
            <InputOTPSlot index={5} className="w-10 h-12 text-xl shadow-none border border-gray-500 rounded-md" />
          </InputOTPGroup>
        </InputOTP>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}
    </div>
  )
}
