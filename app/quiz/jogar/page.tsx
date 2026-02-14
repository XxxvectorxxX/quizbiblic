"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, XCircle, Clock, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useQuiz } from "@/lib/contexts/quiz-context"
import { DIFFICULTY_LABELS } from "@/lib/types"
import { ProtectedRoute } from "@/components/auth/protected-route"

const optionLetterColors = [
  "bg-primary/10 text-primary border-primary/20",
  "bg-secondary/10 text-secondary border-secondary/20",
  "bg-amber-500/10 text-amber-700 border-amber-500/20",
  "bg-pink-500/10 text-pink-700 border-pink-500/20",
]

const optionSelectedCorrect = "bg-emerald-500/20 text-emerald-700 border-emerald-500 ring-2 ring-emerald-500/30"
const optionSelectedWrong = "bg-destructive/20 text-destructive border-destructive ring-2 ring-destructive/30"
const optionRevealCorrect = "bg-emerald-500/10 border-emerald-500/50"

export default function QuizPlayPage() {
  const router = useRouter()
  const { state, answerQuestion } = useQuiz()
  const [timeLeft, setTimeLeft] = useState(30)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [startTime] = useState(Date.now())

  const currentQuestion = state.questions[state.currentIndex]
  const progress = state.questions.length > 0 ? ((state.currentIndex) / state.questions.length) * 100 : 0

  useEffect(() => {
    if (!state.isActive || !currentQuestion || showResult) return
    if (state.isFinished) {
      router.push("/quiz/resultado")
      return
    }
  }, [state.isActive, state.isFinished, currentQuestion, showResult, router])

  useEffect(() => {
    if (!state.isActive || showResult || !currentQuestion) return
    setTimeLeft(30)
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentIndex, state.isActive, showResult])

  const handleTimeUp = useCallback(() => {
    if (showResult) return
    setSelectedOption(null)
    setShowResult(true)
    const timeTaken = 30
    setTimeout(() => {
      answerQuestion("", timeTaken)
      setShowResult(false)
      setSelectedOption(null)
    }, 2000)
  }, [showResult, answerQuestion])

  const handleSelect = (option: string) => {
    if (selectedOption || showResult) return
    setSelectedOption(option)
    setShowResult(true)
    const timeTaken = (Date.now() - startTime) / 1000
    setTimeout(() => {
      answerQuestion(option, timeTaken)
      setShowResult(false)
      setSelectedOption(null)
    }, 2000)
  }

  if (!state.isActive && !state.isFinished) {
    router.push("/quiz")
    return null
  }

  if (!currentQuestion) {
    if (state.isFinished) {
      router.push("/quiz/resultado")
    }
    return null
  }

  const isCorrectAnswer = selectedOption === currentQuestion.correct_option
  const timerPercent = (timeLeft / 30) * 100
  const timerColor = timeLeft > 15 ? "text-secondary" : timeLeft > 5 ? "text-accent" : "text-destructive"

  return (
    <ProtectedRoute>
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Top Bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <BookOpen className="h-3 w-3" />
            {state.currentIndex + 1}/{state.questions.length}
          </Badge>
          <Badge className={cn(
            state.difficulty === "easy" ? "bg-emerald-100 text-emerald-700" :
            state.difficulty === "medium" ? "bg-amber-100 text-amber-700" :
            "bg-destructive/10 text-destructive"
          )}>
            {DIFFICULTY_LABELS[state.difficulty]}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-emerald-600 font-semibold">{state.totalCorrect} acertos</span>
          <span className="text-destructive font-semibold">{state.totalWrong} erros</span>
        </div>
      </div>

      {/* Progress */}
      <Progress value={progress} className="mb-6 h-2" />

      {/* Timer */}
      <div className="mb-6 flex justify-center">
        <div className={cn("relative flex h-20 w-20 items-center justify-center rounded-full border-4 transition-colors", timerColor, timeLeft <= 5 ? "animate-pulse" : "")}>
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={`${timerPercent * 2.26} 226`} className="transition-all duration-1000 opacity-30" />
          </svg>
          <div className="flex flex-col items-center">
            <Clock className="h-4 w-4 mb-0.5" />
            <span className="text-xl font-extrabold">{timeLeft}</span>
          </div>
        </div>
      </div>

      {/* Question */}
      <Card className="mb-6 border-0 shadow-lg">
        <CardContent className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-balance text-center leading-relaxed">{currentQuestion.text}</h2>
        </CardContent>
      </Card>

      {/* Options */}
      <div className="grid gap-3">
        {currentQuestion.options.map((opt, i) => {
          const isSelected = selectedOption === opt.label
          const isCorrect = opt.label === currentQuestion.correct_option

          let optionClass = `cursor-pointer border-2 transition-all hover:shadow-md ${optionLetterColors[i]}`
          if (showResult) {
            if (isSelected && isCorrectAnswer) optionClass = optionSelectedCorrect
            else if (isSelected && !isCorrectAnswer) optionClass = optionSelectedWrong
            else if (isCorrect) optionClass = optionRevealCorrect
            else optionClass = "border-2 opacity-50"
          }

          return (
            <button
              key={opt.label}
              onClick={() => handleSelect(opt.label)}
              disabled={showResult}
              className={cn("flex items-center gap-4 rounded-xl p-4 text-left", optionClass)}
            >
              <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold", showResult && isCorrect ? "bg-emerald-500 text-white" : showResult && isSelected && !isCorrectAnswer ? "bg-destructive text-destructive-foreground" : "bg-background")}>
                {opt.label}
              </span>
              <span className="flex-1 font-medium">{opt.text}</span>
              {showResult && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
              {showResult && isSelected && !isCorrectAnswer && <XCircle className="h-5 w-5 text-destructive shrink-0" />}
            </button>
          )
        })}
      </div>

      {/* Bible Reference (shown after answer) */}
      {showResult && (
        <div className="mt-4 rounded-xl bg-muted/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Referencia: <span className="font-semibold text-foreground">{currentQuestion.bible_reference}</span>
          </p>
        </div>
      )}
    </div>
    </ProtectedRoute>
  )
}
