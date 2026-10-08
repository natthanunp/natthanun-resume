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

  const [{ data: dogPictures }, { data: allLikes }] = await Promise.all([
    supabase.from('dog_pictures').select('*').order('order_index', { ascending: true }),
    supabase.from('dog_likes').select('dog_picture_id, session_id'),
  ])

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
    <section id="dogs" className="section-space dogs-section" aria-labelledby="dogs-title">
      <div className="site-container">
        <div className="section-heading section-heading-inline">
          <div><p className="eyebrow">05 / Life beyond the screen</p><h2 id="dogs-title">My favorite<br /><span className="text-muted-foreground">co-pilots.</span></h2></div>
          <p className="section-aside">A little less code.<br />A lot more joy.</p>
        </div>

        <div className="dogs-grid">
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
