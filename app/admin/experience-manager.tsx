'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { GlassCard } from '@/components/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, GripVertical, Loader2, Pencil, ArrowUp, ArrowDown } from 'lucide-react'
import { addExperience, updateExperience, deleteExperience, reorderExperiences } from './actions'
import { useRouter } from 'next/navigation'

interface Experience {
  id: string
  company: string
  position: string
  location: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string[]
  order_index: number
}

export function ExperienceManager({ experiences }: { experiences: Experience[] }) {
  const router = useRouter()
  const [orderedExperiences, setOrderedExperiences] = useState(experiences)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)
  const [isReordering, setIsReordering] = useState(false)

  useEffect(() => {
    setOrderedExperiences(experiences)
  }, [experiences])

  const moveExperience = async (sourceId: string, targetId: string, placeAfter: boolean) => {
    if (isReordering || isAdding || editingId || sourceId === targetId) return

    const sourceIndex = orderedExperiences.findIndex((experience) => experience.id === sourceId)
    const targetIndex = orderedExperiences.findIndex((experience) => experience.id === targetId)
    if (sourceIndex < 0 || targetIndex < 0) return

    const previousOrder = orderedExperiences
    const nextOrder = [...orderedExperiences]
    const [movedExperience] = nextOrder.splice(sourceIndex, 1)
    let destinationIndex = targetIndex + (placeAfter ? 1 : 0)
    if (sourceIndex < destinationIndex) destinationIndex -= 1
    nextOrder.splice(destinationIndex, 0, movedExperience)

    if (nextOrder.every((experience, index) => experience.id === previousOrder[index].id)) return

    setOrderedExperiences(nextOrder)
    setIsReordering(true)
    try {
      await reorderExperiences(nextOrder.map((experience) => experience.id))
      router.refresh()
    } catch (error) {
      setOrderedExperiences(previousOrder)
      alert('Error reordering experiences. Please try again.')
    } finally {
      setIsReordering(false)
    }
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>, targetId: string) => {
    event.preventDefault()
    const sourceId = event.dataTransfer.getData('text/plain') || draggingId
    const bounds = event.currentTarget.getBoundingClientRect()
    const placeAfter = event.clientY > bounds.top + bounds.height / 2
    setDraggingId(null)
    setDropTargetId(null)
    if (sourceId) await moveExperience(sourceId, targetId, placeAfter)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return
    
    setLoading(id)
    try {
      await deleteExperience(id)
      router.refresh()
    } catch (error) {
      alert('Error deleting experience')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      {orderedExperiences.map((exp, index) => (
        <GlassCard
          key={exp.id}
          onDragOver={(event) => {
            if (!draggingId || isAdding || editingId || isReordering) return
            event.preventDefault()
            event.dataTransfer.dropEffect = 'move'
            setDropTargetId(exp.id)
          }}
          onDrop={(event) => handleDrop(event, exp.id)}
          className={[
            draggingId === exp.id ? 'opacity-50' : '',
            dropTargetId === exp.id && draggingId !== exp.id ? 'ring-2 ring-primary' : '',
          ].join(' ')}
        >
          {editingId === exp.id ? (
            <ExperienceForm
              key={exp.id}
              experience={exp}
              onCancel={() => setEditingId(null)}
              onSuccess={() => {
                setEditingId(null)
                router.refresh()
              }}
            />
          ) : (
            <div className="flex items-start gap-4">
              <div className="flex shrink-0 flex-col items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  draggable={!isReordering && !isAdding && !editingId}
                  aria-label={`Drag to reorder ${exp.position} at ${exp.company}`}
                  title="Drag to reorder"
                  className="cursor-grab active:cursor-grabbing"
                  disabled={isReordering || Boolean(isAdding) || Boolean(editingId)}
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = 'move'
                    event.dataTransfer.setData('text/plain', exp.id)
                    setDraggingId(exp.id)
                  }}
                  onDragEnd={() => {
                    setDraggingId(null)
                    setDropTargetId(null)
                  }}
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Move ${exp.position} up`}
                  title="Move up"
                  disabled={index === 0 || isReordering || isAdding || Boolean(editingId)}
                  onClick={() => {
                    const previousExperience = orderedExperiences[index - 1]
                    if (previousExperience) moveExperience(exp.id, previousExperience.id, false)
                  }}
                  className="h-7 w-7"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Move ${exp.position} down`}
                  title="Move down"
                  disabled={index === orderedExperiences.length - 1 || isReordering || isAdding || Boolean(editingId)}
                  onClick={() => {
                    const nextExperience = orderedExperiences[index + 1]
                    if (nextExperience) moveExperience(exp.id, nextExperience.id, true)
                  }}
                  className="h-7 w-7"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{exp.position}</h3>
                <p className="text-muted-foreground">{exp.company} • {exp.location}</p>
                <p className="text-sm text-muted-foreground">
                  {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                </p>
                {exp.description && exp.description.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.description.map((desc, idx) => (
                      <li key={idx} className="text-sm">• {desc}</li>
                    ))}
                  </ul>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Edit ${exp.position} at ${exp.company}`}
                title="Edit experience"
                disabled={isReordering}
                onClick={() => {
                  setIsAdding(false)
                  setEditingId(exp.id)
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${exp.position} at ${exp.company}`}
                onClick={() => handleDelete(exp.id)}
                disabled={loading === exp.id || isReordering}
              >
                {loading === exp.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </GlassCard>
      ))}

      {isAdding ? (
        <GlassCard>
          <ExperienceForm
            onCancel={() => setIsAdding(false)}
            onSuccess={() => {
              setIsAdding(false)
              router.refresh()
            }}
          />
        </GlassCard>
      ) : !editingId ? (
        <Button onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      ) : null}
    </div>
  )
}

