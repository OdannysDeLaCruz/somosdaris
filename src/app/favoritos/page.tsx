'use client'

import { useAuth } from '@/components/AuthProvider'
import LoginPrompt from '@/components/LoginPrompt'
import EmptyState from '@/components/EmptyState'

export default function FavoritosPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <LoginPrompt
        title="Inicia sesión para ver tus favoritos"
        message="Guarda tus profesionales favoritos para encontrarlos fácilmente cuando los necesites."
        icon={
          <svg
            className="w-20 h-20 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        }
      />
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 mb-20 md:mb-0">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Favoritos
      </h1>

      <EmptyState
        icon={
          <svg
            className="w-24 h-24 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        }
        title="No tienes favoritos aún"
        message="Cuando encuentres profesionales que te gusten, podrás agregarlos a favoritos para verlos aquí."
      />
    </div>
  )
}
