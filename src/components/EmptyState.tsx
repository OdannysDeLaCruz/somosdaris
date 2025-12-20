interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4 py-8">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mb-6 flex justify-center opacity-50">
          {icon}
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>

        {/* Optional Action Button */}
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}
