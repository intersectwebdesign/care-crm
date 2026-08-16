'use client'

import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import { KanbanCard } from './KanbanCard'
import { KanbanEntity, KanbanStage } from './types'

export function KanbanColumn({
  stage,
  entities,
  detailBasePath,
}: {
  stage: KanbanStage
  entities: KanbanEntity[]
  detailBasePath: string
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex w-72 shrink-0 flex-col rounded-lg border bg-gray-50/60 transition-colors',
        isOver ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
      )}
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2.5">
        <span className="text-sm font-semibold text-gray-900">{stage.name}</span>
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
          {entities.length}
        </span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-2" style={{ minHeight: 80 }}>
        {entities.map((entity) => (
          <KanbanCard key={entity.id} entity={entity} detailBasePath={detailBasePath} />
        ))}
      </div>
    </div>
  )
}
