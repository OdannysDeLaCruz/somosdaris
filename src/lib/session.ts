import { prisma } from './prisma'
import { Session, User } from '@prisma/client'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from './jwt'

export async function createSession(
  userId: string,
  phone: string,
  deviceInfo?: string,
  ipAddress?: string
): Promise<{ accessToken: string; refreshToken: string; session: Session }> {
  // Generate tokens (now async)
  const accessToken = await generateAccessToken(userId, phone)
  const refreshToken = await generateRefreshToken(userId)

  // Calculate expiration dates
  const now = new Date()
  const accessExpiresAt = new Date(now.getTime() + 30 * 60 * 1000) // 30 minutes
  const refreshExpiresAt = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000) // 15 days

  // Create session in database
  const session = await prisma.session.create({
    data: {
      userId,
      accessToken,
      refreshToken,
      expiresAt: accessExpiresAt,
      refreshExpiresAt,
      deviceInfo,
      ipAddress,
    },
  })

  return { accessToken, refreshToken, session }
}

export async function getSessionByAccessToken(
  accessToken: string
): Promise<(Session & { user: User }) | null> {
  const session = await prisma.session.findUnique({
    where: { accessToken },
    include: { user: true },
  })

  if (!session || session.revoked || session.expiresAt < new Date()) {
    return null
  }

  return session
}

export async function getSessionByRefreshToken(
  refreshToken: string
): Promise<(Session & { user: User }) | null> {
  const session = await prisma.session.findUnique({
    where: { refreshToken },
    include: { user: true },
  })

  if (!session || session.revoked || session.refreshExpiresAt < new Date()) {
    return null
  }

  return session
}

export async function refreshAccessToken(
  oldRefreshToken: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
  // Verify refresh token (now async)
  const payload = await verifyRefreshToken(oldRefreshToken)
  if (!payload) {
    return null
  }

  // Get session
  const session = await getSessionByRefreshToken(oldRefreshToken)
  if (!session) {
    return null
  }

  // Generate new access token (keep same refresh token) (now async)
  const newAccessToken = await generateAccessToken(session.userId, session.user.phone)
  const accessExpiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

  // Update session with new access token
  await prisma.session.update({
    where: { id: session.id },
    data: {
      accessToken: newAccessToken,
      expiresAt: accessExpiresAt,
      lastUsedAt: new Date(),
    },
  })

  return {
    accessToken: newAccessToken,
    refreshToken: oldRefreshToken, // Keep same refresh token
  }
}

export async function revokeSession(accessToken: string): Promise<boolean> {
  try {
    await prisma.session.update({
      where: { accessToken },
      data: { revoked: true },
    })
    return true
  } catch (error) {
    console.error('Error revoking session:', error)
    return false
  }
}

export async function revokeAllUserSessions(userId: string): Promise<number> {
  const result = await prisma.session.updateMany({
    where: { userId, revoked: false },
    data: { revoked: true },
  })

  return result.count
}

export async function getUserFromAccessToken(accessToken: string): Promise<User | null> {
  // Verify token (now async)
  const payload = await verifyAccessToken(accessToken)
  if (!payload) {
    return null
  }

  // Get session
  const session = await getSessionByAccessToken(accessToken)
  if (!session) {
    return null
  }

  // Update last used timestamp
  await prisma.session.update({
    where: { id: session.id },
    data: { lastUsedAt: new Date() },
  })

  return session.user
}
