'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePortfolioInfo(formData: FormData) {
  const supabase = await createClient()

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
  const profile_image_url = formData.get('profile_image_url') as string
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
      profile_image_url: profile_image_url || null,
      years_experience,
      projects_delivered,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    throw error
  }

  revalidatePath('/')
  revalidatePath('/admin')
}

export async function addExperience(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const company = formData.get('company') as string
  const position = formData.get('position') as string
  const location = formData.get('location') as string
  const start_date = formData.get('start_date') as string
  const end_date = formData.get('end_date') as string
  const is_current = formData.get('is_current') === 'true'
  const description = JSON.parse(formData.get('description') as string)

  const { data: maxOrder } = await supabase
    .from('work_experience')
    .select('order_index')
    .order('order_index', { ascending: false })
    .limit(1)
    .single()

  const { error } = await supabase.from('work_experience').insert({
    company,
    position,
    location,
    start_date,
    end_date: is_current ? null : end_date,
    is_current,
    description,
    order_index: (maxOrder?.order_index || 0) + 1,
  })

  if (error) {
    throw error
  }

  revalidatePath('/')
  revalidatePath('/admin')
}

export async function updateExperience(id: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const company = formData.get('company') as string
  const position = formData.get('position') as string
  const location = formData.get('location') as string
  const start_date = formData.get('start_date') as string
  const end_date = formData.get('end_date') as string
  const is_current = formData.get('is_current') === 'true'
  const description = JSON.parse(formData.get('description') as string)

  const { error } = await supabase
    .from('work_experience')
    .update({
      company,
      position,
      location,
      start_date,
      end_date: is_current ? null : end_date,
      is_current,
      description,
    })
    .eq('id', id)

  if (error) {
    throw error
  }

  revalidatePath('/')
  revalidatePath('/admin')
}

export async function reorderExperiences(ids: string[]) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'string')) {
    throw new Error('Invalid experience order')
  }

  const { data: experiences, error: fetchError } = await supabase
    .from('work_experience')
    .select('id')

  if (fetchError) {
    throw fetchError
  }

  const currentExperiences = experiences ?? []
  const submittedIds = new Set(ids)
  if (
    submittedIds.size !== ids.length ||
    currentExperiences.length !== ids.length ||
    currentExperiences.some(({ id }) => !submittedIds.has(id))
  ) {
    throw new Error('Experience list changed. Refresh and try again.')
  }

  for (const [order_index, id] of ids.entries()) {
    const { error } = await supabase
      .from('work_experience')
      .update({ order_index })
      .eq('id', id)

    if (error) {
      throw error
    }
  }

  revalidatePath('/')
  revalidatePath('/admin')
}

export async function deleteExperience(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase.from('work_experience').delete().eq('id', id)

  if (error) {
    throw error
  }

  revalidatePath('/')
  revalidatePath('/admin')
}

export async function addSkill(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name') as string
  const category = formData.get('category') as string

  const { data: maxOrder } = await supabase
    .from('skills')
    .select('order_index')
    .order('order_index', { ascending: false })
    .limit(1)
    .single()

  const { error } = await supabase.from('skills').insert({
    name,
    category,
    order_index: (maxOrder?.order_index || 0) + 1,
  })

  if (error) {
    throw error
  }

  revalidatePath('/')
  revalidatePath('/admin')
}

export async function deleteSkill(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase.from('skills').delete().eq('id', id)

  if (error) {
    throw error
  }

  revalidatePath('/')
  revalidatePath('/admin')
}

export async function addDog(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name') as string
  const image_url = formData.get('image_url') as string
  const description = formData.get('description') as string

  const { data: maxOrder } = await supabase
    .from('dog_pictures')
    .select('order_index')
    .order('order_index', { ascending: false })
    .limit(1)
    .single()

  const { error } = await supabase.from('dog_pictures').insert({
    name,
    image_url,
    description: description || null,
    order_index: (maxOrder?.order_index || 0) + 1,
  })

  if (error) {
    throw error
  }

  revalidatePath('/')
  revalidatePath('/admin')
}

export async function deleteDog(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase.from('dog_pictures').delete().eq('id', id)

  if (error) {
    throw error
  }

  revalidatePath('/')
  revalidatePath('/admin')
}
