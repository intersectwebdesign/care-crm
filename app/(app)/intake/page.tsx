import { createClient } from '@/lib/supabase/server'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { Inbox } from 'lucide-react'

export default async function IntakePage() {
  const supabase = await createClient()

  const [{ data: clientStages }, { data: clients }, { data: staffStages }, { data: contractors }] =
    await Promise.all([
      supabase.from('pipeline_stages').select('*').eq('pipeline_type', 'client'),
      supabase
        .from('clients')
        .select('id, name, current_stage_id, services_position, funding_source, phone')
        .order('created_at', { ascending: false }),
      supabase.from('pipeline_stages').select('*').eq('pipeline_type', 'staff'),
      supabase
        .from('contractors')
        .select('id, name, current_stage_id, services_position, credentialling_status, phone')
        .order('created_at', { ascending: false }),
    ])

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">Intake</h1>
      <p className="mt-1 text-sm text-gray-500">New referrals and applications, moving through the pipeline.</p>

      <div className="mt-6">
        <Tabs
          tabs={[
            {
              id: 'clients',
              label: 'Client referrals',
              content:
                !clients || clients.length === 0 ? (
                  <EmptyState
                    icon={Inbox}
                    title="No referrals yet"
                    description="New submissions from the client referral form will appear here."
                  />
                ) : (
                  <KanbanBoard
                    pipelineType="client"
                    stages={clientStages ?? []}
                    initialEntities={clients}
                    detailBasePath="/clients"
                  />
                ),
            },
            {
              id: 'staff',
              label: 'Staff applications',
              content:
                !contractors || contractors.length === 0 ? (
                  <EmptyState
                    icon={Inbox}
                    title="No applicants yet"
                    description="New submissions from the staff application form will appear here."
                  />
                ) : (
                  <KanbanBoard
                    pipelineType="staff"
                    stages={staffStages ?? []}
                    initialEntities={contractors}
                    detailBasePath="/contractors"
                  />
                ),
            },
          ]}
        />
      </div>
    </div>
  )
}
