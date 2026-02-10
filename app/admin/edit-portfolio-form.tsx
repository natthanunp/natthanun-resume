'use client'

import React from "react"

import { useState } from 'react'
import { GlassCard } from '@/components/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/image-upload'
import { updatePortfolioInfo } from './actions'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface EditPortfolioFormProps {
  portfolioData: {
    id: string
    name: string
    title: string
    tagline: string
    about: string
    email: string
    location: string
    github_url: string | null
    linkedin_url: string | null
    profile_image_url: string | null
    years_experience: number
    projects_delivered: number
  }
}

export function EditPortfolioForm({ portfolioData }: EditPortfolioFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState(
    portfolioData.profile_image_url || '/images/profile.jpg'
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const formData = new FormData(e.currentTarget)
      
      // Ensure profile_image_url is included with the latest value
      formData.set('profile_image_url', profileImageUrl)
      
      console.log('[v0] Submitting profile_image_url:', profileImageUrl)
      
      await updatePortfolioInfo(formData)
      setMessage('Portfolio updated successfully!')
      router.refresh()
    } catch (error) {
      setMessage('Error updating portfolio. Please try again.')
      console.error('[v0] Error updating portfolio:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GlassCard>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={portfolioData.id} />
        
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={portfolioData.name}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={portfolioData.title}
                required
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              name="tagline"
              defaultValue={portfolioData.tagline}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="about">About Me</Label>
            <Textarea
              id="about"
              name="about"
              defaultValue={portfolioData.about}
              required
              rows={8}
              className="mt-2"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={portfolioData.email}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                defaultValue={portfolioData.location}
                required
                className="mt-2"
              />
            </div>
          </div>

          <ImageUpload
            label="Profile Image"
            name="profile_image_url"
            currentImage={profileImageUrl}
            onChange={setProfileImageUrl}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                name="github_url"
                type="url"
                defaultValue={portfolioData.github_url || ''}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                name="linkedin_url"
                type="url"
                defaultValue={portfolioData.linkedin_url || ''}
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="years_experience">Years of Experience</Label>
              <Input
                id="years_experience"
                name="years_experience"
                type="number"
                defaultValue={portfolioData.years_experience}
                required
                min="0"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="projects_delivered">Projects Delivered</Label>
              <Input
                id="projects_delivered"
                name="projects_delivered"
                type="number"
                defaultValue={portfolioData.projects_delivered}
                required
                min="0"
                className="mt-2"
              />
            </div>
          </div>

          {message && (
            <div
              className={`rounded-lg p-4 text-sm ${
                message.includes('success')
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
              }`}
            >
              {message}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </GlassCard>
  )
}
