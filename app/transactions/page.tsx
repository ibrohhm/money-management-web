"use client"

import { useEffect, useState } from "react"
import { DailyTransactions } from "@/components/transactions/daily-transactions"
import { Transaction, TransactionGroup, ApiTransactionGroupResponse } from '@/lib/types/transactions'
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import { TransactionDetailDialog } from "@/components/transactions/transaction-detail-dialog"

export default function TransactionsPage() {
  const [transactionGroups, setTransactions] = useState<TransactionGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_MONEY_MANAGEMENT_API_URL}/api/transactions`)

        if (!response.ok) {
          throw new Error(`Failed to fetch transactions: ${response.statusText}`)
        }

        const apiResponse: ApiTransactionGroupResponse = await response.json()

        if (apiResponse.success) {
          setTransactions(apiResponse.data)
          setError(null)
        } else {
          throw new Error("API returned unsuccessful response")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching transactions:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setDialogOpen(true)
  }

  return (
    <div className="w-full relative">
      <LoadingOverlay isLoading={loading} />
      <TransactionDetailDialog
        transaction={selectedTransaction}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <div className="pb-10">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          View and manage your financial transactions
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {transactionGroups.length === 0 ? (
            <div className="rounded-lg border p-8 text-center text-muted-foreground">
              No transactions found
            </div>
          ) : (
            transactionGroups.map((trx) => (
              <DailyTransactions
                key={trx.date}
                date={trx.date}
                transactions={trx.transactions}
                onTransactionClick={handleTransactionClick}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
