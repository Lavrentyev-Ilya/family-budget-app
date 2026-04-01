'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Helper: convert Prisma Decimal fields to plain Numbers
function serializeBudget(b: any) {
  return {
    id: b.id,
    categoryId: b.categoryId,
    month: b.month,
    year: b.year,
    plannedAmount: Number(b.plannedAmount),
  }
}

export async function getBudgets(year: number) {
  const budgets = await prisma.budget.findMany({
    where: { year },
  })
  return budgets.map(serializeBudget)
}

export async function upsertBudget(data: {
  categoryId: string
  month: number
  year: number
  plannedAmount: number
}) {
  const budget = await prisma.budget.upsert({
    where: {
      categoryId_month_year: {
        categoryId: data.categoryId,
        month: data.month,
        year: data.year
      }
    },
    update: {
      plannedAmount: data.plannedAmount
    },
    create: {
      ...data,
      plannedAmount: data.plannedAmount
    }
  })
  
  revalidatePath('/', 'layout')
  return serializeBudget(budget)
}
