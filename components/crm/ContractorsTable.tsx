'use client'

import { Badge } from '@/components/ui/Badge'
import { SearchableTable, Column } from './SearchableTable'

export interface ContractorRow {
  id: string
  name: string
  phone: string | null
  email: string | null
  credentialling_status: string | null
  services_position: string | null
  status: string
  stage_name: string | null
}

const columns: Column<ContractorRow>[] = [
  { header: 'Name', render: (r) => <span className="font-medium text-gray-900">{r.name}</span> },
  { header: 'Stage', render: (r) => (r.stage_name ? <Badge>{r.stage_name}</Badge> : '—') },
  { header: 'Position', render: (r) => r.services_position ?? '—' },
  {
    header: 'Credentialing',
    render: (r) => (r.credentialling_status ? <Badge status={r.credentialling_status}>{r.credentialling_status}</Badge> : '—'),
  },
  { header: 'Phone', render: (r) => r.phone ?? '—' },
  { header: 'Status', render: (r) => <Badge status={r.status}>{r.status}</Badge> },
]

export function ContractorsTable({ rows }: { rows: ContractorRow[] }) {
  return (
    <SearchableTable
      rows={rows}
      columns={columns}
      searchPlaceholder="Search staff by name…"
      matches={(row, q) => row.name.toLowerCase().includes(q)}
      getHref={(row) => `/contractors/${row.id}`}
      emptyTitle="No staff on file yet"
      emptyDescription="Staff appear here once they've come through the intake pipeline."
    />
  )
}
