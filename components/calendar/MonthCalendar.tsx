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
  isWeekend,
  addMonths,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from 'lucide-react'
import { cn, eventDotColor, statusColor } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { CalendarEventRow } from './types'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const LEGEND: { type: string; label: string }[] = [
  { type: 'visit', label: 'Visit' },
  { type: 'review', label: 'Review' },
  { type: 'meeting', label: 'Meeting' },
  { type: 'other', label: 'Other' },
]

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
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date())

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

  const selectedDayEvents = (eventsByDay.get(format(selectedDate, 'yyyy-MM-dd')) ?? []).sort((a, b) =>
    a.start_at.localeCompare(b.start_at)
  )

  function goToToday() {
    const today = new Date()
    setMonth(today)
    setSelectedDate(today)
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h2 className="text-base font-semibold text-gray-900">{format(month, 'MMMM yyyy')}</h2>
          <button onClick={goToToday} className="text-xs font-medium text-blue-600 hover:text-blue-700">
            Today
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMonth((m) => subMonths(m, 1))}
            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMonth((m) => addMonths(m, 1))}
            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-3">
        {LEGEND.map((l) => (
          <div key={l.type} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className={cn('h-2 w-2 rounded-full', eventDotColor(l.type))} />
            {l.label}
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
          {WEEKDAYS.map((d) => (
            <div key={d} className="px-1.5 py-2 text-center text-xs font-medium text-gray-400">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-100">
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd')
            const dayEvents = eventsByDay.get(key) ?? []
            const inMonth = isSameMonth(day, month)
            const isSelected = isSameDay(day, selectedDate)
            const isToday = isSameDay(day, new Date())
            const weekend = isWeekend(day)

            return (
              <button
                key={key}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  'min-h-[4.5rem] p-1.5 text-left align-top transition-colors sm:min-h-24',
                  weekend && inMonth ? 'bg-gray-50/60' : 'bg-white',
                  !inMonth && 'bg-gray-50 text-gray-300',
                  isSelected ? 'ring-2 ring-inset ring-blue-500' : 'hover:bg-blue-50/60'
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-6 w-6 items-center justify-center rounded-full text-sm',
                    isToday ? 'bg-blue-600 font-semibold text-white' : 'text-gray-700',
                    !inMonth && 'text-gray-300'
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

                {/* Desktop/tablet: colored event chips */}
                <div className="mt-1 hidden space-y-1 sm:block">
                  {dayEvents.slice(0, 2).map((e) => (
                    <div
                      key={e.id}
                      className={cn(
                        'truncate rounded px-1.5 py-0.5 text-[11px] font-medium',
                        statusColor(e.event_type)
                      )}
                    >
                      {format(new Date(e.start_at), 'h:mm a')} {e.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="px-1 text-[11px] font-medium text-gray-400">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <CalendarDays className="h-4 w-4 text-gray-400" />
            {isSameDay(selectedDate, new Date()) ? 'Today' : format(selectedDate, 'EEEE d MMMM')}
          </h3>
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
          <ul className="space-y-2.5">
            {selectedDayEvents.map((e) => (
              <li key={e.id} className="flex items-center gap-3">
                <span className={cn('h-2 w-2 shrink-0 rounded-full', eventDotColor(e.event_type))} />
                <span className="w-16 shrink-0 text-xs tabular-nums text-gray-400">
                  {format(new Date(e.start_at), 'h:mm a')}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm text-gray-900">{e.title}</p>
                  {showEntityName && e.entity_name && <p className="truncate text-xs text-gray-400">{e.entity_name}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
