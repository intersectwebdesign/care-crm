'use client'

import { useState } from 'react'
import { MonthCalendar } from './MonthCalendar'
import { EventForm } from './EventForm'
import { CalendarEventRow } from './types'

export function ProjectCalendarPanel({
  initialEvents,
  canManage,
  clientId,
  contractorId,
  projectId,
  entityName,
}: {
  initialEvents: CalendarEventRow[]
  canManage: boolean
  clientId: string | null
  contractorId: string | null
  projectId: string
  entityName: string
}) {
  const [events, setEvents] = useState(initialEvents)
  const [formOpen, setFormOpen] = useState(false)
  const [defaultDate, setDefaultDate] = useState<Date | null>(null)

  return (
    <div>
      <MonthCalendar
        events={events}
        onAddEvent={
          canManage
            ? (date) => {
                setDefaultDate(date)
                setFormOpen(true)
              }
            : undefined
        }
      />
      {canManage && (
        <EventForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onCreated={(event) => setEvents((prev) => [...prev, event])}
          defaultDate={defaultDate}
          lockedClientId={clientId}
          lockedContractorId={contractorId}
          lockedProjectId={projectId}
          lockedEntityName={entityName}
        />
      )}
    </div>
  )
}
