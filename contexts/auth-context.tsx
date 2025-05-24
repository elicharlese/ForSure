"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export type User = {
  id: string
  email: string
  name: string
  avatar?: string
  role: "user" | "admin"
  createdAt: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isDemoMode: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (email: string, name: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  enterDemoMode: () => void
  exitDemoMode: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.user) {
            setUser(data.user)
          }
        }
      } catch (error) {
        console.error("Failed to restore session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success && data.user) {
        setUser(data.user)
        return { success: true }
      }

      return {
        success: false,
        message: data.message || "Login failed",
      }
    } catch (error) {
      console.error("Login failed:", error)
      return {
        success: false,
        message: "An error occurred during login",
      }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, name: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, name, password }),
      })

      const data = await response.json()

      if (data.success && data.user) {
        setUser(data.user)
        return { success: true }
      }

      return {
        success: false,
        message: data.message || "Registration failed",
      }
    } catch (error) {
      console.error("Registration failed:", error)
      return {
        success: false,
        message: "An error occurred during registration",
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      router.push("/")
    }
  }

  const enterDemoMode = () => {
    setIsDemoMode(true)
    router.push("/app")
  }

  const exitDemoMode = () => {
    setIsDemoMode(false)
    router.push("/")
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success && result.user) {
        setUser(result.user)
      } else {
        throw new Error(result.message || 'Profile update failed')
      }
    } catch (error) {
      console.error("Profile update failed:", error)
      throw error
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
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
