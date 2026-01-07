import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updatePricingOptionSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').optional(),
  description: z.string().nullable().optional(),
  basePrice: z.number().positive('El precio debe ser mayor a 0').optional(),
  metadata: z.any().optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; optionId: string }> }
) {
  try {
    const { id: serviceId, optionId } = await params
    const body = await request.json()
    const validatedData = updatePricingOptionSchema.parse(body)

    // Verificar que la opción existe y pertenece al servicio
    const existingOption = await prisma.pricingOption.findFirst({
      where: {
        id: optionId,
        serviceId,
      },
    })

    if (!existingOption) {
      return NextResponse.json(
        { error: 'Opción de precio no encontrada' },
        { status: 404 }
      )
    }

    // Actualizar la opción
    const updatedOption = await prisma.pricingOption.update({
      where: { id: optionId },
      data: validatedData,
    })

    return NextResponse.json(updatedOption)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating pricing option:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la opción de precio' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; optionId: string }> }
) {
  try {
    const { id: serviceId, optionId } = await params

    // Verificar que la opción existe y pertenece al servicio
    const existingOption = await prisma.pricingOption.findFirst({
      where: {
        id: optionId,
        serviceId,
      },
      include: {
        _count: {
          select: { reservations: true },
        },
      },
    })

    if (!existingOption) {
      return NextResponse.json(
        { error: 'Opción de precio no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que no tiene reservas asociadas
    if (existingOption._count.reservations > 0) {
      return NextResponse.json(
        { error: `No se puede eliminar: tiene ${existingOption._count.reservations} reservaciones asociadas` },
        { status: 400 }
      )
    }

    // Eliminar la opción
    await prisma.pricingOption.delete({
      where: { id: optionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting pricing option:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la opción de precio' },
      { status: 500 }
    )
  }
}
