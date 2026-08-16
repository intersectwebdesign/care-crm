import { createClient } from '@/lib/supabase/server'
import { ProjectsTable } from '@/components/crm/ProjectsTable'

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('projects')
    .select('id, name, pipeline_type, status')
    .order('updated_at', { ascending: false })

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">Projects</h1>
      <p className="mt-1 text-sm text-gray-500">Onboarding and ongoing care, one project per client or staff member.</p>

      <div className="mt-6">
        <ProjectsTable rows={data ?? []} />
      </div>
    </div>
  )
}
