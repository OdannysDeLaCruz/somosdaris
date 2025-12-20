'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import Image from 'next/image'

interface AuthRedirectProps {
  children: React.ReactNode
}

export function AuthRedirect({ children }: AuthRedirectProps) {
  const router = useRouter()
  const { user, loading, isGuest } = useAuth()

  // Redirect to login if user is not authenticated and not in guest mode
  useEffect(() => {
    if (!loading && !user && !isGuest) {
      router.push('/login')
    }
  }, [user, loading, isGuest, router])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <Image src="/images/logo-con-lema.png" alt="Loading" width={200} height={200} />
      </div>
    )
  }

  // Don't render if redirecting to login
  if (!user && !isGuest) {
    return null
  }

  return <>{children}</>
}
