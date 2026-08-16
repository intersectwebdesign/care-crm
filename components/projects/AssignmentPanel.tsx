'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Avatar } from '@/components/ui/Avatar'

export interface AssignmentRow {
  id: string
  contractor_id: string
  contractor_name: string
}

export function AssignmentPanel({
  clientId,
  initialAssignments,
  availableContractors,
}: {
  clientId: string
  initialAssignments: AssignmentRow[]
  availableContractors: { id: string; name: string }[]
}) {
  const [assignments, setAssignments] = useState(initialAssignments)
  const [selected, setSelected] = useState('')
  const { show } = useToast()
  const supabase = createClient()

  const unassigned = availableContractors.filter(
    (c) => !assignments.some((a) => a.contractor_id === c.id)
  )

  async function assign() {
    if (!selected) return
    const contractor = availableContractors.find((c) => c.id === selected)
    if (!contractor) return

    const { data, error } = await supabase
      .from('client_assignments')
      .insert({ client_id: clientId, contractor_id: selected })
      .select()
      .single()

    if (error || !data) {
      show('error', 'Could not assign staff member.')
      return
    }

    setAssignments((prev) => [...prev, { id: data.id, contractor_id: selected, contractor_name: contractor.name }])
    setSelected('')
  }

  async function unassign(assignmentId: string) {
    const previous = assignments
    setAssignments((prev) => prev.filter((a) => a.id !== assignmentId))

    const { error } = await supabase.from('client_assignments').delete().eq('id', assignmentId)
    if (error) {
      setAssignments(previous)
      show('error', 'Could not remove assignment.')
    }
  }

  return (
    <div>
      {assignments.length === 0 ? (
        <p className="mb-3 text-sm text-gray-400">No staff assigned yet.</p>
      ) : (
        <ul className="mb-3 space-y-2">
          {assignments.map((a) => (
            <li key={a.id} className="flex items-center gap-2">
              <Avatar name={a.contractor_name} />
              <span className="flex-1 text-sm text-gray-900">{a.contractor_name}</span>
              <button onClick={() => unassign(a.id)} className="text-gray-400 hover:text-red-600" aria-label="Remove">
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {unassigned.length > 0 && (
        <div className="flex gap-2">
          <Select value={selected} onChange={(e) => setSelected(e.target.value)} className="flex-1">
            <option value="">Assign a staff member…</option>
            {unassigned.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Button size="sm" onClick={assign} disabled={!selected}>
            Assign
          </Button>
        </div>
      )}
    </div>
  )
}
