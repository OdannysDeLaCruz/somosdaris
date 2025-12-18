import { NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = await getSessionFromRequest(request)

    if (!user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error in /api/auth/me:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
