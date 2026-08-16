'use client'

import { ReactNode, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'

export interface Column<T> {
  header: string
  render: (row: T) => ReactNode
  className?: string
}

interface SearchableTableProps<T extends { id: string }> {
  rows: T[]
  columns: Column<T>[]
  searchPlaceholder: string
  matches: (row: T, query: string) => boolean
  getHref: (row: T) => string
  emptyTitle: string
  emptyDescription?: string
}

export function SearchableTable<T extends { id: string }>({
  rows,
  columns,
  searchPlaceholder,
  matches,
  getHref,
  emptyTitle,
  emptyDescription,
}: SearchableTableProps<T>) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const filtered = useMemo(() => {
    if (!query.trim()) return rows
    return rows.filter((row) => matches(row, query.trim().toLowerCase()))
  }, [rows, query, matches])

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div>
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              {columns.map((col) => (
                <th key={col.header} className={`px-4 py-2.5 ${col.className ?? ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((row) => (
              <tr
                key={row.id}
                onClick={() => router.push(getHref(row))}
                className="cursor-pointer hover:bg-gray-50"
              >
                {columns.map((col) => (
                  <td key={col.header} className={`px-4 py-3 ${col.className ?? ''}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-gray-400">No matches for &ldquo;{query}&rdquo;.</p>
        )}
      </div>
    </div>
  )
}
