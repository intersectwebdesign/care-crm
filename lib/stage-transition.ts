import { createClient } from '@/lib/supabase/client'
import { PipelineType } from '@/types'

export async function movePipelineStage(
  entityId: string,
  entityType: PipelineType,
  newStageId: string
) {
  const supabase = createClient()
  const { error } = await supabase.rpc('move_pipeline_stage', {
    p_entity_id: entityId,
    p_entity_type: entityType,
    p_new_stage_id: newStageId,
  })
  if (error) throw error
}
