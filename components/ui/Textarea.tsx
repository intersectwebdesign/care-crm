import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { inputClass } from './Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return <textarea ref={ref} className={cn(inputClass, 'min-h-24 resize-y', className)} {...props} />
  }
)
Textarea.displayName = 'Textarea'
