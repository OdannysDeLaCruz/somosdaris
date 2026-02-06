import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateReservationSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
  allyId: z.string().nullable().optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            role: true,
          },
        },
        ally: {
          include: {
            role: true,
          },
        },
        service: true,
        address: true,
        package: true,
        coupon: true,
        payments: true,
      },
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Error fetching reservation:', error)
    return NextResponse.json(
      { error: 'Error al obtener la reserva' },
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
    const validatedData = updateReservationSchema.parse(body)

    // Check if reservation exists
    const existingReservation = await prisma.reservation.findUnique({
      where: { id },
    })

    if (!existingReservation) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    // If allyId is provided, verify it's a valid ally
    if (validatedData.allyId !== undefined && validatedData.allyId !== null) {
      const ally = await prisma.user.findFirst({
        where: {
          id: validatedData.allyId,
          role: { name: 'ally' },
        },
      })

      if (!ally) {
        return NextResponse.json(
          { error: 'El aliado especificado no existe o no tiene el rol correcto' },
          { status: 400 }
        )
      }
    }

    // Build update data object
    const updateData: Record<string, unknown> = {}
    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status
    }
    if (validatedData.allyId !== undefined) {
      updateData.allyId = validatedData.allyId
    }

    // Update reservation
    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          include: {
            role: true,
          },
        },
        ally: {
          include: {
            role: true,
          },
        },
        service: true,
        address: true,
        package: true,
        coupon: true,
        payments: true,
      },
    })

    return NextResponse.json(updatedReservation)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating reservation:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la reserva' },
      { status: 500 }
    )
  }
}
