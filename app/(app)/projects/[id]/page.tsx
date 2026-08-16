import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import { TaskList, TaskRow } from '@/components/projects/TaskList'
import { NotesPanel, NoteRow } from '@/components/projects/NotesPanel'
import { ActivityFeed, ActivityRow } from '@/components/projects/ActivityFeed'
import { AssignmentPanel, AssignmentRow } from '@/components/projects/AssignmentPanel'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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

  const { data: project } = await supabase
    .from('projects')
    .select('*, clients(name), contractors(name)')
    .eq('id', id)
    .single()

  if (!project) notFound()

  const entityName =
    (project.clients as { name: string } | null)?.name ??
    (project.contractors as { name: string } | null)?.name ??
    project.name

  const [{ data: tasks }, { data: notes }, { data: activity }, { data: userProfiles }] = await Promise.all([
    supabase
      .from('tasks')
      .select('id, title, category, status, assigned_to, due_date')
      .eq('project_id', id)
      .order('sort_order'),
    supabase
      .from('notes')
      .select('id, body, visibility, created_at, author_id, author:user_profiles!notes_author_id_fkey(full_name)')
      .eq('project_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('project_activity')
      .select('id, activity_type, summary, created_at')
      .eq('project_id', id)
      .order('created_at', { ascending: false })
      .limit(50),
    supabase.from('user_profiles').select('id, full_name'),
  ])

  const noteRows: NoteRow[] = (notes ?? []).map((n) => ({
    id: n.id,
    body: n.body,
    visibility: n.visibility,
    created_at: n.created_at,
    author_id: n.author_id,
    author_name: (n.author as { full_name: string | null } | null)?.full_name ?? 'Unknown',
  }))

  let assignmentPanel = null
  if (project.pipeline_type === 'client' && project.client_id && canManage) {
    const [{ data: assignments }, { data: contractors }] = await Promise.all([
      supabase
        .from('client_assignments')
        .select('id, contractor_id, contractors(name)')
        .eq('client_id', project.client_id),
      supabase.from('contractors').select('id, name').order('name'),
    ])

    const assignmentRows: AssignmentRow[] = (assignments ?? []).map((a) => ({
      id: a.id,
      contractor_id: a.contractor_id,
      contractor_name: (a.contractors as { name: string } | null)?.name ?? 'Unknown',
    }))

    assignmentPanel = (
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-gray-900">Assigned staff</h2>
        </CardHeader>
        <CardBody>
          <AssignmentPanel
            clientId={project.client_id}
            initialAssignments={assignmentRows}
            availableContractors={contractors ?? []}
          />
        </CardBody>
      </Card>
    )
  }

  const activityRows: ActivityRow[] = activity ?? []

  return (
    <div>
      <Link href="/projects" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-semibold text-gray-900">{entityName}</h1>
        <Badge>{project.pipeline_type}</Badge>
        <Badge status={project.status}>{project.status.replace('_', ' ')}</Badge>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardBody>
              <Tabs
                tabs={[
                  {
                    id: 'tasks',
                    label: 'Tasks',
                    content: (
                      <TaskList
                        initialTasks={(tasks ?? []) as TaskRow[]}
                        assignableUsers={userProfiles ?? []}
                        canManage={canManage}
                        currentUserId={user!.id}
                      />
                    ),
                  },
                  {
                    id: 'notes',
                    label: 'Notes',
                    content: (
                      <NotesPanel
                        projectId={id}
                        initialNotes={noteRows}
                        currentUserId={user!.id}
                        currentUserName={profile?.full_name ?? 'Unknown'}
                      />
                    ),
                  },
                  {
                    id: 'activity',
                    label: 'Activity',
                    content: <ActivityFeed activity={activityRows} />,
                  },
                ]}
              />
            </CardBody>
          </Card>
        </div>

        {assignmentPanel && <div>{assignmentPanel}</div>}
      </div>
    </div>
  )
}
