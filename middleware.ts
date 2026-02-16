import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/proxy"
import { createServerClient } from "@supabase/ssr"

const protectedRoutes = ["/quiz", "/torneios", "/perguntas"]
const adminRoutes = ["/admin"]

function isMatch(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(route + "/"))
}

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request)
  const pathname = request.nextUrl.pathname

  const isProtected = isMatch(pathname, protectedRoutes)
  const isAdminRoute = isMatch(pathname, adminRoutes)

  // 🔒 precisa estar logado
  if ((isProtected || isAdminRoute) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // 👑 rota admin: valida pelo DB (profiles.role)
  if (isAdminRoute && user) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => request.cookies.get(name)?.value,
          set: (name, value, options) => response.cookies.set(name, value, options),
          remove: (name, options) => response.cookies.set(name, "", { ...options, maxAge: 0 }),
        },
      }
    )

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    // se deu erro, ou não é admin, bloqueia
    if (error || profile?.role !== "admin") {
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*", "/quiz/:path*", "/torneios/:path*", "/perguntas/:path*"],
}
