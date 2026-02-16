"use client"

import { useEffect, useMemo, useState } from "react"
import {
  LayoutDashboard,
  Users,
  Church,
  Trophy,
  BookOpen,
  AlertTriangle,
  Clock,
  Activity,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

type Profile = {
  id: string
  email?: string | null
  name?: string | null
  role?: string | null
  church_id?: string | null
  xp?: number | null
  total_correct?: number | null
  total_wrong?: number | null
}

type ChurchT = { id: string; name: string; city?: string | null; state?: string | null; total_points?: number | null }
type Tournament = { id: string; name: string; status?: string | null }
type Question = { id: string; question?: string | null; difficulty?: "easy" | "medium" | "hard" | string | null }
type Penalty = { id: string; user_name?: string | null; reason?: string | null; type?: string | null; applied_at?: string | null; expires_at?: string | null }
type Log = { id: string; user_name?: string | null; action?: string | null; target?: string | null; created_at?: string | null }

async function safeJson(res: Response) {
  try {
    return await res.json()
  } catch {
    return {}
  }
}

export default function AdminPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [churches, setChurches] = useState<ChurchT[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [penalties, setPenalties] = useState<Penalty[]>([])
  const [logs, setLogs] = useState<Log[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)

      const endpoints = [
        { key: "users", url: "/api/admin/users" },
        { key: "churches", url: "/api/admin/churches" },
        { key: "tournaments", url: "/api/admin/tournaments" },
        { key: "questions", url: "/api/admin/questions" },
        { key: "penalties", url: "/api/admin/penalties" },
        { key: "activity", url: "/api/admin/activity" },
      ] as const

      const results = await Promise.all(
        endpoints.map(async (e) => {
          const res = await fetch(e.url, { cache: "no-store" })
          const data = await safeJson(res)
          return { key: e.key, ok: res.ok, status: res.status, data }
        })
      )

      const firstErr = results.find((r) => !r.ok)
      if (firstErr) {
        setError(firstErr.data?.error ?? `Erro ao carregar ${firstErr.key} (HTTP ${firstErr.status}).`)
        setLoading(false)
        return
      }

      setUsers(results.find((r) => r.key === "users")?.data?.users ?? [])
      setChurches(results.find((r) => r.key === "churches")?.data?.churches ?? [])
      setTournaments(results.find((r) => r.key === "tournaments")?.data?.tournaments ?? [])
      setQuestions(results.find((r) => r.key === "questions")?.data?.questions ?? [])
      setPenalties(results.find((r) => r.key === "penalties")?.data?.penalties ?? [])
      setLogs(results.find((r) => r.key === "activity")?.data?.logs ?? [])

      setLoading(false)
    }

    load()
  }, [])

  const statCards = useMemo(() => {
    const active = tournaments.filter((t) => t.status === "in_progress").length
    return [
      { icon: Users, label: "Usuarios", value: users.length },
      { icon: Church, label: "Igrejas", value: churches.length },
      { icon: Trophy, label: "Torneios Ativos", value: active },
      { icon: BookOpen, label: "Perguntas", value: questions.length },
    ]
  }, [users, churches, tournaments, questions])

  const difficultyData = useMemo(() => {
    const easy = questions.filter((q) => q.difficulty === "easy").length
    const medium = questions.filter((q) => q.difficulty === "medium").length
    const hard = questions.filter((q) => q.difficulty === "hard").length

    return [
      { name: "Facil", value: easy, color: "#10b981" },
      { name: "Media", value: medium, color: "#f59e0b" },
      { name: "Dificil", value: hard, color: "#ef4444" },
    ]
  }, [questions])

  // (Mantive do seu layout antigo. Se você não usar, pode remover.)
  const ageAccuracyData = useMemo(
    () => [
      { name: "Criancas", rate: 87 },
      { name: "Adolescentes", rate: 72 },
      { name: "Jovens", rate: 65 },
      { name: "Adultos", rate: 58 },
    ],
    []
  )

  const penaltyTypeLabels: Record<string, string> = { ban: "Banimento", suspension: "Suspensao", warning: "Advertencia" }
  const penaltyColors: Record<string, string> = {
    ban: "bg-destructive/10 text-destructive",
    suspension: "bg-amber-100 text-amber-700",
    warning: "bg-blue-100 text-blue-700",
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold flex items-center gap-2">
          <LayoutDashboard className="h-8 w-8 text-primary" /> Painel Administrativo
        </h1>
        <p className="mt-1 text-muted-foreground">Visao geral da plataforma e gestao administrativa</p>

        {loading && <p className="mt-3 text-sm text-muted-foreground">Carregando...</p>}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="group relative overflow-hidden border-0 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-500 opacity-5 group-hover:opacity-10 transition-opacity" />
            <CardContent className="relative flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-500">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-extrabold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="overview" className="gap-1"><Activity className="h-4 w-4" /> Visao Geral</TabsTrigger>
          <TabsTrigger value="penalties" className="gap-1"><AlertTriangle className="h-4 w-4" /> Penalidades</TabsTrigger>
          <TabsTrigger value="activity" className="gap-1"><Clock className="h-4 w-4" /> Atividades</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Difficulty Pie */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="mb-4 font-bold">Distribuicao de Dificuldades</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={difficultyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {difficultyData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Age Accuracy Bar (mantido como estava) */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="mb-4 font-bold">Taxa de Acerto por Faixa Etaria</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageAccuracyData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(val: number) => [`${val}%`, "Taxa de Acerto"]} />
                      <Bar dataKey="rate" fill="hsl(263, 70%, 50%)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Penalties Tab */}
        <TabsContent value="penalties">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="mb-4 font-bold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" /> Penalidades Ativas
              </h3>

              {!penalties.length ? (
                <p className="py-6 text-center text-muted-foreground">Nenhuma penalidade ativa.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {penalties.map((p) => (
                    <div key={p.id} className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex rounded px-2 py-1 text-xs font-semibold ${penaltyColors[p.type ?? "warning"] ?? "bg-muted text-muted-foreground"}`}>
                          {penaltyTypeLabels[p.type ?? "warning"] ?? (p.type ?? "Penalty")}
                        </span>
                        <div>
                          <p className="font-semibold">{p.user_name ?? "Usuario"}</p>
                          <p className="text-xs text-muted-foreground">{p.reason ?? "-"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {p.applied_at && <span>Aplicada em: {new Date(p.applied_at).toLocaleDateString("pt-BR")}</span>}
                        {p.expires_at && <span>Expira: {new Date(p.expires_at).toLocaleDateString("pt-BR")}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="mb-4 font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Atividades Recentes
              </h3>

              {!logs.length ? (
                <p className="py-6 text-center text-muted-foreground">Nenhuma atividade.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-semibold">{log.user_name ?? "Usuario"}</span>{" "}
                          <span className="text-muted-foreground">{log.action ?? ""}</span>{" "}
                          <span className="font-medium">{log.target ?? ""}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {log.created_at
                            ? new Date(log.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
                            : "-"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
