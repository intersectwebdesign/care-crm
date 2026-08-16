import { createClient } from '@/lib/supabase/server'
import { ClientsTable, ClientRow } from '@/components/crm/ClientsTable'

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

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">Clients</h1>
      <p className="mt-1 text-sm text-gray-500">Every client on file, regardless of pipeline stage.</p>

      <div className="mt-6">
        <ClientsTable rows={rows} />
      </div>
    </div>
  )
}
