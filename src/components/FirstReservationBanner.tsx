'use client'

import { useState, useMemo } from 'react'
import { X } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function FirstReservationBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const { user, loading } = useAuth()
  const router = useRouter()

  // Calculate modal type based on user state
  const modalType = useMemo<'guest' | 'registered' | null>(() => {
    // Wait for auth to load
    if (loading || !isVisible) return null

    // Determine which modal to show based on user state
    if (!user) {
      // Not logged in → show guest modal (always, no localStorage)
      return 'guest'
    } else if (user.haveReservations === false) {
      // Logged in without reservations → check if registered modal was dismissed
      if (typeof window !== 'undefined') {
        const registeredDismissed = localStorage.getItem('registeredModalDismissed')
        if (registeredDismissed === 'true') return null
      }
      return 'registered'
    }

    // Logged in with reservations → don't show any modal
    return null
  }, [user, loading, isVisible])

  const handleDismiss = () => {
    // Save to localStorage only for registered modal
    if (modalType === 'registered') {
      localStorage.setItem('registeredModalDismissed', 'true')
    }
    setIsVisible(false)
  }

  const handleGoToLogin = () => {
    handleDismiss()
    router.push('/login')
  }

  if (!modalType) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-black hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          aria-label="Cerrar"
        >
          <X size={24} />
        </button>

        <div className="p-5 text-center space-y-6">

          {modalType === 'guest' ? (
            <>
              {/* Image */}
              <div className="w-full h-40 rounded-xl flex items-center justify-center">
                <Image
                  src="/images/obsequio-cerrado.png"
                  alt="Obsequio de 10% en tu primera reserva"
                  width={300}
                  height={180}
                  loading="eager"
                  className="object-contain mb-8"
                  fetchPriority='high'
                  style={{ width: '320px', height: 'auto' }}
                />
              </div>
              {/* Guest Modal Content */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  Te obsequiamos
                </h2>
                <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">
                  10%
                </div>
                <p className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
                  En tu primera reserva
                </p>
                <p className="text-base text-zinc-800 dark:text-zinc-400 max-w-sm mx-auto">
                  Regístrate y recibelo automáticamente en tu primera reserva
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-row gap-3 items-center">
                <button
                  onClick={handleDismiss}
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleGoToLogin}
                  className="w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-nowrap"
                >
                  ¡Lo quiero!
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Image */}
              <div className="w-full h-40 rounded-xl flex items-center justify-center">
                <Image
                  src="/images/obsequio-recibido.png"
                  alt="Obsequio de 10% en tu primera reserva"
                  width={300}
                  height={180}
                  fetchPriority='high'
                  loading="eager"
                  className="object-contain mb-8"
                  style={{ width: '320px', height: 'auto' }}
                />
              </div>

              {/* Registered Modal Content */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-black dark:text-green-400">
                  Se activó tu obsequio
                </h2>
                <p className="text-lg text-zinc-800 dark:text-zinc-200">
                  Tienes un obsequio del <span className="font-bold text-green-600 dark:text-green-400">10%</span>, se aplicará automáticamente en tu primer servicio.
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                  Estará disponible hasta que decidas usarlo.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-row gap-3 items-center">
                <button
                  onClick={handleDismiss}
                  className="w-full px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  OK
                </button>
                <button
                  onClick={handleDismiss}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                >
                  ¡Usarlo!
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
