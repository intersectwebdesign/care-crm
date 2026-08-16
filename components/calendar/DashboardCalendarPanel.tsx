'use client'

import { useState } from 'react'
import { MonthCalendar } from './MonthCalendar'
import { EventForm } from './EventForm'
import { CalendarEventRow } from './types'

export function DashboardCalendarPanel({
  initialEvents,
  canManage,
  clients,
  contractors,
}: {
  initialEvents: CalendarEventRow[]
  canManage: boolean
  clients: { id: string; name: string }[]
  contractors: { id: string; name: string }[]
}) {
  const [events, setEvents] = useState(initialEvents)
  const [formOpen, setFormOpen] = useState(false)
  const [defaultDate, setDefaultDate] = useState<Date | null>(null)

  return (
    <div>
      <MonthCalendar
        events={events}
        showEntityName
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
          onCreated={(event) => {
            const entity =
              clients.find((c) => c.id === event.client_id) ??
              contractors.find((c) => c.id === event.contractor_id)
            setEvents((prev) => [...prev, { ...event, entity_name: entity?.name ?? null }])
          }}
          defaultDate={defaultDate}
          clients={clients}
          contractors={contractors}
        />
      )}
    </div>
  )
}
