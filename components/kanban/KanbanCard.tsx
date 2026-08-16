'use client'

import { useDraggable } from '@dnd-kit/core'
import { useRouter } from 'next/navigation'
import { Phone } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'
import { KanbanEntity } from './types'

export function KanbanCard({ entity, detailBasePath }: { entity: KanbanEntity; detailBasePath: string }) {
  const router = useRouter()
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: entity.id,
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => !isDragging && router.push(`${detailBasePath}/${entity.id}`)}
      className={cn('touch-none', isDragging && 'z-10 opacity-70')}
    >
      <Card className="cursor-pointer p-3 hover:border-blue-300">
        <div className="flex items-start gap-2">
          <Avatar name={entity.name} className="mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{entity.name}</p>
            {entity.services_position && (
              <p className="truncate text-xs text-gray-500">{entity.services_position}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {entity.funding_source && <Badge>{entity.funding_source}</Badge>}
              {entity.credentialling_status && (
                <Badge status={entity.credentialling_status}>{entity.credentialling_status}</Badge>
              )}
              {entity.phone && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <Phone className="h-3 w-3" />
                  {entity.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
