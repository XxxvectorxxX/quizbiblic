"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Trophy, Zap, Home, LogIn, UserCircle, Shield } from "lucide-react"

import { useAuth } from "@/lib/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar as SidebarRoot,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
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
  const router = useRouter()
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
      <SidebarRoot collapsible="icon" variant="sidebar">
        <SidebarHeader className="gap-2">
          <div className="px-2 pt-2">
            <div className="flex items-center justify-between">
              <div className="font-extrabold">BibleQuiz</div>
              {isLoggedIn && profile?.role === "admin" ? (
                <Badge variant="secondary" className="text-xs">
                  Admin
                </Badge>
              ) : null}
            </div>

            {isLoggedIn && profile ? (
              <p className="text-xs text-muted-foreground truncate">
                {profile.name} • {profile.email}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Entre para liberar recursos</p>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {items.filter(canSee).map((item) => {
              const locked = isLocked(item)
              const active = pathname === item.href || pathname?.startsWith(item.href + "/")
              const Icon = item.icon

              if (locked) {
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      type="button"
                      isActive={false}
                      tooltip={`${item.label} (faça login)`}
                      onClick={() => setLoginOpen(true)}
                      className="opacity-80"
                    >
                      <Icon />
                      <span>{item.label}</span>
                      <span className="ml-auto text-xs text-muted-foreground">🔒</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              }

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                    <Link href={item.href}>
                      <Icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="gap-2">
          {!isLoggedIn ? (
            <div className="p-2">
              <Button className="w-full gap-2" onClick={() => setLoginOpen(true)} type="button">
                <LogIn className="h-4 w-4" />
                Entrar
              </Button>
            </div>
          ) : (
            <div className="p-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between" type="button">
                    <span className="flex items-center gap-2 min-w-0">
                      <UserCircle className="h-4 w-4" />
                      <span className="truncate">{profile?.name ?? "Conta"}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">{isAdmin ? "admin" : "user"}</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel className="truncate">{profile?.email ?? "Usuário"}</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => alert("Crie /conta depois se quiser.")}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    Meu perfil
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={async () => {
                      await logout()
                      router.refresh()
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </SidebarFooter>
      </SidebarRoot>

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToSignup={() => alert("Abra o modal de cadastro aqui.")}
        redirectTo={pathname || "/"}
      />
    </>
  )
}
