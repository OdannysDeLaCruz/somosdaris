'use client'

import { useState, useRef } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft, Pencil, Save, X, Camera } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/routes'

type ReservationStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

interface AllyReservation {
  id: string
  date: Date
  status: ReservationStatus
  finalPrice: number
  service: {
    id: string
    name: string
  }
  user: {
    id: string
    name: string | null
    lastname: string | null
    phone: string
  }
  address: {
    id: string
    address: string
    city: string
  }
}

interface AllyData {
  id: string
  name: string | null
  lastname: string | null
  phone: string
  email: string | null
  photo: string | null
  identificationNumber: string | null
  createdAt: Date
  allyReservations: AllyReservation[]
}

interface AllyDetailProps {
  ally: AllyData
}

const statusLabels: Record<ReservationStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

const statusColors: Record<ReservationStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AllyDetail({ ally: initialAlly }: AllyDetailProps) {
  const router = useRouter()
  const [ally, setAlly] = useState(initialAlly)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editData, setEditData] = useState({
    name: ally.name || '',
    lastname: ally.lastname || '',
    phone: ally.phone,
    email: ally.email || '',
    identificationNumber: ally.identificationNumber || '',
  })
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null)
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({
      name: ally.name || '',
      lastname: ally.lastname || '',
      phone: ally.phone,
      email: ally.email || '',
      identificationNumber: ally.identificationNumber || '',
    })
    setNewPhotoFile(null)
    setNewPhotoPreview(null)
    setErrors({})
  }

  const handleCancel = () => {
    setIsEditing(false)
    setNewPhotoFile(null)
    setNewPhotoPreview(null)
    setErrors({})
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors((prev) => ({ ...prev, photo: 'Use formato JPG, PNG o WebP' }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: 'La imagen no puede superar 5MB' }))
      return
    }

    setNewPhotoFile(file)
    setNewPhotoPreview(URL.createObjectURL(file))
    setErrors((prev) => {
      const next = { ...prev }
      delete next.photo
      return next
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    setErrors({})

    try {
      let photoUrl: string | undefined
      if (newPhotoFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', newPhotoFile)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json()
          setErrors({ photo: uploadError.error || 'Error al subir la foto' })
          setIsSaving(false)
          return
        }

        const { url } = await uploadResponse.json()
        photoUrl = url
      }

      const patchBody: Record<string, string> = { ...editData }
      if (photoUrl) {
        patchBody.photo = photoUrl
      }

      const response = await fetch(`/api/allies/${ally.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchBody),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.details) {
          const newErrors: Record<string, string> = {}
          data.details.forEach((error: { path?: string[]; message: string }) => {
            if (error.path) {
              newErrors[error.path[0]] = error.message
            }
          })
          setErrors(newErrors)
        } else {
          setErrors({ general: data.error || 'Error al actualizar' })
        }
        return
      }

      // Refresh data from server
      const refreshResponse = await fetch(`/api/allies/${ally.id}`)
      if (refreshResponse.ok) {
        const refreshed = await refreshResponse.json()
        setAlly(refreshed)
      }

      setIsEditing(false)
      setNewPhotoFile(null)
      setNewPhotoPreview(null)
    } catch (error) {
      console.error('Error saving ally:', error)
      setErrors({ general: 'Error al procesar la solicitud' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const displayPhoto = newPhotoPreview || ally.photo

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={ROUTES.DASHBOARD_ALIADOS}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </Link>
          <div className="flex items-center gap-4">
            {displayPhoto ? (
              <Image
                src={displayPhoto}
                alt={ally.name || 'Aliado'}
                width={56}
                height={56}
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-xl">
                  {(ally.name || ally.phone).charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {ally.name || 'Sin nombre'} {ally.lastname || ''}
              </h1>
              <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                Aliado
              </span>
            </div>
          </div>
        </div>

        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Pencil size={16} />
            Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X size={16} />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        )}
      </div>

      {/* General Error */}
      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {errors.general}
        </div>
      )}

      {/* Ally Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
        {/* Photo (edit mode only) */}
        {isEditing && (
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Foto
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSaving}
                className="relative group"
              >
                {displayPhoto ? (
                  <Image
                    src={displayPhoto}
                    alt="Preview"
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center group-hover:border-blue-400 group-hover:bg-blue-50 transition-colors">
                    <Camera size={24} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <Camera size={12} className="text-white" />
                </div>
              </button>
              <span className="text-sm text-gray-500">Click para cambiar foto</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            {errors.photo && (
              <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
            )}
          </div>
        )}

        {/* Name */}
        <div className="p-4 hover:bg-gray-50 transition-colors">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Nombre
          </label>
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                disabled={isSaving}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </>
          ) : (
            <p className="text-base text-gray-900">{ally.name || 'Sin nombre'}</p>
          )}
        </div>

        {/* Lastname */}
        <div className="p-4 hover:bg-gray-50 transition-colors">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Apellido
          </label>
          {isEditing ? (
            <>
              <input
                type="text"
                name="lastname"
                value={editData.lastname}
                onChange={handleChange}
                disabled={isSaving}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.lastname ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lastname && <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>}
            </>
          ) : (
            <p className="text-base text-gray-900">{ally.lastname || '-'}</p>
          )}
        </div>

        {/* Phone */}
        <div className="p-4 hover:bg-gray-50 transition-colors">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Teléfono
          </label>
          {isEditing ? (
            <>
              <input
                type="tel"
                name="phone"
                value={editData.phone}
                onChange={handleChange}
                disabled={isSaving}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </>
          ) : (
            <p className="text-base text-gray-900">{ally.phone}</p>
          )}
        </div>

        {/* Email */}
        <div className="p-4 hover:bg-gray-50 transition-colors">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Email
          </label>
          {isEditing ? (
            <>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                disabled={isSaving}
                placeholder="aliado@ejemplo.com"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </>
          ) : (
            <p className="text-base text-gray-900">{ally.email || '-'}</p>
          )}
        </div>

        {/* Identification Number */}
        <div className="p-4 hover:bg-gray-50 transition-colors">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Número de Identificación
          </label>
          {isEditing ? (
            <>
              <input
                type="text"
                name="identificationNumber"
                value={editData.identificationNumber}
                onChange={handleChange}
                disabled={isSaving}
                placeholder="1234567890"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.identificationNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.identificationNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.identificationNumber}</p>
              )}
            </>
          ) : (
            <p className="text-base text-gray-900">{ally.identificationNumber || '-'}</p>
          )}
        </div>

        {/* Member Since */}
        <div className="p-4 hover:bg-gray-50 transition-colors">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Miembro desde
          </label>
          <p className="text-base text-gray-900">
            {format(new Date(ally.createdAt), 'PPP', { locale: es })}
          </p>
        </div>
      </div>

      {/* Reservations */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Reservaciones ({ally.allyReservations.length})
        </h2>

        {ally.allyReservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No tiene reservaciones asignadas</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Fecha</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Cliente</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Servicio</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Estado</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Precio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ally.allyReservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      onClick={() => router.push(ROUTES.DASHBOARD_RESERVA_DETAIL(reservation.id))}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {format(new Date(reservation.date), 'd MMM yyyy', { locale: es })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {reservation.user.name || 'Sin nombre'} {reservation.user.lastname || ''}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {reservation.service.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusColors[reservation.status]}`}>
                          {statusLabels[reservation.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                        ${reservation.finalPrice.toLocaleString('es-CO')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {ally.allyReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  onClick={() => router.push(ROUTES.DASHBOARD_RESERVA_DETAIL(reservation.id))}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {reservation.service.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(reservation.date), 'd MMM yyyy - h:mm a', { locale: es })}
                      </p>
                    </div>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusColors[reservation.status]}`}>
                      {statusLabels[reservation.status]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-600">
                      {reservation.user.name || 'Sin nombre'} {reservation.user.lastname || ''}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      ${reservation.finalPrice.toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
