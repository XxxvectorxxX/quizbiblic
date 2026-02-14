import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 })
    }

    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .single()

    if (adminProfile?.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, name, role, church_id } = body

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, senha e nome sao obrigatorios" }, { status: 400 })
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role: role || "user",
        church_id: church_id || null,
      },
    })

    if (authError) {
      if (authError.message?.includes("not authorized") || authError.message?.includes("admin")) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role: role || "user",
              church_id: church_id || null,
            },
          },
        })

        if (signUpError) {
          return NextResponse.json({ error: signUpError.message }, { status: 400 })
        }

        return NextResponse.json({
          success: true,
          user: signUpData.user,
          message: "Usuario criado. Email de confirmacao enviado.",
        })
      }

      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      user: authData.user,
      message: "Usuario criado com sucesso!",
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
