"use client"

import { useAuth } from "@/lib/contexts/auth-context"
import { type ReactNode } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: ReactNode
  adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isLoggedIn, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  if (adminOnly && !isAdmin) {
    return null
  }

  return <>{children}</>
}
