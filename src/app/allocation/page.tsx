import { getCategories } from '@/app/actions/category'
import { getBudgets } from '@/app/actions/budget'
import { AllocationCalculator } from '@/components/AllocationCalculator'

export const dynamic = 'force-dynamic'

export default async function AllocationPage() {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const allCategories = await getCategories()
  const budgets = await getBudgets(currentYear)
  
  // Filter budgets for the current month
  const currentMonthBudgets = budgets.filter((b: any) => b.month === currentMonth)
  
  // Compute total planned income for the current month
  let totalPlannedIncome = 0
  const incomeCategoryIds = new Set(allCategories.filter(c => c.type === 'INCOME').map(c => c.id))
  
  currentMonthBudgets.forEach(b => {
    if (incomeCategoryIds.has(b.categoryId)) {
      totalPlannedIncome += Number(b.plannedAmount)
    }
  })

  // Patched expense categories with calculated percentages
  const expenseCategories = allCategories
    .filter(c => c.type === 'EXPENSE')
    .map(c => {
      const budgetForCategory = currentMonthBudgets.find(b => b.categoryId === c.id)
      const plannedExpense = budgetForCategory ? Number(budgetForCategory.plannedAmount) : 0
      
      let calculatedPercent = 0
      if (totalPlannedIncome > 0) {
        calculatedPercent = (plannedExpense / totalPlannedIncome) * 100
      }
      
      return {
        id: c.id,
        name: c.name,
        type: c.type,
        color: c.color,
        distributionPercent: calculatedPercent
      }
    })
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Текущий подсчет</h1>
        <p className="text-muted-foreground">Калькулятор распределения дохода по категориям</p>
      </div>

      <AllocationCalculator 
        initialCategories={expenseCategories} 
        totalPlannedIncome={totalPlannedIncome} 
      />
    </div>
  )
}
