import { ArrowDown, ArrowUpRight, Github, Linkedin, MapPin } from 'lucide-react'
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
    <section id="hero" className="hero-section" aria-labelledby="hero-title">
      <div className="hero-haze" aria-hidden="true" />
      <div className="site-container hero-grid">
        <div className="hero-copy entrance">
          <p className="eyebrow hero-eyebrow"><span className="status-dot" />{portfolioInfo.title}</p>
          <p className="hero-intro">Hi, I’m {portfolioInfo.name.split(' ')[0]}.</p>
          <h1 id="hero-title">Thoughtful code.<br /><span className="hero-heading-muted">Real-world impact.</span></h1>
          <p className="hero-description">{portfolioInfo.tagline}</p>
          <div className="hero-buttons">
            <a href="#showcase" className="button-primary">Explore my work <ArrowDown size={17} aria-hidden="true" /></a>
            <a href={`mailto:${portfolioInfo.email}`} className="button-glass liquid-glass">Get in touch <ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
          <div className="hero-location"><MapPin size={14} aria-hidden="true" /><span>{portfolioInfo.location}</span><span className="small-divider" /><span>Building for the world</span></div>
        </div>
        <div className="hero-art entrance entrance-delay">
          <div className="glass-orbit orbit-one" aria-hidden="true" />
          <div className="glass-orbit orbit-two" aria-hidden="true" />
          <div className="portrait-frame liquid-glass">
            <div className="portrait-image"><Image src={portfolioInfo.profile_image_url || '/images/profile.jpg'} alt={portfolioInfo.name} fill sizes="(max-width: 900px) 280px, (max-width: 1050px) 300px, 380px" className="object-cover" priority /></div>
            <div className="portrait-caption"><span>{portfolioInfo.name}</span><span>{portfolioInfo.title}</span></div>
          </div>
          <div className="floating-note floating-note-top liquid-glass" aria-hidden="true"><span className="note-symbol">&lt;/&gt;</span><span>Built with care.<br /><strong>Down to the details.</strong></span></div>
          <div className="floating-note floating-note-bottom liquid-glass"><span className="note-spark" aria-hidden="true">✦</span><span>Engineer by craft.<br /><strong>Curious by nature.</strong></span></div>
        </div>
        <div className="hero-bottom entrance entrance-delay">
          <div className="hero-stats">
            <div className="hero-stat"><strong>{portfolioInfo.years_experience}<span>+</span></strong><span>Years of experience</span></div>
            <div className="hero-stat"><strong>{portfolioInfo.projects_delivered}<span>+</span></strong><span>Projects delivered</span></div>
          </div>
          <div className="hero-socials">
            {portfolioInfo.github_url && <a href={portfolioInfo.github_url} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub (opens in a new tab)"><Github size={19} /><span>GitHub</span><ArrowUpRight size={13} aria-hidden="true" /></a>}
            {portfolioInfo.linkedin_url && <a href={portfolioInfo.linkedin_url} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn (opens in a new tab)"><Linkedin size={19} /><span>LinkedIn</span><ArrowUpRight size={13} aria-hidden="true" /></a>}
          </div>
        </div>
      </div>
      <a href="#about" className="scroll-cue"><span>A little more about me</span><ArrowDown size={14} aria-hidden="true" /></a>
    </section>
  )
}
