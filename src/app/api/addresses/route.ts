import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAccessTokenFromHeaders } from '@/lib/auth-cookies'
import { verifyAccessToken } from '@/lib/jwt'
import { z } from 'zod'

const addressSchema = z.object({
  address: z.string().min(1, 'La dirección es requerida'),
  label: z.string().optional(),
  neighborhood: z.string().min(1, 'El barrio es requerido'),
  city: z.string().min(1, 'La ciudad es requerida'),
  state: z.string().min(1, 'El estado es requerido'),
  country: z.string().min(1, 'El país es requerido'),
  extra: z.string().optional(),
})

// GET /api/addresses - Get addresses for authenticated user
export async function GET(request: Request) {
  try {
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

    const addresses = await prisma.address.findMany({
      where: { userId: payload.userId },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json({ error: 'Error al obtener las direcciones' }, { status: 500 })
  }
}

// POST /api/addresses - Create new address for authenticated user
export async function POST(request: Request) {
  try {
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

    const body = await request.json()
    const validatedData = addressSchema.parse(body)

    const address = await prisma.address.create({
      data: {
        ...validatedData,
        userId: payload.userId,
      },
    })

    return NextResponse.json(address, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: error.issues }, { status: 400 })
    }

    console.error('Error creating address:', error)
    return NextResponse.json({ error: 'Error al crear la dirección' }, { status: 500 })
  }
}
