import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const addressSchema = z.object({
  address: z.string().min(1, 'La dirección es requerida'),
  label: z.string().optional(),
  city: z.string().min(1, 'La ciudad es requerida'),
  state: z.string().min(1, 'El estado es requerido'),
  country: z.string().min(1, 'El país es requerido'),
  extra: z.string().optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Error al obtener las direcciones' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const body = await request.json()

    const validatedData = addressSchema.parse(body)

    const address = await prisma.address.create({
      data: {
        ...validatedData,
        userId,
      },
    })

    return NextResponse.json(address, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error },
        { status: 400 }
      )
    }

    console.error('Error creating address:', error)
    return NextResponse.json(
      { error: 'Error al crear la dirección' },
      { status: 500 }
    )
  }
}
