import { NextResponse } from 'next/server'
import { getRefreshTokenFromHeaders, clearAuthCookies } from '@/lib/auth-cookies'
import { refreshAccessToken } from '@/lib/session'
import { setAuthCookies } from '@/lib/auth-cookies'

export async function POST(request: Request) {
  try {
    // Get refresh token from cookies
    const refreshToken = getRefreshTokenFromHeaders(request)

    if (!refreshToken) {
      return NextResponse.json({ error: 'No hay sesión activa' }, { status: 401 })
    }

    // Refresh access token
    const tokens = await refreshAccessToken(refreshToken)

    if (!tokens) {
      // Clear invalid cookies
      const response = NextResponse.json(
        { error: 'Sesión inválida o expirada' },
        { status: 401 }
      )
      clearAuthCookies(response)
      return response
    }

    // Create response and set new cookies
    const response = NextResponse.json({ success: true })
    setAuthCookies(response, tokens.accessToken, tokens.refreshToken)

    return response
  } catch (error) {
    console.error('Error in refresh:', error)
    return NextResponse.json({ error: 'Error al refrescar la sesión' }, { status: 500 })
  }
}
