import { NextResponse } from 'next/server'
import { sendOTP } from '@/lib/supabase/auth'
import { normalizePhone, validatePhone } from '@/lib/phone'
import { z } from 'zod'

const sendOtpSchema = z.object({
  phone: z.string().min(1, 'El teléfono es requerido'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone } = sendOtpSchema.parse(body)

    // Validate phone format (10 digits for Colombian phones)
    if (!validatePhone(phone)) {
      return NextResponse.json(
        { error: 'Formato de teléfono inválido. Debe ser un número colombiano de 10 dígitos.' },
        { status: 400 }
      )
    }

    // Normalize to E.164 format (+57XXXXXXXXXX)
    const normalizedPhone = normalizePhone(phone)

    // Send OTP via Supabase Auth (SMS)
    const result = await sendOTP(normalizedPhone)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Error al enviar el código' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: error.issues }, { status: 400 })
    }

    console.error('Error in send-otp:', error)
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 })
  }
}
