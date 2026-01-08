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
  selectedDate?: Date,
  onSelect: (date: Date) => void
  onSelectedDateFormated: (date: string) => void
  onSelectedTimeFormated: (time: string) => void
}

export function DateTimePicker({ onSelect, selectedDate, onSelectedDateFormated, onSelectedTimeFormated }: DateTimePickerProps) {
  const [selected, setSelected] = useState<Date | undefined>(selectedDate)
  const [selectedTime, setSelectedTime] = useState<string>('08:00')

  // Verificar si la fecha seleccionada es hoy
  const isToday = (date: Date | undefined) => {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // Verificar si la fecha seleccionada es mañana
  const isTomorrow = (date: Date | undefined) => {
    if (!date) return false
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return date.toDateString() === tomorrow.toDateString()
  }

  const handleDateSelect = (date: Date | undefined) => {
    // console.log("date", date)
    if (date) {
      setSelected(date)
      onSelectedDateFormated(date.toISOString().split('T')[0])

      // Si hoy son más de las 2PM y se selecciona mañana, ajustar la hora mínima
      const now = new Date()
      const currentHour = now.getHours()
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const isSelectingTomorrow = date.toDateString() === tomorrow.toDateString()

      let timeToUse = selectedTime
      if (currentHour >= 14 && isSelectingTomorrow && selectedTime < '14:00') {
        // Si la hora seleccionada es antes de las 2PM, ajustarla a 2PM
        timeToUse = '14:00'
        setSelectedTime(timeToUse)
      }

      onSelectedTimeFormated(timeToUse)
      console.log("selectedDateFormated", date.toISOString().split('T')[0])
      console.log("selectedTimeFormated", timeToUse)
      // Siempre llamar onSelect para que el padre se entere del cambio
      console.log('!isToday(date)', !isToday(date))
      if (!isToday(date)) {
        const [hours, minutes] = timeToUse.split(':')
        const dateTime = new Date(date)
        dateTime.setHours(parseInt(hours), parseInt(minutes))
        onSelect(dateTime)
        console.log("dateTime", dateTime)
      } else {
        // Si es hoy, llamar onSelect con la fecha sin hora establecida
        onSelect(date)
      }
    }
  }

  const handleTimeChange = (time: string) => {
    console.log("time", time)
    setSelectedTime(time)
    if (selected) {
      const [hours, minutes] = time.split(':')
      const dateTime = new Date(selected)
      dateTime.setHours(parseInt(hours), parseInt(minutes))
      onSelect(dateTime)
      console.log("dateTime", dateTime)
      onSelectedTimeFormated(time)
    }
  }

  // Generar opciones de tiempo (cada hora de 7am a 4pm)
  // Si hoy son más de las 2PM y se selecciona mañana, solo mostrar horarios después de 2PM
  const getTimeOptions = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const timeOptions = []

    // Si hoy son más de las 2PM (14:00) y la fecha seleccionada es mañana
    const shouldRestrictMorning = currentHour >= 14 && isTomorrow(selected)

    // Empezar a las 2PM si aplica restricción, sino a las 7AM
    const startHour = shouldRestrictMorning ? 14 : 7

    for (let hour = startHour; hour <= 16; hour++) {
      timeOptions.push(`${hour.toString().padStart(2, '0')}:00`)
      if (hour < 16) {
        timeOptions.push(`${hour.toString().padStart(2, '0')}:30`)
      }
    }

    return timeOptions
  }

  const timeOptions = getTimeOptions()

  return (
    <div className="space-y-4">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendario */}
        <div>
          <h3 className="text-2xl font-bold text-black">
            Fecha del servicio
          </h3>
          <div className='mb-6'></div>
          
          <div className="bg-blue-200 dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700">
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
                <SelectTrigger className="w-full text-xl border border-black px-5 py-6 mb-8">
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
