'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@prisma/client'

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  isGuest: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  refreshUser: () => Promise<void>
  setGuestMode: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('auth_token')
      const guestMode = localStorage.getItem('guest_mode')

      if (guestMode === 'true') {
        setIsGuest(true)
        setLoading(false)
        return
      }

      if (!storedToken) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setToken(storedToken)
        } else {
          // Invalid token, clear it
          localStorage.removeItem('auth_token')
        }
      } catch (error) {
        console.error('Error loading user:', error)
        localStorage.removeItem('auth_token')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const setAuth = (newUser: User, newToken: string) => {
    setUser(newUser)
    setToken(newToken)
    setIsGuest(false)
    localStorage.setItem('auth_token', newToken)
    localStorage.removeItem('guest_mode')
  }

  const setGuestMode = () => {
    setIsGuest(true)
    localStorage.setItem('guest_mode', 'true')
  }

  const logout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        })
      } catch (error) {
        console.error('Error logging out:', error)
      }
    }

    setUser(null)
    setToken(null)
    setIsGuest(false)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('guest_mode')
  }

  const refreshUser = async () => {
    if (!token) return

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, isGuest, setAuth, logout, refreshUser, setGuestMode }}>
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
