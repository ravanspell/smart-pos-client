"use client"

import * as React from "react"
import { Column } from "@tanstack/react-table"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/atoms/Button"

interface SortableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  className?: string
}

export function SortableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: SortableColumnHeaderProps<TData, TValue>) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-2"
      >
        <span>{title}</span>
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  )
}