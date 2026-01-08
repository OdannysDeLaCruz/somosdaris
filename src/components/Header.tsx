'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import UserMenu from './UserMenu'
import { useAuth } from './AuthProvider'
import Image from 'next/image'

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  // No mostrar header en páginas de reserva, confirmación, login, dashboard y landing
  const hideHeader = pathname?.includes('/app/reservar') || pathname?.includes('/app/confirmacion') || pathname?.includes('/login') || pathname?.includes('/app/dashboard') || pathname === '/'

  if (hideHeader) return null

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex md:grid md:grid-cols-3 items-center justify-center px-4 py-3">
          {/* Left side: Hamburger Menu + Discount Tag */}
          <div className="flex items-center gap-3">
            {/* Hamburger Menu Button - Only visible on desktop */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="hidden md:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Abrir menú"
            >
              <svg
                className="w-6 h-6 text-gray-700 dark:text-gray-200"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          {/* Logo */}
          <div className="col-span-1 flex justify-start md:justify-center">
            <Image src="/images/logo-azul.png" alt="Logo" width={100} height={100} />
          </div>

          {/* User Profile Button */}
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-auto"
            aria-label="Menú de usuario"
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {user ? 'Hola, ' + user.name : 'Invitado'}
            </span>
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-300"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </button>
        </div>
      </header>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-[57px]"></div>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* User Menu Dropdown */}
      <UserMenu isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} />
    </>
  )
}
