import { getCategories } from '@/app/actions/category'
import { getBudgets } from '@/app/actions/budget'
import { BudgetMatrixForm } from '@/components/BudgetMatrixForm'

export const dynamic = 'force-dynamic'

const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

export default async function BudgetPage() {
  const currentYear = new Date().getFullYear()
  const categories = await getCategories()
  const budgets = await getBudgets(currentYear)

  // Strip Prisma Date objects for Client Component
  const safeCategories = categories.map(c => ({
    id: c.id,
    name: c.name,
    type: c.type,
    color: c.color
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Планирование (Этот год)</h1>
        <p className="text-muted-foreground">Бюджетная матрица расходов на {currentYear} год</p>
      </div>

      <BudgetMatrixForm 
        categories={safeCategories} 
        initialBudgets={budgets} 
        currentYear={currentYear} 
      />
    </div>
  )
}
