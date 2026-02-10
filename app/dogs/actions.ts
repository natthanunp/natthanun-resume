'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function likeDogPhoto(dogPhotoId: string, sessionId: string) {
  const supabase = await createClient()

  // Insert like
  const { error } = await supabase.from('dog_likes').insert({
    dog_picture_id: dogPhotoId,
    session_id: sessionId,
  })

  if (error) {
    console.error('Error liking dog photo:', error)
    throw error
  }

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set('dog_likes_session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })

  revalidatePath('/dogs')
}

export async function unlikeDogPhoto(dogPhotoId: string, sessionId: string) {
  const supabase = await createClient()

  // Delete like
  const { error } = await supabase
    .from('dog_likes')
    .delete()
    .eq('dog_picture_id', dogPhotoId)
    .eq('session_id', sessionId)

  if (error) {
    console.error('Error unliking dog photo:', error)
    throw error
  }

  revalidatePath('/dogs')
}
