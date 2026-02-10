'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { GlassCard } from './glass-card'
import { likeDogPhoto, unlikeDogPhoto } from '@/app/dogs/actions'

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
        <h3 className="text-2xl font-bold">{name}</h3>
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
