import { ArrowUpRight, CalendarDays } from 'lucide-react'
import { AchievementIcon } from './achievement-icon'
import { formatAchievementMonth, type Achievement } from '@/lib/achievements'

export function AchievementsSection({ achievements }: { achievements: Achievement[] }) {
  if (!achievements.length) return null

  return (
    <section id="achievements" className="section-space achievements-section" aria-labelledby="achievements-title">
      <div className="site-container">
        <div className="section-heading section-heading-inline">
          <div>
            <p className="eyebrow">03 / Beyond the role</p>
            <h2 id="achievements-title">Achievements &amp;<br /><span className="text-muted-foreground">Recognition</span></h2>
          </div>
          <p className="section-aside">Sharing knowledge.<br />Connecting with the community.</p>
        </div>
        <div className="achievements-grid">
          {achievements.map((achievement) => (
            <article key={achievement.id} className="achievement-card liquid-glass" data-category={achievement.category}>
              <div className="achievement-card-top">
                <span className="achievement-icon"><AchievementIcon category={achievement.category} /></span>
                <span className="achievement-category">{achievement.category}</span>
              </div>
              <h3>{achievement.title}</h3>
              <p className="achievement-description">{achievement.description}</p>
              {achievement.event_date || achievement.event_url ? (
                <div className="achievement-details">
                  {achievement.event_date ? <span className="achievement-date"><CalendarDays size={14} aria-hidden="true" /><time dateTime={achievement.event_date.slice(0, 7)}>{formatAchievementMonth(achievement.event_date)}</time></span> : null}
                  {achievement.event_url ? <a href={achievement.event_url} target="_blank" rel="noopener noreferrer" className="text-link">View event <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only">: {achievement.title} (opens in a new tab)</span></a> : null}
                </div>
              ) : null}
            </article>
          ))}
        </div>
        <p className="achievements-summary"><strong>{achievements.length}</strong><span>{achievements.length === 1 ? 'Community highlight' : 'Community highlights'}</span></p>
      </div>
    </section>
  )
}
