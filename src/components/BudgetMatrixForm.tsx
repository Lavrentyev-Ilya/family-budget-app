'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { upsertBudget } from '@/app/actions/budget'

const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

export function BudgetMatrixForm({
  categories,
  initialBudgets,
  currentYear
}: {
  categories: any[]
  initialBudgets: any[]
  currentYear: number
}) {
  // Map to easily find budget by categoryId and month
  // Key format: `${categoryId}_${month}` (month is 1-12)
  const [budgetMap, setBudgetMap] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {}
    for (const b of initialBudgets) {
      map[`${b.categoryId}_${b.month}`] = Number(b.plannedAmount)
    }
    return map
  })
  
  const [isSaving, setIsSaving] = useState<string | null>(null)

  const handleAmountChange = (categoryId: string, monthIndex: number, newValueString: string) => {
    const month = monthIndex + 1
    const key = `${categoryId}_${month}`
    
    let amount = parseFloat(newValueString)
    if (isNaN(amount) || amount < 0) amount = 0

    // Optimistic UI update
    setBudgetMap(prev => ({
      ...prev,
      [key]: amount
    }))

    setIsSaving(key)

    // Debounce save to database
    if ((window as any)._budgetSaveTimeoutMatrix) clearTimeout((window as any)._budgetSaveTimeoutMatrix)
    ;(window as any)._budgetSaveTimeoutMatrix = setTimeout(async () => {
      try {
        await upsertBudget({
          categoryId,
          month,
          year: currentYear,
          plannedAmount: amount
        })
      } catch (err) {
        console.error("Failed to save budget:", err)
      } finally {
        setIsSaving(null)
      }
    }, 500)
  }

  const renderTableRows = (title: string, list: any[]) => {
    if (list.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={13} className="text-center py-6 text-muted-foreground border-r font-medium sticky left-0 bg-background z-10">
            Нет категорий {title.toLowerCase()}
          </TableCell>
        </TableRow>
      )
    }

    return (
      <>
        <TableRow className="bg-muted/50">
          <TableCell colSpan={13} className="font-bold py-2 sticky left-0 z-20 bg-muted/50 border-r">{title}</TableCell>
        </TableRow>
        {list.map(cat => (
          <TableRow key={cat.id} className="group">
            <TableCell className="font-medium sticky left-0 bg-background z-10 shadow-[1px_0_0_0_#e5e7eb] dark:shadow-[1px_0_0_0_#262626]">
              {cat.name}
            </TableCell>
            {months.map((_, i) => {
              const key = `${cat.id}_${i + 1}`
              const amount = budgetMap[key] || 0
              return (
                <TableCell key={i} className="p-1 min-w-[100px] relative">
                  <Input 
                    type="number"
                    min="0"
                    step="100"
                    value={amount === 0 ? '' : amount}
                    placeholder="0"
                    onChange={(e) => handleAmountChange(cat.id, i, e.target.value)}
                    className="h-9 w-full rounded-sm border-transparent group-hover:border-input focus:border-input bg-transparent hover:bg-muted/50 focus:bg-background transition-colors text-right pr-2"
                  />
                  {isSaving === key && <span className="absolute top-0 right-1 text-[8px] text-muted-foreground opacity-70">сохр...</span>}
                </TableCell>
              )
            })}
          </TableRow>
        ))}
      </>
    )
  }

  const expenses = categories.filter(c => c.type === 'EXPENSE')
  const incomes = categories.filter(c => c.type === 'INCOME')

  return (
    <Card className="overflow-x-auto w-full">
      <CardHeader>
        <CardTitle>Месячный план затрат и доходов</CardTitle>
        <CardDescription>
          Заполняйте ожидаемые суммы доходов и расходов. Все изменения автоматически сохраняются в базу данных как в Excel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table className="min-w-[1200px] border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="w-48 sticky left-0 bg-background z-20 shadow-[1px_0_0_0_#e5e7eb] dark:shadow-[1px_0_0_0_#262626]">
                Категория
              </TableHead>
              {months.map((m, i) => (
                <TableHead key={i} className="text-right min-w-[100px]">{m}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderTableRows('💸 Доходы', incomes)}
            {renderTableRows('🛒 Расходы', expenses)}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
