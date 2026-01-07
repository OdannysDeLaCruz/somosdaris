'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User, Role } from '@prisma/client'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import { ROUTES } from '@/lib/routes'

interface UserWithReservations extends User {
  role: Role
  haveReservations?: boolean
}

interface AuthContextType {
  user: UserWithReservations | null
  loading: boolean
  isGuest: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  setGuestMode: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<UserWithReservations | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  // Load user from cookies on mount
  useEffect(() => {
    const loadUser = async () => {
      // Check if guest mode is enabled in localStorage (for backwards compat)
      const guestMode = localStorage.getItem('guest_mode')

      if (guestMode === 'true') {
        setIsGuest(true)
        setLoading(false)
        return
      }

      try {
        // Fetch user from /api/auth/me (automatically handles token refresh)
        const response = await fetchWithAuth('/api/auth/me')

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else if (response.status === 401) {
          // Token refresh failed, user needs to login again
          setUser(null)
        }
      } catch (error) {
        console.error('Error loading user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  // Redirect to complete profile if user is authenticated but profile is incomplete
  useEffect(() => {
    // Skip if still loading or already on login page
    if (loading || pathname === ROUTES.LOGIN) {
      return
    }

    // Skip if user is in guest mode
    if (isGuest) {
      return
    }

    // If user is authenticated but doesn't have complete profile (name or lastname missing)
    if (user && (!user.name || !user.lastname)) {
      // Redirect to login page with current URL as returnUrl
      router.push(`${ROUTES.LOGIN}?returnUrl=${encodeURIComponent(pathname)}`)
    }
  }, [user, loading, isGuest, pathname, router])

  const setGuestMode = () => {
    setIsGuest(true)
    localStorage.setItem('guest_mode', 'true')
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Error logging out:', error)
    }

    setUser(null)
    setIsGuest(false)
    localStorage.removeItem('guest_mode')
  }

  const refreshUser = async () => {
    try {
      const response = await fetchWithAuth('/api/auth/me')

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setIsGuest(false)
        localStorage.removeItem('guest_mode')
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, isGuest, logout, refreshUser, setGuestMode }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
