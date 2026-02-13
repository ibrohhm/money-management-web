"use client"

import { ReactNode } from "react"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface DataTableHeader{
  label: string
  className?: string
}

interface DataTableProps {
  headers: DataTableHeader[]
  note?: string
  children?: ReactNode
}
export function DataTable({headers, note, children}: Readonly<DataTableProps>){
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {headers.map((header) => (
              <TableHead key={header.label} className={`h-12 ${header.className ?? ""}`}>
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {children}
        </TableBody>
      </Table>
      {note && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-sm text-muted-foreground">
            {note}
          </p>
        </div>
      )}
    </div>
  )
}