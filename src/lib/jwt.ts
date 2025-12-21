import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be defined in environment variables')
}

// Convert secrets to Uint8Array for jose
const getSecretKey = (secret: string) => new TextEncoder().encode(secret)

export interface AccessTokenPayload {
  userId: string
  phone: string
  [key: string]: unknown
}

export interface RefreshTokenPayload {
  userId: string
  [key: string]: unknown
}

export async function generateAccessToken(userId: string, phone: string): Promise<string> {
  const payload: AccessTokenPayload = { userId, phone }

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m') // 30 minutes
    .sign(getSecretKey(JWT_SECRET))

  return token
}

export async function generateRefreshToken(userId: string): Promise<string> {
  const payload: RefreshTokenPayload = { userId }

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15d') // 15 days
    .sign(getSecretKey(JWT_REFRESH_SECRET))

  return token
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(JWT_SECRET), {
      algorithms: ['HS256'],
    })
    return payload as AccessTokenPayload
  } catch (error) {
    console.error('Error verifying access token:', error)
    return null
  }
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(JWT_REFRESH_SECRET), {
      algorithms: ['HS256'],
    })
    return payload as RefreshTokenPayload
  } catch (error) {
    // Only log in development, and only the message (not full stack trace)
    if (process.env.NODE_ENV === 'development') {
      console.log('Refresh token verification failed (expected if cookie is old/invalid)')
    }
    return null
  }
}
