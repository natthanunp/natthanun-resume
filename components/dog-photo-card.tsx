'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { GlassCard } from './glass-card'
import { likeDogPhoto, unlikeDogPhoto } from '@/app/dogs/actions'
import { createClient } from '@/lib/supabase/client'

interface DogPhotoCardProps {
  id: string
  name: string
  description: string
  imageUrl: string
  initialLikes: number
  isLiked: boolean
  sessionId: string
}

export function DogPhotoCard({
  id,
  name,
  description,
  imageUrl,
  initialLikes,
  isLiked: initialIsLiked,
  sessionId,
}: DogPhotoCardProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showHeart, setShowHeart] = useState(false)

  // Real-time subscription to dog_likes changes
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`dog_likes_${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dog_likes',
          filter: `dog_picture_id=eq.${id}`,
        },
        async (payload) => {
          // Check if this change is from the current session
          const isFromCurrentSession =
            (payload.eventType === 'INSERT' && payload.new.session_id === sessionId) ||
            (payload.eventType === 'DELETE' && payload.old.session_id === sessionId)

          // For DELETE events, we need to refetch the count since payload.old doesn't include session_id
          if (payload.eventType === 'DELETE') {
            // Refetch actual count from database
            const { count } = await supabase
              .from('dog_likes')
              .select('*', { count: 'exact', head: true })
              .eq('dog_picture_id', id)

            if (count !== null) {
              setLikes(count)
            }

            // Check if current session still has a like
            const { data: myLike } = await supabase
              .from('dog_likes')
              .select('id')
              .eq('dog_picture_id', id)
              .eq('session_id', sessionId)
              .single()

            setIsLiked(!!myLike)
          } else if (!isFromCurrentSession && payload.eventType === 'INSERT') {
            // Only increment if it's from another session
            setLikes((prev) => prev + 1)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id, sessionId])

  const handleDoubleClick = async () => {
    if (isLiked) {
      // Unlike
      setLikes((prev) => prev - 1)
      setIsLiked(false)
      await unlikeDogPhoto(id, sessionId)
    } else {
      // Like
      setLikes((prev) => prev + 1)
      setIsLiked(true)
      setIsAnimating(true)
      setShowHeart(true)

      setTimeout(() => setIsAnimating(false), 500)
      setTimeout(() => setShowHeart(false), 1000)

      await likeDogPhoto(id, sessionId)
    }
  }

  return (
    <GlassCard className="group overflow-hidden">
      <div className="relative aspect-square overflow-hidden rounded-2xl">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onDoubleClick={handleDoubleClick}
        />

        {/* Animated heart on double click */}
        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart
              className={`h-24 w-24 text-red-500 fill-red-500 transition-all duration-500 ${
                isAnimating ? 'scale-100 opacity-100' : 'scale-150 opacity-0'
              }`}
            />
          </div>
        )}

        {/* Like counter badge */}
        <div className="absolute top-4 right-4 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-white">
          <Heart
            className={`mr-1.5 inline-block h-4 w-4 transition-all ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-white'
            }`}
          />
          {likes}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-cyan-400">{name}</h3>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
        )}
        <p className="mt-2 text-xs text-muted-foreground italic">
          Double-click the image to like
        </p>
      </div>
    </GlassCard>
  )
}
