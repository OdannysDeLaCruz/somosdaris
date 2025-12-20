'use client'

import Link from 'next/link'

interface LoginPromptProps {
  title: string
  message: string
  icon?: React.ReactNode
}

export default function LoginPrompt({ title, message, icon }: LoginPromptProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4 py-8">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          {icon || (
            <svg
              className="w-20 h-20 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {message}
        </p>

        {/* Login Button */}
        <Link
          href="/login"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
          </svg>
          Iniciar sesión
        </Link>
      </div>
    </div>
  )
}
