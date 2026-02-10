'use client'

import React from "react"

import { useState } from 'react'
import { GlassCard } from '@/components/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, GripVertical, Loader2 } from 'lucide-react'
import { addExperience, updateExperience, deleteExperience } from './actions'
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
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

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
      {experiences.map((exp) => (
        <GlassCard key={exp.id}>
          <div className="flex items-start gap-4">
            <GripVertical className="mt-1 h-5 w-5 text-muted-foreground" />
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
              onClick={() => handleDelete(exp.id)}
              disabled={loading === exp.id}
            >
              {loading === exp.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </GlassCard>
      ))}

      {isAdding ? (
        <ExperienceForm
          onCancel={() => setIsAdding(false)}
          onSuccess={() => {
            setIsAdding(false)
            router.refresh()
          }}
        />
      ) : (
        <Button onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      )}
    </div>
  )
}

function ExperienceForm({ onCancel, onSuccess }: { onCancel: () => void; onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isCurrent, setIsCurrent] = useState(false)
  const [descriptions, setDescriptions] = useState([''])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('description', JSON.stringify(descriptions.filter(d => d.trim())))
    formData.set('is_current', isCurrent.toString())

    try {
      await addExperience(formData)
      onSuccess()
    } catch (error) {
      alert('Error adding experience')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GlassCard>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" required />
          </div>
          <div>
            <Label htmlFor="position">Position</Label>
            <Input id="position" name="position" required />
          </div>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" required />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <Input id="start_date" name="start_date" placeholder="Jan 2020" required />
          </div>
          <div>
            <Label htmlFor="end_date">End Date</Label>
            <Input id="end_date" name="end_date" placeholder="Dec 2022" disabled={isCurrent} />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="is_current" checked={isCurrent} onCheckedChange={(checked) => setIsCurrent(checked === true)} />
          <label htmlFor="is_current" className="text-sm cursor-pointer">I currently work here</label>
        </div>

        <div>
          <Label>Description Points</Label>
          {descriptions.map((desc, idx) => (
            <div key={idx} className="flex gap-2 mt-2">
              <Input
                value={desc}
                onChange={(e) => {
                  const newDescs = [...descriptions]
                  newDescs[idx] = e.target.value
                  setDescriptions(newDescs)
                }}
                placeholder="Achievement or responsibility"
              />
              {descriptions.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
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
            Save Experience
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </GlassCard>
  )
}
