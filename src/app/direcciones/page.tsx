'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import LoginPrompt from '@/components/LoginPrompt'
import EmptyState from '@/components/EmptyState'
import { AddressForm, type AddressFormData } from '@/components/AddressForm'
import { fetchWithAuth } from '@/lib/fetchWithAuth'

interface Address {
  id: string
  address: string
  neighborhood: string
  label?: string | null
  city: string
  state: string
  country: string
  extra?: string | null
}

export default function DireccionesPage() {
  const { user, loading } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user) {
      fetchAddresses()
    } else if (!loading && !user) {
      setIsLoading(false)
    }
  }, [user, loading])

  const fetchAddresses = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const response = await fetchWithAuth('/api/addresses')

      if (!response.ok) {
        throw new Error('Error al cargar las direcciones')
      }

      const data = await response.json()
      setAddresses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAddress = async (data: AddressFormData) => {
    if (!user) return

    try {
      const response = await fetchWithAuth('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Error al guardar la dirección')
      }

      await fetchAddresses()
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!user) return

    if (!confirm('¿Estás seguro de eliminar esta dirección?')) return

    try {
      const response = await fetchWithAuth(`/api/addresses/${addressId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al eliminar la dirección')
      }

      await fetchAddresses()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <LoginPrompt
        title="Inicia sesión para gestionar tus direcciones"
        message="Guarda tus direcciones para hacer reservas más rápido en el futuro."
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
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        }
      />
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mb-20 md:mb-0">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-6 mb-20 md:mb-0">
        <div className="mb-6">
          <button
            onClick={() => setShowForm(false)}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7"></path>
            </svg>
            Volver
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Agregar nueva dirección
        </h1>
        <AddressForm
          onSubmit={handleAddAddress}
          onCancel={() => setShowForm(false)}
        />
      </div>
    )
  }

  if (addresses.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 mb-20 md:mb-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Direcciones
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
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          }
          title="No tienes direcciones guardadas"
          message="Agrega direcciones para hacer tus reservas más rápido."
          action={{
            label: 'Agregar dirección',
            onClick: () => setShowForm(true),
          }}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 mb-20 md:mb-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Mis direcciones
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 4v16m8-8H4"></path>
          </svg>
          <span className="hidden sm:inline">Agregar</span>
        </button>
      </div>

      <div className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {address.label && (
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {address.label}
                  </h3>
                )}
                <p className="text-gray-700 dark:text-gray-300">
                  {address.address}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {address.neighborhood}, {address.city}, {address.state}
                </p>
                {address.extra && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    {address.extra}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDeleteAddress(address.id)}
                className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                aria-label="Eliminar dirección"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
