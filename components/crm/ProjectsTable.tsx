'use client'

import { Badge } from '@/components/ui/Badge'
import { SearchableTable, Column } from './SearchableTable'

export interface ProjectRow {
  id: string
  name: string
  pipeline_type: string
  status: string
}

const columns: Column<ProjectRow>[] = [
  { header: 'Project', render: (r) => <span className="font-medium text-gray-900">{r.name}</span> },
  { header: 'Type', render: (r) => <Badge>{r.pipeline_type}</Badge> },
  { header: 'Status', render: (r) => <Badge status={r.status}>{r.status.replace('_', ' ')}</Badge> },
]

export function ProjectsTable({ rows }: { rows: ProjectRow[] }) {
  return (
    <SearchableTable
      rows={rows}
      columns={columns}
      searchPlaceholder="Search projects by name…"
      matches={(row, q) => row.name.toLowerCase().includes(q)}
      getHref={(row) => `/projects/${row.id}`}
      emptyTitle="No projects yet"
      emptyDescription="A project is created automatically once a client or staff member reaches the Active stage."
    />
  )
}
