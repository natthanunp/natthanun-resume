'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePortfolioInfo(formData: FormData) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const title = formData.get('title') as string
  const tagline = formData.get('tagline') as string
  const about = formData.get('about') as string
  const email = formData.get('email') as string
  const location = formData.get('location') as string
  const github_url = formData.get('github_url') as string
  const linkedin_url = formData.get('linkedin_url') as string
  const years_experience = parseInt(formData.get('years_experience') as string)
  const projects_delivered = parseInt(formData.get('projects_delivered') as string)

  const { error } = await supabase
    .from('portfolio_info')
    .update({
      name,
      title,
      tagline,
      about,
      email,
      location,
      github_url: github_url || null,
      linkedin_url: linkedin_url || null,
      years_experience,
      projects_delivered,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('[v0] Error updating portfolio:', error)
    throw error
  }

  revalidatePath('/')
  revalidatePath('/admin')
}
