"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Zap, BookOpen, Clock, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AGE_GROUP_LABELS, DENOMINATION_LABELS, type AgeGroup, type Denomination } from "@/lib/types"
import { useQuiz } from "@/lib/contexts/quiz-context"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function QuizConfigPage() {
  const router = useRouter()
  const { startQuiz } = useQuiz()
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("young_adults")
  const [denomination, setDenomination] = useState<Denomination>("universal")

  const handleStart = () => {
    startQuiz(ageGroup, denomination)
    router.push("/quiz/jogar")
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-extrabold text-balance">Quiz Individual</h1>
          <p className="mt-2 text-muted-foreground">Configure seu quiz e teste seus conhecimentos biblicos!</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="flex flex-col gap-6 p-8">
            <div className="flex flex-col gap-2">
              <Label className="text-base font-semibold">Faixa Etaria</Label>
              <Select value={ageGroup} onValueChange={(v) => setAgeGroup(v as AgeGroup)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(AGE_GROUP_LABELS) as [AgeGroup, string][]).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-base font-semibold">Denominacao</Label>
              <Select value={denomination} onValueChange={(v) => setDenomination(v as Denomination)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(DENOMINATION_LABELS) as [Denomination, string][]).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-xl bg-muted/50 p-4">
              <h3 className="mb-3 font-semibold">Detalhes do Quiz</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">10</span>
                  <span className="text-xs text-muted-foreground">Perguntas</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Clock className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium">30s</span>
                  <span className="text-xs text-muted-foreground">Por Pergunta</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Zap className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium">Adaptavel</span>
                  <span className="text-xs text-muted-foreground">Dificuldade</span>
                </div>
              </div>
            </div>

            <Button size="lg" className="gradient-primary text-primary-foreground gap-2 text-lg h-14" onClick={handleStart}>
              <Zap className="h-5 w-5" />
              Iniciar Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
