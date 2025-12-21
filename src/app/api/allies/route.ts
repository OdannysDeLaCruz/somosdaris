import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizePhone } from '@/lib/phone'
import { z } from 'zod'

const allySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  lastname: z.string().min(1, 'El apellido es requerido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
})

export async function GET() {
  try {
    const allies = await prisma.user.findMany({
      where: {
        role: {
          name: 'ally',
        },
      },
      include: {
        role: true,
        _count: {
          select: {
            allyReservations: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(allies)
  } catch (error) {
    console.error('Error fetching allies:', error)
    return NextResponse.json(
      { error: 'Error al obtener los aliados' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = allySchema.parse(body)

    const normalizedPhone = normalizePhone(validatedData.phone)

    // Check if phone already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone: normalizedPhone },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con este número de teléfono' },
        { status: 400 }
      )
    }

    // Get ally role
    const allyRole = await prisma.role.findFirst({
      where: { name: 'ally' },
    })

    if (!allyRole) {
      return NextResponse.json(
        { error: 'Error de configuración: rol de aliado no encontrado' },
        { status: 500 }
      )
    }

    // Create ally user
    const ally = await prisma.user.create({
      data: {
        name: validatedData.name,
        lastname: validatedData.lastname,
        phone: normalizedPhone,
        email: validatedData.email || null,
        roleId: allyRole.id,
      },
      include: {
        role: true,
      },
    })

    return NextResponse.json(ally, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating ally:', error)
    return NextResponse.json(
      { error: 'Error al crear el aliado' },
      { status: 500 }
    )
  }
}
