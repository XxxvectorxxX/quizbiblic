"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Trophy, Users, Calendar, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { createClient } from "@/lib/supabase/client"
import { TOURNAMENT_STATUS_LABELS, AGE_GROUP_LABELS, type TournamentStatus, type AgeGroup } from "@/lib/types"

type TournamentDB = {
  id: string
  name: string
  description: string | null
  start_date: string
  end_date: string
  status: TournamentStatus
  max_participants: number
  current_participants: number
  age_group: AgeGroup
  created_by: string
  created_at: string
}

export default function TournamentDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id

  const [tournament, setTournament] = useState<TournamentDB | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!id) return
      setLoading(true)
      setError(null)

      const supabase = createClient()

      const { data, error } = await supabase
        .from("tournaments")
        .select(
          "id,name,description,start_date,end_date,status,max_participants,current_participants,age_group,created_by,created_at"
        )
        .eq("id", id)
        .single()

      if (error) {
        setTournament(null)
        setError(error.message)
      } else {
        setTournament(data as TournamentDB)
      }

      setLoading(false)
    }

    load()
  }, [id])

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="py-20 text-center text-muted-foreground">Carregando torneio...</div>
      </ProtectedRoute>
    )
  }

  if (error || !tournament) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col items-center gap-4 py-20">
          <Trophy className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-semibold text-muted-foreground">Torneio não encontrado</p>
          {error ? <p className="text-xs text-muted-foreground">{error}</p> : null}
          <Link href="/torneios">
            <Button variant="outline">Voltar</Button>
          </Link>
        </div>
      </ProtectedRoute>
    )
  }

  const badgeClass =
    tournament.status === "in_progress"
      ? "bg-amber-100 text-amber-700"
      : tournament.status === "upcoming"
        ? "bg-secondary/10 text-secondary"
        : "bg-muted text-muted-foreground"

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Link
          href="/torneios"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para Torneios
        </Link>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-extrabold md:text-3xl">{tournament.name}</h1>
              <Badge className={badgeClass}>{TOURNAMENT_STATUS_LABELS[tournament.status]}</Badge>
            </div>
            <p className="text-muted-foreground">{tournament.description ?? ""}</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-bold">
                {tournament.current_participants}/{tournament.max_participants}
              </span>
              <span className="text-xs text-muted-foreground">Participantes</span>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
              <Calendar className="h-5 w-5 text-secondary" />
              <span className="text-sm font-bold">
                {new Date(tournament.start_date).toLocaleDateString("pt-BR")}
              </span>
              <span className="text-xs text-muted-foreground">Início</span>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
              <Calendar className="h-5 w-5 text-secondary" />
              <span className="text-sm font-bold">
                {new Date(tournament.end_date).toLocaleDateString("pt-BR")}
              </span>
              <span className="text-xs text-muted-foreground">Fim</span>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
              <Trophy className="h-5 w-5 text-accent" />
              <span className="text-sm font-bold">{AGE_GROUP_LABELS[tournament.age_group]}</span>
              <span className="text-xs text-muted-foreground">Faixa etária</span>
            </CardContent>
          </Card>
        </div>

        {/* Tabs (por enquanto sem dados de teams/matches) */}
        <Tabs defaultValue="teams">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="teams" className="gap-1">
              <Users className="h-4 w-4" /> Equipes
            </TabsTrigger>
            <TabsTrigger value="matches" className="gap-1">
              <Trophy className="h-4 w-4" /> Partidas
            </TabsTrigger>
            <TabsTrigger value="ranking" className="gap-1">
              <Trophy className="h-4 w-4" /> Ranking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teams">
            <p className="py-8 text-center text-muted-foreground">
              Ainda não há tabela de equipes no banco. (Estamos lendo só “tournaments”.)
            </p>
          </TabsContent>

          <TabsContent value="matches">
            <p className="py-8 text-center text-muted-foreground">
              Ainda não há tabela de partidas no banco. (Estamos lendo só “tournaments”.)
            </p>
          </TabsContent>

          <TabsContent value="ranking">
            <p className="py-8 text-center text-muted-foreground">
              Ranking indisponível sem equipes/pontuação no banco.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
