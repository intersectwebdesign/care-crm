'use client'

import { useMemo, useState } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { cn, eventDotColor } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CalendarEventRow } from './types'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function MonthCalendar({
  events,
  onAddEvent,
  showEntityName = false,
}: {
  events: CalendarEventRow[]
  onAddEvent?: (date: Date) => void
  showEntityName?: boolean
}) {
  const [month, setMonth] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month))
    const end = endOfWeek(endOfMonth(month))
    return eachDayOfInterval({ start, end })
  }, [month])

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEventRow[]>()
    for (const event of events) {
      const key = format(new Date(event.start_at), 'yyyy-MM-dd')
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(event)
    }
    return map
  }, [events])

  const selectedDayEvents = selectedDate
    ? (eventsByDay.get(format(selectedDate, 'yyyy-MM-dd')) ?? [])
    : []

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">{format(month, 'MMMM yyyy')}</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMonth((m) => subMonths(m, 1))}
            className="rounded p-1 text-gray-500 hover:bg-gray-100"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMonth((m) => addMonths(m, 1))}
            className="rounded p-1 text-gray-500 hover:bg-gray-100"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 text-xs">
        {WEEKDAYS.map((d) => (
          <div key={d} className="bg-gray-50 px-2 py-1.5 text-center font-medium text-gray-500">
            {d}
          </div>
        ))}
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd')
          const dayEvents = eventsByDay.get(key) ?? []
          const inMonth = isSameMonth(day, month)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isToday = isSameDay(day, new Date())

          return (
            <button
              key={key}
              onClick={() => setSelectedDate(day)}
              className={cn(
                'min-h-16 bg-white p-1.5 text-left align-top hover:bg-blue-50 sm:min-h-20',
                !inMonth && 'bg-gray-50 text-gray-300',
                isSelected && 'ring-2 ring-inset ring-blue-500'
              )}
            >
              <span
                className={cn(
                  'inline-flex h-5 w-5 items-center justify-center rounded-full',
                  isToday && 'bg-blue-600 font-semibold text-white'
                )}
              >
                {format(day, 'd')}
              </span>

              {/* Mobile: dots only */}
              <div className="mt-1 flex flex-wrap gap-1 sm:hidden">
                {dayEvents.slice(0, 4).map((e) => (
                  <span key={e.id} className={cn('h-1.5 w-1.5 rounded-full', eventDotColor(e.event_type))} />
                ))}
              </div>

              {/* Desktop/tablet: event titles */}
              <div className="mt-1 hidden space-y-0.5 sm:block">
                {dayEvents.slice(0, 2).map((e) => (
                  <div key={e.id} className="truncate rounded bg-gray-100 px-1 py-0.5 text-[11px] text-gray-700">
                    {e.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-[11px] text-gray-400">+{dayEvents.length - 2} more</div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">{format(selectedDate, 'EEEE d MMMM')}</h3>
            {onAddEvent && (
              <Button size="sm" variant="secondary" onClick={() => onAddEvent(selectedDate)}>
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            )}
          </div>
          {selectedDayEvents.length === 0 ? (
            <p className="text-sm text-gray-400">Nothing scheduled.</p>
          ) : (
            <ul className="space-y-2">
              {selectedDayEvents
                .sort((a, b) => a.start_at.localeCompare(b.start_at))
                .map((e) => (
                  <li key={e.id} className="flex items-start gap-2 text-sm">
                    <Badge status={e.event_type}>{e.event_type}</Badge>
                    <div className="min-w-0">
                      <p className="text-gray-900">{e.title}</p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(e.start_at), 'h:mm a')}
                        {showEntityName && e.entity_name ? ` · ${e.entity_name}` : ''}
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
