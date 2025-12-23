import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyOTP } from '@/lib/supabase/auth'
import { normalizePhone } from '@/lib/phone'
import { createSession } from '@/lib/session'
import { setAuthCookies } from '@/lib/auth-cookies'
import { z } from 'zod'

const verifyOtpSchema = z.object({
  phone: z.string().min(1, 'El teléfono es requerido'),
  code: z.string().length(6, 'El código debe tener 6 dígitos'),
  deviceInfo: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, code, deviceInfo } = verifyOtpSchema.parse(body)

    const normalizedPhone = normalizePhone(phone)

    // BYPASS: Skip Supabase verification - accept any code
    // Generate a consistent userId based on phone number
    const crypto = await import('crypto')
    const supabaseUserId = crypto.createHash('sha256').update(normalizedPhone).digest('hex').substring(0, 28)

    // Check if user exists in our database
    let user = await prisma.user.findUnique({
      where: { phone: normalizedPhone },
    })

    let isNewUser = false

    if (!user) {
      // Get customer role
      const customerRole = await prisma.role.findFirst({
        where: { name: 'customer' },
      })

      if (!customerRole) {
        return NextResponse.json(
          { error: 'Error de configuración: rol de cliente no encontrado' },
          { status: 500 }
        )
      }

      // Create new user with Supabase ID and customer role
      user = await prisma.user.create({
        data: {
          id: supabaseUserId, // Use Supabase user ID
          phone: normalizedPhone,
          name: null,
          lastname: null,
          roleId: customerRole.id,
        },
      })
      isNewUser = true
    }

    // Get IP address from request
    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      undefined

    // Create session with JWT tokens
    const { accessToken, refreshToken } = await createSession(
      user.id,
      normalizedPhone,
      deviceInfo,
      ipAddress
    )

    // Check if user has complete profile (name and lastname)
    const hasCompleteProfile = !!(user.name && user.lastname)

    // Create response and set cookies
    const response = NextResponse.json({
      success: true,
      isNewUser,
      hasCompleteProfile,
    })

    setAuthCookies(response, accessToken, refreshToken)

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: error.issues }, { status: 400 })
    }

    console.error('Error in verify-otp:', error)
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 })
  }
}
