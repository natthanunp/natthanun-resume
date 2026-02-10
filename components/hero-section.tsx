import { GlassCard } from './glass-card'
import { Github, Linkedin, Mail, MapPin } from 'lucide-react'
import { Button } from './ui/button'
import Image from 'next/image'

interface HeroSectionProps {
  portfolioInfo: {
    name: string
    title: string
    tagline: string
    email: string
    location: string
    github_url: string | null
    linkedin_url: string | null
    profile_image_url: string | null
    years_experience: number
    projects_delivered: number
  }
}

export function HeroSection({ portfolioInfo }: HeroSectionProps) {
  return (
    <section id="hero" className="relative flex min-h-[calc(100vh-65px)] items-center justify-center px-4 py-20 overflow-hidden">

      <div className="mx-auto max-w-4xl w-full relative z-10">
        <GlassCard className="text-center">
          <div className="mb-8">
            {portfolioInfo.profile_image_url && (
              <div className="relative mb-6 mx-auto w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl dark:border-blue-400/30">
                <Image
                  src={portfolioInfo.profile_image_url}
                  alt={portfolioInfo.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <h1 className="mb-2 text-5xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-300">
              {portfolioInfo.name}
            </h1>
            <p className="text-2xl font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent md:text-3xl dark:from-blue-400 dark:to-cyan-300">
              {portfolioInfo.title}
            </p>
          </div>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {portfolioInfo.tagline}
          </p>

          <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{portfolioInfo.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a
                href={`mailto:${portfolioInfo.email}`}
                className="hover:text-primary transition-colors"
              >
                {portfolioInfo.email}
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            {portfolioInfo.github_url && (
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-white/20 bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl dark:border-white/10 dark:from-white/10 dark:to-white/5 hover:from-purple-500/20 hover:to-pink-500/20 dark:hover:from-purple-500/30 dark:hover:to-pink-500/30 transition-all duration-300"
                asChild
              >
                <a
                  href={portfolioInfo.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
            )}
            {portfolioInfo.linkedin_url && (
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-white/20 bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl dark:border-white/10 dark:from-white/10 dark:to-white/5 hover:from-blue-500/20 hover:to-cyan-500/20 dark:hover:from-blue-500/30 dark:hover:to-cyan-500/30 transition-all duration-300"
                asChild
              >
                <a
                  href={portfolioInfo.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </Button>
            )}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 border-t border-white/20 pt-8 dark:border-white/10">
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-br from-primary to-blue-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-cyan-600 transition-all duration-300 dark:from-blue-300 dark:to-cyan-400">
                {portfolioInfo.years_experience}+
              </div>
              <div className="text-sm text-muted-foreground">
                Years Experience
              </div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-br from-primary to-cyan-600 bg-clip-text text-transparent group-hover:from-cyan-500 group-hover:to-teal-600 transition-all duration-300 dark:from-cyan-300 dark:to-teal-400">
                {portfolioInfo.projects_delivered}+
              </div>
              <div className="text-sm text-muted-foreground">
                Projects Delivered
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}
