'use client'

import React from "react"

import { useState } from 'react'
import { GlassCard } from '@/components/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUpload } from '@/components/image-upload'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { addDog, deleteDog } from './actions'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Dog {
  id: string
  name: string
  description: string | null
  image_url: string
  order_index: number
}

export function DogsManager({ dogs }: { dogs: Dog[] }) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dog picture?')) return
    
    setLoading(id)
    try {
      await deleteDog(id)
      router.refresh()
    } catch (error) {
      alert('Error deleting dog picture')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {dogs.map((dog) => (
          <GlassCard key={dog.id}>
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <Image
                src={dog.image_url || "/placeholder.svg"}
                alt={dog.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{dog.name}</h3>
                {dog.description && (
                  <p className="text-sm text-muted-foreground">{dog.description}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(dog.id)}
                disabled={loading === dog.id}
              >
                {loading === dog.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {isAdding ? (
        <DogForm
          onCancel={() => setIsAdding(false)}
          onSuccess={() => {
            setIsAdding(false)
            router.refresh()
          }}
        />
      ) : (
        <Button onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Dog Picture
        </Button>
      )}
    </div>
  )
}

function DogForm({ onCancel, onSuccess }: { onCancel: () => void; onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      await addDog(formData)
      onSuccess()
    } catch (error) {
      alert('Error adding dog picture')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GlassCard>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Dog Name</Label>
          <Input id="name" name="name" placeholder="Paopao" required />
        </div>

        <ImageUpload
          label="Dog Photo"
          name="image_url"
          currentImage={imageUrl}
          onChange={setImageUrl}
          required
          aspectRatio={1}
        />

        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Input id="description" name="description" placeholder="My fluffy companion" />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading || !imageUrl} className="flex-1">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Add Dog Picture
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </GlassCard>
  )
}
