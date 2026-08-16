import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: client } = await supabase
    .from('clients')
    .select('*, pipeline_stages(name)')
    .eq('id', id)
    .single()

  if (!client) notFound()

  const { data: history } = await supabase
    .from('pipeline_stage_history')
    .select('*, from_stage:pipeline_stages!pipeline_stage_history_from_stage_id_fkey(name), to_stage:pipeline_stages!pipeline_stage_history_to_stage_id_fkey(name)')
    .eq('client_id', id)
    .order('changed_at', { ascending: false })

  const stageName = (client.pipeline_stages as { name: string } | null)?.name

  return (
    <div>
      <Link href="/clients" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
        <ArrowLeft className="h-4 w-4" />
        Back to clients
      </Link>

      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-gray-900">{client.name}</h1>
        {stageName && <Badge>{stageName}</Badge>}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-gray-900">Details</h2>
          </CardHeader>
          <CardBody className="space-y-2 text-sm">
            <Field label="Phone" value={client.phone} />
            <Field label="Email" value={client.email} />
            <Field label="Address" value={client.address} />
            <Field label="Support needed" value={client.services_position} />
            <Field label="Funding source" value={client.funding_source} />
            <Field label="Funding number" value={client.funding_number} />
            <Field label="Representative" value={client.representative_name} />
            <Field label="Representative phone" value={client.representative_phone} />
            <Field label="Intake source" value={client.intake_source} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-gray-900">Stage history</h2>
          </CardHeader>
          <CardBody>
            {!history || history.length === 0 ? (
              <p className="text-sm text-gray-400">No stage moves recorded yet.</p>
            ) : (
              <ul className="space-y-3">
                {history.map((h) => (
                  <li key={h.id} className="text-sm">
                    <p className="text-gray-900">
                      {(h.from_stage as { name: string } | null)?.name ?? 'Start'} →{' '}
                      <span className="font-medium">
                        {(h.to_stage as { name: string } | null)?.name ?? '—'}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(h.changed_at).toLocaleString()} {h.changed_by ? `· ${h.changed_by}` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="text-right text-gray-900">{value}</span>
    </div>
  )
}
