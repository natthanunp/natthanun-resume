'use client'

import { DogPhotoCard } from '@/components/dog-photo-card'
import { likeDogPhoto, unlikeDogPhoto } from './actions'

interface DogData {
  id: string
  name: string
  description: string | null
  image_url: string
  totalLikes: number
  isLiked: boolean
}

interface DogGalleryProps {
  dogs: DogData[]
  sessionId: string
}

export function DogGallery({ dogs, sessionId }: DogGalleryProps) {
  const handleLike = async (dogPhotoId: string) => {
    await likeDogPhoto(dogPhotoId, sessionId)
  }

  const handleUnlike = async (dogPhotoId: string) => {
    await unlikeDogPhoto(dogPhotoId, sessionId)
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {dogs.map((dog) => (
        <DogPhotoCard
          key={dog.id}
          id={dog.id}
          name={dog.name}
          description={dog.description || ''}
          imageUrl={dog.image_url}
          initialLikes={dog.totalLikes}
          isLiked={dog.isLiked}
          onLike={handleLike}
          onUnlike={handleUnlike}
        />
      ))}
    </div>
  )
}
