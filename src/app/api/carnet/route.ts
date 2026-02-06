import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateCVTToken, generateCVUToken } from '@/lib/carnet'
import { getUserFromAccessToken } from '@/lib/session'
import { getAccessTokenFromHeaders } from '@/lib/auth-cookies'

export async function POST(request: NextRequest) {
  try {
    // Verify authenticated user is admin
    const accessToken = getAccessTokenFromHeaders(request)
    if (!accessToken) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const user = await getUserFromAccessToken(accessToken)
    if (!user) {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 })
    }

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      include: { role: true },
    })

    if (!userWithRole) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const isAdmin = userWithRole.role.name === 'admin'
    const isAlly = userWithRole.role.name === 'ally'

    const body = await request.json()
    const { type, reservationId, allyId } = body

    if (type === 'cvt') {
      if (!isAdmin) {
        return NextResponse.json({ error: 'Solo admin puede generar CVT' }, { status: 403 })
      }
      if (!reservationId) {
        return NextResponse.json({ error: 'reservationId es requerido' }, { status: 400 })
      }

      const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
        select: { id: true, allyId: true, status: true },
      })

      if (!reservation || !reservation.allyId) {
        return NextResponse.json({ error: 'Reserva no encontrada o sin aliado asignado' }, { status: 404 })
      }

      const token = generateCVTToken(reservationId)
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
      const url = `${baseUrl}/carnet/${encodeURIComponent(token)}`

      return NextResponse.json({ token, url })
    }

    if (type === 'cvu') {
      // Admin can generate for any ally; allies can only generate their own
      if (!isAdmin && !isAlly) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
      }

      const targetAllyId = isAlly ? userWithRole.id : allyId
      if (!targetAllyId) {
        return NextResponse.json({ error: 'allyId es requerido' }, { status: 400 })
      }

      const ally = await prisma.user.findUnique({
        where: { id: targetAllyId },
        include: { role: true },
      })

      if (!ally || ally.role.name !== 'ally') {
        return NextResponse.json({ error: 'Aliado no encontrado' }, { status: 404 })
      }

      const token = generateCVUToken(targetAllyId)
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
      const url = `${baseUrl}/carnet/${encodeURIComponent(token)}`

      return NextResponse.json({ token, url })
    }

    return NextResponse.json({ error: 'Tipo inválido. Use "cvt" o "cvu"' }, { status: 400 })
  } catch (error) {
    console.error('Error generating carnet token:', error)
    return NextResponse.json({ error: 'Error al generar el token' }, { status: 500 })
  }
}
