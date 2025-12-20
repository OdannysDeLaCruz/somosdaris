import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAccessTokenFromHeaders } from '@/lib/auth-cookies'
import { verifyAccessToken } from '@/lib/jwt'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get access token from cookies
    const accessToken = getAccessTokenFromHeaders(request)

    if (!accessToken) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Verify token and get userId
    const payload = await verifyAccessToken(accessToken)

    if (!payload) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 })
    }

    // Verify the address exists and belongs to the user
    const address = await prisma.address.findFirst({
      where: {
        id,
        userId: payload.userId,
      },
    })

    if (!address) {
      return NextResponse.json(
        { error: 'Dirección no encontrada o no pertenece al usuario' },
        { status: 404 }
      )
    }

    // Delete the address
    await prisma.address.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json({ error: 'Error al eliminar la dirección' }, { status: 500 })
  }
}
