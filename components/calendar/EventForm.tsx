'use client'

import { FormEvent, useState } from 'react'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { CalendarEventType } from '@/types'
import { CalendarEventRow } from './types'

interface EntityOption {
  id: string
  name: string
}

interface EventFormProps {
  open: boolean
  onClose: () => void
  onCreated: (event: CalendarEventRow) => void
  defaultDate?: Date | null
  // Locked context: creating from a project page — entity is fixed.
  lockedClientId?: string | null
  lockedContractorId?: string | null
  lockedProjectId?: string | null
  lockedEntityName?: string | null
  // Free picker: creating from the dashboard — choose who it's for.
  clients?: EntityOption[]
  contractors?: EntityOption[]
}

export function EventForm({
  open,
  onClose,
  onCreated,
  defaultDate,
  lockedClientId,
  lockedContractorId,
  lockedProjectId,
  lockedEntityName,
  clients = [],
  contractors = [],
}: EventFormProps) {
  const [title, setTitle] = useState('')
  const [eventType, setEventType] = useState<CalendarEventType>('visit')
  const [date, setDate] = useState(() => format(defaultDate ?? new Date(), 'yyyy-MM-dd'))
  const [time, setTime] = useState('09:00')
  const [notes, setNotes] = useState('')
  const [target, setTarget] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { show } = useToast()
  const supabase = createClient()

  const isLocked = Boolean(lockedClientId || lockedContractorId)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)

    const isClientTarget = clients.some((c) => c.id === target)
    const isContractorTarget = contractors.some((c) => c.id === target)

    const { data, error } = await supabase
      .from('calendar_events')
      .insert({
        title: title.trim(),
        event_type: eventType,
        start_at: new Date(`${date}T${time}`).toISOString(),
        notes: notes.trim() || null,
        client_id: lockedClientId ?? (isClientTarget ? target : null),
        contractor_id: lockedContractorId ?? (isContractorTarget ? target : null),
        project_id: lockedProjectId ?? null,
      })
      .select()
      .single()

    setSubmitting(false)

    if (error || !data) {
      show('error', 'Could not create event.')
      return
    }

    onCreated(data)
    setTitle('')
    setNotes('')
    setTarget('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="New calendar event">
      <form onSubmit={handleSubmit} className="space-y-3">
        <FormField label="Title" htmlFor="event-title" required>
          <Input id="event-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Type" htmlFor="event-type">
            <Select
              id="event-type"
              value={eventType}
              onChange={(e) => setEventType(e.target.value as CalendarEventType)}
            >
              <option value="visit">Visit</option>
              <option value="review">Review</option>
              <option value="meeting">Meeting</option>
              <option value="other">Other</option>
            </Select>
          </FormField>

          {isLocked ? (
            <FormField label="For" htmlFor="event-for">
              <Input id="event-for" value={lockedEntityName ?? ''} disabled />
            </FormField>
          ) : (
            <FormField label="For" htmlFor="event-target">
              <Select id="event-target" value={target} onChange={(e) => setTarget(e.target.value)}>
                <option value="">General</option>
                {clients.length > 0 && (
                  <optgroup label="Clients">
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                )}
                {contractors.length > 0 && (
                  <optgroup label="Staff">
                    {contractors.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </Select>
            </FormField>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Date" htmlFor="event-date" required>
            <Input id="event-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </FormField>
          <FormField label="Time" htmlFor="event-time" required>
            <Input id="event-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </FormField>
        </div>

        <FormField label="Notes" htmlFor="event-notes">
          <Textarea id="event-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting} disabled={!title.trim()}>
            Create event
          </Button>
        </div>
      </form>
    </Modal>
  )
}
