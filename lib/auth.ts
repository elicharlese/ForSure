import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { connectDB } from './db'
import User from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthenticatedUser {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

export async function authenticateUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    await connectDB()
    
    const token = request.cookies.get('token')?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    
    const user = await User.findById(decoded.userId)
    if (!user) {
      return null
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

export function generateToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
  } catch (error) {
    return null
  }
}