import type { Metadata, Viewport } from "next"
import { Nunito, Geist_Mono } from "next/font/google"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Providers } from "./providers"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import "./globals.css"

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
          <SidebarProvider defaultOpen>
            <div className="flex min-h-svh w-full">
              {/* SIDEBAR */}
              <AppSidebar />

              {/* CONTEÚDO */}
              <SidebarInset>
                <div className="flex min-h-svh flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  )
}
