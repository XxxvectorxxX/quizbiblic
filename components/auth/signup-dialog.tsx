"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/contexts/auth-context"
import { BookOpen, Loader2 } from "lucide-react"

interface SignupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToLogin: () => void
}

export function SignupDialog({ open, onOpenChange, onSwitchToLogin }: SignupDialogProps) {
  const { signup } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const result = await signup({ name, email, password })
      if (result.success) {
        setSuccess(true)
        setName("")
        setEmail("")
        setPassword("")
      } else {
        setError(result.error || "Erro ao criar conta.")
      }
    } catch {
      setError("Erro ao criar conta. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) setSuccess(false)
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-xl">Criar Conta</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <BookOpen className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Conta criada com sucesso!</h3>
            <p className="text-sm text-muted-foreground">
              Verifique seu email para confirmar sua conta antes de fazer login.
            </p>
            <Button variant="outline" onClick={() => { setSuccess(false); onSwitchToLogin() }}>
              Ir para Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-name">Nome Completo</Label>
              <Input id="signup-name" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-password">Senha</Label>
              <Input id="signup-password" type="password" placeholder="Minimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="gradient-primary text-primary-foreground" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Criar Conta
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {"Ja tem conta? "}
              <button type="button" onClick={onSwitchToLogin} className="font-medium text-primary hover:underline">
                Entrar
              </button>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
