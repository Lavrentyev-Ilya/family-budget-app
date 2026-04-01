import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/Sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Семейный Бюджет",
  description: "Приложение для управления семейным бюджетом",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} min-h-screen bg-background text-foreground flex flex-col md:flex-row antialiased`}>
        <Sidebar />
        <main className="flex-1 overflow-auto bg-muted/20 pb-16 md:pb-0">
          <div className="mx-auto h-full max-w-6xl p-4 md:p-6 pb-20 md:pb-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
