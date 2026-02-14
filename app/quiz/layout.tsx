import { QuizProvider } from "@/lib/contexts/quiz-context"

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <QuizProvider>{children}</QuizProvider>
}
