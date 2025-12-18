import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reservationSchema = z.object({
  type: z.enum(['home', 'office']).default('home'),
  date: z.string().datetime(),
  serviceId: z.string(),
  packageId: z.string(),
  couponId: z.string().optional(),
  userInfo: z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    lastname: z.string().min(1, 'El apellido es requerido'),
    phone: z.string().min(1, 'El teléfono es requerido'),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
  }),
  addressData: z.object({
    address: z.string().min(1, 'La dirección es requerida'),
    label: z.string().optional(),
    city: z.string().min(1, 'La ciudad es requerida'),
    state: z.string().min(1, 'El estado es requerido'),
    country: z.string().min(1, 'El país es requerido'),
    extra: z.string().optional(),
  }),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = reservationSchema.parse(body)

    // Transacción atómica: crear usuario, dirección y reserva
    const reservation = await prisma.$transaction(async (tx) => {
      // 1. Crear o actualizar el usuario
      const user = await tx.user.upsert({
        where: { phone: validatedData.userInfo.phone },
        update: {
          name: validatedData.userInfo.name,
          lastname: validatedData.userInfo.lastname,
          email: validatedData.userInfo.email || undefined,
        },
        create: {
          name: validatedData.userInfo.name,
          lastname: validatedData.userInfo.lastname,
          phone: validatedData.userInfo.phone,
          email: validatedData.userInfo.email || undefined,
        },
      })

      // 2. Crear la dirección asociada al usuario
      const address = await tx.address.create({
        data: {
          address: validatedData.addressData.address,
          label: validatedData.addressData.label || null,
          city: validatedData.addressData.city,
          state: validatedData.addressData.state,
          country: validatedData.addressData.country,
          extra: validatedData.addressData.extra || null,
          userId: user.id,
        },
      })

      // 3. Crear la reserva
      const newReservation = await tx.reservation.create({
        data: {
          type: validatedData.type,
          date: new Date(validatedData.date),
          userId: user.id,
          serviceId: validatedData.serviceId,
          addressId: address.id,
          packageId: validatedData.packageId,
          couponId: validatedData.couponId,
        },
        include: {
          user: true,
          service: true,
          address: true,
          package: true,
          coupon: true,
        },
      })

      return newReservation
    })

    return NextResponse.json(reservation, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error },
        { status: 400 }
      )
    }

    console.error('Error creating reservation:', error)
    return NextResponse.json(
      { error: 'Error al crear la reserva' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        user: true,
        service: true,
        address: true,
        package: true,
        coupon: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(reservations)
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json(
      { error: 'Error al obtener las reservas' },
      { status: 500 }
    )
  }
}
