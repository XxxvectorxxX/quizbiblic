"use client"

import { useState } from "react"
import { LayoutDashboard, Users, Church, Trophy, BookOpen, Crown, Shield, Ban, AlertTriangle, Clock, CheckCircle2, XCircle, Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockUsers, mockChurches, mockTournaments, mockQuestions, mockPenalties, mockPermissions, mockActivityLog } from "@/lib/mock-data"
import { ROLE_LABELS, type UserRole } from "@/lib/types"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const statCards = [
  { icon: Users, label: "Usuarios", value: mockUsers.length, color: "from-primary to-blue-500", iconColor: "text-primary" },
  { icon: Church, label: "Igrejas", value: mockChurches.length, color: "from-secondary to-teal-400", iconColor: "text-secondary" },
  { icon: Trophy, label: "Torneios Ativos", value: mockTournaments.filter((t) => t.status === "in_progress").length, color: "from-amber-500 to-orange-500", iconColor: "text-amber-500" },
  { icon: BookOpen, label: "Perguntas", value: mockQuestions.length, color: "from-pink-500 to-rose-500", iconColor: "text-pink-500" },
]

const difficultyData = [
  { name: "Facil", value: mockQuestions.filter((q) => q.difficulty === "easy").length, color: "#10b981" },
  { name: "Media", value: mockQuestions.filter((q) => q.difficulty === "medium").length, color: "#f59e0b" },
  { name: "Dificil", value: mockQuestions.filter((q) => q.difficulty === "hard").length, color: "#ef4444" },
]

const ageAccuracyData = [
  { name: "Criancas", rate: 87 },
  { name: "Adolescentes", rate: 72 },
  { name: "Jovens", rate: 65 },
  { name: "Adultos", rate: 58 },
]

const topUsers = [...mockUsers].sort((a, b) => b.xp - a.xp).slice(0, 5)
const topChurches = [...mockChurches].sort((a, b) => b.total_points - a.total_points).slice(0, 5)

const penaltyTypeLabels: Record<string, string> = { ban: "Banimento", suspension: "Suspensao", warning: "Advertencia" }
const penaltyColors: Record<string, string> = { ban: "bg-destructive/10 text-destructive", suspension: "bg-amber-100 text-amber-700", warning: "bg-blue-100 text-blue-700" }

export default function AdminPage() {
  const [permissions, setPermissions] = useState(mockPermissions)

  const togglePermission = (role: UserRole, module: string, action: "view" | "create" | "edit" | "delete") => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.role === role && p.module === module ? { ...p, actions: { ...p.actions, [action]: !p.actions[action] } } : p
      )
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold flex items-center gap-2">
          <LayoutDashboard className="h-8 w-8 text-primary" /> Painel Administrativo
        </h1>
        <p className="mt-1 text-muted-foreground">Visao geral da plataforma e gestao administrativa</p>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="group relative overflow-hidden border-0 shadow-lg">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
            <CardContent className="relative flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color}`}>
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
          <TabsTrigger value="rankings" className="gap-1"><Crown className="h-4 w-4" /> Rankings</TabsTrigger>
          <TabsTrigger value="penalties" className="gap-1"><Ban className="h-4 w-4" /> Penalidades</TabsTrigger>
          <TabsTrigger value="permissions" className="gap-1"><Shield className="h-4 w-4" /> Permissoes</TabsTrigger>
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
                      <Pie data={difficultyData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
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

            {/* Age Accuracy Bar */}
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

        {/* Rankings Tab */}
        <TabsContent value="rankings">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="mb-4 flex items-center gap-2 font-bold"><Crown className="h-5 w-5 text-accent" /> Top Jogadores</h3>
                <div className="flex flex-col gap-2">
                  {topUsers.map((u, i) => (
                    <div key={u.id} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-amber-400 text-amber-950" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-orange-400 text-orange-950" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.total_correct}/{u.total_correct + u.total_wrong} acertos</p>
                      </div>
                      <Badge className="bg-primary/10 text-primary">{ROLE_LABELS[u.role]}</Badge>
                      <span className="text-sm font-bold text-primary">{u.xp.toLocaleString()} XP</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="mb-4 flex items-center gap-2 font-bold"><Church className="h-5 w-5 text-secondary" /> Top Igrejas</h3>
                <div className="flex flex-col gap-2">
                  {topChurches.map((c, i) => (
                    <div key={c.id} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-amber-400 text-amber-950" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-orange-400 text-orange-950" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
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
        </TabsContent>

        {/* Penalties Tab */}
        <TabsContent value="penalties">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="mb-4 font-bold flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" /> Penalidades Ativas</h3>
              {mockPenalties.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground">Nenhuma penalidade ativa.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {mockPenalties.map((p) => (
                    <div key={p.id} className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={penaltyColors[p.type]}>{penaltyTypeLabels[p.type]}</Badge>
                        <div>
                          <p className="font-semibold">{p.user_name}</p>
                          <p className="text-xs text-muted-foreground">{p.reason}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Aplicada em: {new Date(p.applied_at).toLocaleDateString("pt-BR")}</span>
                        {p.expires_at && <span>Expira: {new Date(p.expires_at).toLocaleDateString("pt-BR")}</span>}
                        <Button variant="outline" size="sm" className="text-xs">
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold">Papel</th>
                      <th className="px-4 py-3 text-left font-semibold">Modulo</th>
                      <th className="px-4 py-3 text-center font-semibold">Visualizar</th>
                      <th className="px-4 py-3 text-center font-semibold">Criar</th>
                      <th className="px-4 py-3 text-center font-semibold">Editar</th>
                      <th className="px-4 py-3 text-center font-semibold">Excluir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((p, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-2.5">
                          <Badge className={p.role === "admin" ? "bg-primary/10 text-primary" : p.role === "supervisor" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}>
                            {ROLE_LABELS[p.role]}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 font-medium">{p.module}</td>
                        {(["view", "create", "edit", "delete"] as const).map((action) => (
                          <td key={action} className="px-4 py-2.5 text-center">
                            <button
                              onClick={() => togglePermission(p.role, p.module, action)}
                              className="inline-flex items-center justify-center"
                            >
                              {p.actions[action] ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-muted-foreground/40" />
                              )}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="mb-4 font-bold flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> Atividades Recentes</h3>
              <div className="flex flex-col gap-3">
                {mockActivityLog.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold">{log.user_name}</span>{" "}
                        <span className="text-muted-foreground">{log.action}</span>{" "}
                        <span className="font-medium">{log.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(log.timestamp).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
