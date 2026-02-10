import { GlassCard } from './glass-card'
import { Briefcase, MapPin } from 'lucide-react'

interface Experience {
  id: string
  company: string
  position: string
  location: string | null
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string[]
  order_index: number
}

interface ExperienceSectionProps {
  experiences: Experience[]
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-4xl font-bold tracking-tight text-balance md:text-5xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-300">
          Professional Experience
        </h2>
        <div className="space-y-6">
          {experiences.map((experience) => (
            <GlassCard key={experience.id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-lg bg-primary/10 p-2 dark:bg-blue-500/15">
                      <Briefcase className="h-5 w-5 text-primary dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{experience.position}</h3>
                      <p className="text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-cyan-400">
                        {experience.company}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground md:items-end md:text-right">
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-primary font-medium dark:bg-blue-500/15 dark:text-blue-300">
                    {experience.start_date} -{' '}
                    {experience.is_current ? 'Present' : experience.end_date}
                  </div>
                  {experience.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{experience.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <ul className="mt-6 space-y-2 pl-14">
                {experience.description.map((item, index) => (
                  <li
                    key={index}
                    className="text-muted-foreground leading-relaxed before:content-['•'] before:mr-2 before:text-primary"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
