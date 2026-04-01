'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'

export function AllocationCalculator({ 
  initialCategories,
  totalPlannedIncome = 0
}: { 
  initialCategories: any[],
  totalPlannedIncome?: number
}) {
  const [total, setTotal] = useState<number>(0)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [isMounted, setIsMounted] = useState(false)

  // Load from offline storage
  React.useEffect(() => {
    setIsMounted(true)
    const savedTotal = localStorage.getItem('budget_allocation_total')
    if (savedTotal) setTotal(parseFloat(savedTotal))
    
    const savedChecks = localStorage.getItem('budget_allocation_checks')
    if (savedChecks) setCheckedItems(JSON.parse(savedChecks))
  }, [])

  // Sync state changes to offline storage
  React.useEffect(() => {
    if (isMounted) {
      localStorage.setItem('budget_allocation_total', total.toString())
      localStorage.setItem('budget_allocation_checks', JSON.stringify(checkedItems))
    }
  }, [total, checkedItems, isMounted])

  const toggleCheck = (categoryId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  // Calculate stats
  const totalAllocated = initialCategories.reduce((sum, c) => sum + (c.distributionPercent || 0), 0)
  let allocatedMoney = 0
  let spentSoFar = 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Общая сумма к распределению</CardTitle>
          <CardDescription>Введите сумму дохода, чтобы подсчитать отчисления по категориям</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 max-w-sm">
            <span className="text-xl font-bold">₴</span>
            <Input 
              type="number" 
              className="text-lg"
              placeholder="100000"
              value={total || ''}
              onChange={e => setTotal(parseFloat(e.target.value) || 0)} 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Распределение по категориям</CardTitle>
          <CardDescription>
            Проценты высчитываются автоматически из Бюджета текущего месяца. Сумма всех процентов: {totalAllocated.toFixed(2)}%
            {totalPlannedIncome === 0 && (
               <span className="block text-red-500 mt-2 font-medium bg-red-50 p-2 rounded">
                 ⚠️ Вы не запланировали Доходы на текущий месяц во вкладке "Бюджет". Проценты равны нулю.
               </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto w-full pb-4">
            <Table className="min-w-[400px]">
              <TableHeader>
              <TableRow>
                <TableHead className="w-12">✅</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead className="w-32">Доля (%)</TableHead>
                <TableHead className="text-right">Сумма (₴)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialCategories.map((c) => {
                const percent = c.distributionPercent || 0
                const amount = Math.round((total * percent) / 100)
                if (percent > 0) allocatedMoney += amount
                if (checkedItems[c.id]) spentSoFar += amount

                return (
                  <TableRow key={c.id} className={checkedItems[c.id] ? "opacity-50" : ""}>
                    <TableCell>
                      <Checkbox 
                        checked={!!checkedItems[c.id]} 
                        onCheckedChange={() => toggleCheck(c.id)} 
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {c.name}
                      <span className="text-xs text-muted-foreground block">{c.type === 'INCOME' ? 'Доход' : 'Расход'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-muted-foreground">{percent.toFixed(1)}%</span>
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg">
                      {amount.toLocaleString('ru-RU')}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          </div>

          <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center rounded-lg bg-muted p-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Не распределено (Остаток)</p>
              <h3 className="text-2xl font-bold">{Math.round(total - allocatedMoney).toLocaleString('ru-RU')} ₴</h3>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm font-medium text-muted-foreground">Отложено / Потрачено (✅)</p>
              <h3 className="text-2xl font-bold text-green-600">{spentSoFar.toLocaleString('ru-RU')} ₴</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
