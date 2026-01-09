'use client'

import { CircleCheck, CircleX } from 'lucide-react'
import { Modal } from './Modal'

interface ServiceIncludesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ServiceIncludesModal({ isOpen, onClose }: ServiceIncludesModalProps) {
  const included = [
    'Limpieza de habitaciones',
    'Limpieza de salas y zonas comunes',
    'Limpieza y desinfección de baños y cocinas',
    'Recolección de basuras',
    'Limpieza de ventanas',
    'Lavado de ropa con lavadora',
  ]
  
  const notIncluded = [
    // 'Productos de limpieza',
    'Cuidado de niños',
    'Entregas de dinero, mandados fuera de la casa',
    'Carga de pesos superiores a 20 kilos',
    'Planchar ropa',
    'Lavar ropa a mano',
    'Cocinar',
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="¿Qué incluye el servicio?">
      <div className="space-y-6">
        {/* Included Services */}
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Incluye
          </h3>
          <ul className="space-y-3">
            {included.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <CircleCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-zinc-700 dark:text-zinc-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Not Included Services */}
        <div>
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
            NO incluye
          </h3>
          <ul className="space-y-3">
            {notIncluded.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <CircleX className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-zinc-700 dark:text-zinc-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Accept Button */}
        <div className="pt-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </Modal>
  )
}
