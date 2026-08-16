import { Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { EmptyState } from '@/components/ui/EmptyState'

export default async function ClientsPage() {
  const supabase = await createClient()

  const [{ data: stages }, { data: clients }] = await Promise.all([
    supabase.from('pipeline_stages').select('*').eq('pipeline_type', 'client'),
    supabase
      .from('clients')
      .select('id, name, current_stage_id, services_position, funding_source, phone')
      .order('created_at', { ascending: false }),
  ])

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">Clients</h1>
      <p className="mt-1 text-sm text-gray-500">Referral through to active care, in order.</p>

      <div className="mt-6">
        {!clients || clients.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No clients yet"
            description="New referrals from the client intake form will appear here."
          />
        ) : (
          <KanbanBoard
            pipelineType="client"
            stages={stages ?? []}
            initialEntities={clients}
            detailBasePath="/clients"
          />
        )}
      </div>
    </div>
  )
}
