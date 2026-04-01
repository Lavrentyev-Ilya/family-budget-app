'use client'

import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface ExpenseData {
  name: string
  color: string
  value: number
}

export function ExpenseChart({ data }: { data: ExpenseData[] }) {
  if (data.length === 0) {
    return (
      <Card className="col-span-full xl:col-span-2">
        <CardHeader>
          <CardTitle>Структура расходов</CardTitle>
          <CardDescription>В этом месяце еще нет записей</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle>Структура расходов</CardTitle>
        <CardDescription>По категориям</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#cccccc'} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [`${Number(value).toLocaleString('ru-RU')} ₴`, 'Сумма']}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
