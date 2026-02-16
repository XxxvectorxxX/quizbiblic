"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Trophy,
  Zap,
  Home,
  LogIn,
  UserCircle,
  Shield,
} from "lucide-react"

import { useAuth } from "@/lib/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoginDialog } from "@/components/auth/login-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type MenuItem = {
  href: string
  label: string
  icon: React.ElementType
  requiresAuth?: boolean
  adminOnly?: boolean
}

export function Sidebar() {
  const pathname = usePathname()
  const { isLoggedIn, isAdmin, profile, logout } = useAuth()
  const [loginOpen, setLoginOpen] = React.useState(false)

  const items: MenuItem[] = [
    { href: "/", label: "Início", icon: Home },
    { href: "/quiz", label: "Quiz", icon: Zap, requiresAuth: true },
    { href: "/torneios", label: "Torneios", icon: Trophy, requiresAuth: true },
    { href: "/admin", label: "Admin", icon: Shield, requiresAuth: true, adminOnly: true },
  ]

  function canSee(item: MenuItem) {
    if (item.adminOnly) return isLoggedIn && isAdmin
    return true
  }

  function isLocked(item: MenuItem) {
    if (!item.requiresAuth) return false
    return !isLoggedIn
  }

  return (
    <>
      <aside className="w-64 border-r bg-background h-screen flex flex-col">
        {/* HEADER */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">BibleQuiz</h2>
            {isAdmin && (
              <Badge variant="secondary" className="text-xs">
                Admin
              </Badge>
            )}
          </div>

          {isLoggedIn && profile ? (
            <p className="text-xs text-muted-foreground truncate">
              {profile.name}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Entre para liberar recursos
            </p>
          )}
        </div>

        {/* MENU */}
        <nav className="flex-1 p-2 space-y-1">
          {items.filter(canSee).map((item) => {
            const locked = isLocked(item)
            const active =
              pathname === item.href ||
              pathname?.startsWith(item.href + "/")

            const Icon = item.icon

            if (locked) {
              return (
                <button
                  key={item.href}
                  onClick={() => setLoginOpen(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md opacity-70 hover:bg-muted"
                >
                  <Icon size={16} />
                  {item.label}
                  <span className="ml-auto text-xs">🔒</span>
                </button>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* FOOTER */}
        <div className="p-3 border-t">
          {!isLoggedIn ? (
            <Button
              className="w-full gap-2"
              onClick={() => setLoginOpen(true)}
            >
              <LogIn size={16} />
              Entrar
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <UserCircle size={16} />
                    <span className="truncate">
                      {profile?.name ?? "Conta"}
                    </span>
                  </span>
                  <span className="text-xs">
                    {isAdmin ? "admin" : "user"}
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {profile?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Meu perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive"
                >
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </aside>

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToSignup={() => alert("Implemente cadastro aqui")}
      />
    </>
  )
}
