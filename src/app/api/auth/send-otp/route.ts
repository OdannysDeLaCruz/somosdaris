// TEMPORALMENTE DESHABILITADO - No eliminar, se usará más adelante
import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
// import { generateOTP } from '@/lib/otp'
// import { sendOTP } from '@/lib/whatsapp'
// import { normalizePhone, validatePhone } from '@/lib/phone'
// import { z } from 'zod'

// const sendOtpSchema = z.object({
//   phone: z.string().min(1, 'El teléfono es requerido'),
// })

export async function POST(request: Request) {
  return NextResponse.json(
    { error: 'Autenticación OTP temporalmente deshabilitada' },
    { status: 503 }
  )
}

/* CÓDIGO ORIGINAL - MANTENER PARA USO FUTURO
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone } = sendOtpSchema.parse(body)

    // Validate phone format
    if (!validatePhone(phone)) {
      return NextResponse.json(
        { error: 'Formato de teléfono inválido' },
        { status: 400 }
      )
    }

    const normalizedPhone = normalizePhone(phone)

    // Rate limiting: Check if user has requested too many OTPs in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentOtps = await prisma.otpVerification.count({
      where: {
        phone: normalizedPhone,
        createdAt: {
          gte: oneHourAgo
        }
      }
    })

    if (recentOtps >= 3) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Por favor intente más tarde.' },
        { status: 429 }
      )
    }

    // Invalidate previous unverified OTPs for this phone
    await prisma.otpVerification.updateMany({
      where: {
        phone: normalizedPhone,
        verified: false
      },
      data: {
        verified: true // Mark as verified to effectively invalidate
      }
    })

    // Generate OTP
    const code = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP
    await prisma.otpVerification.create({
      data: {
        phone: normalizedPhone,
        code,
        expiresAt
      }
    })

    // Send OTP via WhatsApp
    try {
      await sendOTP(normalizedPhone, code)
    } catch (error) {
      console.error('Error sending WhatsApp:', error)
      return NextResponse.json(
        { error: 'Error al enviar el código. Intente nuevamente.' },
        { status: 503 }
      )
    }

    return NextResponse.json({
      success: true,
      expiresIn: 600 // 10 minutes in seconds
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error},
        { status: 400 }
      )
    }

    console.error('Error in send-otp:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
*/
