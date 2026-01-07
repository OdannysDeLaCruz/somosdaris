import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateServiceSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').optional(),
  description: z.string().min(1, 'La descripción es requerida').optional(),
  image: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  comingSoon: z.boolean().optional(),
  pricingModel: z.enum(['PACKAGE_BASED', 'FORMULA_BASED', 'ITEM_BASED']).optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const service = await prisma.service.findUnique({
      where: { id },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { error: 'Error al obtener el servicio' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateServiceSchema.parse(body)

    // Verificar que el servicio existe
    const existingService = await prisma.service.findUnique({
      where: { id },
    })

    if (!existingService) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      )
    }

    // Si se actualiza el nombre, verificar que no exista otro con ese nombre
    if (validatedData.name && validatedData.name !== existingService.name) {
      const duplicateService = await prisma.service.findFirst({
        where: {
          name: validatedData.name,
          id: { not: id },
        },
      })

      if (duplicateService) {
        return NextResponse.json(
          { error: 'Ya existe un servicio con este nombre' },
          { status: 400 }
        )
      }
    }

    // Actualizar el servicio
    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.description && { description: validatedData.description }),
        ...(validatedData.image !== undefined && { image: validatedData.image || null }),
        ...(validatedData.comingSoon !== undefined && { comingSoon: validatedData.comingSoon }),
        ...(validatedData.pricingModel && { pricingModel: validatedData.pricingModel }),
      },
    })

    return NextResponse.json(updatedService)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating service:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el servicio' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Verificar que el servicio existe
    const existingService = await prisma.service.findUnique({
      where: { id },
      include: {
        _count: {
          select: { reservations: true },
        },
      },
    })

    if (!existingService) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si tiene reservaciones asociadas
    if (existingService._count.reservations > 0) {
      return NextResponse.json(
        {
          error: 'No se puede eliminar el servicio porque tiene reservaciones asociadas',
          reservationsCount: existingService._count.reservations
        },
        { status: 400 }
      )
    }

    // Eliminar el servicio
    await prisma.service.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Servicio eliminado exitosamente' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el servicio' },
      { status: 500 }
    )
  }
}
