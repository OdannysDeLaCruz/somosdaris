'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PackageSelector } from '@/components/PackageSelector'
import { DateTimePicker } from '@/components/DateTimePicker'
import { AddressForm, AddressFormData } from '@/components/AddressForm'
import { FixedFooter } from '@/components/FixedFooter'
import { ReservationSummary } from '@/components/ReservationSummary'
import { Modal } from '@/components/Modal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { useAuth } from '@/components/AuthProvider'

const userInfoSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  lastname: z.string().min(1, 'El apellido es requerido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
})

type UserInfoData = z.infer<typeof userInfoSchema>

interface Package {
  id: string
  description: string
  hours: number
  price: number
}

interface Service {
  id: string
  name: string
  description: string
}

export default function ReservarPage() {
  const router = useRouter()
  const params = useParams()
  const serviceId = params.id as string
  const { user, loading: authLoading } = useAuth()

  const [step, setStep] = useState(1)
  const [service, setService] = useState<Service | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<Package | undefined>()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedAddressData, setSelectedAddressData] = useState<AddressFormData | undefined>()
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, formState: { errors }, getValues, setValue } = useForm<UserInfoData>({
    resolver: zodResolver(userInfoSchema),
  })

  // TEMPORALMENTE DESHABILITADO - Check de autenticación
  // useEffect(() => {
  //   if (!authLoading && !user) {
  //     const currentPath = `/servicios/${serviceId}/reservar`
  //     router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`)
  //   }
  // }, [user, authLoading, router, serviceId])

  // TEMPORALMENTE DESHABILITADO - Auto-populate user data
  // useEffect(() => {
  //   if (user && user.name && user.lastname) {
  //     setValue('name', user.name)
  //     setValue('lastname', user.lastname)
  //     setValue('phone', user.phone)
  //     if (user.email) {
  //       setValue('email', user.email)
  //     }
  //   }
  // }, [user, setValue])

  useEffect(() => {
    fetch(`/api/services/${serviceId}`)
      .then(res => res.json())
      .then(data => setService(data))
      .catch(error => console.error('Error loading service:', error))
  }, [serviceId])

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

  const canContinueStep1 = selectedPackage && selectedDate && !isToday(selectedDate)
  const canContinueStep2 = selectedAddressData && getValues('name') && getValues('lastname') && getValues('phone')

  const handleContinueStep1 = () => {
    if (canContinueStep1) {
      setStep(2)
    }
  }

  const handleAddressCreated = (addressData: AddressFormData) => {
    // Solo guardar la dirección localmente
    setSelectedAddressData(addressData)
    setShowAddressForm(false)
  }

  const handleContinueStep2 = () => {
    if (canContinueStep2) {
      setStep(3)
    }
  }

  const handleReservar = async () => {
    const userInfo = getValues()

    if (!selectedPackage || !selectedDate || !selectedAddressData) {
      alert('Faltan datos por completar')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'home',
          date: selectedDate.toISOString(),
          serviceId,
          packageId: selectedPackage.id,
          userInfo,
          addressData: selectedAddressData,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al crear reserva')
      }

      const reservation = await response.json()
      router.push(`/confirmacion?id=${reservation.id}`)
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear la reserva')
    } finally {
      setLoading(false)
    }
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">
          <Image
            src="/images/logo.svg"
            alt="Loading"
            width={200}
            height={200}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pt-8">
        {/* Back Button */}
        {step === 1 ? (
          <Link
            href="/"
            className="text-2xl font-bold inline-flex items-center gap-2 text-black transition-colors mb-16"
          >
            <ArrowLeft className="w-10 h-10 mr-2 bg-blue-100 p-2 rounded-full" />
            Reserva tu servicio
          </Link>
        ) : (
          <button
            onClick={() => setStep(step - 1)}
            className="text-2xl font-bold inline-flex items-center gap-2 text-black transition-colors mb-16"
          >
            <ArrowLeft className="w-10 h-10 mr-2 bg-blue-100 p-2 rounded-full" />
            Volver
          </button>
        )}

        {/* Steps Indicator */}
        {/* <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  s === step
                    ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-black'
                    : s < step
                    ? 'bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
                    : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    s < step
                      ? 'bg-zinc-300 dark:bg-zinc-700'
                      : 'bg-zinc-200 dark:bg-zinc-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div> */}

        {/* Step 1: Package & Date */}
        {step === 1 && (
          <div className="space-y-8">
            <PackageSelector
              onSelect={setSelectedPackage}
              selectedPackageId={selectedPackage?.id}
            />
            <DateTimePicker
              onSelect={setSelectedDate}
              selectedDate={selectedDate}
            />
          </div>
        )}

        {/* Step 2: User Info & Address */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Información del cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    Nombre *
                  </label>
                  <input
                    {...register('name')}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    Apellido *
                  </label>
                  <input
                    {...register('lastname')}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50"
                  />
                  {errors.lastname && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastname.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    Teléfono *
                  </label>
                  <input
                    {...register('phone')}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    Email (opcional)
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                ¿Donde será el servicio?
              </h3>

              {selectedAddressData ? (
                <div className="space-y-2">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    {selectedAddressData.label && (
                      <p className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                        {selectedAddressData.label}
                      </p>
                    )}
                    <p className="text-zinc-900 dark:text-zinc-50">{selectedAddressData.address}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {selectedAddressData.neighborhood}, {selectedAddressData.city}, {selectedAddressData.state}, {selectedAddressData.country}
                    </p>
                    {selectedAddressData.extra && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        {selectedAddressData.extra}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full p-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-600 dark:text-zinc-400 hover:border-zinc-900 dark:hover:border-zinc-50"
                  >
                    Cambiar dirección
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="w-full p-4 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-600 dark:text-zinc-400 hover:border-zinc-900 dark:hover:border-zinc-50"
                >
                  + Agregar dirección
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Summary */}
        {step === 3 && selectedPackage && selectedDate && selectedAddressData && (
          <div>
            <ReservationSummary
              package={selectedPackage}
              date={selectedDate}
              address={selectedAddressData}
              userInfo={getValues()}
              serviceName={service.name}
            />
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-6 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                Volver
              </button>
              <button
                onClick={handleReservar}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Reservar'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Footer - Only show on steps 1 and 2 */}
      {step === 1 && (
        <FixedFooter
          selectedPackage={selectedPackage}
          onContinue={handleContinueStep1}
          disabled={!canContinueStep1}
        />
      )}
      {step === 2 && (
        <FixedFooter
          selectedPackage={selectedPackage}
          onContinue={handleContinueStep2}
          disabled={!canContinueStep2}
        />
      )}

      {/* Address Modal */}
      <Modal
        isOpen={showAddressForm}
        onClose={() => setShowAddressForm(false)}
        title={selectedAddressData ? "Editar dirección" : "Agregar nueva dirección"}
      >
        <AddressForm
          onSubmit={handleAddressCreated}
          onCancel={() => setShowAddressForm(false)}
          initialData={selectedAddressData}
        />
      </Modal>
    </div>
  )
}
