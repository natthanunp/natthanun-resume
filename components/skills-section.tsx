import { Cloud, Code2, FlaskConical, Layers3, LineChart, Smartphone } from 'lucide-react'
import { GlassCard } from './glass-card'

interface Skill { id: string; category: string; name: string; order_index: number }

function CategoryIcon({ category }: { category: string }) {
  const name = category.toLowerCase()
  const Icon = name.includes('mobile') ? Smartphone : name.includes('cloud') || name.includes('devops') ? Cloud : name.includes('test') || name.includes('quality') ? FlaskConical : name.includes('analytic') || name.includes('tool') ? LineChart : name.includes('back') ? Layers3 : Code2
  return <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
}

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const groupedSkills = skills.reduce((groups, skill) => {
    (groups[skill.category] ??= []).push(skill)
    return groups
  }, {} as Record<string, Skill[]>)

  return (
    <section id="skills" className="section-space skills-section" aria-labelledby="skills-title">
      <div className="site-container">
        <div className="section-heading section-heading-inline"><div><p className="eyebrow">04 / My toolkit</p><h2 id="skills-title">The right tools.<br /><span className="text-muted-foreground">For the right idea.</span></h2></div><p className="section-aside">Across screens, systems,<br />and everything in between.</p></div>
        <div className="skills-grid">{Object.entries(groupedSkills).map(([category, categorySkills]) => <GlassCard key={category} className="skill-card"><span className="skill-icon"><CategoryIcon category={category} /></span><h3>{category}</h3><div className="skill-tags">{categorySkills.map((skill) => <span key={skill.id}>{skill.name}</span>)}</div></GlassCard>)}</div>
      </div>
    </section>
  )
}
