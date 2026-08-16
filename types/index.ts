import type { Tables, Enums } from './database'

export type UserRole = Enums<'user_role'>
export type PipelineType = Enums<'pipeline_type'>
export type ProjectStatus = Enums<'project_status'>
export type TaskStatus = Enums<'task_status'>
export type TicketStatus = Enums<'ticket_status'>
export type TicketPriority = Enums<'ticket_priority'>
export type NoteVisibility = Enums<'note_visibility'>
export type CalendarEventType = Enums<'calendar_event_type'>

export type UserProfile = Tables<'user_profiles'>
export type Client = Tables<'clients'>
export type Contractor = Tables<'contractors'>
export type PipelineStage = Tables<'pipeline_stages'>
export type Project = Tables<'projects'>
export type Task = Tables<'tasks'>
export type Note = Tables<'notes'>
export type Department = Tables<'departments'>
export type Ticket = Tables<'tickets'>
export type TicketMessage = Tables<'ticket_messages'>
export type ProjectActivity = Tables<'project_activity'>
export type ClientAssignment = Tables<'client_assignments'>
export type CalendarEvent = Tables<'calendar_events'>

export const NAV_ROLES: Record<string, UserRole[]> = {
  dashboard: ['admin', 'management', 'coordinator', 'support_worker'],
  clients: ['admin', 'management', 'coordinator'],
  contractors: ['admin', 'management', 'coordinator'],
  intake: ['admin', 'management', 'coordinator'],
  projects: ['admin', 'management', 'coordinator', 'support_worker'],
  helpdesk: ['admin', 'management', 'coordinator'],
  settings: ['admin'],
}
