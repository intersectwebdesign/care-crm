'use client'

import { Badge } from '@/components/ui/Badge'
import { SearchableTable, Column } from './SearchableTable'

export interface ClientRow {
  id: string
  name: string
  phone: string | null
  email: string | null
  funding_source: string | null
  services_position: string | null
  status: string
  stage_name: string | null
}

const columns: Column<ClientRow>[] = [
  { header: 'Name', render: (r) => <span className="font-medium text-gray-900">{r.name}</span> },
  { header: 'Stage', render: (r) => (r.stage_name ? <Badge>{r.stage_name}</Badge> : '—') },
  { header: 'Support needed', render: (r) => r.services_position ?? '—' },
  { header: 'Funding', render: (r) => r.funding_source ?? '—' },
  { header: 'Phone', render: (r) => r.phone ?? '—' },
  { header: 'Status', render: (r) => <Badge status={r.status}>{r.status}</Badge> },
]

export function ClientsTable({ rows }: { rows: ClientRow[] }) {
  return (
    <SearchableTable
      rows={rows}
      columns={columns}
      searchPlaceholder="Search clients by name…"
      matches={(row, q) => row.name.toLowerCase().includes(q)}
      getHref={(row) => `/clients/${row.id}`}
      emptyTitle="No clients yet"
      emptyDescription="Clients appear here once they've come through the intake pipeline."
    />
  )
}
