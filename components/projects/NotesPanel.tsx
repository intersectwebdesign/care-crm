'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { NoteVisibility } from '@/types'

export interface NoteRow {
  id: string
  body: string
  visibility: NoteVisibility
  created_at: string
  author_id: string | null
  author_name: string
}

export function NotesPanel({
  projectId,
  initialNotes,
  currentUserId,
  currentUserName,
}: {
  projectId: string
  initialNotes: NoteRow[]
  currentUserId: string
  currentUserName: string
}) {
  const [notes, setNotes] = useState(initialNotes)
  const [body, setBody] = useState('')
  const [visibility, setVisibility] = useState<NoteVisibility>('external')
  const [submitting, setSubmitting] = useState(false)
  const { show } = useToast()
  const supabase = createClient()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setSubmitting(true)

    const { data, error } = await supabase
      .from('notes')
      .insert({ project_id: projectId, body: body.trim(), visibility, author_id: currentUserId })
      .select()
      .single()

    setSubmitting(false)

    if (error || !data) {
      show('error', 'Could not save note.')
      return
    }

    setNotes((prev) => [
      { id: data.id, body: data.body, visibility: data.visibility, created_at: data.created_at, author_id: data.author_id, author_name: currentUserName },
      ...prev,
    ])
    setBody('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6 rounded-lg border border-gray-200 bg-white p-3">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a note…"
          className="min-h-20"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <Select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as NoteVisibility)}
            className="w-auto text-xs"
          >
            <option value="external">External</option>
            <option value="internal">Internal</option>
          </Select>
          <Button type="submit" size="sm" loading={submitting} disabled={!body.trim()}>
            Add note
          </Button>
        </div>
      </form>

      {notes.length === 0 ? (
        <p className="text-sm text-gray-400">No notes yet.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id} className="rounded-lg border border-gray-200 bg-white p-3">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{note.author_name}</span>
                <Badge status={note.visibility}>{note.visibility}</Badge>
                <span className="ml-auto text-xs text-gray-400">
                  {new Date(note.created_at).toLocaleString()}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-gray-700">{note.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
