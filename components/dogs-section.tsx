import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { DogPhotoCard } from './dog-photo-card'

async function getSessionId() {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('dog_likes_session')?.value

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  return sessionId
}

export async function DogsSection() {
  const supabase = await createClient()
  const sessionId = await getSessionId()

  // Fetch dog pictures
  const { data: dogPictures } = await supabase
    .from('dog_pictures')
    .select('*')
    .order('order_index', { ascending: true })

  // Fetch all likes
  const { data: allLikes } = await supabase
    .from('dog_likes')
    .select('dog_picture_id, session_id')

  // Count likes per dog and check if current session liked
  const dogData = dogPictures?.map((dog) => {
    const dogLikes = allLikes?.filter((like) => like.dog_picture_id === dog.id) || []
    const totalLikes = dogLikes.length
    const isLiked = dogLikes.some((like) => like.session_id === sessionId)

    return {
      ...dog,
      totalLikes,
      isLiked,
    }
  }) || []

  if (!dogData.length) return null

  return (
    <section id="dogs" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-balance md:text-5xl">
            My Furry Co-Pilots
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Paopao the Japanese Spitz and Pepo the Chihuahua bring endless joy to my life. 
            Double-click to show some love!
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {dogData.map((dog) => (
            <DogPhotoCard
              key={dog.id}
              id={dog.id}
              name={dog.name}
              description={dog.description || ''}
              imageUrl={dog.image_url}
              initialLikes={dog.totalLikes}
              isLiked={dog.isLiked}
              sessionId={sessionId}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground italic">
            Hope this little dose of cuteness brightens your day!
          </p>
        </div>
      </div>
    </section>
  )
}
