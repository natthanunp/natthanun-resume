import { GlassCard } from './glass-card'
import { Github, Linkedin, Mail, MapPin } from 'lucide-react'
import { Button } from './ui/button'

interface HeroSectionProps {
  portfolioInfo: {
    name: string
    title: string
    tagline: string
    email: string
    location: string
    github_url: string | null
    linkedin_url: string | null
    years_experience: number
    projects_delivered: number
  }
}

export function HeroSection({ portfolioInfo }: HeroSectionProps) {
  return (
    <section id="hero" className="relative flex min-h-[calc(100vh-65px)] items-center justify-center px-4 py-20">

      <div className="mx-auto max-w-4xl w-full">
        <GlassCard className="text-center">
          <div className="mb-8">
            <h1 className="mb-2 text-5xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
              {portfolioInfo.name}
            </h1>
            <p className="text-2xl font-semibold text-primary md:text-3xl">
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
                className="rounded-full border-white/20 bg-white/40 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
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
                className="rounded-full border-white/20 bg-white/40 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
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
            <div>
              <div className="text-4xl font-bold text-primary">
                {portfolioInfo.years_experience}+
              </div>
              <div className="text-sm text-muted-foreground">
                Years Experience
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">
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
