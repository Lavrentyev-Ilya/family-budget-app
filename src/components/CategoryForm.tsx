'use client'

import React, { useState } from 'react'
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/category'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit2 } from 'lucide-react'

export function CategoryForm({ 
  initialCategory 
}: { 
  initialCategory?: { id: string, name: string, type: string, color: string | null }
}) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // form state
  const isEditing = !!initialCategory
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>(initialCategory?.type as any || 'EXPENSE')
  const [name, setName] = useState(initialCategory?.name || '')
  const [color, setColor] = useState(initialCategory?.color || '#8884d8')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    setIsLoading(true)
    try {
      if (isEditing) {
        await updateCategory(initialCategory.id, { name, color })
      } else {
        await createCategory({ name, type, color })
        setName('')
      }
      setOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!isEditing) return
    if (!confirm('Вы уверены, что хотите удалить эту категорию? Транзакции могут остаться без категории.')) return
    
    setIsLoading(true)
    try {
      await deleteCategory(initialCategory.id)
      setOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {isEditing ? (
          <span className="p-2 cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground rounded-full flex items-center justify-center">
            <Edit2 className="w-4 h-4" />
          </span>
        ) : (
          <span className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer">
            + Добавить категорию
          </span>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Редактировать категорию' : 'Новая категория'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEditing && (
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
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Название</label>
            <Input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Например: Продукты" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Цвет (для графиков)</label>
            <Input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-10 p-1 w-full" />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
            {isEditing && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
                Удалить
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
