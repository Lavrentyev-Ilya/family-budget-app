'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: [
      { type: 'asc' },
      { sortOrder: 'asc' },
      { name: 'asc' }
    ]
  })
}

export async function createCategory(data: { name: string, type: 'INCOME' | 'EXPENSE', color?: string, distributionPercent?: number }) {
  const category = await prisma.category.create({
    data
  })
  revalidatePath('/')
  return category
}

export async function updateCategory(id: string, data: { name?: string, color?: string, distributionPercent?: number | null }) {
  const category = await prisma.category.update({
    where: { id },
    data
  })
  revalidatePath('/')
  return category
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } })
  revalidatePath('/')
}
