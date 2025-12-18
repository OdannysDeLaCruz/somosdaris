'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const addressSchema = z.object({
  address: z.string().min(1, 'La dirección es requerida'),
  label: z.string().optional(),
  city: z.string().min(1, 'La ciudad es requerida'),
  state: z.string().min(1, 'El estado/departamento es requerido'),
  country: z.string().min(1, 'El país es requerido'),
  extra: z.string().optional(),
})

export type AddressFormData = z.infer<typeof addressSchema>

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void
  onCancel: () => void
}

export function AddressForm({ onSubmit, onCancel }: AddressFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: 'Colombia',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
            País
          </label>
          <input
            {...register('country')}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50"
          />
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Estado/Departamento *
          </label>
          <input
            {...register('state')}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50"
          />
          {errors.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Ciudad *
        </label>
        <input
          {...register('city')}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50"
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Dirección *
        </label>
        <input
          {...register('address')}
          placeholder="Ej: Calle 123 #45-67"
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Indicaciones adicionales
        </label>
        <textarea
          {...register('extra')}
          rows={3}
          placeholder="Ej: Apartamento 301, Torre B, timbre azul"
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Nombre para esta dirección
        </label>
        <input
          {...register('label')}
          placeholder="Ej: Casa, Oficina, Casa de mamá"
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          Guardar dirección
        </button>
      </div>
    </form>
  )
}
