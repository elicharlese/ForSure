import jwt, { type Secret, type SignOptions } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export type JwtUserPayload = {
  sub: string // user id
  email: string
  role?: string
}

const JWT_SECRET = process.env.JWT_SECRET as Secret | undefined
if (!JWT_SECRET) {
  // Do not throw at import time in tests; runtime will handle missing secret with clear errors
  // console.warn('JWT_SECRET is not set. Set it in your environment to enable authentication.')
}

export function signAccessToken(
  payload: JwtUserPayload,
  expiresIn: string | number = '1h'
) {
  if (!JWT_SECRET) throw new Error('JWT_SECRET not configured')
  const options: SignOptions = { expiresIn: expiresIn as any }
  return jwt.sign(payload, JWT_SECRET, options)
}

export function verifyAccessToken(token: string): JwtUserPayload {
  if (!JWT_SECRET) throw new Error('JWT_SECRET not configured')
  const decoded = jwt.verify(token, JWT_SECRET)
  // jsonwebtoken returns string | jwt.JwtPayload; normalize
  if (typeof decoded === 'string') throw new Error('Invalid token payload')
  return {
    sub: decoded.sub as string,
    email: decoded.email as string,
    role: decoded.role as string | undefined,
  }
}

export function getBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  return authHeader.substring(7)
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

export async function comparePasswords(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
