'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { ROUTES } from '@/lib/routes'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isGuest, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user && !isGuest) {
      router.push(ROUTES.LOGIN)
    }
  }, [user, isGuest, loading, router])

  // Show loading or nothing while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Cargando...</div>
      </div>
    )
  }

  // Don't show content until we've verified auth status
  if (!user && !isGuest) {
    return null
  }

  return <>{children}</>
}
