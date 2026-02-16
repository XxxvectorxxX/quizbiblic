"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/lib/contexts/auth-context"

export function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
