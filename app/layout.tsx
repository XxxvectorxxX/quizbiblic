import type { Metadata, Viewport } from "next"
import { Nunito, Geist_Mono } from "next/font/google"
import { AuthProvider } from "@/lib/contexts/auth-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import "./globals.css"

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "BibleQuiz Arena - Quizzes Biblicos e Torneios",
  description: "Plataforma de quizzes biblicos com torneios entre igrejas, rankings e muito mais. Aprenda, compita e cresca na Palavra!",
}

export const viewport: Viewport = {
  themeColor: "#7C3AED",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
