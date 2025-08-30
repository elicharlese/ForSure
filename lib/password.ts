import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto'
import type { ScryptOptions } from 'crypto'

function scryptAsync(
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    _scrypt(password, salt, keylen, options, (err, derivedKey) => {
      if (err) return reject(err)
      resolve(derivedKey as Buffer)
    })
  })
}

export type PasswordHashOptions = {
  saltBytes?: number
  keyLength?: number
  N?: number
  r?: number
  p?: number
}

const DEFAULTS: Required<PasswordHashOptions> = {
  saltBytes: 16,
  keyLength: 64,
  N: 16384, // cost
  r: 8,
  p: 1,
}

export async function hashPassword(
  password: string,
  opts: PasswordHashOptions = {}
) {
  const { saltBytes, keyLength, N, r, p } = { ...DEFAULTS, ...opts }
  const salt = randomBytes(saltBytes)
  const derivedKey = await scryptAsync(password, salt, keyLength, { N, r, p })
  // store params for future-proof verification
  const record = `scrypt:${N}:${r}:${p}:${salt.toString('hex')}:${derivedKey.toString('hex')}`
  return record
}

export async function verifyPassword(password: string, record: string) {
  try {
    const [algo, nStr, rStr, pStr, saltHex, keyHex] = record.split(':')
    if (algo !== 'scrypt') return false
    const N = Number(nStr)
    const r = Number(rStr)
    const p = Number(pStr)
    const salt = Buffer.from(saltHex, 'hex')
    const key = Buffer.from(keyHex, 'hex')
    const derived = await scryptAsync(password, salt, key.length, { N, r, p })
    return timingSafeEqual(derived, key)
  } catch {
    return false
  }
}
