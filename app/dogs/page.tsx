import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { DogGallery } from './dog-gallery'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

async function getSessionId() {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('dog_likes_session')?.value

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  return sessionId
}

export default async function DogsPage() {
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

  return (
    <main className="relative min-h-screen">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-background via-background to-muted" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/40 backdrop-blur-xl dark:bg-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Button
            variant="ghost"
            className="rounded-full bg-white/40 backdrop-blur-xl dark:bg-white/5"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Portfolio
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </nav>

      {/* Content */}
      <div className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl">
              Meet My Furry Co-Pilots
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Paopao the Japanese Spitz and Pepo the Chihuahua bring endless joy to my life.
            </p>
          </div>

          <DogGallery dogs={dogData} sessionId={sessionId} />

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground italic">
              Hope this little dose of cuteness brightens your day! Have a good one!
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
