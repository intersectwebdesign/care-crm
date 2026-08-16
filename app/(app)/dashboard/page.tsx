import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DashboardCalendarPanel } from '@/components/calendar/DashboardCalendarPanel'
import { MonthCalendar } from '@/components/calendar/MonthCalendar'
import { UnassignedTasks } from '@/components/dashboard/UnassignedTasks'
import { CalendarEventRow } from '@/components/calendar/types'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'

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

  const canManage = profile ? ['admin', 'management', 'coordinator'].includes(profile.role) : false

  // RLS already scopes this correctly per role — office staff see every
  // event, support_workers see only their own visits / assigned-client events.
  const { data: rawEvents } = await supabase
    .from('calendar_events')
    .select('*, clients(name), contractors(name)')
    .order('start_at')

  const events: CalendarEventRow[] = (rawEvents ?? []).map((e) => ({
    id: e.id,
    event_type: e.event_type,
    title: e.title,
    notes: e.notes,
    start_at: e.start_at,
    end_at: e.end_at,
    client_id: e.client_id,
    contractor_id: e.contractor_id,
    project_id: e.project_id,
    entity_name:
      (e.clients as { name: string } | null)?.name ?? (e.contractors as { name: string } | null)?.name ?? null,
  }))

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {canManage ? 'Schedule and open work, at a glance.' : 'Your visits and tasks.'}
      </p>

      {canManage ? (
        <OfficeDashboard supabase={supabase} events={events} />
      ) : (
        <SupportWorkerDashboard supabase={supabase} events={events} userId={user!.id} />
      )}
    </div>
  )
}

async function OfficeDashboard({
  supabase,
  events,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>
  events: CalendarEventRow[]
}) {
  const [{ data: unassigned }, { data: userProfiles }, { data: clients }, { data: contractors }] =
    await Promise.all([
      supabase
        .from('tasks')
        .select('id, title, due_date, project_id, projects(name)')
        .is('assigned_to', null)
        .neq('status', 'done')
        .order('due_date', { ascending: true, nullsFirst: false })
        .limit(20),
      supabase.from('user_profiles').select('id, full_name'),
      supabase.from('clients').select('id, name').order('name'),
      supabase.from('contractors').select('id, name').order('name'),
    ])

  const unassignedRows = (unassigned ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    due_date: t.due_date,
    project_id: t.project_id,
    project_name: (t.projects as { name: string } | null)?.name ?? 'Unknown project',
  }))

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-gray-900">Calendar</h2>
          </CardHeader>
          <CardBody>
            <DashboardCalendarPanel
              initialEvents={events}
              canManage
              clients={clients ?? []}
              contractors={contractors ?? []}
            />
          </CardBody>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-gray-900">Unassigned tasks</h2>
          </CardHeader>
          <CardBody>
            <UnassignedTasks initialTasks={unassignedRows} assignableUsers={userProfiles ?? []} />
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

async function SupportWorkerDashboard({
  supabase,
  events,
  userId,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>
  events: CalendarEventRow[]
  userId: string
}) {
  const { data: myTasks } = await supabase
    .from('tasks')
    .select('id, title, due_date, project_id, projects(name)')
    .eq('assigned_to', userId)
    .neq('status', 'done')
    .order('due_date', { ascending: true, nullsFirst: false })
    .limit(20)

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-gray-900">Your calendar</h2>
          </CardHeader>
          <CardBody>
            <MonthCalendar events={events} />
          </CardBody>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-gray-900">Your tasks</h2>
          </CardHeader>
          <CardBody>
            {!myTasks || myTasks.length === 0 ? (
              <p className="text-sm text-gray-400">Nothing outstanding.</p>
            ) : (
              <ul className="space-y-2">
                {myTasks.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/projects/${t.project_id}`}
                      className="block truncate text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      {t.title}
                    </Link>
                    <p className="truncate text-xs text-gray-400">
                      {(t.projects as { name: string } | null)?.name ?? 'Unknown project'}
                      {t.due_date ? ` · due ${new Date(t.due_date).toLocaleDateString()}` : ''}
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
