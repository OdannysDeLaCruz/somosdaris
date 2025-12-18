import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSessionToken, constantTimeCompare } from '@/lib/auth'
import { normalizePhone } from '@/lib/phone'
import { z } from 'zod'

const verifyOtpSchema = z.object({
  phone: z.string().min(1, 'El teléfono es requerido'),
  code: z.string().length(6, 'El código debe tener 6 dígitos'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, code } = verifyOtpSchema.parse(body)

    const normalizedPhone = normalizePhone(phone)

    // Find most recent non-expired OTP for this phone
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        phone: normalizedPhone,
        verified: false,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Código expirado o inválido' },
        { status: 400 }
      )
    }

    // Check attempts limit
    if (otpRecord.attempts >= 3) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Solicite un nuevo código.' },
        { status: 400 }
      )
    }

    // Increment attempts
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { attempts: otpRecord.attempts + 1 }
    })

    // Verify code using constant-time comparison
    if (!constantTimeCompare(code, otpRecord.code)) {
      const remainingAttempts = 3 - (otpRecord.attempts + 1)
      return NextResponse.json(
        {
          error: 'Código incorrecto',
          remainingAttempts
        },
        { status: 400 }
      )
    }

    // Mark OTP as verified
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    })

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { phone: normalizedPhone }
    })

    let isNewUser = false

    if (!user) {
      // Create new user with empty name/lastname
      user = await prisma.user.create({
        data: {
          phone: normalizedPhone,
          name: '',
          lastname: ''
        }
      })
      isNewUser = true
    } else {
      // Check if user has completed their profile
      isNewUser = !user.name || !user.lastname
    }

    // Create session
    const token = generateSessionToken()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    })

    return NextResponse.json({
      success: true,
      token,
      user,
      isNewUser
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error },
        { status: 400 }
      )
    }

    console.error('Error in verify-otp:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
