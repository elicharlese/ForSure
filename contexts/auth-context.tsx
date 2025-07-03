"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export type User = {
  id: string
  email: string
  name: string
  avatar_url?: string
  role: "user" | "admin"
  created_at: string
  bio?: string
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
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session on mount
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Fetch user profile
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          })
          
          if (response.ok) {
            const { data } = await response.json()
            setUser(data)
          }
        }
      } catch (error) {
        console.error('Failed to restore session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          })
          
          if (response.ok) {
            const { data } = await response.json()
            setUser(data)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (response.ok) {
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
      const response = await fetch('/api/auth/register', {
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
          message: result.message 
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
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        })
      }
      
      await supabase.auth.signOut()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error('Logout error:', error)
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
    if (!user) return { success: false, message: 'Not authenticated' }

    setIsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        return { success: false, message: 'Not authenticated' }
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
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
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
