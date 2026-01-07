import { prisma } from '@/lib/prisma'
import { Calendar, Users, UserCheck, TrendingUp } from 'lucide-react'

async function getDashboardStats() {
  const [
    totalReservations,
    totalClients,
    totalAllies,
    pendingReservations,
  ] = await Promise.all([
    prisma.reservation.count(),
    prisma.user.count({
      where: {
        role: {
          name: 'customer',
        },
      },
    }),
    prisma.user.count({
      where: {
        role: {
          name: 'ally',
        },
      },
    }),
    prisma.reservation.count({
      where: {
        status: 'pending',
      },
    }),
  ])

  return {
    totalReservations,
    totalClients,
    totalAllies,
    pendingReservations,
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  const cards = [
    {
      title: 'Total Reservas',
      value: stats.totalReservations,
      icon: Calendar,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
    },
    {
      title: 'Clientes',
      value: stats.totalClients,
      icon: Users,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50',
    },
    {
      title: 'Aliados',
      value: stats.totalAllies,
      icon: UserCheck,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-50',
    },
    {
      title: 'Reservas Pendientes',
      value: stats.pendingReservations,
      icon: TrendingUp,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgLight: 'bg-orange-50',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Bienvenido al panel de administración de SomosDaris
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.bgLight} p-3 rounded-lg`}>
                  <Icon className={card.textColor} size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Actividad Reciente
        </h2>
        <p className="text-gray-500">
          Las últimas reservas y actividades aparecerán aquí.
        </p>
      </div>
    </div>
  )
}
