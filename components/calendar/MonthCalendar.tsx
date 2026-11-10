'use client'

import { useMemo, useState } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfToday,
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
import { EmptyState } from '@/components/ui/EmptyState'
import { CalendarEventRow } from './types'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const LEGEND: { type: string; label: string }[] = [
  { type: 'visit', label: 'Visit' },
  { type: 'review', label: 'Review' },
  { type: 'meeting', label: 'Meeting' },
  { type: 'other', label: 'Other' },
]

const selectClass =
  'rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

function segmentClass(active: boolean) {
  return cn(
    'rounded-md px-3 py-1 text-xs font-medium transition-colors',
    active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
  )
}

export function MonthCalendar({
  events,
  onAddEvent,
  showEntityName = false,
}: {
  events: CalendarEventRow[]
  onAddEvent?: (date: Date) => void
  showEntityName?: boolean
}) {
  const [view, setView] = useState<'month' | 'agenda'>('month')
  const [month, setMonth] = useState(() => new Date())

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
    map.forEach((list) => list.sort((a, b) => a.start_at.localeCompare(b.start_at)))
    return map
  }, [events])

  const agendaDays = useMemo(() => {
    const today = startOfToday()
    const upcoming = events.filter((e) => new Date(e.start_at) >= today)
    const map = new Map<string, CalendarEventRow[]>()
    for (const event of upcoming) {
      const key = format(new Date(event.start_at), 'yyyy-MM-dd')
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(event)
    }
    map.forEach((list) => list.sort((a, b) => a.start_at.localeCompare(b.start_at)))
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [events])

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={month.getMonth()}
            onChange={(e) => setMonth(new Date(month.getFullYear(), Number(e.target.value), 1))}
            className={selectClass}
          >
            {MONTH_NAMES.map((m, i) => (
              <option key={m} value={i}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={month.getFullYear()}
            onChange={(e) => setMonth(new Date(Number(e.target.value), month.getMonth(), 1))}
            className={selectClass}
          >
            {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMonth((m) => subMonths(m, 1))}
              className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMonth((m) => addMonths(m, 1))}
              className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => setMonth(new Date())}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Today
          </button>
        </div>

        {onAddEvent && (
          <Button size="sm" onClick={() => onAddEvent(new Date())}>
            <Plus className="h-3.5 w-3.5" />
            Add event
          </Button>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
          <button className={segmentClass(view === 'month')} onClick={() => setView('month')}>
            Month
          </button>
          <button className={segmentClass(view === 'agenda')} onClick={() => setView('agenda')}>
            Agenda
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {LEGEND.map((l) => (
            <div key={l.type} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className={cn('h-2 w-2 rounded-full', eventDotColor(l.type))} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {view === 'month' ? (
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            {WEEKDAYS.map((d) => (
              <div key={d} className="px-1.5 py-2 text-center text-xs font-medium text-gray-500">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map((day) => {
              const key = format(day, 'yyyy-MM-dd')
              const dayEvents = eventsByDay.get(key) ?? []
              const inMonth = isSameMonth(day, month)
              const isToday = isSameDay(day, new Date())
              const weekend = isWeekend(day)

              return (
                <div
                  key={key}
                  className={cn(
                    'min-h-[5.5rem] border-b border-r border-gray-100 p-1.5 sm:min-h-[6.5rem]',
                    !inMonth ? 'bg-gray-50' : weekend ? 'bg-gray-50/50' : 'bg-white'
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs',
                      isToday ? 'bg-blue-600 font-semibold text-white' : inMonth ? 'text-gray-700' : 'text-gray-300'
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
                    {dayEvents.slice(0, 3).map((e) => (
                      <div
                        key={e.id}
                        title={e.title}
                        className={cn('truncate rounded px-1.5 py-0.5 text-[11px] font-medium', statusColor(e.event_type))}
                      >
                        {format(new Date(e.start_at), 'h:mm a')} {e.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="px-1 text-[11px] font-medium text-gray-400">+{dayEvents.length - 3} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {agendaDays.length === 0 ? (
            <div className="py-10">
              <EmptyState icon={CalendarDays} title="Nothing coming up" description="Upcoming events will appear here." />
            </div>
          ) : (
            agendaDays.map(([dayKey, dayEvents]) => (
              <div key={dayKey} className="border-b border-gray-100 last:border-0">
                <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600">
                  {format(new Date(dayKey), 'EEEE, d MMMM yyyy')}
                </div>
                {dayEvents.map((e) => (
                  <div key={e.id} className="flex items-center gap-3 border-t border-gray-50 px-4 py-3">
                    <span className="w-16 shrink-0 text-sm text-gray-500">{format(new Date(e.start_at), 'h:mm a')}</span>
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                        statusColor(e.event_type)
                      )}
                    >
                      {e.event_type}
                    </span>
                    <span className="truncate font-medium text-gray-900">{e.title}</span>
                    {showEntityName && e.entity_name && (
                      <span className="truncate text-sm text-gray-400">— {e.entity_name}</span>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
