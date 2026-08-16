import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return <input ref={ref} className={cn(inputClass, className)} {...props} />
  }
)
Input.displayName = 'Input'
