import { getCategories, deleteCategory } from '@/app/actions/category'
import { getBudgets } from '@/app/actions/budget'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CategoryForm } from '@/components/CategoryForm'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const categories = await getCategories()
  
  // Calculate dynamic percentages from current month budget
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  const budgets = await getBudgets(currentYear)
  const currentMonthBudgets = budgets.filter(b => b.month === currentMonth)
  
  const incomeCategoryIds = new Set(categories.filter(c => c.type === 'INCOME').map(c => c.id))
  let totalPlannedIncome = 0
  currentMonthBudgets.forEach(b => {
    if (incomeCategoryIds.has(b.categoryId)) {
      totalPlannedIncome += Number(b.plannedAmount)
    }
  })
  
  // Build a map: categoryId -> calculated percent
  const percentMap: Record<string, number> = {}
  for (const b of currentMonthBudgets) {
    if (!incomeCategoryIds.has(b.categoryId) && totalPlannedIncome > 0) {
      percentMap[b.categoryId] = (Number(b.plannedAmount) / totalPlannedIncome) * 100
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Категории</h1>
          <p className="text-muted-foreground">Управление статьями доходов и расходов</p>
        </div>
        
        <div className="flex gap-2">
          <CategoryForm />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Расходы</CardTitle>
            <CardDescription>На что уходят деньги</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y space-y-2">
              {categories.filter(c => c.type === 'EXPENSE').map(c => {
                const pct = percentMap[c.id]
                const pctLabel = pct !== undefined ? `${pct.toFixed(1)}%` : '—'
                return (
                  <li key={c.id} className="pt-2 flex justify-between items-center group">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color || '#ccc' }}></span>
                      <span className="font-medium">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground hidden sm:inline-block">{pctLabel} от бюджета</span>
                      <CategoryForm initialCategory={{ id: c.id, name: c.name, type: c.type, color: c.color }} />
                    </div>
                  </li>
                )
              })}
              {categories.filter(c => c.type === 'EXPENSE').length === 0 && (
                <li className="pt-2 text-sm text-muted-foreground">Нет категорий расходов</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-500">Доходы</CardTitle>
            <CardDescription>Откуда приходят деньги</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y space-y-2">
              {categories.filter(c => c.type === 'INCOME').map(c => (
                <li key={c.id} className="pt-2 flex justify-between items-center group">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color || '#ccc' }}></span>
                    <span className="font-medium">{c.name}</span>
                  </div>
                  <CategoryForm initialCategory={{ id: c.id, name: c.name, type: c.type, color: c.color }} />
                </li>
              ))}
              {categories.filter(c => c.type === 'INCOME').length === 0 && (
                <li className="pt-2 text-sm text-muted-foreground">Нет источников дохода</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
