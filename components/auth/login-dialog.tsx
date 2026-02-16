"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/contexts/auth-context"
import { BookOpen, Loader2 } from "lucide-react"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToSignup: () => void
  redirectTo?: string // ✅ opcional: pra você escolher pra onde vai depois do login
}

export function LoginDialog({ open, onOpenChange, onSwitchToSignup, redirectTo = "/" }: LoginDialogProps) {
  const router = useRouter()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setError("")

    try {
      const result = await login(email.trim(), password)

      if (!result.success) {
        setError(result.error || "Email ou senha incorretos.")
        setLoading(false)
        return
      }

      // ✅ fecha modal e limpa
      onOpenChange(false)
      setEmail("")
      setPassword("")

      // ✅ atualiza UI (sidebar, componentes, etc.)
      router.refresh()

      // ✅ redireciona pra uma rota que EXISTE
      router.replace(redirectTo)
    } catch (err) {
      console.error(err)
      setError("Erro ao fazer login. Tente novamente.")
      setLoading(false)
    } finally {
      // evita setLoading duplicado no fluxo de erro
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-xl">Entrar no BibleQuiz</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="login-password">Senha</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="gradient-primary text-primary-foreground" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Entrar
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {"Não tem conta? "}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="font-medium text-primary hover:underline"
            >
              Cadastre-se
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
