'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Trash2, Trophy } from 'lucide-react'
import { GlassCard } from '@/components/glass-card'
import { AchievementIcon } from '@/components/achievement-icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { achievementCategories, formatAchievementMonth, type Achievement } from '@/lib/achievements'
import { addAchievement, deleteAchievement, reorderAchievements, updateAchievement } from './achievement-actions'

export function AchievementsManager({ achievements }: { achievements: Achievement[] }) {
  const router = useRouter()
  const [editor, setEditor] = useState<Achievement | 'new' | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null)
  const [isRefreshing, startRefresh] = useTransition()
  const controlsDisabled = Boolean(busy || editor || deleteTarget || isRefreshing)

  async function runAction(key: string, action: () => Promise<void>, message: string) {
    setBusy(key)
    setError('')
    setNotice('')
    try {
      await action()
      setDeleteTarget(null)
      setNotice(message)
      startRefresh(() => router.refresh())
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(null)
    }
  }

  function move(index: number, offset: number) {
    const ids = achievements.map(({ id }) => id)
    const destination = index + offset
    if (destination < 0 || destination >= ids.length) return
    const movedId = ids[index]
    ids[index] = ids[destination]
    ids[destination] = movedId
    void runAction('order', () => reorderAchievements(ids), 'Achievement order saved.')
  }

  function openEditor(value: Achievement | 'new') {
    setError('')
    setNotice('')
    setEditor(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h2 className="text-2xl font-semibold">Achievements &amp; Recognition</h2><p className="mt-2 text-sm text-muted-foreground">Speaking engagements, conferences, awards, and community contributions.</p></div>
        <Button onClick={() => openEditor('new')} disabled={controlsDisabled}><Plus className="mr-2 h-4 w-4" />Add Achievement</Button>
      </div>
      {error ? <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm">{error}</p> : null}
      <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{busy === 'order' ? 'Saving order…' : notice}</p>

      {deleteTarget ? (
        <GlassCard className="achievement-delete-confirmation">
          <h3 className="font-semibold">Delete “{deleteTarget.title}”?</h3>
          <p className="mt-2 text-sm text-muted-foreground">This removes the entry from your portfolio and cannot be undone.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="destructive" disabled={Boolean(busy)} onClick={() => void runAction(deleteTarget.id, () => deleteAchievement(deleteTarget.id), 'Achievement deleted.')}>
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />}Delete achievement
            </Button>
            <Button variant="outline" disabled={Boolean(busy)} onClick={() => { setDeleteTarget(null); setError('') }}>Cancel</Button>
          </div>
        </GlassCard>
      ) : null}

      {editor ? (
        <GlassCard>
          <AchievementForm key={editor === 'new' ? 'new' : editor.id} achievement={editor === 'new' ? undefined : editor} onCancel={() => setEditor(null)} onSuccess={() => { setEditor(null); setNotice('Achievement saved.'); startRefresh(() => router.refresh()) }} />
        </GlassCard>
      ) : null}

      {!achievements.length && !editor ? (
        <GlassCard>
          <Trophy className="mb-4 h-8 w-8 text-primary" aria-hidden="true" />
          <h3 className="text-lg font-semibold">Your next highlight starts here.</h3>
          <p className="mt-2 text-sm text-muted-foreground">Add your first achievement to show this section on your portfolio.</p>
        </GlassCard>
      ) : null}

      {achievements.map((achievement, index) => (
        <GlassCard key={achievement.id}>
          <div className="flex flex-wrap items-start gap-4">
            <span className="text-primary"><AchievementIcon category={achievement.category} /></span>
            <div className="min-w-0 flex-1 basis-48">
              <div className="flex flex-wrap items-center gap-2"><h3 className="break-words text-lg font-semibold">{achievement.title}</h3><span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">{achievement.category}</span></div>
              <p className="mt-3 whitespace-pre-line break-words text-sm leading-relaxed text-muted-foreground">{achievement.description}</p>
              {achievement.event_date ? <p className="mt-3 text-sm text-muted-foreground">{formatAchievementMonth(achievement.event_date)}</p> : null}
              {achievement.event_url ? <a href={achievement.event_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block break-all text-sm text-primary">{achievement.event_url}<span className="sr-only"> (opens in a new tab)</span></a> : null}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" disabled={controlsDisabled || index === 0} onClick={() => move(index, -1)} aria-label={`Move ${achievement.title} up`} title="Move up"><ArrowUp className="h-4 w-4" aria-hidden="true" /></Button>
              <Button variant="ghost" size="icon" disabled={controlsDisabled || index === achievements.length - 1} onClick={() => move(index, 1)} aria-label={`Move ${achievement.title} down`} title="Move down"><ArrowDown className="h-4 w-4" aria-hidden="true" /></Button>
              <Button variant="ghost" size="icon" disabled={controlsDisabled} onClick={() => openEditor(achievement)} aria-label={`Edit ${achievement.title}`} title="Edit achievement"><Pencil className="h-4 w-4" aria-hidden="true" /></Button>
              <Button variant="ghost" size="icon" disabled={controlsDisabled} onClick={() => { setError(''); setNotice(''); setDeleteTarget(achievement) }} aria-label={`Delete ${achievement.title}`} title="Delete achievement"><Trash2 className="h-4 w-4" aria-hidden="true" /></Button>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}

function AchievementForm({ achievement, onCancel, onSuccess }: {
  achievement?: Achievement
  onCancel: () => void
  onSuccess: () => void
}) {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const prefix = `achievement-${achievement?.id ?? 'new'}`

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setIsSaving(true)
    setError('')
    try {
      if (achievement) await updateAchievement(achievement.id, formData)
      else await addAchievement(formData)
      onSuccess()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={isSaving} className="min-w-0 space-y-5">
        <legend className="mb-5 text-xl font-semibold">{achievement ? 'Edit achievement' : 'Add achievement'}</legend>
        <div><Label htmlFor={`${prefix}-title`}>Title</Label><Input id={`${prefix}-title`} name="title" defaultValue={achievement?.title} placeholder="Thailand Flutter Meetup Speaker" maxLength={160} required autoFocus /></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div><Label htmlFor={`${prefix}-category`}>Category</Label><select id={`${prefix}-category`} name="category" defaultValue={achievement?.category ?? 'Speaking'} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>{achievementCategories.map((category) => <option key={category}>{category}</option>)}</select></div>
          <div><Label htmlFor={`${prefix}-month`}>Event month <span className="font-normal text-muted-foreground">(optional)</span></Label><Input id={`${prefix}-month`} type="month" name="event_month" defaultValue={achievement?.event_date?.slice(0, 7) ?? ''} /></div>
        </div>
        <div><Label htmlFor={`${prefix}-description`}>Description</Label><Textarea id={`${prefix}-description`} name="description" defaultValue={achievement?.description} placeholder="What did you share, showcase, or achieve?" maxLength={2000} rows={4} required /></div>
        <div><Label htmlFor={`${prefix}-url`}>Event or recognition link <span className="font-normal text-muted-foreground">(optional)</span></Label><Input id={`${prefix}-url`} name="event_url" type="url" defaultValue={achievement?.event_url ?? ''} placeholder="https://…" maxLength={2048} /></div>
        {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
        <div className="flex flex-wrap gap-3"><Button type="submit">{isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}{isSaving ? 'Saving…' : 'Save achievement'}</Button><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button></div>
      </fieldset>
    </form>
  )
}
