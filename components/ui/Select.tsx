import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { inputClass } from './Input'

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select ref={ref} className={cn(inputClass, 'bg-white', className)} {...props}>
        {children}
      </select>
    )
  }
)
Select.displayName = 'Select'
