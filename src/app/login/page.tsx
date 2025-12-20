'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PhoneInput } from '@/components/ui/phone-input'
import { OtpInputField } from '@/components/ui/otp-input-field'
import { useAuth } from '@/components/AuthProvider'
import Image from 'next/image'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser, setGuestMode } = useAuth()

  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [
    email, 
    setEmail
  ] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const returnUrl = searchParams.get('returnUrl') || '/'

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Step 1: BYPASS OTP - Go directly to verify
  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setError('Por favor ingresa un número válido de 10 dígitos')
      return
    }

    setError('')
    setLoading(true)

    try {
      // BYPASS: Skip sending OTP, go directly to verify
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phone,
          code: '000000', // Dummy code - will be bypassed in backend
          deviceInfo: navigator.userAgent,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al verificar')
      }

      if (data.isNewUser) {
        // New user, go to step 3 to complete profile
        setStep(3)
      } else {
        // Existing user, refresh auth and redirect
        await refreshUser()
        router.push(returnUrl)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Error desconocido al verificar')
      }
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOtp = async () => {
    setCountdown(0)
    setOtp('')
    await handleSendOtp()
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Por favor ingresa el código de 6 dígitos')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({
          phone,
          code: otp,
          deviceInfo: navigator.userAgent,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Código inválido')
      }

      if (data.isNewUser) {
        // New user, go to step 3 to complete profile
        setStep(3)
      } else {
        // Existing user, refresh auth and redirect
        await refreshUser()
        router.push(returnUrl)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Error desconocido')
      }
    } finally {
      setLoading(false)
    }
  }

  // Auto-submit OTP when complete
  useEffect(() => {
    if (otp.length === 6 && !loading) {
      handleVerifyOtp()
    }
  }, [otp])

  // Step 3: Complete Profile
  const handleCompleteProfile = async () => {
    if (!name || !lastname) {
      setError('Por favor completa todos los campos obligatorios')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ name, lastname, email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al completar perfil')
      }

      // Refresh user data
      await refreshUser()
      router.push(returnUrl)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Error desconocido')
      }
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleGuestMode = () => {
    setGuestMode()
    router.push(returnUrl)
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          { step != 2 ? (
            <div className="flex justify-center mt-8 mb-16">
              <Image src="/images/logo-con-lema.png" alt="Daris" width={200} height={100} priority />
            </div>
          ) : <div className="h-20"></div>}
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            {step === 1 && ''}
            {step === 2 && 'Ingresar PIN'}
            {step === 3 && 'Completa tu perfil'}
          </h1>
          <p className="text-black dark:text-zinc-400 mb-6">
            {step === 1 && 'Ingresa tu número de celular'}
            {step === 2 && 'Ingresa el código que enviamos a tu celular.'}
            {step === 3 && 'Por favor completa tu información'}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800">
          {/* Step 1: Phone Number */}
          {step === 1 && (
            <div className="space-y-4">
              <PhoneInput value={phone} onChange={setPhone} error={error} />

              <button
                onClick={handleSendOtp}
                disabled={loading || phone.length !== 10}
                className="w-full px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Enviando...' : 'Continuar'}
              </button>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center mt-2">
                ¿No tienes cuenta? 
              </p>
              <button
                onClick={handleGuestMode}
                className="w-full px-6 py-1 mt- border border-blue-600 dark:border-zinc-700 text-blue-600 dark:text-zinc-400 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium"
              >
                Entrar como invitado
              </button>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div className="space-y-4">
              <OtpInputField value={otp} onChange={setOtp} error={error} />

              {countdown > 0 ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
                  Código válido por {formatTime(countdown)}
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Reenviar código
                </button>
              )}

              <button
                onClick={() => setStep(1)}
                className="w-full px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium"
              >
                Cambiar número
              </button>
            </div>
          )}

          {/* Step 3: Complete Profile */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50"
                  placeholder="Juan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50"
                  placeholder="Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50"
                  placeholder="juan@example.com"
                />
              </div>

              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

              <button
                onClick={handleCompleteProfile}
                disabled={loading || !name || !lastname}
                className="w-full px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Completando...' : 'Completar perfil'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
          <div className="text-zinc-600 dark:text-zinc-400">Cargando...</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
