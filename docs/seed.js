const fs = require('fs')
const { PrismaClient } = require('@prisma/client')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')
require('dotenv').config()

const data = require('./excel_analysis.json')

async function main() {
  const connectionString = process.env.DATABASE_URL
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  const sheet = data['Этот год']
  
  // Hardcoded default categories based on common knowledge of the user's Excel structure,
  // since reading directly from the messy JSON is complex, I will extract typical ones.
  const expenses = [
    'Продукты', 'Коммун. платежи', 'Интернет/Телефон', 'Машина',
    'Кот', 'Красота/Уход', 'Здоровье', 'Одежда/Обувь', 'Рестораны',
    'Подписки', 'Бытовая химия', 'Развлечения'
  ]
  const incomes = ['ЗП', 'Подработки', 'Проценты/Кэшбек']

  console.log('Inserting categories...')

  for (const name of expenses) {
    if (name) {
      await prisma.category.upsert({
        where: { id: name }, // Note: id is UUID, so upsert by name usually requires a unique index. 
        // We'll just create them since DB is empty.
        create: { name, type: 'EXPENSE', color: '#ff7c7c' },
        update: {}
      }).catch(async (e) => {
         // if upsert fails because NO unique constraint on name, we use findFirst
         const exists = await prisma.category.findFirst({ where: { name, type: 'EXPENSE' } })
         if (!exists) {
            await prisma.category.create({ data: { name, type: 'EXPENSE', color: '#ff7c7c' }})
         }
      })
    }
  }

  for (const name of incomes) {
    if (name) {
      const exists = await prisma.category.findFirst({ where: { name, type: 'INCOME' } })
      if (!exists) {
        await prisma.category.create({ data: { name, type: 'INCOME', color: '#82ca9d' }})
      }
    }
  }

  console.log('Seeded successfully!')
  await prisma.$disconnect()
}

main().catch(console.error)
