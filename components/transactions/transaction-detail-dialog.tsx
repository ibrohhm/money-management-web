import { Transaction } from '@/lib/types/transactions'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TransactionDetailDialogProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionDetailDialog({
  transaction,
  open,
  onOpenChange
}: TransactionDetailDialogProps) {
  if (!transaction) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="font-medium">{transaction.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                {transaction.type === "income" ? "+" : "-"}
                {transaction.currency} {Math.abs(transaction.amount).toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium capitalize">{transaction.type}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{transaction.category_name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Account</p>
              <p className="font-medium">{transaction.account_name}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-medium">
              {new Date(transaction.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Transaction ID</p>
            <p className="font-mono text-sm">{transaction.id}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
