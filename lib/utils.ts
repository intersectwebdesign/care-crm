import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const STATUS_COLORS: Record<string, string> = {
  // task status
  todo: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
  blocked: 'bg-red-100 text-red-700',
  // ticket status
  open: 'bg-blue-100 text-blue-700',
  waiting: 'bg-amber-100 text-amber-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
  // ticket priority
  low: 'bg-gray-100 text-gray-700',
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-amber-100 text-amber-700',
  urgent: 'bg-red-100 text-red-700',
  // project status
  active: 'bg-green-100 text-green-700',
  on_hold: 'bg-amber-100 text-amber-700',
  completed: 'bg-blue-100 text-blue-700',
  archived: 'bg-gray-100 text-gray-700',
  // note visibility
  internal: 'bg-purple-100 text-purple-700',
  external: 'bg-teal-100 text-teal-700',
  // calendar event type
  visit: 'bg-teal-100 text-teal-700',
  review: 'bg-amber-100 text-amber-700',
  meeting: 'bg-blue-100 text-blue-700',
  other: 'bg-gray-100 text-gray-700',
}

const DOT_COLORS: Record<string, string> = {
  visit: 'bg-teal-500',
  review: 'bg-amber-500',
  meeting: 'bg-blue-500',
  other: 'bg-gray-400',
}

export function eventDotColor(eventType: string): string {
  return DOT_COLORS[eventType] ?? 'bg-gray-400'
}

export function statusColor(status: string): string {
  return STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-700'
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('')
}
