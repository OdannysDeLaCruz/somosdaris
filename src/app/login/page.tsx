// TEMPORALMENTE DESHABILITADO - No eliminar, se usará más adelante
'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

function LoginContent() {
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || '/'

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          <div className="flex justify-center mt-8 mb-8">
            <Image
              src="/images/logo-con-lema.png"
              alt="Daris"
              width={200}
              height={100}
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Inicio de sesión temporalmente deshabilitado
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Por ahora puedes solicitar servicios directamente sin necesidad de iniciar sesión.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
          <div className="space-y-4">
            <Link
              href={returnUrl}
              className="block w-full px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 font-medium text-center"
            >
              Continuar sin iniciar sesión
            </Link>
            <Link
              href="/"
              className="block w-full px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium text-center"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Cargando...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}

/* CÓDIGO ORIGINAL - RESTAURAR MÁS ADELANTE

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PhoneInput } from '@/components/PhoneInput'
import { OtpInput } from '@/components/OtpInput'
import { useAuth } from '@/components/AuthProvider'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuth, refreshUser, setGuestMode } = useAuth()

  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [remainingAttempts, setRemainingAttempts] = useState(3)

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    setError('')

    if (phone.length !== 10) {
      setError('El número debe tener 10 dígitos')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })

      const data = await response.json()

      if (response.ok) {
        setStep(2)
        setCountdown(600) // 10 minutes
        setRemainingAttempts(3)
      } else {
        setError(data.error || 'Error al enviar el código')
      }
    } catch {
      setError('Error de conexión. Intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    setError('')

    if (otp.length !== 6) {
      setError('El código debe tener 6 dígitos')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp })
      })

      const data = await response.json()

      if (response.ok) {
        setAuth(data.user, data.token)

        if (data.isNewUser) {
          // Go to step 3 to complete profile
          setStep(3)
        } else {
          // Redirect to intended page or home
          const returnUrl = searchParams.get('returnUrl') || '/'
          router.push(returnUrl)
        }
      } else {
        setError(data.error || 'Código incorrecto')
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts)
        }
      }
    } catch {
      setError('Error de conexión. Intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Complete Profile
  const handleCompleteProfile = async () => {
    setError('')

    if (!name || !lastname) {
      setError('Por favor complete todos los campos')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, lastname })
      })

      const data = await response.json()

      if (response.ok) {
        await refreshUser()
        const returnUrl = searchParams.get('returnUrl') || '/'
        router.push(returnUrl)
      } else {
        setError(data.error || 'Error al actualizar el perfil')
      }
    } catch {
      setError('Error de conexión. Intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = () => {
    setOtp('')
    setStep(1)
  }

  const handleGuestMode = () => {
    setGuestMode()
    const returnUrl = searchParams.get('returnUrl') || '/'
    router.push(returnUrl)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          <div className="flex justify-center mt-8 mb-16">
            <Image
              src="/images/logo-con-lema.png"
              alt="Daris"
              width={200}
              height={100}
              priority
            />
          </div>
          <p className="mb-4 text-md font-bold text-back">
            {step === 1 && 'Login con número de WhatsApp'}
            {step === 2 && 'Ingrese el código que recibió por WhatsApp'}
            {step === 3 && 'Complete su perfil'}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800">
          {step === 1 && (
            <div className="space-y-6">
              <PhoneInput
                value={phone}
                onChange={setPhone}
                error={error}
              />
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 font-medium mx-auto"
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-300 dark:border-zinc-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                    o
                  </span>
                </div>
              </div>

              <button
                onClick={handleGuestMode}
                className="w-full px-6 py-3 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium"
              >
                Entrar como invitado
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <OtpInput
                value={otp}
                onChange={setOtp}
                error={error}
              />

              {countdown > 0 && (
                <p className="text-sm text-center text-zinc-600 dark:text-zinc-400">
                  Código válido por {formatTime(countdown)}
                </p>
              )}

              {remainingAttempts < 3 && (
                <p className="text-sm text-center text-amber-600 dark:text-amber-400">
                  {remainingAttempts} intentos restantes
                </p>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 font-medium"
              >
                {loading ? 'Verificando...' : 'Verificar Código'}
              </button>

              <button
                onClick={handleResendOtp}
                disabled={countdown > 540} // Allow resend after 1 minute
                className="w-full text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 disabled:opacity-50"
              >
                Reenviar código
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}

              <button
                onClick={handleCompleteProfile}
                disabled={loading}
                className="w-full px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 font-medium"
              >
                {loading ? 'Guardando...' : 'Completar Perfil'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
*/
