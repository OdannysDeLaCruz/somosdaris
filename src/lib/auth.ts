import { cookies } from 'next/headers'
import { getUserFromAccessToken } from './session'
import { prisma } from './prisma'
import { User, Role } from '@prisma/client'
import { redirect } from 'next/navigation'

export type UserWithRole = User & { role: Role }

export async function getCurrentUser(): Promise<UserWithRole | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  if (!accessToken) {
    return null
  }

  const user = await getUserFromAccessToken(accessToken)
  if (!user) {
    return null
  }

  // Get user with role
  const userWithRole = await prisma.user.findUnique({
    where: { id: user.id },
    include: { role: true },
  })

  return userWithRole
}

export async function requireAuth(): Promise<UserWithRole> {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return user
}

export async function requireAdmin(): Promise<UserWithRole> {
  const user = await requireAuth()

  if (user.role.name !== 'admin') {
    redirect('/')
  }

  return user
}

export function isAdmin(user: UserWithRole | null): boolean {
  return user?.role?.name === 'admin'
}

export function isAlly(user: UserWithRole | null): boolean {
  return user?.role?.name === 'ally'
}

export function isCustomer(user: UserWithRole | null): boolean {
  return user?.role?.name === 'customer'
}
