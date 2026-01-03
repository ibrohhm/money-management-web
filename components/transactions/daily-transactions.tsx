
interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  category_id: string
  category_name: string
  account_id: string
  account_name: string
  type: "income" | "expense"
  currency: string
}

interface DailyTransactionsProps {
  date: string
  transactions: Transaction[]
}

export function DailyTransactions({ date, transactions }: DailyTransactionsProps) {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const currency = transactions[0]?.currency || "IDR"

  return (
    <div className="space-y-2 border">
      <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-3">
        <h3 className="font-semibold">{date}</h3>
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Income:</span>
            <span className="font-medium text-green-600">
              +{currency} {totalIncome.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Expense:</span>
            <span className="font-medium text-red-600">
              -{currency} {totalExpense.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="divide-y">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="grid grid-cols-[150px_1fr_150px] items-center gap-4 px-4 py-1 hover:bg-muted/30">
            <div>
              <p className="font-medium">{transaction.category_name}</p>
            </div>
            <div>
              <p className="font-medium">{transaction.description}</p> 
              <div className="mt-1 text-sm text-muted-foreground">
                <span>{transaction.account_name}</span>
              </div>
            </div>
            <div className="text-right">
              <span className={transaction.type === "income" ? "font-medium text-green-600" : "font-medium text-red-600"}>
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
