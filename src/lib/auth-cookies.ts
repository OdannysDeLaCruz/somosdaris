import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ACCESS_TOKEN_NAME = 'access_token'
const REFRESH_TOKEN_NAME = 'refresh_token'

// Cookie options for production
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
): void {
  // Access token expires in 30 minutes
  const accessMaxAge = 30 * 60 // 30 minutes in seconds

  // Refresh token expires in 15 days
  const refreshMaxAge = 15 * 24 * 60 * 60 // 15 days in seconds

  response.cookies.set(ACCESS_TOKEN_NAME, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: accessMaxAge,
  })

  response.cookies.set(REFRESH_TOKEN_NAME, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: refreshMaxAge,
  })
}

export function getAccessTokenFromCookies(request: NextRequest): string | undefined {
  return request.cookies.get(ACCESS_TOKEN_NAME)?.value
}

export function getRefreshTokenFromCookies(request: NextRequest): string | undefined {
  return request.cookies.get(REFRESH_TOKEN_NAME)?.value
}

export function clearAuthCookies(response: NextResponse): void {
  response.cookies.set(ACCESS_TOKEN_NAME, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  })

  response.cookies.set(REFRESH_TOKEN_NAME, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  })
}

// Helper to get cookies from Request headers (for API routes)
export function getAccessTokenFromHeaders(request: Request): string | undefined {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return undefined

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)

  return cookies[ACCESS_TOKEN_NAME]
}

export function getRefreshTokenFromHeaders(request: Request): string | undefined {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return undefined

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)

  return cookies[REFRESH_TOKEN_NAME]
}
