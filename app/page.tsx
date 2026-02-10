import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { AboutSection } from '@/components/about-section'
import { ExperienceSection } from '@/components/experience-section'
import { SkillsSection } from '@/components/skills-section'
import { DogsSection } from '@/components/dogs-section'

export default async function Home() {
  const supabase = await createClient()

  // Fetch portfolio info
  const { data: portfolioData } = await supabase
    .from('portfolio_info')
    .select('*')
    .single()

  // Fetch work experience
  const { data: experiences } = await supabase
    .from('work_experience')
    .select('*')
    .order('order_index', { ascending: true })

  // Fetch skills
  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .order('order_index', { ascending: true })

  if (!portfolioData) {
    return <div>Loading...</div>
  }

  return (
    <>
      {/* Header */}
      <Header portfolioInfo={portfolioData} />

      <main className="relative min-h-screen">
        {/* Background gradient with mesh effect */}
        <div className="fixed inset-0 -z-20 bg-gradient-to-br from-background via-background to-secondary" />
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {/* Primary purple/pink gradient - more vibrant in dark mode */}
          <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-primary/10 blur-[128px] animate-pulse dark:from-purple-500/40 dark:via-pink-500/30 dark:to-primary/20 dark:blur-[150px]" />
          {/* Blue/cyan gradient - more vibrant in dark mode */}
          <div className="absolute right-1/4 bottom-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-500/20 via-cyan-500/15 to-accent/10 blur-[128px] animate-pulse [animation-delay:2s] dark:from-blue-500/40 dark:via-cyan-500/30 dark:to-accent/20 dark:blur-[150px]" />
          {/* Additional vibrant accent - more vibrant in dark mode */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-primary/15 via-purple-500/10 to-pink-500/10 blur-[100px] animate-pulse [animation-delay:4s] dark:from-primary/30 dark:via-purple-500/20 dark:to-pink-500/20" />
          {/* Extra colorful gradients for dark mode */}
          <div className="absolute left-0 top-1/3 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-fuchsia-500/10 to-rose-500/10 blur-[120px] animate-pulse [animation-delay:1s] dark:from-fuchsia-500/25 dark:to-rose-500/25 dark:opacity-100 opacity-0" />
          <div className="absolute right-0 bottom-1/3 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-violet-500/10 to-indigo-500/10 blur-[120px] animate-pulse [animation-delay:3s] dark:from-violet-500/25 dark:to-indigo-500/25 dark:opacity-100 opacity-0" />
        </div>

        {/* Hero Section */}
        <HeroSection portfolioInfo={portfolioData} />

        {/* About Section */}
        <AboutSection aboutText={portfolioData.about} />

        {/* Experience Section */}
        {experiences && experiences.length > 0 && (
          <ExperienceSection experiences={experiences} />
        )}

        {/* Skills Section */}
        {skills && skills.length > 0 && <SkillsSection skills={skills} />}

        {/* Dogs Section */}
        <DogsSection />

        {/* Footer */}
        <footer className="border-t border-white/20 bg-white/70 backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-white/10 px-4 py-8 mt-8">
          <div className="mx-auto max-w-4xl text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} {portfolioData.name}. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  )
}
