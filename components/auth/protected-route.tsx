"use client"

import { type ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"

interface ProtectedRouteProps {
  children: ReactNode
  adminOnly?: boolean
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  adminOnly = false,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const router = useRouter()
  const { isLoggedIn, isAdmin, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    // Não logado -> manda pro início (ou onde você quiser)
    if (!isLoggedIn) {
      router.replace(redirectTo)
      return
    }

    // Admin only -> se não for admin, manda pro início
    if (adminOnly && !isAdmin) {
      router.replace(redirectTo)
      return
    }
  }, [loading, isLoggedIn, isAdmin, adminOnly, redirectTo, router])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // enquanto o effect redireciona, não renderiza nada
  if (!isLoggedIn) return null
  if (adminOnly && !isAdmin) return null

  return <>{children}</>
}
