'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getTransactions(month?: number, year?: number) {
  let whereClause = {}
  
  if (month && year) {
    // month is 1-12
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59, 999) // end of the month
    
    whereClause = {
      date: {
        gte: startDate,
        lte: endDate
      }
    }
  }

  return await prisma.transaction.findMany({
    where: whereClause,
    orderBy: { date: 'desc' },
    include: {
      category: true,
      user: true
    }
  })
}

export async function createTransaction(data: {
  amount: number
  date: Date
  note?: string
  type: 'INCOME' | 'EXPENSE'
  categoryId: string
  userId?: string
}) {
  const transaction = await prisma.transaction.create({
    data: {
      ...data,
      amount: data.amount // Decimal handles numbers
    }
  })
  revalidatePath('/')
  return transaction
}

export async function deleteTransaction(id: string) {
  await prisma.transaction.delete({ where: { id } })
  revalidatePath('/')
}
