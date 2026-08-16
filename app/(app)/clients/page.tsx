import { createClient } from '@/lib/supabase/server'
import { SearchableTable, Column } from '@/components/crm/SearchableTable'
import { Badge } from '@/components/ui/Badge'

interface ClientRow {
  id: string
  name: string
  phone: string | null
  email: string | null
  funding_source: string | null
  services_position: string | null
  status: string
  stage_name: string | null
}

export default async function ClientsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('clients')
    .select('id, name, phone, email, funding_source, services_position, status, pipeline_stages(name)')
    .order('name')

  const rows: ClientRow[] = (data ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email,
    funding_source: c.funding_source,
    services_position: c.services_position,
    status: c.status,
    stage_name: (c.pipeline_stages as { name: string } | null)?.name ?? null,
  }))

  const columns: Column<ClientRow>[] = [
    { header: 'Name', render: (r) => <span className="font-medium text-gray-900">{r.name}</span> },
    { header: 'Stage', render: (r) => (r.stage_name ? <Badge>{r.stage_name}</Badge> : '—') },
    { header: 'Support needed', render: (r) => r.services_position ?? '—' },
    { header: 'Funding', render: (r) => r.funding_source ?? '—' },
    { header: 'Phone', render: (r) => r.phone ?? '—' },
    { header: 'Status', render: (r) => <Badge status={r.status}>{r.status}</Badge> },
  ]

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">Clients</h1>
      <p className="mt-1 text-sm text-gray-500">Every client on file, regardless of pipeline stage.</p>

      <div className="mt-6">
        <SearchableTable
          rows={rows}
          columns={columns}
          searchPlaceholder="Search clients by name…"
          matches={(row, q) => row.name.toLowerCase().includes(q)}
          getHref={(row) => `/clients/${row.id}`}
          emptyTitle="No clients yet"
          emptyDescription="Clients appear here once they've come through the intake pipeline."
        />
      </div>
    </div>
  )
}
