import { Transaction } from '@/lib/types/transactions'
import { colors } from '@/lib/colors'

interface DailyTransactionsProps {
  date: string
  transactions: Transaction[]
  onTransactionClick?: (transaction: Transaction) => void
}

export function DailyTransactions({ date, transactions, onTransactionClick }: DailyTransactionsProps) {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const currency = transactions[0]?.currency || "IDR"

  const [year, month, day] = date.split('-')
  const formattedDate = `${month}/${year}`

  return (
    <div className="space-y-2 border">
      <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-3">
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold">{day}</h3>
          <span className="text-sm text-muted-foreground">{formattedDate}</span>
        </div>
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Income:</span>
            <span className="font-medium" style={{ color: colors.marine }}>
              +{currency} {totalIncome.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Expense:</span>
            <span className="font-medium" style={{ color: colors.coral }}>
              -{currency} {totalExpense.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="divide-y">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="grid grid-cols-[150px_1fr_150px] items-center gap-4 px-4 py-1 hover:bg-muted/30 cursor-pointer" onClick={() => onTransactionClick?.(transaction)}>
            <div>
              <p className="font-medium text-sm text-muted-foreground">{transaction.category_name}</p>
            </div>
            <div>
              <p className="font-medium">{transaction.description}</p> 
              <div className="mt-1 text-sm text-muted-foreground">
                <span>{transaction.account_name}</span>
              </div>
            </div>
            <div className="text-right">
              <span
                className="font-medium"
                style={{ color: transaction.type === "income" ? colors.marine : colors.coral }}
              >
                {transaction.type === "income" ? "+" : "-"}
                {transaction.currency} {Math.abs(transaction.amount).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
