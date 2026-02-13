"use client"

import { ReactNode } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"

export interface DataTableColumn<T> {
  key: string
  label: string
  className?: string
  render?: (item: T) => ReactNode
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  keyField: keyof T
  actions?: (item: T) => ReactNode
  emptyMessage?: string
}

export function DataTable<T>({
  columns,
  data,
  keyField,
  actions,
  emptyMessage = "No data found",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {columns.map((col) => (
              <TableHead key={col.key} className={`h-12 first:pl-4 ${col.className ?? ""}`}>
                {col.label}
              </TableHead>
            ))}
            {actions && (
              <TableHead className="h-12 w-10 pr-4">
                <span className="sr-only">Actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={String(item[keyField])} className="h-14">
              {columns.map((col) => (
                <TableCell key={col.key} className={`first:pl-4 ${col.className ?? ""}`}>
                  {col.render ? col.render(item) : String(item[col.key as keyof T] ?? "")}
                </TableCell>
              ))}
              {actions && (
                <TableCell className="pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {actions(item)}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between border-t px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {data.length} row(s) total
        </p>
      </div>
    </div>
  )
}
