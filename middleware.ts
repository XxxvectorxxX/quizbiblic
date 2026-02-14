import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/proxy"

const protectedRoutes = ["/quiz", "/torneios", "/perguntas"]
const adminRoutes = ["/admin"]

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request)

  const pathname = request.nextUrl.pathname

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route))

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  if (isAdmin && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  if (isAdmin && user) {
    const isAdminUser = user.user_metadata?.role === "admin"
    if (!isAdminUser) {
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