function ExperienceForm({
  experience,
  onCancel,
  onSuccess,
}: {
  experience?: Experience
  onCancel: () => void
  onSuccess: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isCurrent, setIsCurrent] = useState(experience?.is_current ?? false)
  const [descriptions, setDescriptions] = useState(
    experience?.description?.length ? experience.description : [''],
  )
  const [draggingDescriptionIndex, setDraggingDescriptionIndex] = useState<number | null>(null)

  const moveDescription = (sourceIndex: number, targetIndex: number, placeAfter: boolean) => {
    if (sourceIndex === targetIndex) return

    const nextDescriptions = [...descriptions]
    const [movedDescription] = nextDescriptions.splice(sourceIndex, 1)
    let destinationIndex = targetIndex + (placeAfter ? 1 : 0)
    if (sourceIndex < destinationIndex) destinationIndex -= 1
    nextDescriptions.splice(destinationIndex, 0, movedDescription)
    setDescriptions(nextDescriptions)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('description', JSON.stringify(descriptions.filter(d => d.trim())))
    formData.set('is_current', isCurrent.toString())

    try {
      if (experience) {
        await updateExperience(experience.id, formData)
      } else {
        await addExperience(formData)
      }
      onSuccess()
    } catch (error) {
      alert(`Error ${experience ? 'updating' : 'adding'} experience`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" defaultValue={experience?.company} required />
          </div>
          <div>
            <Label htmlFor="position">Position</Label>
            <Input id="position" name="position" defaultValue={experience?.position} required />
          </div>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={experience?.location} required />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <Input id="start_date" name="start_date" placeholder="Jan 2020" defaultValue={experience?.start_date} required />
          </div>
          <div>
            <Label htmlFor="end_date">End Date</Label>
            <Input id="end_date" name="end_date" placeholder="Dec 2022" defaultValue={experience?.end_date ?? ''} disabled={isCurrent} required={!isCurrent} />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="is_current" checked={isCurrent} onCheckedChange={(checked) => setIsCurrent(checked === true)} />
          <label htmlFor="is_current" className="text-sm cursor-pointer">I currently work here</label>
        </div>

        <div>
          <Label>Description Points</Label>
          {descriptions.map((desc, idx) => (
            <div
              key={idx}
              className={`mt-2 flex items-center gap-2 rounded-lg ${draggingDescriptionIndex === idx ? 'opacity-50' : ''}`}
              onDragOver={(event) => {
                if (draggingDescriptionIndex === null) return
                event.preventDefault()
                event.dataTransfer.dropEffect = 'move'
              }}
              onDrop={(event) => {
                event.preventDefault()
                const draggedIndex = event.dataTransfer.getData('text/plain')
                if (!draggedIndex) return
                const sourceIndex = Number(draggedIndex)
                if (!Number.isInteger(sourceIndex) || sourceIndex < 0 || sourceIndex >= descriptions.length) return
                const bounds = event.currentTarget.getBoundingClientRect()
                const placeAfter = event.clientY > bounds.top + bounds.height / 2
                moveDescription(sourceIndex, idx, placeAfter)
                setDraggingDescriptionIndex(null)
              }}
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                draggable
                aria-label={`Drag to reorder description point ${idx + 1}`}
                title="Drag to reorder point"
                className="h-8 w-8 shrink-0 cursor-grab active:cursor-grabbing"
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = 'move'
                  event.dataTransfer.setData('text/plain', String(idx))
                  setDraggingDescriptionIndex(idx)
                }}
                onDragEnd={() => setDraggingDescriptionIndex(null)}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Input
                value={desc}
                onChange={(e) => {
                  const newDescs = [...descriptions]
                  newDescs[idx] = e.target.value
                  setDescriptions(newDescs)
                }}
                placeholder="Achievement or responsibility"
                className="min-w-0 flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Move description point ${idx + 1} up`}
                title="Move point up"
                className="h-8 w-8 shrink-0"
                disabled={idx === 0}
                onClick={() => moveDescription(idx, idx - 1, false)}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Move description point ${idx + 1} down`}
                title="Move point down"
                className="h-8 w-8 shrink-0"
                disabled={idx === descriptions.length - 1}
                onClick={() => moveDescription(idx, idx + 1, true)}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              {descriptions.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove description point ${idx + 1}`}
                  className="shrink-0"
                  onClick={() => setDescriptions(descriptions.filter((_, i) => i !== idx))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDescriptions([...descriptions, ''])}
            className="mt-2"
          >
            <Plus className="mr-2 h-3 w-3" />
            Add Point
          </Button>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {experience ? 'Update Experience' : 'Save Experience'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
  )
}
