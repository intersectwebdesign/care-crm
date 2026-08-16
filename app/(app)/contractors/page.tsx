import { createClient } from '@/lib/supabase/server'
import { SearchableTable, Column } from '@/components/crm/SearchableTable'
import { Badge } from '@/components/ui/Badge'

interface ContractorRow {
  id: string
  name: string
  phone: string | null
  email: string | null
  credentialling_status: string | null
  services_position: string | null
  status: string
  stage_name: string | null
}

export default async function ContractorsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('contractors')
    .select('id, name, phone, email, credentialling_status, services_position, status, pipeline_stages(name)')
    .order('name')

  const rows: ContractorRow[] = (data ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email,
    credentialling_status: c.credentialling_status,
    services_position: c.services_position,
    status: c.status,
    stage_name: (c.pipeline_stages as { name: string } | null)?.name ?? null,
  }))

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

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">Staff</h1>
      <p className="mt-1 text-sm text-gray-500">Every staff member on file, regardless of pipeline stage.</p>

      <div className="mt-6">
        <SearchableTable
          rows={rows}
          columns={columns}
          searchPlaceholder="Search staff by name…"
          matches={(row, q) => row.name.toLowerCase().includes(q)}
          getHref={(row) => `/contractors/${row.id}`}
          emptyTitle="No staff on file yet"
          emptyDescription="Staff appear here once they've come through the intake pipeline."
        />
      </div>
    </div>
  )
}
