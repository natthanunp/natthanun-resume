import { GlassCard } from './glass-card'

interface Skill {
  id: string
  category: string
  name: string
  order_index: number
}

interface SkillsSectionProps {
  skills: Skill[]
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  // Group skills by category
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>
  )

  return (
    <section id="skills" className="px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-4xl font-bold tracking-tight text-balance md:text-5xl">
          Skills & Expertise
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <GlassCard key={category}>
              <h3 className="mb-4 text-xl font-bold">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
