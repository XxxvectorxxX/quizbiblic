"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogIn } from "lucide-react"

import { useAuth } from "@/lib/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LoginDialog } from "@/components/auth/login-dialog"
import { Sidebar } from "@/components/ui/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

function PublicTopbar({ onOpenLogin }: { onOpenLogin: () => void }) {
  return (
    <header className="h-14 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="font-extrabold">BibleQuiz</div>

        <nav className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost">Início</Button>
          </Link>

          <Link href="/torneios">
            <Button variant="ghost">Torneios</Button>
          </Link>

          <Button onClick={onOpenLogin} className="gap-2">
            <LogIn className="h-4 w-4" />
            Entrar
          </Button>
        </nav>
      </div>
    </header>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isLoggedIn, loading } = useAuth()
  const [loginOpen, setLoginOpen] = React.useState(false)

  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center">
        <div>Carregando…</div>
      </div>
    )
  }

  // 🔹 DESLOGADO
  if (!isLoggedIn) {
    return (
      <>
        <PublicTopbar onOpenLogin={() => setLoginOpen(true)} />
        <main className="min-h-[calc(100svh-56px)]">{children}</main>
        <Footer />

        <LoginDialog
          open={loginOpen}
          onOpenChange={setLoginOpen}
          onSwitchToSignup={() => alert("Abra o modal de cadastro aqui.")}
          redirectTo={pathname || "/"}
        />
      </>
    )
  }

  // 🔹 LOGADO
  return (
    <div className="flex min-h-svh w-full">
      <Sidebar />

      <div className="flex min-h-svh flex-1 flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
