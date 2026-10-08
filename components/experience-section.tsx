import { ArrowUpRight, MapPin } from 'lucide-react'
import { getExperiencePeriod } from '@/lib/experience-dates'

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

export function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  const now = new Date()

  return (
    <section id="experience" className="section-space" aria-labelledby="experience-title">
      <div className="site-container">
        <div className="section-heading"><p className="eyebrow">02 / The journey so far</p><h2 id="experience-title">Good work.<br /><span className="text-muted-foreground">Great people.</span></h2></div>
        <div className="experience-list">
          {experiences.map((experience, index) => {
            const period = getExperiencePeriod(experience.start_date, experience.end_date, experience.is_current, now)

            return (
              <article key={experience.id} className="experience-row">
                <div className="experience-meta">
                  <span className="experience-index">{String(index + 1).padStart(2, '0')}</span>
                  <div className="experience-dates">
                    <p className="experience-period">{period.startDate}{period.endDate && <span>— {period.endDate}</span>}</p>
                    {period.duration && <p className="experience-duration">({period.duration})</p>}
                  </div>
                  {period.isCurrent && <span className="current-badge"><span className="status-dot" />Current</span>}
                </div>
                <div className="experience-body"><div className="experience-title"><div><h3>{experience.company}</h3><p>{experience.position}</p></div><ArrowUpRight size={24} className="experience-arrow" aria-hidden="true" /></div>{experience.location && <p className="experience-location"><MapPin size={12} aria-hidden="true" />{experience.location}</p>}
                  <ul className="experience-points">{(experience.description || []).map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
