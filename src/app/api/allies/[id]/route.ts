import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizePhone } from '@/lib/phone'
import { z } from 'zod'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const ally = await prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        allyReservations: {
          include: {
            service: true,
            user: true,
            address: true,
          },
          orderBy: {
            date: 'desc',
          },
        },
      },
    })

    if (!ally || ally.role.name !== 'ally') {
      return NextResponse.json(
        { error: 'Aliado no encontrado' },
        { status: 404 }
      )
    }

    // Convert Decimal to number for serialization
    const serializedAlly = {
      ...ally,
      allyReservations: ally.allyReservations.map((r) => ({
        ...r,
        finalPrice: Number(r.finalPrice),
      })),
    }

    return NextResponse.json(serializedAlly)
  } catch (error) {
    console.error('Error fetching ally:', error)
    return NextResponse.json(
      { error: 'Error al obtener el aliado' },
      { status: 500 }
    )
  }
}

const updateAllySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').optional(),
  lastname: z.string().min(1, 'El apellido es requerido').optional(),
  phone: z.string().min(1, 'El teléfono es requerido').optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  identificationNumber: z.string().optional().or(z.literal('')),
  photo: z.string().url('URL de foto inválida').optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateAllySchema.parse(body)

    // Verify ally exists
    const existing = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    })

    if (!existing || existing.role.name !== 'ally') {
      return NextResponse.json(
        { error: 'Aliado no encontrado' },
        { status: 404 }
      )
    }

    // If phone is being changed, check for duplicates
    if (validatedData.phone) {
      const normalizedPhone = normalizePhone(validatedData.phone)
      const phoneExists = await prisma.user.findFirst({
        where: {
          phone: normalizedPhone,
          id: { not: id },
        },
      })

      if (phoneExists) {
        return NextResponse.json(
          { error: 'Ya existe un usuario con este número de teléfono' },
          { status: 400 }
        )
      }

      validatedData.phone = normalizedPhone
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(validatedData.name !== undefined && { name: validatedData.name }),
        ...(validatedData.lastname !== undefined && { lastname: validatedData.lastname }),
        ...(validatedData.phone !== undefined && { phone: validatedData.phone }),
        ...(validatedData.email !== undefined && { email: validatedData.email || null }),
        ...(validatedData.identificationNumber !== undefined && {
          identificationNumber: validatedData.identificationNumber || null,
        }),
        ...(validatedData.photo !== undefined && { photo: validatedData.photo }),
      },
      include: {
        role: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating ally:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el aliado' },
      { status: 500 }
    )
  }
}
