import Link from "next/link"
import { BookOpen, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl gradient-primary animate-float">
        <BookOpen className="h-12 w-12 text-primary-foreground" />
      </div>
      <h1 className="mb-2 text-6xl font-extrabold text-primary">404</h1>
      <h2 className="mb-2 text-2xl font-bold">Pagina Nao Encontrada</h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        Parece que voce se perdeu no caminho. Esta pagina nao existe ou foi movida para outro endereco.
      </p>
      <Link href="/">
        <Button size="lg" className="gradient-primary text-primary-foreground gap-2">
          <Home className="h-5 w-5" /> Voltar para o Inicio
        </Button>
      </Link>
    </div>
  )
}
