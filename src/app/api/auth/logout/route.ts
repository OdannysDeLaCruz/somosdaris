import { NextResponse } from 'next/server'
import { getAccessTokenFromHeaders, clearAuthCookies } from '@/lib/auth-cookies'
import { revokeSession } from '@/lib/session'

export async function POST(request: Request) {
  try {
    // Get access token from cookies
    const accessToken = getAccessTokenFromHeaders(request)

    if (accessToken) {
      // Revoke session in database
      await revokeSession(accessToken)
    }

    // Create response and clear cookies
    const response = NextResponse.json({ success: true })
    clearAuthCookies(response)

    return response
  } catch (error) {
    console.error('Error in logout:', error)
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 })
  }
}
