'use client'

import { FormEvent, useState } from 'react'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'

export function ScheduleTaskModal({
  open,
  onClose,
  taskId,
  taskTitle,
  onScheduled,
}: {
  open: boolean
  onClose: () => void
  taskId: string
  taskTitle: string
  onScheduled: (startAt: string, eventId: string) => void
}) {
  const [date, setDate] = useState(() => format(new Date(), 'yyyy-MM-dd'))
  const [time, setTime] = useState('09:00')
  const [submitting, setSubmitting] = useState(false)
  const { show } = useToast()
  const supabase = createClient()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const { data, error } = await supabase.rpc('schedule_task', {
      p_task_id: taskId,
      p_start_at: new Date(`${date}T${time}`).toISOString(),
    })

    setSubmitting(false)

    if (error || !data) {
      show('error', 'Could not schedule this — please try again.')
      return
    }

    show('success', 'Added to the calendar.')
    onScheduled(data.start_at, data.id)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Schedule">
      <form onSubmit={handleSubmit} className="space-y-3">
        <p className="text-sm text-gray-600">{taskTitle}</p>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Date" htmlFor="schedule-date" required>
            <Input id="schedule-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </FormField>
          <FormField label="Time" htmlFor="schedule-time" required>
            <Input id="schedule-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </FormField>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Confirm date
          </Button>
        </div>
      </form>
    </Modal>
  )
}
