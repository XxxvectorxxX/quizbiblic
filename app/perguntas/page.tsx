"use client"

import { useState } from "react"
import { BookOpen, Plus, Search, Filter, Edit2, Trash2, Eye, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { mockQuestions } from "@/lib/mock-data"
import { DIFFICULTY_LABELS, AGE_GROUP_LABELS, DENOMINATION_LABELS, type Difficulty, type AgeGroup, type Denomination, type Question } from "@/lib/types"

const difficultyColors: Record<Difficulty, string> = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-destructive/10 text-destructive",
}

export default function QuestionsPage() {
  const [search, setSearch] = useState("")
  const [diffFilter, setDiffFilter] = useState("all")
  const [ageFilter, setAgeFilter] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [viewQuestion, setViewQuestion] = useState<Question | null>(null)

  const [questions, setQuestions] = useState(mockQuestions)

  const filtered = questions.filter((q) => {
    if (diffFilter !== "all" && q.difficulty !== diffFilter) return false
    if (ageFilter !== "all" && q.age_group !== ageFilter) return false
    if (search && !q.text.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  // Form state
  const [formText, setFormText] = useState("")
  const [formOptions, setFormOptions] = useState(["", "", "", ""])
  const [formCorrect, setFormCorrect] = useState("A")
  const [formRef, setFormRef] = useState("")
  const [formDiff, setFormDiff] = useState<Difficulty>("easy")
  const [formAge, setFormAge] = useState<AgeGroup>("young_adults")
  const [formDenom, setFormDenom] = useState<Denomination>("universal")

  const resetForm = () => {
    setFormText("")
    setFormOptions(["", "", "", ""])
    setFormCorrect("A")
    setFormRef("")
    setFormDiff("easy")
    setFormAge("young_adults")
    setFormDenom("universal")
  }

  const handleSave = () => {
    const labels = ["A", "B", "C", "D"]
    const newQ: Question = {
      id: `q${Date.now()}`,
      text: formText,
      options: labels.map((l, i) => ({ label: l, text: formOptions[i] })),
      correct_option: formCorrect,
      bible_reference: formRef,
      difficulty: formDiff,
      age_group: formAge,
      denomination: formDenom,
      type: "multiple_choice",
      tags: [],
      times_used: 0,
      times_correct: 0,
      created_by: "u1",
      created_at: new Date().toISOString(),
    }
    setQuestions((prev) => [newQ, ...prev])
    setShowForm(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" /> Banco de Perguntas
          </h1>
          <p className="mt-1 text-muted-foreground">{questions.length} perguntas cadastradas</p>
        </div>
        <Button className="gradient-primary text-primary-foreground gap-2" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" /> Nova Pergunta
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-0 shadow-sm">
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar perguntas..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={diffFilter} onValueChange={setDiffFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Dificuldade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {(Object.entries(DIFFICULTY_LABELS) as [Difficulty, string][]).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={ageFilter} onValueChange={setAgeFilter}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Faixa" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Faixas</SelectItem>
              {(Object.entries(AGE_GROUP_LABELS) as [AgeGroup, string][]).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Questions Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-semibold text-muted-foreground">Nenhuma pergunta encontrada</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((q) => (
            <Card key={q.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-2 text-sm font-medium leading-relaxed flex-1">{q.text}</p>
                  <Badge className={difficultyColors[q.difficulty]}>{DIFFICULTY_LABELS[q.difficulty]}</Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-xs">{AGE_GROUP_LABELS[q.age_group]}</Badge>
                  <Badge variant="outline" className="text-xs">{q.bible_reference}</Badge>
                </div>
                <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
                  <span>Usado {q.times_used}x | {q.times_used > 0 ? Math.round((q.times_correct / q.times_used) * 100) : 0}% acerto</span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewQuestion(q)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(q.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Question Dialog */}
      <Dialog open={!!viewQuestion} onOpenChange={() => setViewQuestion(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Pergunta</DialogTitle>
          </DialogHeader>
          {viewQuestion && (
            <div className="flex flex-col gap-4">
              <p className="font-medium">{viewQuestion.text}</p>
              <div className="flex flex-col gap-2">
                {viewQuestion.options.map((opt) => (
                  <div key={opt.label} className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${opt.label === viewQuestion.correct_option ? "border-emerald-500 bg-emerald-50" : ""}`}>
                    <span className="font-bold">{opt.label})</span>
                    <span className="flex-1">{opt.text}</span>
                    {opt.label === viewQuestion.correct_option && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Referencia: <strong>{viewQuestion.bible_reference}</strong></p>
              <div className="flex flex-wrap gap-2">
                <Badge className={difficultyColors[viewQuestion.difficulty]}>{DIFFICULTY_LABELS[viewQuestion.difficulty]}</Badge>
                <Badge variant="outline">{AGE_GROUP_LABELS[viewQuestion.age_group]}</Badge>
                <Badge variant="outline">{DENOMINATION_LABELS[viewQuestion.denomination]}</Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Question Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Pergunta</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="font-semibold">Enunciado</Label>
              <textarea
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                rows={2}
                placeholder="Digite a pergunta..."
                className="flex min-h-[60px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            {["A", "B", "C", "D"].map((label, i) => (
              <div key={label} className="flex flex-col gap-1">
                <Label className="text-xs">Alternativa {label}</Label>
                <Input
                  placeholder={`Opcao ${label}`}
                  value={formOptions[i]}
                  onChange={(e) => {
                    const copy = [...formOptions]
                    copy[i] = e.target.value
                    setFormOptions(copy)
                  }}
                />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label className="text-xs font-semibold">Resposta Correta</Label>
                <Select value={formCorrect} onValueChange={setFormCorrect}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["A", "B", "C", "D"].map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs font-semibold">Dificuldade</Label>
                <Select value={formDiff} onValueChange={(v) => setFormDiff(v as Difficulty)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.entries(DIFFICULTY_LABELS) as [Difficulty, string][]).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs font-semibold">Referencia Biblica</Label>
              <Input placeholder="Ex: Genesis 1:1" value={formRef} onChange={(e) => setFormRef(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label className="text-xs font-semibold">Faixa Etaria</Label>
                <Select value={formAge} onValueChange={(v) => setFormAge(v as AgeGroup)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.entries(AGE_GROUP_LABELS) as [AgeGroup, string][]).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs font-semibold">Denominacao</Label>
                <Select value={formDenom} onValueChange={(v) => setFormDenom(v as Denomination)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.entries(DENOMINATION_LABELS) as [Denomination, string][]).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="gradient-primary text-primary-foreground gap-2" onClick={handleSave}>
              <Plus className="h-4 w-4" /> Salvar Pergunta
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
