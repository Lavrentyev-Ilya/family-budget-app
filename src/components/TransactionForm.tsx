'use client'

import React, { useState } from 'react'
import { createTransaction } from '@/app/actions/transaction'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function TransactionForm({ 
  categories, 
  users 
}: { 
  categories: any[], 
  users: any[] 
}) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // form state
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [userId, setUserId] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !categoryId) return

    setIsLoading(true)
    try {
      await createTransaction({
        amount: parseFloat(amount),
        date: new Date(date),
        type,
        categoryId,
        userId: userId || undefined,
        note
      })
      setOpen(false) // close dialog
      // reset form
      setAmount('')
      setNote('')
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCategories = categories.filter(c => c.type === type)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <span className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer">
          + Добавить
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новая транзакция</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
                type="button"
                variant={type === 'EXPENSE' ? 'default' : 'outline'}
                onClick={() => setType('EXPENSE')}
            >
              Расход
            </Button>
            <Button 
                type="button"
                variant={type === 'INCOME' ? 'default' : 'outline'}
                onClick={() => setType('INCOME')}
            >
              Доход
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Сумма (₴)</label>
            <Input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Категория</label>
            <Select value={categoryId} onValueChange={(val) => setCategoryId(val || '')} required>
              <SelectTrigger>
                <SelectValue placeholder="Выберите..." />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Дата</label>
            <Input type="date" required value={date} onChange={e => setDate(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Кто (опционально)</label>
            <Select value={userId} onValueChange={(val) => setUserId(val || '')}>
              <SelectTrigger>
                <SelectValue placeholder="Никто / Общее" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Никто / Общее</SelectItem>
                {users.map(u => (
                  <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Заметка</label>
            <Input type="text" value={note} onChange={e => setNote(e.target.value)} />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  )
}
