'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { name: 'asc' }
  })
}

export async function createUser(name: string) {
  const user = await prisma.user.create({
    data: { name }
  })
  revalidatePath('/')
  return user
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } })
  revalidatePath('/')
}
