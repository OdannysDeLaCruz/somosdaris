'use client'

// import Image from 'next/image'
import { useAuth } from './AuthProvider'

export default function FirstReservationTag() {
  const { user, loading } = useAuth()

  // Don't show while loading
  if (loading) return null

  // Only show if user is logged in and has no reservations
  if (!user || user.haveReservations !== false) return null

  return (
    <div className="flex items-center">
      {/* <Image
        src="/images/tag-desc.png"
        alt="Tienes 10% de descuento"
        width={120}
        height={40}
        className="object-contain"
        priority
      /> */}
      <div className="text-[10px] font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
        🎁 ¡DESC 10% activo!
      </div>
    </div>
  )
}
