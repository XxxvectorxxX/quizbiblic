"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Question, QuizAnswer, Difficulty, AgeGroup, Denomination } from "@/lib/types"
import { mockQuestions } from "@/lib/mock-data"

interface QuizState {
  questions: Question[]
  answers: QuizAnswer[]
  currentIndex: number
  score: number
  totalCorrect: number
  totalWrong: number
  difficulty: Difficulty
  ageGroup: AgeGroup
  denomination: Denomination
  isActive: boolean
  isFinished: boolean
  timePerQuestion: number
}

interface QuizContextType {
  state: QuizState
  startQuiz: (ageGroup: AgeGroup, denomination: Denomination) => void
  answerQuestion: (selectedOption: string, timeTaken: number) => void
  resetQuiz: () => void
}

const initialState: QuizState = {
  questions: [],
  answers: [],
  currentIndex: 0,
  score: 0,
  totalCorrect: 0,
  totalWrong: 0,
  difficulty: "easy",
  ageGroup: "young_adults",
  denomination: "universal",
  isActive: false,
  isFinished: false,
  timePerQuestion: 30,
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

function selectQuestions(ageGroup: AgeGroup, denomination: Denomination, difficulty: Difficulty): Question[] {
  let filtered = mockQuestions.filter((q) => {
    const ageMatch = q.age_group === ageGroup || q.age_group === "kids" || ageGroup === "adults"
    const denomMatch = q.denomination === denomination || q.denomination === "universal" || denomination === "universal"
    return ageMatch && denomMatch
  })

  const diffQuestions = filtered.filter((q) => q.difficulty === difficulty)
  if (diffQuestions.length >= 5) filtered = diffQuestions

  const shuffled = [...filtered].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 10)
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QuizState>(initialState)

  const startQuiz = useCallback((ageGroup: AgeGroup, denomination: Denomination) => {
    const questions = selectQuestions(ageGroup, denomination, "easy")
    setState({
      ...initialState,
      questions,
      ageGroup,
      denomination,
      isActive: true,
    })
  }, [])

  const answerQuestion = useCallback((selectedOption: string, timeTaken: number) => {
    setState((prev) => {
      const question = prev.questions[prev.currentIndex]
      if (!question) return prev

      const isCorrect = selectedOption === question.correct_option
      const answer: QuizAnswer = {
        question_id: question.id,
        selected_option: selectedOption,
        is_correct: isCorrect,
        time_taken: timeTaken,
      }

      const newCorrect = prev.totalCorrect + (isCorrect ? 1 : 0)
      const newWrong = prev.totalWrong + (isCorrect ? 0 : 1)
      const newScore = prev.score + (isCorrect ? (question.difficulty === "hard" ? 30 : question.difficulty === "medium" ? 20 : 10) : 0)
      const newIndex = prev.currentIndex + 1
      const isFinished = newIndex >= prev.questions.length

      let newDifficulty = prev.difficulty
      const totalAnswered = newCorrect + newWrong
      if (totalAnswered > 0) {
        const rate = newCorrect / totalAnswered
        if (rate > 0.8 && prev.difficulty !== "hard") newDifficulty = prev.difficulty === "easy" ? "medium" : "hard"
        else if (rate < 0.4 && prev.difficulty !== "easy") newDifficulty = prev.difficulty === "hard" ? "medium" : "easy"
      }

      return {
        ...prev,
        answers: [...prev.answers, answer],
        currentIndex: newIndex,
        score: newScore,
        totalCorrect: newCorrect,
        totalWrong: newWrong,
        difficulty: newDifficulty,
        isFinished,
        isActive: !isFinished,
      }
    })
  }, [])

  const resetQuiz = useCallback(() => {
    setState(initialState)
  }, [])

  return (
    <QuizContext.Provider value={{ state, startQuiz, answerQuestion, resetQuiz }}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const context = useContext(QuizContext)
  if (!context) throw new Error("useQuiz must be used within QuizProvider")
  return context
}
