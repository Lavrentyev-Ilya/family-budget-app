import { getTransactions } from '@/app/actions/transaction'
import { getCategories } from '@/app/actions/category'
import { getUsers } from '@/app/actions/user'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TransactionForm } from '@/components/TransactionForm'

export const dynamic = 'force-dynamic'

export default async function TransactionsPage() {
  const transactions = await getTransactions() // fetches all if no month provided
  const categories = await getCategories()
  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Транзакции</h1>
          <p className="text-muted-foreground">История ваших доходов и расходов</p>
        </div>
        
        {/* The Create Button / Form Dialog */}
        <div className="flex gap-2">
          <TransactionForm categories={categories} users={users} />
        </div>
      </div>

      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle>Список операций</CardTitle>
          <CardDescription>Все транзакции за выбранный период отображаются ниже.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Название / Заметка</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Кто</TableHead>
                <TableHead className="text-right">Сумма</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 && (
                 <TableRow>
                   <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                     Транзакций не найдено
                   </TableCell>
                 </TableRow>
              )}
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.date.toLocaleDateString('ru-RU')}</TableCell>
                  <TableCell>{t.note || '—'}</TableCell>
                  <TableCell>
                    <span 
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: t.category.color ? `${t.category.color}20` : '#eee', color: t.category.color || '#333' }}
                    >
                      {t.category.name}
                    </span>
                  </TableCell>
                  <TableCell>{t.user?.name || '—'}</TableCell>
                  <TableCell className={`text-right font-medium ${t.type === 'INCOME' ? 'text-green-600' : ''}`}>
                    {t.type === 'INCOME' ? '+' : '-'}{Number(t.amount).toLocaleString('ru-RU')} ₴
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
