"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { BookOpen, Trophy, Church, HelpCircle, LayoutDashboard, Menu, X, LogOut, User as UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LoginDialog } from "@/components/auth/login-dialog"
import { SignupDialog } from "@/components/auth/signup-dialog"

const publicLinks = [
  { href: "/", label: "Inicio", icon: BookOpen },
  { href: "/igrejas", label: "Igrejas", icon: Church },
]

const authLinks = [
  { href: "/quiz", label: "Quiz", icon: HelpCircle },
  { href: "/torneios", label: "Torneios", icon: Trophy },
  { href: "/perguntas", label: "Perguntas", icon: BookOpen },
]

const adminLink = { href: "/admin", label: "Admin", icon: LayoutDashboard }

export function Header() {
  const pathname = usePathname()
  const { profile, isLoggedIn, isAdmin, logout, loading } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    ...publicLinks,
    ...(isLoggedIn ? authLinks : []),
    ...(isAdmin ? [adminLink] : []),
  ]

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">
            Bible<span className="text-primary">Quiz</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {!loading && isLoggedIn && profile ? (
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full gradient-primary">
                  <UserIcon className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold leading-none">{profile.name?.split(" ")[0] || "User"}</span>
                  <span className="text-[10px] text-muted-foreground leading-none">{profile.role === "admin" ? "Administrador" : "Usuario"}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : !loading ? (
            <div className="hidden gap-2 md:flex">
              <Button variant="ghost" size="sm" onClick={() => setLoginOpen(true)}>
                Entrar
              </Button>
              <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => setSignupOpen(true)}>
                Cadastrar
              </Button>
            </div>
          ) : null}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="flex flex-col gap-1 p-4 pt-12">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  )
                })}
                <div className="my-4 h-px bg-border" />
                {isLoggedIn ? (
                  <Button variant="ghost" onClick={async () => { await handleLogout(); setMobileOpen(false) }} className="justify-start text-muted-foreground">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" onClick={() => { setLoginOpen(true); setMobileOpen(false) }}>
                      Entrar
                    </Button>
                    <Button className="gradient-primary text-primary-foreground" onClick={() => { setSignupOpen(true); setMobileOpen(false) }}>
                      Cadastrar
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} onSwitchToSignup={() => { setLoginOpen(false); setSignupOpen(true) }} />
      <SignupDialog open={signupOpen} onOpenChange={setSignupOpen} onSwitchToLogin={() => { setSignupOpen(false); setLoginOpen(true) }} />
    </header>
  )
}
