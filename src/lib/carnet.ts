import { createHmac } from 'crypto'

const CARNET_SECRET = process.env.JWT_SECRET!

interface CVTPayload {
  type: 'cvt'
  reservationId: string
}

interface CVUPayload {
  type: 'cvu'
  allyId: string
}

type CarnetPayload = CVTPayload | CVUPayload

function base64urlEncode(data: string): string {
  return Buffer.from(data, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function base64urlDecode(data: string): string {
  const padded = data.replace(/-/g, '+').replace(/_/g, '/')
  return Buffer.from(padded, 'base64').toString('utf-8')
}

function sign(payload: string): string {
  return createHmac('sha256', CARNET_SECRET)
    .update(payload)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function generateCVTToken(reservationId: string): string {
  const payload = base64urlEncode(JSON.stringify({ type: 'cvt', reservationId }))
  const signature = sign(payload)
  return `${payload}.${signature}`
}

export function generateCVUToken(allyId: string): string {
  const payload = base64urlEncode(JSON.stringify({ type: 'cvu', allyId }))
  const signature = sign(payload)
  return `${payload}.${signature}`
}

export function verifyCarnetToken(token: string): CarnetPayload | null {
  const parts = token.split('.')
  if (parts.length !== 2) return null

  const [payload, signature] = parts
  const expectedSignature = sign(payload)

  if (signature !== expectedSignature) return null

  try {
    const decoded = JSON.parse(base64urlDecode(payload)) as CarnetPayload
    if (decoded.type === 'cvt' && typeof decoded.reservationId === 'string') {
      return decoded
    }
    if (decoded.type === 'cvu' && typeof decoded.allyId === 'string') {
      return decoded
    }
    return null
  } catch {
    return null
  }
}
