import { getMonthlyStats } from '@/app/actions/statistics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExpenseChart } from '@/components/ExpenseChart'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()
  
  const stats = await getMonthlyStats(currentMonth, currentYear)

  // Localized month name
  const monthName = currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Дашборд</h1>
        <p className="text-muted-foreground capitalize">Статистика за {monthName}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Доходы</CardTitle>
            <span className="text-green-500 rounded-full bg-green-500/10 p-2">
              💰
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{stats.totalIncome.toLocaleString('ru-RU')} ₴
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Расходы</CardTitle>
            <span className="text-red-500 rounded-full bg-red-500/10 p-2">
              📉
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              -{stats.totalExpense.toLocaleString('ru-RU')} ₴
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Остаток</CardTitle>
            <span className="text-primary rounded-full bg-primary/10 p-2">
              🏦
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.balance.toLocaleString('ru-RU')} ₴
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Денег свободно
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ExpenseChart data={stats.expensesByCategory} />
        
        {/* Placeholder for Recent Transactions */}
        <Card className="col-span-full md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Последние транзакции</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Список транзакций будет добавлен здесь (см. вкладку Транзакции для полного вида).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
