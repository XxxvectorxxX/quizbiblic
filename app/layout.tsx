import type { Metadata, Viewport } from "next"
import { Nunito, Geist_Mono } from "next/font/google"
import "./globals.css"

import { Providers } from "./providers"
import { AppShell } from "@/components/layout/app-shell"

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "BibleQuiz Arena - Quizzes Biblicos e Torneios",
  description:
    "Plataforma de quizzes biblicos com torneios entre igrejas, rankings e muito mais. Aprenda, compita e cresca na Palavra!",
}

export const viewport: Viewport = {
  themeColor: "#7C3AED",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
