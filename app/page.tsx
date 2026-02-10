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
          <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[128px] animate-pulse" />
          <div className="absolute right-1/4 bottom-1/4 h-[600px] w-[600px] rounded-full bg-accent/10 blur-[128px] animate-pulse [animation-delay:2s]" />
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
        <footer className="border-t border-white/20 bg-white/70 backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-white/10 px-4 py-8 mt-20">
          <div className="mx-auto max-w-4xl text-center text-sm text-muted-foreground">
            <p>© 2024 {portfolioData.name}. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  )
}
