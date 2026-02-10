'use client'

import { useState } from 'react'
import { GlassCard } from './glass-card'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface DogPhotoCardProps {
  id: string
  name: string
  description: string
  imageUrl: string
  initialLikes: number
  isLiked: boolean
  onLike: (dogPhotoId: string) => Promise<void>
  onUnlike: (dogPhotoId: string) => Promise<void>
}

export function DogPhotoCard({
  id,
  name,
  description,
  imageUrl,
  initialLikes,
  isLiked: initialIsLiked,
  onLike,
  onUnlike,
}: DogPhotoCardProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleDoubleClick = async () => {
    if (isLiked) {
      // Unlike
      setIsLiked(false)
      setLikes((prev) => prev - 1)
      await onUnlike(id)
    } else {
      // Like with animation
      setIsLiked(true)
      setLikes((prev) => prev + 1)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
      await onLike(id)
    }
  }

  return (
    <GlassCard className="group overflow-hidden p-0">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer select-none"
          onDoubleClick={handleDoubleClick}
          draggable={false}
        />
        
        {/* Heart animation overlay */}
        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart
              className="h-24 w-24 fill-red-500 text-red-500 animate-ping"
              style={{ animationDuration: '0.5s' }}
            />
          </div>
        )}

        {/* Like indicator */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-2 backdrop-blur-sm">
          <button
            onClick={handleDoubleClick}
            className={cn(
              'transition-all',
              isLiked && 'scale-110'
            )}
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-all',
                isLiked
                  ? 'fill-red-500 text-red-500'
                  : 'text-white hover:scale-110'
              )}
            />
          </button>
          <span className="text-sm font-medium text-white">{likes}</span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="mt-4 text-xs text-muted-foreground italic">
          Double-click to like!
        </p>
      </div>
    </GlassCard>
  )
}
