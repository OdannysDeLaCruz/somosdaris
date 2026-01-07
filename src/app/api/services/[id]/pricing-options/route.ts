import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const pricingOptionSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  basePrice: z.number().positive('El precio debe ser mayor a 0'),
  metadata: z.any().optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const options = await prisma.pricingOption.findMany({
      where: {
        serviceId: id,
        isActive: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    })

    return NextResponse.json(options)
  } catch (error) {
    console.error('Error fetching pricing options:', error)
    return NextResponse.json(
      { error: 'Error al obtener opciones de precio' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: serviceId } = await params
    const body = await request.json()
    const validatedData = pricingOptionSchema.parse(body)

    // Verificar que el servicio existe
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      )
    }

    // Crear la opción de precio
    const pricingOption = await prisma.pricingOption.create({
      data: {
        serviceId,
        name: validatedData.name,
        description: validatedData.description,
        basePrice: validatedData.basePrice,
        metadata: validatedData.metadata,
        displayOrder: validatedData.displayOrder ?? 0,
        isActive: validatedData.isActive ?? true,
      },
    })

    return NextResponse.json(pricingOption, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating pricing option:', error)
    return NextResponse.json(
      { error: 'Error al crear la opción de precio' },
      { status: 500 }
    )
  }
}
