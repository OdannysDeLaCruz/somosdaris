import { ReactNode } from 'react'
import { requireAdmin } from '@/lib/auth'
import Sidebar from '@/components/dashboard/Sidebar'

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await requireAdmin()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar userName={user.name || user.email || user.phone} />

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
