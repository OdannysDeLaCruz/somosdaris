'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Edit2, Trash2, ImageIcon, DollarSign } from 'lucide-react'
import AddServiceModal from './AddServiceModal'
import EditServiceModal from './EditServiceModal'
import { Service } from '@prisma/client'
import { ROUTES } from '@/lib/routes'

type ServiceWithCount = Service & {
  _count: {
    reservations: number
  }
}

interface ServicesContentProps {
  initialServices: ServiceWithCount[]
}

export default function ServicesContent({ initialServices }: ServicesContentProps) {
  const [services, setServices] = useState<ServiceWithCount[]>(initialServices)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const handleSuccess = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        const servicesWithCount = await Promise.all(
          data.map(async (service: Service) => {
            const countResponse = await fetch(`/api/services/${service.id}`)
            const serviceData = await countResponse.json()
            return {
              ...service,
              _count: { reservations: serviceData._count?.reservations || 0 }
            }
          })
        )
        setServices(servicesWithCount)
      }
    } catch (error) {
      console.error('Error reloading services:', error)
      window.location.reload()
    }
  }

  const handleEdit = (service: Service) => {
    setSelectedService(service)
    setIsEditModalOpen(true)
  }

  const handleDelete = async (service: ServiceWithCount) => {
    if (service._count.reservations > 0) {
      alert(`No se puede eliminar el servicio "${service.name}" porque tiene ${service._count.reservations} reservaciones asociadas.`)
      return
    }

    if (!confirm(`¿Estás seguro de eliminar el servicio "${service.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/services/${service.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || 'Error al eliminar el servicio')
        return
      }

      await handleSuccess()
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Error al eliminar el servicio')
    }
  }

  const availableServices = services.filter((s) => !s.comingSoon)

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Servicios</h1>
            <p className="text-gray-500 mt-2">
              Gestiona los servicios disponibles en la plataforma
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Agregar Servicio
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total Servicios</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {services.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Disponibles</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {availableServices.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total Reservaciones</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {services.reduce((acc, service) => acc + service._count.reservations, 0)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No hay servicios registrados</p>
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {service.image ? (
                  <div className="w-full h-48 overflow-hidden bg-gray-100 relative">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <ImageIcon size={48} className="text-white/50" />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-gray-900">
                      {service.name}
                    </h3>
                    {service.comingSoon && (
                      <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded font-medium">
                        Próximamente
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>
                        Creado{' '}
                        {format(new Date(service.createdAt), 'MMM yyyy', {
                          locale: es,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">
                        Reservaciones
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {service._count.reservations}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Link
                        href={ROUTES.DASHBOARD_SERVICIO_PRICING(service.id)}
                        className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <DollarSign size={16} />
                        Configurar Precio
                      </Link>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit2 size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(service)}
                          className="px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title={service._count.reservations > 0 ? 'No se puede eliminar: tiene reservaciones' : 'Eliminar servicio'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
      />

      <EditServiceModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedService(null)
        }}
        onSuccess={handleSuccess}
        service={selectedService}
      />
    </>
  )
}
