'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useRouter } from 'next/navigation'
import { movePipelineStage } from '@/lib/stage-transition'
import { useToast } from '@/components/ui/Toast'
import { Select } from '@/components/ui/Select'
import { Avatar } from '@/components/ui/Avatar'
import { KanbanColumn } from './KanbanColumn'
import { KanbanBoardProps, KanbanEntity } from './types'

export function KanbanBoard({ pipelineType, stages, initialEntities, detailBasePath }: KanbanBoardProps) {
  const [entities, setEntities] = useState<KanbanEntity[]>(initialEntities)
  const { show } = useToast()
  const router = useRouter()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } })
  )

  const sortedStages = [...stages].sort((a, b) => a.sort_order - b.sort_order)

  async function moveTo(entityId: string, newStageId: string) {
    const previous = entities
    setEntities((prev) =>
      prev.map((e) => (e.id === entityId ? { ...e, current_stage_id: newStageId } : e))
    )

    try {
      await movePipelineStage(entityId, pipelineType, newStageId)
      router.refresh()
    } catch {
      setEntities(previous)
      show('error', 'Could not move — please try again.')
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const entityId = String(active.id)
    const newStageId = String(over.id)
    const entity = entities.find((e) => e.id === entityId)
    if (!entity || entity.current_stage_id === newStageId) return
    moveTo(entityId, newStageId)
  }

  return (
    <div>
      {/* Desktop/tablet: drag-and-drop board */}
      <div className="hidden sm:block">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {sortedStages.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                entities={entities.filter((e) => e.current_stage_id === stage.id)}
                detailBasePath={detailBasePath}
              />
            ))}
          </div>
        </DndContext>
      </div>

      {/* Phone: stage-picker list instead of drag-and-drop */}
      <div className="space-y-3 sm:hidden">
        {entities.map((entity) => (
          <div
            key={entity.id}
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
          >
            <Avatar name={entity.name} />
            <button
              className="min-w-0 flex-1 truncate text-left text-sm font-medium text-gray-900"
              onClick={() => router.push(`${detailBasePath}/${entity.id}`)}
            >
              {entity.name}
            </button>
            <Select
              value={entity.current_stage_id ?? ''}
              onChange={(e) => moveTo(entity.id, e.target.value)}
              className="w-auto shrink-0 text-xs"
            >
              {sortedStages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
            </Select>
          </div>
        ))}
      </div>
    </div>
  )
}
