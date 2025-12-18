import { User } from '@prisma/client'
import { prisma } from './prisma'
import crypto from 'crypto'

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function validateSession(token: string): Promise<User | null> {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  })

  if (!session || session.expiresAt < new Date()) {
    return null
  }

  return session.user
}

export async function getSessionFromRequest(request: Request): Promise<User | null> {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  return validateSession(token)
}

export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}
