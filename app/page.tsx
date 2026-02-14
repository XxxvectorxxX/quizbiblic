"use client"

import Link from "next/link"
import { Trophy, Users, BookOpen, Zap, Target, ArrowRight, Crown, Church, Star, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockTournaments, mockMatches, mockUsers, mockChurches } from "@/lib/mock-data"
import { TOURNAMENT_STATUS_LABELS, AGE_GROUP_LABELS } from "@/lib/types"

const topUsers = [...mockUsers].sort((a, b) => b.xp - a.xp).slice(0, 5)
const topChurches = [...mockChurches].sort((a, b) => b.total_points - a.total_points).slice(0, 5)
const featuredTournaments = mockTournaments.filter((t) => t.status === "in_progress" || t.status === "upcoming").slice(0, 3)
const liveMatches = mockMatches.filter((m) => m.status === "in_progress")

const statusColors: Record<string, string> = {
  upcoming: "bg-secondary text-secondary-foreground",
  in_progress: "bg-accent text-accent-foreground",
  finished: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero px-4 py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 text-center">
          <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-sm px-4 py-1">
            Nova Temporada de Torneios
          </Badge>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
            Teste Seu Conhecimento<br />
            <span className="text-amber-300">Biblico</span>
          </h1>
          <p className="max-w-2xl text-pretty text-lg text-white/80 md:text-xl">
            Participe de quizzes individuais, forme equipes, dispute torneios entre igrejas e suba no ranking. A maneira mais divertida de estudar a Biblia!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/quiz">
              <Button size="lg" className="bg-white text-primary font-bold shadow-lg hover:bg-white/90 gap-2 text-base px-6">
                <Zap className="h-5 w-5" />
                Iniciar Quiz
              </Button>
            </Link>
            <Link href="/torneios">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2 text-base px-6 bg-white/5 backdrop-blur-sm">
                <Trophy className="h-5 w-5" />
                Ver Torneios
              </Button>
            </Link>
          </div>
          <div className="mt-4 flex items-center gap-6 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {mockUsers.length}+ jogadores</span>
            <span className="flex items-center gap-1.5"><Church className="h-4 w-4" /> {mockChurches.length} igrejas</span>
            <span className="flex items-center gap-1.5"><Trophy className="h-4 w-4" /> {mockTournaments.length} torneios</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-10 text-center text-3xl font-bold text-balance">Como Funciona</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: Target, title: "Escolha sua Modalidade", desc: "Quiz individual ou forme uma equipe para disputar torneios entre igrejas.", color: "from-primary to-blue-500" },
            { icon: BookOpen, title: "Responda Perguntas", desc: "Perguntas de multipla escolha sobre a Biblia, com diferentes niveis de dificuldade.", color: "from-secondary to-teal-400" },
            { icon: Crown, title: "Suba no Ranking", desc: "Ganhe XP, conquiste badges e leve sua igreja ao topo do ranking nacional.", color: "from-amber-500 to-orange-500" },
          ].map((step, i) => (
            <Card key={i} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              <CardContent className="relative flex flex-col items-center gap-4 p-8 text-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color}`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Torneios em Destaque</h2>
            <Link href="/torneios">
              <Button variant="ghost" className="gap-1 text-primary">
                Ver Todos <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTournaments.map((t) => (
              <Link key={t.id} href={`/torneios/${t.id}`}>
                <Card className="group h-full overflow-hidden border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                  <div className="h-2 gradient-primary" />
                  <CardContent className="flex flex-col gap-3 p-5">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-balance leading-tight">{t.name}</h3>
                      <Badge className={statusColors[t.status]}>
                        {TOURNAMENT_STATUS_LABELS[t.status]}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{t.description}</p>
                    <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {t.total_teams} equipes</span>
                      <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {AGE_GROUP_LABELS[t.age_group]}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="mb-8 text-2xl font-bold flex items-center gap-2">
            <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-destructive" /></span>
            Partidas Ao Vivo
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {liveMatches.map((m) => (
              <Card key={m.id} className="overflow-hidden border-2 border-destructive/20 shadow-md">
                <CardContent className="p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{m.round}</Badge>
                    <div className="flex items-center gap-1.5 text-xs text-destructive font-medium">
                      <Play className="h-3 w-3 fill-destructive" /> AO VIVO
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 text-right">
                      <p className="font-bold">{m.team_a.name}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-2">
                      <span className="text-2xl font-extrabold text-primary">{m.team_a.score}</span>
                      <span className="text-muted-foreground">x</span>
                      <span className="text-2xl font-extrabold text-secondary">{m.team_b.score}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{m.team_b.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Rankings */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center text-2xl font-bold">Rankings</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Users */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <Crown className="h-5 w-5 text-accent" /> Top Jogadores
                </h3>
                <div className="flex flex-col gap-3">
                  {topUsers.map((u, i) => (
                    <div key={u.id} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-amber-400 text-amber-950" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-orange-400 text-orange-950" : "bg-muted text-muted-foreground"}`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.total_correct} acertos</p>
                      </div>
                      <span className="text-sm font-bold text-primary">{u.xp.toLocaleString()} XP</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Churches */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <Church className="h-5 w-5 text-secondary" /> Top Igrejas
                </h3>
                <div className="flex flex-col gap-3">
                  {topChurches.map((c, i) => (
                    <div key={c.id} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-amber-400 text-amber-950" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-orange-400 text-orange-950" : "bg-muted text-muted-foreground"}`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.city}, {c.state}</p>
                      </div>
                      <span className="text-sm font-bold text-secondary">{c.total_points.toLocaleString()} pts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-balance">Pronto para o Desafio?</h2>
          <p className="mb-8 text-muted-foreground text-lg">Comece agora mesmo com um quiz rapido ou inscreva sua equipe em um torneio!</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/quiz">
              <Button size="lg" className="gradient-primary text-primary-foreground gap-2 text-base px-8">
                <Zap className="h-5 w-5" /> Jogar Agora
              </Button>
            </Link>
            <Link href="/torneios">
              <Button size="lg" variant="outline" className="gap-2 text-base px-8">
                <Trophy className="h-5 w-5" /> Explorar Torneios
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
