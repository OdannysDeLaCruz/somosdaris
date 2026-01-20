'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PricingSelector, PricingSelection } from '@/components/PricingSelector'
import QuoteBasedSelector from '@/components/pricing/QuoteBasedSelector'
import { DateTimePicker } from '@/components/DateTimePicker'
import { AddressForm, AddressFormData } from '@/components/AddressForm'
import { FixedFooter } from '@/components/FixedFooter'
import { ReservationSummary } from '@/components/ReservationSummary'
import { Modal } from '@/components/Modal'
import { ServiceIncludesModal } from '@/components/ServiceIncludesModal'
import { useAuth } from '@/components/AuthProvider'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import Image from 'next/image'
import FirstReservationTag from '@/components/FirstReservationTag'
import { ROUTES } from '@/lib/routes'

interface Service {
  id: string
  name: string
  description: string
  pricingModel: 'PACKAGE_BASED' | 'FORMULA_BASED' | 'ITEM_BASED' | 'QUOTE_BASED'
}

interface Address {
  id: string
  label?: string
  address: string
  neighborhood: string
  city: string
  state: string
  country: string
  extra?: string
}

const STORAGE_KEY = 'reservation_state'

export default function ReservarPage() {
  const router = useRouter()
  const params = useParams()
  const serviceId = params.id as string
  const { user } = useAuth()

  const [step, setStep] = useState(1)
  const [service, setService] = useState<Service | null>(null)
  const [selectedPricing, setSelectedPricing] = useState<PricingSelection | undefined>()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedDateFormated, setSelectedDateFormated] = useState<string | undefined>()
  const [selectedTime, setSelectedTime] = useState<string | undefined>()
  const [selectedAddressData, setSelectedAddressData] = useState<AddressFormData | undefined>()
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>()
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [showIncludesModal, setShowIncludesModal] = useState(false)

  // Load service data
  useEffect(() => {
    fetch(`/api/services/${serviceId}`)
      .then(res => res.json())
      .then(data => setService(data))
      .catch(error => console.error('Error loading service:', error))
  }, [serviceId])

  // Restore state from sessionStorage when returning from login
  useEffect(() => {
    const savedState = sessionStorage.getItem(STORAGE_KEY)
    if (savedState) {
      try {
        const state = JSON.parse(savedState)
        if (state.serviceId === serviceId) {
          if (state.selectedPricing) setSelectedPricing(state.selectedPricing)
          if (state.selectedDate) setSelectedDate(new Date(state.selectedDate))
          if (state.selectedDateFormated) setSelectedDateFormated(state.selectedDateFormated)
          if (state.selectedTime) setSelectedTime(state.selectedTime)
          if (state.step) setStep(state.step)
        }
        sessionStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        console.error('Error restoring state:', error)
      }
    }
  }, [serviceId])

  // Auto-populate user data if authenticated
  useEffect(() => {
    if (user) {
      setEmail(user.email || '')
    }
  }, [user])

  // Load saved addresses when user is authenticated
  useEffect(() => {
    if (user) {
      setLoadingAddresses(true)
      fetchWithAuth('/api/addresses')
        .then(res => res.json())
        .then(addresses => {
          setSavedAddresses(addresses)
          // Auto-select first address if exists and no address selected
          if (addresses.length > 0 && !selectedAddressData) {
            const firstAddress = addresses[0]
            setSelectedAddressId(firstAddress.id)
            setSelectedAddressData({
              label: firstAddress.label,
              address: firstAddress.address,
              neighborhood: firstAddress.neighborhood,
              city: firstAddress.city,
              state: firstAddress.state,
              country: firstAddress.country,
              extra: firstAddress.extra,
            })
          }
        })
        .catch(error => console.error('Error loading addresses:', error))
        .finally(() => setLoadingAddresses(false))
    }
  }, [user])

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  // Verificar si la fecha seleccionada es hoy
  const isToday = (date: Date | undefined) => {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const canContinueStep1 = selectedPricing && selectedDate && !isToday(selectedDate)
  const canContinueStep2 = user && selectedAddressId

  const handleContinueStep1 = () => {
    if (canContinueStep1) {
      setStep(2)
    }
  }

  const handleSelectAddress = (address: Address) => {
    setSelectedAddressId(address.id)
    setSelectedAddressData({
      label: address.label,
      address: address.address,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      country: address.country,
      extra: address.extra,
    })
  }

  const handleAddressCreated = async (addressData: AddressFormData) => {
    if (!user) return

    try {
      setLoading(true)

      // Save address to database
      const response = await fetchWithAuth('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al guardar la dirección')
      }

      const newAddress: Address = await response.json()

      // Add to saved addresses list
      setSavedAddresses(prev => [newAddress, ...prev])

      // Select the new address
      setSelectedAddressId(newAddress.id)
      setSelectedAddressData(addressData)

      // Close modal
      setShowAddressForm(false)
    } catch (error) {
      console.error('Error creating address:', error)
      alert(error instanceof Error ? error.message : 'Error al guardar la dirección')
    } finally {
      setLoading(false)
    }
  }

  const handleContinueStep2 = () => {
    if (canContinueStep2) {
      setStep(3)
    }
  }

  const handleGoToLogin = () => {
    // Save current state to sessionStorage
    const state = {
      serviceId,
      selectedPricing,
      selectedDate: selectedDate?.toISOString(),
      selectedDateFormated,
      selectedTime,
      step: 2,
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))

    // Redirect to login with return URL
    const currentPath = `/app/servicios/${serviceId}/reservar`
    router.push(`${ROUTES.LOGIN}?returnUrl=${encodeURIComponent(currentPath)}`)
  }

  const handleReservar = async () => {
    if (!selectedPricing || !selectedDate || !selectedAddressId || !selectedTime || !user) {
      alert('Faltan datos por completar')
      return
    }

    const reservationDate = `${selectedDateFormated}T${selectedTime}:00-05:00`

    try {
      setLoading(true)

      const response = await fetchWithAuth('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'home',
          date: reservationDate,
          serviceId,
          pricingOptionId: selectedPricing.pricingOptionId,
          pricingData: selectedPricing.pricingData,
          // NOTE: finalPrice se calcula en el backend por seguridad
          addressId: selectedAddressId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al crear reserva')
      }

      const reservation = await response.json()
      router.push(`${ROUTES.CONFIRMACION}?id=${reservation.id}`)
    } catch (error: unknown) {
      console.error('Error:', error)
      if (error instanceof Error) {
        alert(error.message)
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        alert((error as { message: string }).message)
      } else {
        alert('Error al crear la reserva')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">
          <Image
            src="/images/logo-azul.png"
            alt="Loading"
            width={120}
            height={60}
            loading="eager"
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
      </div>
    )
  }

  // Special flow for QUOTE_BASED services (like Lavado en Seco)
  if (service.pricingModel === 'QUOTE_BASED') {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black pt-8 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/app"
            className="text-xl font-bold inline-flex items-center gap-2 text-black transition-colors mb-6"
          >
            <ArrowLeft className="w-9 h-9 mr-2 bg-blue-100 p-2 rounded-full" />
            {service.name}
          </Link>

          <div className="mt-4">
            <QuoteBasedSelector />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pt-8 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Back Button */}
        {step === 1 ? (
          <Link
            href="/app"
            className="text-xl font-bold inline-flex items-center gap-2 text-black transition-colors mb-6"
          >
            <ArrowLeft className="w-9 h-9 mr-2 bg-blue-100 p-2 rounded-full" />
            Reserva tu servicio
          </Link>
        ) : (
          <button
            onClick={() => setStep(step - 1)}
            className="text-xl font-bold inline-flex items-center gap-2 text-black transition-colors mb-6"
          >
            <ArrowLeft className="w-9 h-9 mr-2 bg-blue-100 p-2 rounded-full" />
            Volver
          </button>
        )}

        <FirstReservationTag />

        {/* Step 1: Package & Date */}
        {step === 1 && (
          <div className="space-y-8 mt-4">

            <PricingSelector
              serviceId={serviceId}
              onSelect={setSelectedPricing}
              selectedId={selectedPricing?.pricingOptionId}
            />

            {/* What's Included Button */}
            {service.name.toLowerCase().includes('hogar') && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowIncludesModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
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
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  ¿Qué incluye el servicio?
                </button>
              </div>
            )}


            <DateTimePicker
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
              onSelectedDateFormated={setSelectedDateFormated}
              onSelectedTimeFormated={setSelectedTime}
            />
          </div>
        )}

        {/* Step 2: Authentication Check & Address */}
        {step === 2 && (
          <div className="space-y-8 mt-4">
            {!user ? (
              // Not authenticated - show login prompt
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 border border-zinc-200 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                  Inicia sesión para continuar
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  Para reservar un servicio necesitas tener una cuenta. Puedes iniciar sesión o registrarte fácilmente.
                </p>
                <button
                  onClick={handleGoToLogin}
                  className="w-full px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 font-medium"
                >
                  Iniciar sesión / Registrarse
                </button>
              </div>
            ) : (
              // Authenticated - show address and email
              <>
                <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 border border-zinc-200 dark:border-zinc-800 mb-4">
                  <div className="space-y-1 text-md">
                    <p className="text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">Nombre:</span> {user.name} {user.lastname}
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">Teléfono:</span> {user.phone}
                    </p>
                    {user.email && (
                      <p className="text-zinc-600 dark:text-zinc-400">
                        <span className="font-medium text-zinc-900 dark:text-zinc-50">Email:</span> {user.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 border border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                    ¿Donde será el servicio?
                  </h3>

                  {loadingAddresses ? (
                    <div className="text-center py-4 text-zinc-600 dark:text-zinc-400">
                      Cargando direcciones...
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Saved Addresses */}
                      {savedAddresses.length > 0 && (
                        <div className="space-y-2 mb-4">
                          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                            Selecciona una dirección
                          </p>
                          {savedAddresses.map((address) => {
                            const isSelected = selectedAddressId === address.id
                            return (
                              <label
                                key={address.id}
                                className={`flex items-start gap-3 w-full text-left p-2 rounded-lg border cursor-pointer transition-all ${
                                  isSelected
                                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950 ring-2 ring-blue-500 dark:ring-blue-400'
                                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="address"
                                  checked={isSelected}
                                  onChange={() => handleSelectAddress(address)}
                                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="flex-1">
                                  {address.label && (
                                    <p className="text-zinc-900 dark:text-zinc-50">
                                      {address.label}, {address.address}
                                    </p>
                                  )}
                                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    {address.neighborhood}, {address.city}, {address.state}
                                  </p>
                                  {address.extra && (
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                      {address.extra}
                                    </p>
                                  )}
                                </div>
                              </label>
                            )
                          })}
                        </div>
                      )}

                      {/* Add New Address Button */}
                      <button
                        onClick={() => {
                          setIsEditingAddress(false)
                          setShowAddressForm(true)
                        }}
                        className="w-full p-2 border border-dashed border-blue-400 dark:border-blue-700 rounded-lg text-blue-600 dark:text-blue-400 hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-blue-100 hover:bg-blue-300"
                      >
                        + Agregar nueva dirección
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 3: Summary */}
        {step === 3 && selectedPricing && selectedDate && selectedAddressData && user && (
          <div className='mt-4'>
            <ReservationSummary
              pricing={selectedPricing}
              date={selectedDate}
              address={selectedAddressData}
              userInfo={{
                name: user.name!,
                lastname: user.lastname!,
                phone: user.phone,
                email: email || undefined,
              }}
              serviceName={service.name}
              applyFirstReservationDiscount={user.haveReservations === false}
            />
          </div>
        )}
      </div>

      {/* Fixed Footer - Only show on steps 1 and 2 */}
      {step === 1 && (
        <FixedFooter
          selectedPricing={selectedPricing}
          onContinue={handleContinueStep1}
          disabled={!canContinueStep1}
          applyFirstReservationDiscount={user?.haveReservations === false}
        />
      )}
      {step === 2 && user && (
        <FixedFooter
          selectedPricing={selectedPricing}
          onContinue={handleContinueStep2}
          disabled={!canContinueStep2}
          applyFirstReservationDiscount={user.haveReservations === false}
        />
      )}
      {step === 3 && selectedPricing && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-4 z-50">
          <div className="max-w-4xl mx-auto flex gap-4">
            <button
              onClick={() => setStep(2)}
              className="flex-1 px-6 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-semibold transition-colors"
            >
              Volver
            </button>
            <button
              onClick={handleReservar}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 font-semibold transition-colors"
            >
              {loading ? 'Procesando...' : 'Reservar'}
            </button>
          </div>
        </div>
      )}

      {/* Address Modal */}
      <Modal
        isOpen={showAddressForm}
        onClose={() => setShowAddressForm(false)}
        title={isEditingAddress ? "Editar dirección" : "Agregar nueva dirección"}
      >
        <AddressForm
          onSubmit={handleAddressCreated}
          onCancel={() => setShowAddressForm(false)}
          initialData={isEditingAddress ? selectedAddressData : undefined}
        />
      </Modal>

      {/* Service Includes Modal */}
      <ServiceIncludesModal
        isOpen={showIncludesModal}
        onClose={() => setShowIncludesModal(false)}
      />
    </div>
  )
}
