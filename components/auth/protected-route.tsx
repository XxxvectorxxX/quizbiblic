"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth-context"
import { type ReactNode } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: ReactNode
  adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const router = useRouter()
  const { isLoggedIn, isAdmin, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.replace("/") // 🔁 redireciona se não logado
      }

      if (adminOnly && !isAdmin) {
        router.replace("/") // 🔁 redireciona se não for admin
      }
    }
  }, [loading, isLoggedIn, isAdmin, adminOnly, router])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isLoggedIn) return null
  if (adminOnly && !isAdmin) return null

  return <>{children}</>
}
