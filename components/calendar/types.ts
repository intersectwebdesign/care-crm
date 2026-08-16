import { CalendarEventType } from '@/types'

export interface CalendarEventRow {
  id: string
  event_type: CalendarEventType
  title: string
  notes: string | null
  start_at: string
  end_at: string | null
  client_id: string | null
  contractor_id: string | null
  project_id: string | null
  entity_name?: string | null
}
