'use client'

import type React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export type User = {
  id: string
  email: string
  name: string
  avatar_url?: string
  role: 'user' | 'admin'
  created_at: string
  bio?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isDemoMode: boolean
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>
  register: (
    email: string,
    name: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  enterDemoMode: () => void
  exitDemoMode: () => void
  updateProfile: (
    data: Partial<User>
  ) => Promise<{ success: boolean; message?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('fs_access_token')
        : null
    const restore = async () => {
      if (!token) {
        setIsLoading(false)
        return
      }
      try {
        const response = await fetch('/api/v1/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const { data } = await response.json()
          setUser(data)
        } else {
          localStorage.removeItem('fs_access_token')
          setUser(null)
        }
      } catch (e) {
        console.error('Failed to restore session:', e)
        localStorage.removeItem('fs_access_token')
      } finally {
        setIsLoading(false)
      }
    }
    restore()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (response.ok) {
        const token = result.data?.session?.access_token
        if (token) localStorage.setItem('fs_access_token', token)
        setUser(result.data.user)
        return { success: true }
      } else {
        return {
          success: false,
          message: result.error || 'Login failed',
        }
      }
    } catch (error) {
      console.error('Login failed:', error)
      return {
        success: false,
        message: 'Network error occurred',
      }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, name: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      })

      const result = await response.json()

      if (response.ok) {
        return {
          success: true,
          message: result.message,
        }
      } else {
        return {
          success: false,
          message: result.error || 'Registration failed',
        }
      }
    } catch (error) {
      console.error('Registration failed:', error)
      return {
        success: false,
        message: 'Network error occurred',
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      localStorage.removeItem('fs_access_token')
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const enterDemoMode = () => {
    setIsDemoMode(true)
    router.push('/app')
  }

  const exitDemoMode = () => {
    setIsDemoMode(false)
    router.push('/')
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return { success: false, message: 'Not authenticated' }

    setIsLoading(true)
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('fs_access_token')
          : null
      if (!token) return { success: false, message: 'Not authenticated' }

      const response = await fetch('/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setUser(result.data)
        return { success: true }
      } else {
        return {
          success: false,
          message: result.error || 'Update failed',
        }
      }
    } catch (error) {
      console.error('Profile update failed:', error)
      return {
        success: false,
        message: 'Network error occurred',
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isDemoMode,
        login,
        register,
        logout,
        enterDemoMode,
        exitDemoMode,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
