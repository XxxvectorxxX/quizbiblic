import Link from "next/link"
import { BookOpen } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <BookOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">
                Bible<span className="text-primary">Quiz</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A plataforma de quizzes biblicos mais divertida do Brasil. Aprenda, compita e cresça na Palavra.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold">Plataforma</h4>
            <Link href="/quiz" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Quiz Individual</Link>
            <Link href="/torneios" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Torneios</Link>
            <Link href="/igrejas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Igrejas</Link>
            <Link href="/perguntas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Banco de Perguntas</Link>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold">Comunidade</h4>
            <span className="text-sm text-muted-foreground">Rankings Globais</span>
            <span className="text-sm text-muted-foreground">Regras e Conduta</span>
            <span className="text-sm text-muted-foreground">Perguntas Frequentes</span>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold">Contato</h4>
            <span className="text-sm text-muted-foreground">contato@biblequiz.com.br</span>
            <span className="text-sm text-muted-foreground">Suporte</span>
            <span className="text-sm text-muted-foreground">Termos de Uso</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            2025 BibleQuiz Arena. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Feito com fe e tecnologia.
          </p>
        </div>
      </div>
    </footer>
  )
}
