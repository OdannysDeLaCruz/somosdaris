import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAccessTokenFromHeaders } from '@/lib/auth-cookies'
import { getUserFromAccessToken } from '@/lib/session'
import { z } from 'zod'
import { sendAdminReservationNotification } from '@/lib/email'
import { formatInTimeZone } from 'date-fns-tz'
import { es } from 'date-fns/locale'
import { Decimal } from '@prisma/client/runtime/library'

// Interfaces para tipos de pricing
interface PricingItem {
  name: string
  quantity: number
  price: number
}

interface PricingData {
  cantidad?: number
  altura?: number
  items?: PricingItem[]
}

interface PricingOption {
  basePrice: Decimal
}

interface FormulaVariable {
  name: string
  multiplier: Decimal | null
}

interface Coupon {
  discountType: string
  discountAmount: Decimal
}

const pricingItemSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
})

const pricingDataSchema = z.object({
  cantidad: z.number().optional(),
  altura: z.number().optional(),
  items: z.array(pricingItemSchema).optional(),
})

const reservationSchema = z.object({
  type: z.enum(['home', 'office']).default('home'),
  date: z.string(),
  serviceId: z.string(),
  packageId: z.string().optional(),        // Legacy
  pricingOptionId: z.string().optional(),
  pricingData: pricingDataSchema.optional(),
  addressId: z.string().min(1, 'La dirección es requerida'),
  couponId: z.string().optional(),
  // NOTE: finalPrice NO se acepta - se calcula en el backend
})

// Función para calcular precio según pricing model
async function calculatePrice(
  service: { pricingModel: string },
  pricingOption: PricingOption | null,
  pricingData: PricingData | undefined,
  formulaVariables: FormulaVariable[] | null
): Promise<number> {
  if (!pricingOption) {
    throw new Error('Pricing option no encontrada')
  }

  const basePrice = Number(pricingOption.basePrice)

  if (service.pricingModel === 'PACKAGE_BASED') {
    return basePrice
  }

  if (service.pricingModel === 'FORMULA_BASED') {
    if (!formulaVariables || !pricingData) {
      return basePrice
    }

    let total = basePrice
    formulaVariables.forEach((variable) => {
      const value = pricingData[variable.name as keyof PricingData]
      if (value !== undefined && variable.multiplier) {
        const numValue = typeof value === 'number' ? value : parseInt(String(value))

        if (variable.name === 'cantidad') {
          total = basePrice * numValue
        } else if (variable.name === 'altura') {
          const adjustment = Number(variable.multiplier) * (numValue - 1)
          total += adjustment
        }
      }
    })

    return total
  }

  if (service.pricingModel === 'ITEM_BASED') {
    if (!pricingData?.items) {
      return basePrice
    }

    return pricingData.items.reduce((total: number, item: PricingItem) => {
      return total + (item.price * item.quantity)
    }, 0)
  }

  return basePrice
}

// Función para aplicar descuento de cupón
function applyDiscount(basePrice: number, coupon: Coupon | null): number {
  if (!coupon) {
    return basePrice
  }

  const discountAmount = Number(coupon.discountAmount)

  if (coupon.discountType === 'percentage') {
    return basePrice - (basePrice * discountAmount / 100)
  }

  return Math.max(0, basePrice - discountAmount)
}

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

    // Fetch service with pricing info
    const service = await prisma.service.findUnique({
      where: { id: validatedData.serviceId },
      include: {
        pricingOptions: {
          where: { id: validatedData.pricingOptionId },
        },
        formulaVariables: true,
      },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      )
    }

    const pricingOption = service.pricingOptions[0] || null

    if (!pricingOption && !validatedData.packageId) {
      return NextResponse.json(
        { error: 'Opción de precio no encontrada' },
        { status: 404 }
      )
    }

    // Auto-apply first reservation discount if applicable
    let finalCouponId = validatedData.couponId

    if (!finalCouponId) {
      const previousReservations = await prisma.reservation.count({
        where: { userId: authenticatedUser.id },
      })

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

    // Fetch coupon if exists
    const coupon = finalCouponId
      ? await prisma.coupon.findUnique({ where: { id: finalCouponId } })
      : null

    // Calculate base price
    const basePrice = await calculatePrice(
      service,
      pricingOption,
      validatedData.pricingData,
      service.formulaVariables
    )

    // Apply discount
    const finalPrice = applyDiscount(basePrice, coupon)

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        type: validatedData.type,
        date: new Date(validatedData.date),
        userId: authenticatedUser.id,
        serviceId: validatedData.serviceId,
        addressId: validatedData.addressId,
        packageId: validatedData.packageId,
        pricingOptionId: validatedData.pricingOptionId,
        pricingData: validatedData.pricingData,
        finalPrice,  // Calculado en el backend
        couponId: finalCouponId,
      },
      include: {
        user: true,
        service: true,
        address: true,
        package: true,
        pricingOption: true,
        coupon: true,
      },
    })

    // Send email notification to admin (non-blocking)
    try {
      const reservationDate = new Date(validatedData.date)
      const formattedAddress = `${address.address}, ${address.neighborhood}, ${address.city}, ${address.state}`
      const timeZone = 'America/Bogota'

      await sendAdminReservationNotification({
        reservationId: reservation.id,
        clientName: `${reservation.user.name || ''} ${reservation.user.lastname || ''}`.trim(),
        clientEmail: reservation.user.email || 'No especificado',
        clientPhone: reservation.user.phone,
        serviceName: reservation.service.name,
        serviceType: reservation.type,
        date: formatInTimeZone(reservationDate, timeZone, "d 'de' MMMM 'de' yyyy", { locale: es }),
        time: formatInTimeZone(reservationDate, timeZone, 'h:mm a', { locale: es }),
        address: formattedAddress,
        packageName: reservation.package?.description,
        pricingOptionName: reservation.pricingOption?.name,
        finalPrice: Number(reservation.finalPrice),
        pricingData: reservation.pricingData as PricingData | undefined,
      })
    } catch (emailError) {
      // Log error but don't fail the reservation
      console.error('Error enviando notificación por email al admin:', emailError)
    }

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
