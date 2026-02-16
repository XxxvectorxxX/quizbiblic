import { createClient } from "@/lib/supabase/server"
import {
  LayoutDashboard,
  Users,
  Church,
  Trophy,
  BookOpen,
  Crown,
  AlertTriangle,
  Clock,
  Activity,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

export default async function AdminPage() {
  const supabase = await createClient()

  // 🔹 Usuários
  const { data: users } = await supabase.from("profiles").select("*")

  // 🔹 Igrejas
  const { data: churches } = await supabase.from("churches").select("*")

  // 🔹 Torneios
  const { data: tournaments } = await supabase.from("tournaments").select("*")

  // 🔹 Perguntas
  const { data: questions } = await supabase.from("questions").select("*")

  // 🔹 Penalidades
  const { data: penalties } = await supabase.from("penalties").select("*")

  // 🔹 Logs
  const { data: logs } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  const statCards = [
    { icon: Users, label: "Usuarios", value: users?.length ?? 0 },
    { icon: Church, label: "Igrejas", value: churches?.length ?? 0 },
    {
      icon: Trophy,
      label: "Torneios Ativos",
      value: tournaments?.filter((t) => t.status === "in_progress").length ?? 0,
    },
    { icon: BookOpen, label: "Perguntas", value: questions?.length ?? 0 },
  ]

  const difficultyData = [
    {
      name: "Facil",
      value: questions?.filter((q) => q.difficulty === "easy").length ?? 0,
      color: "#10b981",
    },
    {
      name: "Media",
      value: questions?.filter((q) => q.difficulty === "medium").length ?? 0,
      color: "#f59e0b",
    },
    {
      name: "Dificil",
      value: questions?.filter((q) => q.difficulty === "hard").length ?? 0,
      color: "#ef4444",
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold flex items-center gap-2">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          Painel Administrativo
        </h1>
        <p className="mt-1 text-muted-foreground">
          Visao geral da plataforma
        </p>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <stat.icon className="h-6 w-6 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Visao Geral</TabsTrigger>
          <TabsTrigger value="penalties">Penalidades</TabsTrigger>
          <TabsTrigger value="activity">Atividades</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-bold">
                Distribuicao de Dificuldades
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
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
        </TabsContent>

        {/* Penalidades */}
        <TabsContent value="penalties">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-bold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Penalidades
              </h3>

              {!penalties?.length ? (
                <p className="text-muted-foreground">
                  Nenhuma penalidade ativa.
                </p>
              ) : (
                penalties.map((p) => (
                  <div key={p.id} className="border p-3 rounded mb-2">
                    <p className="font-semibold">{p.user_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.reason}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity */}
        <TabsContent value="activity">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Atividades Recentes
              </h3>

              {logs?.map((log) => (
                <div key={log.id} className="mb-2">
                  <p className="text-sm">
                    {log.user_name} - {log.action}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString("pt-BR")}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
