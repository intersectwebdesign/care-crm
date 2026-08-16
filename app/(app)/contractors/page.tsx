import { createClient } from '@/lib/supabase/server'
import { ContractorsTable, ContractorRow } from '@/components/crm/ContractorsTable'

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

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">Staff</h1>
      <p className="mt-1 text-sm text-gray-500">Every staff member on file, regardless of pipeline stage.</p>

      <div className="mt-6">
        <ContractorsTable rows={rows} />
      </div>
    </div>
  )
}
