import { PipelineType } from '@/types'

export interface KanbanEntity {
  id: string
  name: string
  current_stage_id: string | null
  services_position: string | null
  funding_source?: string | null
  credentialling_status?: string | null
  phone: string | null
}

export interface KanbanStage {
  id: string
  name: string
  sort_order: number
  spawns_project: boolean
}

export interface KanbanBoardProps {
  pipelineType: PipelineType
  stages: KanbanStage[]
  initialEntities: KanbanEntity[]
  detailBasePath: string
}
