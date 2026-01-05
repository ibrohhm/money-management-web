import { useState, useEffect } from 'react'
import { Transaction } from '@/lib/types/transactions'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Category {
  id: string
  name: string
  type: string
}

interface Account {
  id: string
  name: string
}

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
  const [formData, setFormData] = useState<Transaction | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loadingAccounts, setLoadingAccounts] = useState(false)
  const [dateValue, setDateValue] = useState('')
  const [timeValue, setTimeValue] = useState('')

  useEffect(() => {
    if (open) {
      if (transaction) {
        setFormData(transaction)
        // Split datetime into date and time
        const [date, time] = transaction.date.split('T')
        setDateValue(date || '')
        setTimeValue(time?.substring(0, 5) || '00:00') // Extract HH:mm
      } else {
        // Initialize empty form for new transaction
        const now = new Date()
        const date = now.toISOString().split('T')[0]
        const time = now.toTimeString().substring(0, 5)
        setDateValue(date)
        setTimeValue(time)
        setFormData({
          id: '',
          description: '',
          amount: 0,
          type: 'expense',
          category_id: '',
          category_name: '',
          account_id: '',
          account_name: '',
          date: now.toISOString(),
          currency: 'IDR'
        })
      }
    }
  }, [transaction, open])

  useEffect(() => {
    if (formData?.type) {
      const fetchCategories = async () => {
        try {
          setLoadingCategories(true)
          const response = await fetch(`${process.env.NEXT_PUBLIC_MONEY_MANAGEMENT_API_URL}/api/categories?type=${formData.type}`)

          if (!response.ok) {
            throw new Error('Failed to fetch categories')
          }

          const data = await response.json()
          setCategories(data.data || [])
        } catch (error) {
          console.error('Error fetching categories:', error)
          setCategories([])
        } finally {
          setLoadingCategories(false)
        }
      }

      fetchCategories()
    }
  }, [formData?.type])

  useEffect(() => {
    if (open) {
      const fetchAccounts = async () => {
        try {
          setLoadingAccounts(true)
          const response = await fetch(`${process.env.NEXT_PUBLIC_MONEY_MANAGEMENT_API_URL}/api/accounts`)

          if (!response.ok) {
            throw new Error('Failed to fetch accounts')
          }

          const data = await response.json()
          setAccounts(data.data || [])
        } catch (error) {
          console.error('Error fetching accounts:', error)
          setAccounts([])
        } finally {
          setLoadingAccounts(false)
        }
      }

      fetchAccounts()
    }
  }, [open])

  if (!formData) return null

  const isFormValid = () => {
    return (
      formData.description.trim() !== '' &&
      formData.amount !== 0 &&
      formData.category_id !== '' &&
      formData.account_id !== '' &&
      dateValue !== '' &&
      timeValue !== ''
    )
  }

  const handleSave = () => {
    // Combine date and time back into datetime format
    const datetime = `${dateValue}T${timeValue}:00`

    const payload = {
      ...formData,
      date: datetime
    }

    console.log('Saving transaction:', payload)
    // TODO: Add API call here
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{formData.id === '' ? 'Add' : 'Edit'} Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="description" className="pb-2">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type" className="pb-2">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "income" | "expense") => {
                  setFormData({
                    ...formData,
                    type: value,
                    amount: value === "income" ? Math.abs(formData.amount) : -Math.abs(formData.amount)
                  })
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount" className="pb-2">Amount ({formData.currency})</Label>
              <Input
                id="amount"
                type="number"
                value={Math.abs(formData.amount)}
                onChange={(e) => setFormData({
                  ...formData,
                  amount: formData.type === "income" ? parseFloat(e.target.value) : -parseFloat(e.target.value)
                })}
                className={formData.type === "income" ? "text-green-600" : "text-red-600"}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="pb-2">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => {
                  const selectedCategory = categories.find(c => c.id === value)
                  setFormData({
                    ...formData,
                    category_id: value,
                    category_name: selectedCategory?.name || ''
                  })
                }}
                disabled={loadingCategories}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loadingCategories ? "Loading..." : "Select category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="account" className="pb-2">Account</Label>
              <Select
                value={formData.account_id}
                onValueChange={(value) => {
                  const selectedAccount = accounts.find(a => a.id === value)
                  setFormData({
                    ...formData,
                    account_id: value,
                    account_name: selectedAccount?.name || ''
                  })
                }}
                disabled={loadingAccounts}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loadingAccounts ? "Loading..." : "Select account"} />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="pb-2">Date</Label>
              <Input
                id="date"
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="time" className="pb-2">Time</Label>
              <Input
                id="time"
                type="time"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
              />
            </div>
            <div></div>
          </div>
        </div>

        <DialogFooter>
          <Button className="cursor-pointer" onClick={handleSave} disabled={!isFormValid()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
