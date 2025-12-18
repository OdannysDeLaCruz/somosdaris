import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const logoutSchema = z.object({
  token: z.string().min(1, 'El token es requerido'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token } = logoutSchema.parse(body)

    // Delete session
    await prisma.session.deleteMany({
      where: { token }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error },
        { status: 400 }
      )
    }

    console.error('Error in logout:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
