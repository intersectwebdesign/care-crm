import { ReactNode } from 'react'
import { cn, statusColor } from '@/lib/utils'

interface BadgeProps {
  status?: string
  children: ReactNode
  className?: string
}

export function Badge({ status, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        status ? statusColor(status) : 'bg-gray-100 text-gray-700',
        className
      )}
    >
      {children}
    </span>
  )
}
