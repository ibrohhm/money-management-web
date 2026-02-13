"use client";
import { ReactNode } from "react"
import { TableCell } from "@/components/ui/table"

interface DataTableItemProps {
  value?: any
  className?: string
  children?: ReactNode
}

export function DataTableItem({ value, className, children }: Readonly<DataTableItemProps>) {
  const renderContent = () => {
    if (children) return children
    return value
  }

  return (
    <TableCell className={className}>
      {renderContent()}
    </TableCell>
  )
}
