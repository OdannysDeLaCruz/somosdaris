import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAccessTokenFromHeaders } from '@/lib/auth-cookies'
import { verifyAccessToken } from '@/lib/jwt'
import { z } from 'zod'

const completeProfileSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  lastname: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
})

export async function POST(request: Request) {
  try {
    // Get access token from cookies
    const accessToken = getAccessTokenFromHeaders(request)

    if (!accessToken) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Verify token and get userId (now async)
    const payload = await verifyAccessToken(accessToken)

    if (!payload) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { name, lastname, email } = completeProfileSchema.parse(body)

    // Update user profile
    await prisma.user.update({
      where: { id: payload.userId },
      data: {
        name,
        lastname,
        email: email || undefined,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: error.issues }, { status: 400 })
    }

    console.error('Error in complete-profile:', error)
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 })
  }
}
