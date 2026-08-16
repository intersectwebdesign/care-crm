import { CheckCircle2, MessageSquare, ArrowRightCircle, Circle } from 'lucide-react'

export interface ActivityRow {
  id: string
  activity_type: string
  summary: string
  created_at: string
}

const ICONS: Record<string, typeof Circle> = {
  stage_change: ArrowRightCircle,
  note: MessageSquare,
  task_completed: CheckCircle2,
}

export function ActivityFeed({ activity }: { activity: ActivityRow[] }) {
  if (activity.length === 0) {
    return <p className="text-sm text-gray-400">No activity yet.</p>
  }

  return (
    <ul className="space-y-3">
      {activity.map((a) => {
        const Icon = ICONS[a.activity_type] ?? Circle
        return (
          <li key={a.id} className="flex items-start gap-2.5">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <div className="min-w-0">
              <p className="text-sm text-gray-700">{a.summary}</p>
              <p className="text-xs text-gray-400">{new Date(a.created_at).toLocaleString()}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
