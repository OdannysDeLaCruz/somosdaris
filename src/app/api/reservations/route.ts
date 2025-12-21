import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAccessTokenFromHeaders } from '@/lib/auth-cookies'
import { getUserFromAccessToken } from '@/lib/session'
import { z } from 'zod'

const reservationSchema = z.object({
  type: z.enum(['home', 'office']).default('home'),
  date: z.string(),
  serviceId: z.string(),
  packageId: z.string(),
  addressId: z.string().min(1, 'La dirección es requerida'),
  couponId: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    // Verify user is authenticated
    const accessToken = getAccessTokenFromHeaders(request)
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para crear una reserva' },
        { status: 401 }
      )
    }

    const authenticatedUser = await getUserFromAccessToken(accessToken)
    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'Sesión inválida o expirada' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = reservationSchema.parse(body)

    // Verify the address exists and belongs to the user
    const address = await prisma.address.findFirst({
      where: {
        id: validatedData.addressId,
        userId: authenticatedUser.id,
      },
    })

    if (!address) {
      return NextResponse.json(
        { error: 'Dirección no encontrada o no pertenece al usuario' },
        { status: 404 }
      )
    }

    // Auto-apply first reservation discount if applicable
    let finalCouponId = validatedData.couponId

    if (!finalCouponId) {
      // Check if user has previous reservations
      const previousReservations = await prisma.reservation.count({
        where: { userId: authenticatedUser.id },
      })

      // If no previous reservations, apply first reservation discount
      if (previousReservations === 0) {
        const firstReservationCoupon = await prisma.coupon.findFirst({
          where: {
            isFirstReservationDiscount: true,
            isActive: true,
            expiresAt: { gt: new Date() },
          },
        })

        if (firstReservationCoupon) {
          finalCouponId = firstReservationCoupon.id
        }
      }
    }

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        type: validatedData.type,
        date: new Date(validatedData.date),
        userId: authenticatedUser.id,
        serviceId: validatedData.serviceId,
        addressId: validatedData.addressId,
        packageId: validatedData.packageId,
        couponId: finalCouponId,
      },
      include: {
        user: true,
        service: true,
        address: true,
        package: true,
        coupon: true,
      },
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

export async function GET(request: Request) {
  try {
    // Verify user is authenticated
    const accessToken = getAccessTokenFromHeaders(request)
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para ver tus reservas' },
        { status: 401 }
      )
    }

    const authenticatedUser = await getUserFromAccessToken(accessToken)
    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'Sesión inválida o expirada' },
        { status: 401 }
      )
    }

    // Get reservations for the authenticated user only
    const reservations = await prisma.reservation.findMany({
      where: {
        userId: authenticatedUser.id,
      },
      include: {
        user: true,
        service: true,
        address: true,
        package: true,
        coupon: true,
        ally: {
          select: {
            id: true,
            name: true,
            lastname: true,
            phone: true,
            photo: true,
          },
        },
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
