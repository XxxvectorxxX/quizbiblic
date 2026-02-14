"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Trophy, RotateCcw, Home, CheckCircle2, XCircle, Target, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useQuiz } from "@/lib/contexts/quiz-context"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function QuizResultPage() {
  const router = useRouter()
  const { state, resetQuiz } = useQuiz()

  if (!state.isFinished && state.answers.length === 0) {
    router.push("/quiz")
    return null
  }

  const total = state.totalCorrect + state.totalWrong
  const rate = total > 0 ? Math.round((state.totalCorrect / total) * 100) : 0
  const avgTime = state.answers.length > 0
    ? (state.answers.reduce((a, b) => a + b.time_taken, 0) / state.answers.length).toFixed(1)
    : "0"

  const getMessage = () => {
    if (rate >= 90) return { title: "Incrivel!", subtitle: "Voce e um verdadeiro estudioso da Biblia!", color: "text-amber-500" }
    if (rate >= 70) return { title: "Muito Bem!", subtitle: "Otimo conhecimento biblico! Continue assim!", color: "text-emerald-500" }
    if (rate >= 50) return { title: "Bom Trabalho!", subtitle: "Voce esta no caminho certo. Continue estudando!", color: "text-primary" }
    return { title: "Continue Praticando!", subtitle: "Cada quiz e uma oportunidade de aprender mais.", color: "text-secondary" }
  }

  const message = getMessage()

  const handlePlayAgain = () => {
    resetQuiz()
    router.push("/quiz")
  }

  return (
    <ProtectedRoute>
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl gradient-primary animate-float">
          <Trophy className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className={`text-3xl font-extrabold ${message.color}`}>{message.title}</h1>
        <p className="mt-2 text-muted-foreground">{message.subtitle}</p>
      </div>

      {/* Score Circle */}
      <Card className="mb-6 border-0 shadow-lg overflow-hidden">
        <div className="h-2 gradient-primary" />
        <CardContent className="flex flex-col items-center gap-6 p-8">
          <div className="relative flex h-36 w-36 items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 144 144">
              <circle cx="72" cy="72" r="64" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle cx="72" cy="72" r="64" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeDasharray={`${rate * 4.02} 402`} strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-extrabold text-primary">{rate}%</span>
              <span className="text-xs text-muted-foreground">de acerto</span>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 p-3">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">{total}</span>
              <span className="text-xs text-muted-foreground">Perguntas</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl bg-emerald-50 p-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span className="text-lg font-bold text-emerald-600">{state.totalCorrect}</span>
              <span className="text-xs text-muted-foreground">Acertos</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl bg-destructive/5 p-3">
              <XCircle className="h-5 w-5 text-destructive" />
              <span className="text-lg font-bold text-destructive">{state.totalWrong}</span>
              <span className="text-xs text-muted-foreground">Erros</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl bg-accent/10 p-3">
              <Zap className="h-5 w-5 text-accent" />
              <span className="text-lg font-bold text-amber-600">{state.score}</span>
              <span className="text-xs text-muted-foreground">Pontos</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Tempo medio por pergunta: <span className="font-semibold text-foreground">{avgTime}s</span>
          </p>
        </CardContent>
      </Card>

      {/* Answer Review */}
      <Card className="mb-6 border-0 shadow-lg">
        <CardContent className="p-6">
          <h3 className="mb-4 font-bold">Revisao das Respostas</h3>
          <div className="flex flex-col gap-2">
            {state.answers.map((answer, i) => {
              const question = state.questions[i]
              return (
                <div key={answer.question_id} className="flex items-center gap-3 rounded-lg bg-muted/30 px-3 py-2">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${answer.is_correct ? "bg-emerald-500 text-white" : "bg-destructive text-destructive-foreground"}`}>
                    {i + 1}
                  </span>
                  <p className="flex-1 truncate text-sm">{question?.text}</p>
                  {answer.is_correct ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" className="gradient-primary text-primary-foreground gap-2" onClick={handlePlayAgain}>
          <RotateCcw className="h-5 w-5" /> Jogar Novamente
        </Button>
        <Link href="/">
          <Button size="lg" variant="outline" className="gap-2">
            <Home className="h-5 w-5" /> Pagina Inicial
          </Button>
        </Link>
      </div>
    </div>
    </ProtectedRoute>
  )
}
