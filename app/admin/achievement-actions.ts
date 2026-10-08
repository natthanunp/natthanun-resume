'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { achievementSchema } from '@/lib/achievement-validation'
import { createClient } from '@/lib/supabase/server'

async function authenticatedClient() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Sign in to manage achievements.')
  return supabase
}

function achievementValues(formData: FormData) {
  const result = achievementSchema.safeParse({
    title: formData.get('title'),
    category: formData.get('category'),
    description: formData.get('description'),
    event_month: formData.get('event_month') ?? '',
    event_url: formData.get('event_url') ?? '',
  })
  if (!result.success) throw new Error(result.error.issues[0].message)
  const { event_month, event_url, ...values } = result.data
  return { ...values, event_date: event_month ? `${event_month}-01` : null, event_url: event_url ? new URL(event_url).href : null }
}

function refreshAchievements() {
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function addAchievement(formData: FormData) {
  const supabase = await authenticatedClient()
  const values = achievementValues(formData)
  const { data: last, error: orderError } = await supabase.from('achievements')
    .select('order_index').order('order_index', { ascending: false }).limit(1).maybeSingle()
  if (orderError) throw new Error('Could not load achievements. Please try again.')
  const { error } = await supabase.from('achievements').insert({
    ...values, order_index: (last?.order_index ?? -1) + 1,
  })
  if (error) throw new Error('Could not save this achievement. Please try again.')
  refreshAchievements()
}

export async function updateAchievement(id: string, formData: FormData) {
  const supabase = await authenticatedClient()
  const achievementId = z.string().uuid().parse(id)
  const values = achievementValues(formData)
  const { error } = await supabase.from('achievements')
    .update({ ...values, updated_at: new Date().toISOString() }).eq('id', achievementId).select('id').single()
  if (error) throw new Error('Could not update this achievement. Refresh and try again.')
  refreshAchievements()
}

export async function deleteAchievement(id: string) {
  const supabase = await authenticatedClient()
  const achievementId = z.string().uuid().parse(id)
  const { error } = await supabase.from('achievements').delete().eq('id', achievementId).select('id').single()
  if (error) throw new Error('Could not delete this achievement. Refresh and try again.')
  refreshAchievements()
}

export async function reorderAchievements(ids: string[]) {
  const supabase = await authenticatedClient()
  const orderedIds = z.array(z.string().uuid()).refine((values) => new Set(values).size === values.length).parse(ids)
  // One database transaction validates the entire list before updating its order.
  const { error } = await supabase.rpc('reorder_achievements', { ordered_ids: orderedIds })
  if (error) throw new Error('Could not reorder achievements. Refresh the list and try again.')
  refreshAchievements()
}
