'use client'

import React from "react"

import { useState } from 'react'
import { GlassCard } from '@/components/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { addSkill, deleteSkill } from './actions'
import { useRouter } from 'next/navigation'

interface Skill {
  id: string
  name: string
  category: string
  order_index: number
}

export function SkillsManager({ skills }: { skills: Skill[] }) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return
    
    setLoading(id)
    try {
      await deleteSkill(id)
      router.refresh()
    } catch (error) {
      alert('Error deleting skill')
    } finally {
      setLoading(null)
    }
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <div className="space-y-4">
      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <GlassCard key={category}>
          <h3 className="font-semibold text-lg mb-3">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2"
              >
                <span className="text-sm">{skill.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 p-0"
                  onClick={() => handleDelete(skill.id)}
                  disabled={loading === skill.id}
                >
                  {loading === skill.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </GlassCard>
      ))}

      {isAdding ? (
        <SkillForm
          onCancel={() => setIsAdding(false)}
          onSuccess={() => {
            setIsAdding(false)
            router.refresh()
          }}
        />
      ) : (
        <Button onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      )}
    </div>
  )
}

function SkillForm({ onCancel, onSuccess }: { onCancel: () => void; onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      await addSkill(formData)
      onSuccess()
    } catch (error) {
      alert('Error adding skill')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GlassCard>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="name">Skill Name</Label>
            <Input id="name" name="name" placeholder="React" required />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" placeholder="Frontend" required />
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Add Skill
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </GlassCard>
  )
}
