export interface Transaction {
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

export interface TransactionGroup {
  date: string
  total_income: number
  total_expense: number
  net_total: number
  transaction_count: number
  transactions: Transaction[]
}

export interface ApiTransactionGroupResponse {
  success: boolean
  data: TransactionGroup[]
}
