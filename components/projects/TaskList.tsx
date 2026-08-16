'use client'

import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import { TaskStatus } from '@/types'
import { TablesUpdate } from '@/types/database'

export interface TaskRow {
  id: string
  title: string
  category: string | null
  status: TaskStatus
  assigned_to: string | null
  due_date: string | null
}

export interface AssignableUser {
  id: string
  full_name: string | null
}

export function TaskList({
  initialTasks,
  assignableUsers,
  canManage,
  currentUserId,
}: {
  initialTasks: TaskRow[]
  assignableUsers: AssignableUser[]
  canManage: boolean
  currentUserId: string
}) {
  const [tasks, setTasks] = useState(initialTasks)
  const { show } = useToast()
  const supabase = createClient()

  const grouped = useMemo(() => {
    const groups = new Map<string, TaskRow[]>()
    for (const task of tasks) {
      const key = task.category ?? 'General'
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(task)
    }
    return Array.from(groups.entries())
  }, [tasks])

  async function updateTask(id: string, patch: Partial<TaskRow>) {
    const previous = tasks
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))

    const dbPatch: TablesUpdate<'tasks'> = { ...patch }
    if (patch.status === 'done') dbPatch.completed_at = new Date().toISOString()
    if (patch.status && patch.status !== 'done') dbPatch.completed_at = null

    const { error } = await supabase.from('tasks').update(dbPatch).eq('id', id)
    if (error) {
      setTasks(previous)
      show('error', 'Could not update task.')
    }
  }

  function toggleDone(task: TaskRow) {
    updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' })
  }

  if (tasks.length === 0) {
    return <p className="text-sm text-gray-400">No tasks yet.</p>
  }

  return (
    <div className="space-y-6">
      {grouped.map(([category, categoryTasks]) => (
        <div key={category}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">{category}</h3>
          <ul className="space-y-1.5">
            {categoryTasks.map((task) => {
              const canToggle = canManage || task.assigned_to === currentUserId
              return (
                <li
                  key={task.id}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5"
                >
                  <input
                    type="checkbox"
                    checked={task.status === 'done'}
                    disabled={!canToggle}
                    onChange={() => toggleDone(task)}
                    className="h-5 w-5 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-40"
                  />
                  <span
                    className={`min-w-0 flex-1 text-sm ${
                      task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-900'
                    }`}
                  >
                    {task.title}
                  </span>
                  {task.status !== 'done' && task.status !== 'todo' && (
                    <Badge status={task.status}>{task.status.replace('_', ' ')}</Badge>
                  )}
                  {canManage ? (
                    <Select
                      value={task.assigned_to ?? ''}
                      onChange={(e) => updateTask(task.id, { assigned_to: e.target.value || null })}
                      className="w-auto shrink-0 text-xs"
                    >
                      <option value="">Unassigned</option>
                      {assignableUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.full_name ?? 'Unnamed'}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    task.assigned_to && (
                      <span className="shrink-0 text-xs text-gray-400">
                        {assignableUsers.find((u) => u.id === task.assigned_to)?.full_name ?? '—'}
                      </span>
                    )
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
