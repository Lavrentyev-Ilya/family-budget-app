'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ListOrdered, CalendarDays, Calculator, Wallet, Tags } from "lucide-react"

const navItems = [
  { name: "Дашборд", href: "/", icon: Home },
  { name: "Транзакции", href: "/transactions", icon: ListOrdered },
  { name: "Бюджет", href: "/budget", icon: CalendarDays },
  { name: "Текущий подсчет", href: "/allocation", icon: Calculator },
  { name: "Категории", href: "/categories", icon: Tags },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen w-64 flex-col border-r bg-card text-card-foreground">
        <div className="flex h-14 items-center border-b px-4 font-semibold tracking-tight">
          <Wallet className="mr-2 h-5 w-5 text-primary" />
          Семейный Бюджет
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted hover:text-foreground text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t bg-card text-card-foreground pb-safe">
        <nav className="flex w-full px-2 py-2 justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center rounded-md p-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className={`h-5 w-5 mb-1 ${isActive ? "text-primary" : ""}`} />
                <span className="truncate max-w-[64px]">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
