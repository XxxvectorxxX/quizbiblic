"use client"

import { use } from "react"
import Link from "next/link"
import { Trophy, Users, Calendar, Clock, ArrowLeft, Shield, Swords, Medal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockTournaments, mockTeams, mockMatches } from "@/lib/mock-data"
import { TOURNAMENT_STATUS_LABELS, AGE_GROUP_LABELS, DENOMINATION_LABELS } from "@/lib/types"
import { ProtectedRoute } from "@/components/auth/protected-route"

const matchStatusColors: Record<string, string> = {
  scheduled: "bg-muted text-muted-foreground",
  in_progress: "bg-amber-100 text-amber-700",
  finished: "bg-emerald-100 text-emerald-700",
}

export default function TournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const tournament = mockTournaments.find((t) => t.id === id)
  const teams = mockTeams.filter((t) => t.tournament_id === id).sort((a, b) => b.points - a.points)
  const matches = mockMatches.filter((m) => m.tournament_id === id)

  if (!tournament) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <Trophy className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-lg font-semibold text-muted-foreground">Torneio nao encontrado</p>
        <Link href="/torneios"><Button variant="outline">Voltar</Button></Link>
      </div>
    )
  }

  return (
    <ProtectedRoute>
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link href="/torneios" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar para Torneios
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-extrabold md:text-3xl">{tournament.name}</h1>
            <Badge className={tournament.status === "in_progress" ? "bg-amber-100 text-amber-700" : tournament.status === "upcoming" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}>
              {TOURNAMENT_STATUS_LABELS[tournament.status]}
            </Badge>
          </div>
          <p className="text-muted-foreground">{tournament.description}</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Users, label: "Equipes", value: `${teams.length}/${tournament.total_teams}`, color: "text-primary" },
          { icon: Calendar, label: "Inicio", value: new Date(tournament.start_date).toLocaleDateString("pt-BR"), color: "text-secondary" },
          { icon: Clock, label: "Tempo Resposta", value: `${tournament.answer_time}s`, color: "text-accent" },
          { icon: Shield, label: "Tamanho Equipe", value: `${tournament.team_size} jogadores`, color: "text-pink-500" },
        ].map((info) => (
          <Card key={info.label} className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
              <info.icon className={`h-5 w-5 ${info.color}`} />
              <span className="text-sm font-bold">{info.value}</span>
              <span className="text-xs text-muted-foreground">{info.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-xs text-muted-foreground mb-6 flex flex-wrap gap-3">
        <span>Faixa: <strong>{AGE_GROUP_LABELS[tournament.age_group]}</strong></span>
        <span>Denominacao: <strong>{DENOMINATION_LABELS[tournament.denomination]}</strong></span>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="teams">
        <TabsList className="mb-6 w-full justify-start">
          <TabsTrigger value="teams" className="gap-1"><Users className="h-4 w-4" /> Equipes</TabsTrigger>
          <TabsTrigger value="matches" className="gap-1"><Swords className="h-4 w-4" /> Partidas</TabsTrigger>
          <TabsTrigger value="ranking" className="gap-1"><Medal className="h-4 w-4" /> Ranking</TabsTrigger>
        </TabsList>

        <TabsContent value="teams">
          {teams.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">Nenhuma equipe inscrita ainda.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <Card key={team.id} className="border-0 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                        <Shield className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-bold">{team.name}</h4>
                        <p className="text-xs text-muted-foreground">{team.church_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-emerald-600 font-medium">{team.wins}V</span>
                      <span className="text-destructive font-medium">{team.losses}D</span>
                      <span className="ml-auto font-bold text-primary">{team.points} pts</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {team.members.map((m) => (
                        <Badge key={m.id} variant="outline" className="text-xs">
                          {m.name} {m.role === "captain" ? "(C)" : ""}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="matches">
          {matches.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">Nenhuma partida agendada ainda.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {matches.map((match) => (
                <Card key={match.id} className={`border-0 shadow-sm ${match.status === "in_progress" ? "ring-2 ring-amber-400/50" : ""}`}>
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{match.round}</Badge>
                      <Badge className={matchStatusColors[match.status]}>
                        {match.status === "scheduled" ? "Agendada" : match.status === "in_progress" ? "Ao Vivo" : "Finalizada"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 text-right">
                        <p className={`font-bold ${match.winner_id === match.team_a.id ? "text-emerald-600" : ""}`}>{match.team_a.name}</p>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-2">
                        <span className="text-xl font-extrabold">{match.team_a.score}</span>
                        <span className="text-muted-foreground text-sm">x</span>
                        <span className="text-xl font-extrabold">{match.team_b.score}</span>
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold ${match.winner_id === match.team_b.id ? "text-emerald-600" : ""}`}>{match.team_b.name}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-center text-xs text-muted-foreground">
                      {new Date(match.scheduled_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ranking">
          {teams.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">Ranking indisponivel.</p>
          ) : (
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold">#</th>
                      <th className="px-4 py-3 text-left font-semibold">Equipe</th>
                      <th className="px-4 py-3 text-left font-semibold">Igreja</th>
                      <th className="px-4 py-3 text-center font-semibold">V</th>
                      <th className="px-4 py-3 text-center font-semibold">D</th>
                      <th className="px-4 py-3 text-right font-semibold">Pontos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team, i) => (
                      <tr key={team.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-amber-400 text-amber-950" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-orange-400 text-orange-950" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                        </td>
                        <td className="px-4 py-3 font-semibold">{team.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{team.church_name}</td>
                        <td className="px-4 py-3 text-center text-emerald-600 font-medium">{team.wins}</td>
                        <td className="px-4 py-3 text-center text-destructive font-medium">{team.losses}</td>
                        <td className="px-4 py-3 text-right font-bold text-primary">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
    </ProtectedRoute>
  )
}
