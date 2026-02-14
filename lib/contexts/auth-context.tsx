"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export interface Profile {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  church_id: string | null
  xp: number
  created_at: string
}

interface AuthContextType {
  user: SupabaseUser | null
  profile: Profile | null
  isLoggedIn: boolean
  isAdmin: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (data: { name: string; email: string; password: string; church_id?: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
    if (data) {
      setProfile(data as Profile)
    }
  }, [supabase])

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }, [user, fetchProfile])

  useEffect(() => {
    const getSession = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
      if (currentUser) {
        await fetchProfile(currentUser.id)
      }
      setLoading(false)
    }
    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) {
          await fetchProfile(currentUser.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, fetchProfile])

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, error: error.message }
    return { success: true }
  }, [supabase])

  const signup = useCallback(async (data: { name: string; email: string; password: string; church_id?: string }) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/`,
        data: {
          name: data.name,
          role: "user",
          church_id: data.church_id || null,
        },
      },
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  }, [supabase])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }, [supabase])

  const isAdmin = profile?.role === "admin"

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isLoggedIn: !!user,
      isAdmin,
      loading,
      login,
      signup,
      logout,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
