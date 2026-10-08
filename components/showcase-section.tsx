import Image from 'next/image'
import { ArrowUpRight, Music2, Orbit, Sparkles } from 'lucide-react'

const projectUrl = 'https://galaxique.vercel.app/'

export function ShowcaseSection() {
  return (
    <section id="showcase" className="section-space showcase-section" aria-labelledby="showcase-title">
      <div className="site-container">
        <div className="section-heading section-heading-inline"><div><p className="eyebrow">04 / Selected work</p><h2 id="showcase-title">A little curiosity.<br /><span className="text-muted-foreground">A whole new universe.</span></h2></div><p className="section-aside">An idea brought to life.<br />Made to be explored.</p></div>
        <article className="project-card liquid-glass">
          <a className="project-preview" href={projectUrl} target="_blank" rel="noopener noreferrer" aria-label="Explore Galaxique (opens in a new tab)">
            <Image src="/images/galaxique-homepage.png" alt="Screenshot of the real Galaxique homepage, showing its personality quiz introduction and interactive galaxy" width={1440} height={1000} sizes="(max-width: 900px) calc(100vw - 60px), (max-width: 1440px) calc(100vw - 120px), 1320px" className="project-screenshot" />
            <div className="screenshot-caption"><span>Galaxique · Homepage screenshot</span><span>Open website <ArrowUpRight size={14} aria-hidden="true" /></span></div>
          </a>
          <div className="project-details">
            <div className="project-title-block"><p className="eyebrow">Featured project</p><h3>Galaxique<span className="project-title-dot">✦</span></h3><span className="project-category">An exploration of you.</span></div>
            <div className="project-description"><p>A space-themed personality experience that turns a short quiz into your own interactive 3D universe, with AI personalization and a song that matches your vibe.</p><div className="project-tags"><span><Orbit size={13} aria-hidden="true" />Interactive 3D</span><span><Sparkles size={13} aria-hidden="true" />AI personalization</span><span><Music2 size={13} aria-hidden="true" />Music discovery</span><span>TH / EN</span></div><a href={projectUrl} target="_blank" rel="noopener noreferrer" className="text-link">Visit Galaxique <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></div>
          </div>
        </article>
      </div>
    </section>
  )
}
