"use client"

import { useState } from "react"
import Link from "next/link"
import { Church, Users, Trophy, MapPin, Search, User as UserIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockChurches, mockUsers } from "@/lib/mock-data"
import { DENOMINATION_LABELS, ROLE_LABELS, type UserRole } from "@/lib/types"
import { ProtectedRoute } from "@/components/auth/protected-route"

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  banned: "bg-destructive/10 text-destructive",
  suspended: "bg-amber-100 text-amber-700",
  penalized: "bg-orange-100 text-orange-700",
}

const statusLabels: Record<string, string> = {
  active: "Ativo",
  banned: "Banido",
  suspended: "Suspenso",
  penalized: "Penalizado",
}

const roleColors: Record<UserRole, string> = {
  admin: "bg-primary/10 text-primary",
  supervisor: "bg-secondary/10 text-secondary",
  user: "bg-muted text-muted-foreground",
}

export default function ChurchesPage() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const filteredChurches = mockChurches.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const filteredUsers = mockUsers.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false
    if (search && !u.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <ProtectedRoute>
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold flex items-center gap-2">
          <Church className="h-8 w-8 text-secondary" /> Igrejas e Usuarios
        </h1>
        <p className="mt-1 text-muted-foreground">Gerencie igrejas e veja todos os usuarios da plataforma</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <Tabs defaultValue="churches">
        <TabsList className="mb-6">
          <TabsTrigger value="churches" className="gap-1"><Church className="h-4 w-4" /> Igrejas ({filteredChurches.length})</TabsTrigger>
          <TabsTrigger value="users" className="gap-1"><UserIcon className="h-4 w-4" /> Usuarios ({filteredUsers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="churches">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredChurches.map((church) => (
              <Link key={church.id} href={`/igrejas/${church.id}`}>
                <Card className="group h-full border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-secondary">
                        <Church className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold leading-tight text-balance">{church.name}</h3>
                        <p className="text-xs text-muted-foreground">{DENOMINATION_LABELS[church.denomination]}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-3 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {church.city}, {church.state}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-3.5 w-3.5" /> {church.total_members}</span>
                      <span className="flex items-center gap-1 text-muted-foreground"><Trophy className="h-3.5 w-3.5" /> {church.tournaments_participated}</span>
                      <span className="ml-auto font-bold text-secondary">{church.total_points.toLocaleString()} pts</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="mb-4">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Filtrar por Papel" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Papeis</SelectItem>
                {(Object.entries(ROLE_LABELS) as [UserRole, string][]).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-semibold">Nome</th>
                    <th className="px-4 py-3 text-left font-semibold">Email</th>
                    <th className="px-4 py-3 text-center font-semibold">Papel</th>
                    <th className="px-4 py-3 text-center font-semibold">Status</th>
                    <th className="px-4 py-3 text-right font-semibold">XP</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{user.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={roleColors[user.role]}>{ROLE_LABELS[user.role]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={statusColors[user.status]}>{statusLabels[user.status]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-primary">{user.xp.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
      </ProtectedRoute>
  )
}
