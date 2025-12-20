import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAccessTokenFromCookies } from '@/lib/auth-cookies'
import { verifyAccessToken } from '@/lib/jwt'

export async function proxy(request: NextRequest) {
  // Only protect POST requests to /api/reservations
  if (request.nextUrl.pathname === '/api/reservations' && request.method === 'POST') {
    // Get access token from cookies
    const accessToken = getAccessTokenFromCookies(request)

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para crear una reserva' },
        { status: 401 }
      )
    }

    // Verify token (now async)
    const payload = await verifyAccessToken(accessToken)

    if (!payload) {
      return NextResponse.json(
        { error: 'Sesión inválida o expirada. Por favor inicia sesión nuevamente.' },
        { status: 401 }
      )
    }

    // Token is valid, allow request to continue
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/reservations',
}
