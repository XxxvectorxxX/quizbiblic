"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Trophy, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AGE_GROUP_LABELS, DENOMINATION_LABELS, type AgeGroup, type Denomination } from "@/lib/types"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { createClient } from "@supabase/supabase-js"

export default function CreateTournamentPage() {
  const router = useRouter()

  // States do formulário
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [teamSize, setTeamSize] = useState("5")
  const [answerTime, setAnswerTime] = useState("30")
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("young_adults")
  const [denomination, setDenomination] = useState<Denomination>("universal")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Inserir no Supabase
    const { data, error } = await supabase
      .from("tournaments")
      .insert([
        {
          name,
          description,
          start_date: startDate,
          end_date: startDate, // ou você pode criar outro input para data de fim
          max_participants: Number(teamSize) * 10, // ajuste conforme sua lógica
          current_participants: 0,
          age_group: ageGroup,
          denomination: denomination,
          status: "upcoming", // padrão
        },
      ])
      .select() // retorna o registro inserido

    if (error) {
      console.error("Erro ao criar torneio:", error)
      alert("Erro ao criar torneio: " + error.message)
      setLoading(false)
      return
    }

    setLoading(false)
    router.push("/torneios") // redireciona após criar
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link
          href="/torneios"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para Torneios
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Trophy className="h-7 w-7 text-primary" /> Criar Torneio
          </h1>
          <p className="mt-1 text-muted-foreground">Preencha os dados para criar um novo torneio</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Nome do Torneio */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="font-semibold">Nome do Torneio</Label>
                <Input
                  id="name"
                  placeholder="Ex: Copa Biblica Nacional 2025"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Descrição */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="desc" className="font-semibold">Descricao</Label>
                <textarea
                  id="desc"
                  placeholder="Descreva o torneio..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                />
              </div>

              {/* Data de Inicio e Tamanho da Equipe */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="start" className="font-semibold">Data de Inicio</Label>
                  <Input
                    id="start"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-semibold">Tamanho da Equipe</Label>
                  <Select value={teamSize} onValueChange={setTeamSize}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[3, 4, 5, 6].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} jogadores</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Faixa Etaria e Denominação */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="font-semibold">Faixa Etaria</Label>
                  <Select value={ageGroup} onValueChange={(v) => setAgeGroup(v as AgeGroup)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.entries(AGE_GROUP_LABELS) as [AgeGroup, string][]).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-semibold">Denominacao</Label>
                  <Select value={denomination} onValueChange={(v) => setDenomination(v as Denomination)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.entries(DENOMINATION_LABELS) as [Denomination, string][]).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tempo de Resposta */}
              <div className="flex flex-col gap-2">
                <Label className="font-semibold">Tempo de Resposta</Label>
                <Select value={answerTime} onValueChange={setAnswerTime}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[15, 20, 25, 30, 45, 60].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} segundos</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Botão de Criar */}
              <Button
                type="submit"
                size="lg"
                className="gradient-primary text-primary-foreground gap-2 mt-2"
                disabled={loading}
              >
                <Save className="h-5 w-5" /> {loading ? "Criando..." : "Criar Torneio"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
