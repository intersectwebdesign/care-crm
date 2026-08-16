'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { ListChecks } from 'lucide-react'

export interface UnassignedTaskRow {
  id: string
  title: string
  project_id: string
  project_name: string
  due_date: string | null
}

export function UnassignedTasks({
  initialTasks,
  assignableUsers,
}: {
  initialTasks: UnassignedTaskRow[]
  assignableUsers: { id: string; full_name: string | null }[]
}) {
  const [tasks, setTasks] = useState(initialTasks)
  const { show } = useToast()
  const supabase = createClient()

  async function assign(taskId: string, userId: string) {
    if (!userId) return
    const previous = tasks
    setTasks((prev) => prev.filter((t) => t.id !== taskId))

    const { error } = await supabase.from('tasks').update({ assigned_to: userId }).eq('id', taskId)
    if (error) {
      setTasks(previous)
      show('error', 'Could not assign task.')
    }
  }

  if (tasks.length === 0) {
    return <EmptyState icon={ListChecks} title="Nothing unassigned" description="Every open task has an owner." />
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2.5">
          <div className="min-w-0 flex-1">
            <Link href={`/projects/${task.project_id}`} className="block truncate text-sm font-medium text-gray-900 hover:text-blue-600">
              {task.title}
            </Link>
            <p className="truncate text-xs text-gray-400">
              {task.project_name}
              {task.due_date ? ` · due ${new Date(task.due_date).toLocaleDateString()}` : ''}
            </p>
          </div>
          <Select
            defaultValue=""
            onChange={(e) => assign(task.id, e.target.value)}
            className="w-auto shrink-0 text-xs"
          >
            <option value="" disabled>
              Assign…
            </option>
            {assignableUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.full_name ?? 'Unnamed'}
              </option>
            ))}
          </Select>
        </li>
      ))}
    </ul>
  )
}
