'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar1, Clock } from 'lucide-react'

interface DateTimePickerProps {
  onSelect: (date: Date) => void
  selectedDate?: Date
}

export function DateTimePicker({ onSelect, selectedDate }: DateTimePickerProps) {
  const [selected, setSelected] = useState<Date | undefined>(selectedDate)
  const [selectedTime, setSelectedTime] = useState<string>('09:00')

  // Verificar si la fecha seleccionada es hoy
  const isToday = (date: Date | undefined) => {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelected(date)
      // Siempre llamar onSelect para que el padre se entere del cambio
      if (!isToday(date)) {
        const [hours, minutes] = selectedTime.split(':')
        const dateTime = new Date(date)
        dateTime.setHours(parseInt(hours), parseInt(minutes))
        onSelect(dateTime)
      } else {
        // Si es hoy, llamar onSelect con la fecha sin hora establecida
        onSelect(date)
      }
    }
  }

  const handleTimeChange = (time: string) => {
    setSelectedTime(time)
    if (selected) {
      const [hours, minutes] = time.split(':')
      const dateTime = new Date(selected)
      dateTime.setHours(parseInt(hours), parseInt(minutes))
      onSelect(dateTime)
    }
  }

  // Generar opciones de tiempo (cada hora de 7am a 7pm)
  const timeOptions = []
  for (let hour = 7; hour <= 19; hour++) {
    timeOptions.push(`${hour.toString().padStart(2, '0')}:00`)
    if (hour < 19) {
      timeOptions.push(`${hour.toString().padStart(2, '0')}:30`)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-black">
        Fecha del servicio
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendario */}
        <div className="bg-blue-200 dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleDateSelect}
            disabled={{ before: new Date() }}
            locale={es}
            className="rounded-md w-full"
            classNames={{
              caption_label: "text-xl font-bold",
              day_button: "text-xl",
            }}
          />
        </div>

        {/* Selector de hora */}
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-2xl font-bold text-black">
              Hora del servicio
            </span>
            <div className='mb-6'></div>

            {isToday(selected) ? (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-lg text-yellow-800 dark:text-yellow-200">
                   Pronto tendremos <span className="font-bold text-orange-400 bg-orange-100 border border-orange-400 text-base rounded-lg px-2 py-1 text-nowrap">🔥 Servicio Express</span> disponible. Pero por ahora no podemos ayudarte el mismo día 😞, reserva para mañana o para despues 😎.
                </p>
              </div>
            ) : (
              <Select value={selectedTime} onValueChange={handleTimeChange} disabled={!selected}>
                <SelectTrigger className="w-full text-xl border border-gray-500 p-5">
                  <SelectValue placeholder="Selecciona una hora" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(time => (
                    <SelectItem key={time} value={time} className="text-xl">
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {selected && !isToday(selected) && (
            <div className="flex flex-col mt-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-green-500">
              <div className="text-xl text-black flex">
                <div>
                  <Calendar1 className="mr-2 h-6 w-6 inline" />
                </div>
                <div>
                  Para el <strong className="font-bold ml-1">{format(selected, "PPPP", { locale: es })}</strong>
                </div>
              </div>
              <p className="text-lg text-black mt-1 flex items-center">
                <Clock className="mr-2 size-6" /> A las
                <strong className="font-bold ml-1">{selectedTime} {selectedTime < '12:00' ? 'am' : 'pm'}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
