import { LayoutDashboard, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { EmptyState } from '@/components/ui/EmptyState'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, full_name')
    .eq('id', user!.id)
    .single()

  const isSupportWorker = profile?.role === 'support_worker'

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {isSupportWorker ? 'Your assigned clients for today' : 'Pipeline and project overview'}
      </p>

      <div className="mt-6">
        {isSupportWorker ? (
          <EmptyState
            icon={Users}
            title="No clients assigned yet"
            description="Clients assigned to you will show up here once client_assignments are set up."
          />
        ) : (
          <EmptyState
            icon={LayoutDashboard}
            title="Pipelines coming next"
            description="Client and staff kanban boards land in the next build phase."
          />
        )}
      </div>
    </div>
  )
}
