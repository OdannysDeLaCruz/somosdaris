import { NextResponse } from 'next/server'
import { getAccessTokenFromHeaders } from '@/lib/auth-cookies'
import { getUserFromAccessToken } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    // Get access token from cookies
    const accessToken = getAccessTokenFromHeaders(request)

    if (!accessToken) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Get user from access token
    const user = await getUserFromAccessToken(accessToken)

    if (!user) {
      return NextResponse.json({ error: 'Sesión inválida o expirada' }, { status: 401 })
    }

    // Check if user has any reservations
    const reservationCount = await prisma.reservation.count({
      where: { userId: user.id },
    })

    return NextResponse.json({
      user: {
        ...user,
        haveReservations: reservationCount > 0,
      }
    })
  } catch (error) {
    console.error('Error in /api/auth/me:', error)
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 })
  }
}
