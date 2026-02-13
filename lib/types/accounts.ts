export interface Account {
  id: number
  name: string
  account_group_id: number
  user_id: number
}

export interface ApiAccountsResponse {
  success: boolean
  data: Account[]
}