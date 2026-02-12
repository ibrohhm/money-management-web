import { Category } from "./categories"
import { Account } from "./accounts"

export interface Transaction {
  id: string
  transaction_at: string
  description: string
  amount: number
  user_id: number
  category_id: number
  account_id: number
  transaction_type: string
  currency: string
}

export interface TransactionResponse {
  id: string
  transaction_at: string
  description: string
  amount: number
  user_id: number
  category: Category
  account: Account
  transaction_type: string
  currency: string
}

export interface TransactionGroup {
  date: string
  total_income: number
  total_expense: number
  net_total: number
  transaction_count: number
  transactions: TransactionResponse[]
}

export interface ApiTransactionGroupResponse {
  success: boolean
  data: TransactionGroup[]
}
