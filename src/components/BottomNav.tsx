'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ClipboardList, Heart, MapPin } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()
console.log(pathname)
  // Don't show bottom nav on these pages
  // const nonVisiblePages = ['/reservar', '/confirmacion', '/login', '/dashboard'];

  const hideBottomNav = pathname?.includes('/reservar') || pathname?.includes('/confirmacion') || pathname?.includes('/login') || pathname?.includes('/dashboard')

  if (hideBottomNav) return null

  const navItems = [
    {
      name: 'Home',
      href: '/',
      Icon: Home,
    },
    {
      name: 'Historial',
      href: '/historial',
      Icon: ClipboardList,
    },
    {
      name: 'Favoritos',
      href: '/favoritos',
      Icon: Heart,
    },
    {
      name: 'Direcciones',
      href: '/direcciones',
      Icon: MapPin,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.Icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Icon
                className={`w-6 h-6 ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                fill={isActive ? 'currentColor' : 'none'}
              />
              <span
                className={`text-xs mt-1 ${
                  isActive
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
