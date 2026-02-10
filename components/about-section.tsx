import { GlassCard } from './glass-card'

interface AboutSectionProps {
  aboutText: string
}

export function AboutSection({ aboutText }: AboutSectionProps) {
  return (
    <section id="about" className="px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-center text-4xl font-bold tracking-tight text-balance md:text-5xl">
          About Me
        </h2>
        <GlassCard>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {aboutText.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-foreground leading-relaxed mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  )
}
