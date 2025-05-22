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
        const storedUser = localStorage.getItem("forsure_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
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
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock authentication - in a real app, validate credentials against backend
      if (email === "demo@forsure.dev" && password === "password") {
        const mockUser: User = {
          id: "user-1",
          email,
          name: "Demo User",
          role: "user",
          createdAt: new Date().toISOString(),
        }

        setUser(mockUser)
        localStorage.setItem("forsure_user", JSON.stringify(mockUser))
        return { success: true }
      }

      return {
        success: false,
        message: "Invalid email or password",
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
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock registration - in a real app, send data to backend
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        role: "user",
        createdAt: new Date().toISOString(),
      }

      setUser(mockUser)
      localStorage.setItem("forsure_user", JSON.stringify(mockUser))
      return { success: true }
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

  const logout = () => {
    setUser(null)
    localStorage.removeItem("forsure_user")
    router.push("/")
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
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("forsure_user", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Profile update failed:", error)
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
