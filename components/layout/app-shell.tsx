"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Loader2, LogIn, Trophy, Home } from "lucide-react"

import { useAuth } from "@/lib/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

// ✅ seu arquivo layout/sidebar.tsx exporta "Sidebar", não "AppSidebar"
import { Sidebar as AppSidebar } from "@/components/layout/sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth()
  const pathname = usePathname()

  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // DESLOGADO: menu superior simples
  if (!isLoggedIn) {
    return (
      <div className="min-h-svh flex flex-col">
        <header className="border-b bg-background">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <div className="font-extrabold">BibleQuiz</div>

            <nav className="flex items-center gap-2">
              <Button asChild variant="ghost" className="gap-2">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Início
                </Link>
              </Button>

              <Button asChild variant="ghost" className="gap-2">
                <Link href="/torneios">
                  <Trophy className="h-4 w-4" />
                  Assistir Torneios
                </Link>
              </Button>

              <Button asChild className="gap-2">
                <Link href={pathname || "/"}>
                  <LogIn className="h-4 w-4" />
                  Entrar
                </Link>
              </Button>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    )
  }

  // LOGADO: só sidebar (sem header)
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-svh w-full">
        <AppSidebar />

        <SidebarInset>
          <main className="flex-1">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
