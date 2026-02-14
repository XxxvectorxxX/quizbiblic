"use client"

import { use } from "react"
import Link from "next/link"
import { Church, Users, Trophy, MapPin, ArrowLeft, Crown, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockChurches, mockUsers } from "@/lib/mock-data"
import { DENOMINATION_LABELS, ROLE_LABELS, AGE_GROUP_LABELS, type UserRole } from "@/lib/types"

const roleColors: Record<UserRole, string> = {
  admin: "bg-primary/10 text-primary",
  supervisor: "bg-secondary/10 text-secondary",
  user: "bg-muted text-muted-foreground",
}

export default function ChurchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const church = mockChurches.find((c) => c.id === id)
  const members = mockUsers.filter((u) => u.church_id === id).sort((a, b) => b.xp - a.xp)

  if (!church) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <Church className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-lg font-semibold text-muted-foreground">Igreja nao encontrada</p>
        <Link href="/igrejas"><Button variant="outline">Voltar</Button></Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/igrejas" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar para Igrejas
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl gradient-secondary">
          <Church className="h-8 w-8 text-secondary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold md:text-3xl">{church.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{church.city}, {church.state}</span>
            <Badge variant="outline">{DENOMINATION_LABELS[church.denomination]}</Badge>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Users, label: "Membros", value: church.total_members, color: "text-primary" },
          { icon: Star, label: "Pontos Totais", value: church.total_points.toLocaleString(), color: "text-secondary" },
          { icon: Trophy, label: "Torneios", value: church.tournaments_participated, color: "text-accent" },
          { icon: Crown, label: "Fundada em", value: new Date(church.created_at).toLocaleDateString("pt-BR", { year: "numeric", month: "short" }), color: "text-pink-500" },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <span className="text-lg font-bold">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Members */}
      <h2 className="mb-4 text-xl font-bold">Membros ({members.length})</h2>
      {members.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">Nenhum membro vinculado a esta igreja.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {members.map((member, i) => (
            <Card key={member.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-amber-400 text-amber-950" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-orange-400 text-orange-950" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{AGE_GROUP_LABELS[member.age_group]}</p>
                </div>
                <Badge className={roleColors[member.role]}>{ROLE_LABELS[member.role]}</Badge>
                <span className="text-sm font-bold text-primary">{member.xp.toLocaleString()} XP</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
