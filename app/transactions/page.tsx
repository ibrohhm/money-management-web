"use client"

import { useEffect, useState } from "react"
import { DailyTransactions } from "@/components/transactions/daily-transactions"

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

interface ApiResponse {
  success: boolean
  data: Transaction[]
  count: number
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:3001/api/transactions")

        if (!response.ok) {
          throw new Error(`Failed to fetch transactions: ${response.statusText}`)
        }

        const apiResponse: ApiResponse = await response.json()

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

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = transaction.date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(transaction)
    return acc
  }, {} as Record<string, Transaction[]>)

  return (
    <div className="w-full">
      <div className="pb-10">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          View and manage your financial transactions
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {Object.keys(groupedTransactions).length === 0 ? (
            <div className="rounded-lg border p-8 text-center text-muted-foreground">
              No transactions found
            </div>
          ) : (
            Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
              <DailyTransactions
                key={date}
                date={date}
                transactions={dayTransactions}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
