'use server'

import prisma from '@/lib/prisma'

export async function getMonthlyStats(month: number, year: number) {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0, 23, 59, 59, 999)

  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      category: true
    }
  })

  let totalIncome = 0
  let totalExpense = 0
  const expensesByCategory: Record<string, { name: string, color: string, value: number }> = {}

  for (const t of transactions) {
    const amount = Number(t.amount)
    
    if (t.type === 'INCOME') {
      totalIncome += amount
    } else {
      totalExpense += amount
      
      const catId = t.categoryId
      if (!expensesByCategory[catId]) {
        expensesByCategory[catId] = {
          name: t.category.name,
          color: t.category.color || '#cccccc',
          value: 0
        }
      }
      expensesByCategory[catId].value += amount
    }
  }

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    expensesByCategory: Object.values(expensesByCategory).sort((a, b) => b.value - a.value)
  }
}
