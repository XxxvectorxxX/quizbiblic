"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trophy, Users, Star, Calendar, Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { supabase } from "@/lib/supabase/clients"
import { TOURNAMENT_STATUS_LABELS, AGE_GROUP_LABELS, DENOMINATION_LABELS, type TournamentStatus, type AgeGroup, type Denomination } from "@/lib/types"

const statusColors: Record<TournamentStatus, string> = {
  upcoming: "bg-secondary/10 text-secondary border-secondary/20",
  in_progress: "bg-amber-100 text-amber-700 border-amber-200",
  finished: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
}

export default function TournamentsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ageFilter, setAgeFilter] = useState<string>("all")
  const [denomFilter, setDenomFilter] = useState<string>("all")
  const [tournaments, setTournaments] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Buscar torneios do Supabase
  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .order("start_date", { ascending: true })

      if (error) {
        console.error("Erro ao buscar torneios:", error)
      } else {
        setTournaments(data)
      }
      setLoading(false)
    }

    fetchTournaments()
  }, [])

  // Aplicar filtros
  const filtered = tournaments.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false
    if (ageFilter !== "all" && t.age_group !== ageFilter) return false
    if (denomFilter !== "all" && t.denomination !== denomFilter) return false
    return true
  })

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
              <Trophy className="h-8 w-8 text-primary" /> Torneios
            </h1>
            <p className="mt-1 text-muted-foreground">Explore e participe dos torneios bíblicos</p>
          </div>
          <Link href="/torneios/criar">
            <Button className="gradient-primary text-primary-foreground gap-2">
              <Plus className="h-4 w-4" /> Criar Torneio
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="flex flex-wrap items-center gap-3 p-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                {(Object.entries(TOURNAMENT_STATUS_LABELS) as [TournamentStatus, string][]).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Faixa Etaria" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Faixas</SelectItem>
                {(Object.entries(AGE_GROUP_LABELS) as [AgeGroup, string][]).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={denomFilter} onValueChange={setDenomFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Denominação" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {(Object.entries(DENOMINATION_LABELS) as [Denomination, string][]).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Grid */}
        {loading ? (
          <p className="text-center text-muted-foreground">Carregando torneios...</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-semibold text-muted-foreground">Nenhum torneio encontrado</p>
            <p className="text-sm text-muted-foreground">Ajuste os filtros ou crie um novo torneio.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <Link key={t.id} href={`/torneios/${t.id}`}>
                <Card className="group h-full overflow-hidden border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                  <div className="h-1.5 gradient-primary" />
                  <CardContent className="flex flex-col gap-3 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold leading-tight text-balance">{t.name}</h3>
                      <Badge className={statusColors[t.status]}>{TOURNAMENT_STATUS_LABELS[t.status]}</Badge>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{t.description}</p>
                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{t.total_teams} equipes</span>
                      <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" />{AGE_GROUP_LABELS[t.age_group]}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(t.start_date).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
