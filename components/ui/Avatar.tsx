import { cn, initials } from '@/lib/utils'

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700',
        className
      )}
      title={name}
    >
      {initials(name)}
    </span>
  )
}
