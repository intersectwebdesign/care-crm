import { UserCog } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { EmptyState } from '@/components/ui/EmptyState'

export default async function ContractorsPage() {
  const supabase = await createClient()

  const [{ data: stages }, { data: contractors }] = await Promise.all([
    supabase.from('pipeline_stages').select('*').eq('pipeline_type', 'staff'),
    supabase
      .from('contractors')
      .select('id, name, current_stage_id, services_position, credentialling_status, phone')
      .order('created_at', { ascending: false }),
  ])

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">Staff</h1>
      <p className="mt-1 text-sm text-gray-500">Application through to active, in order.</p>

      <div className="mt-6">
        {!contractors || contractors.length === 0 ? (
          <EmptyState
            icon={UserCog}
            title="No applicants yet"
            description="New applications from the staff application form will appear here."
          />
        ) : (
          <KanbanBoard
            pipelineType="staff"
            stages={stages ?? []}
            initialEntities={contractors}
            detailBasePath="/contractors"
          />
        )}
      </div>
    </div>
  )
}
