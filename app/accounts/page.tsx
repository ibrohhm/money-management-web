"use client";
import { useEffect, useState } from "react"
import { Account, ApiAccountsResponse } from "@/lib/types/accounts"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import { TableRow } from "@/components/ui/table"
import { DataTableItem } from "@/components/base/data-table-item";
import { DataTableHeader, DataTable } from "@/components/base/data-table";
import { Badge } from "@/components/ui/badge"

const headers: DataTableHeader[] = [
  { label: "Name", className: "pl-4" },
  { label: "Account Group" },
  { label: "User ID" },
]

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_MONEY_MANAGEMENT_API_URL}/api/accounts`)
        if (!response.ok) {
          throw new Error(`Failed to fetch accounts: ${response.statusText}`)
        }

        const apiResponse: ApiAccountsResponse = await response.json()
        if (apiResponse.success) {
          setAccounts(apiResponse.data)
          setError(null)
        } else {
          throw new Error("API returned unsuccessful response")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching accounts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [])

  return (
    <div className="w-full relative">
      <LoadingOverlay isLoading={loading} />

      <div className="pb-10">
        <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
        <p className="text-muted-foreground">
          View and manage your accounts
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        accounts.length === 0 ? (
          <div className="rounded-lg border p-8 text-center text-muted-foreground">
            No accounts found
          </div>
        ) : (
          <DataTable headers={headers} note={`${accounts.length} account(s) total`}>
            {accounts.map((account) => (
              <TableRow key={account.id} className="h-14">
                <DataTableItem className={"pl-4 font-medium"}>{account.name}</DataTableItem>
                <DataTableItem>
                  <Badge variant="outline" className={"rounded-md font-normal"}>{`Group ${account.account_group_id}`}</Badge>
                </DataTableItem>
                <DataTableItem className={"text-muted-foreground"}>{account.user_id}</DataTableItem>
              </TableRow>
            ))}
          </DataTable>
        )
      )}
    </div>
  );
}
