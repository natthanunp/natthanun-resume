import { ArrowUpRight, Layers3, Smartphone, Workflow } from 'lucide-react'
import { GlassCard } from './glass-card'

export function AboutSection({ aboutText }: { aboutText: string }) {
  return (
    <section id="about" className="section-space about-section" aria-labelledby="about-title">
      <div className="site-container">
        <div className="section-heading"><p className="eyebrow">01 / A little about me</p><h2 id="about-title">Big-picture thinking.<br /><span className="text-muted-foreground">Detail-driven building.</span></h2></div>
        <div className="about-grid">
          <div className="about-copy">{aboutText.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}<a href="#experience" className="text-link">Follow my journey <ArrowUpRight size={16} aria-hidden="true" /></a></div>
          <GlassCard className="craft-card">
            <p className="eyebrow">From idea to everyday use</p>
            <div className="craft-row"><span className="craft-icon"><Smartphone size={21} aria-hidden="true" /></span><div><h3>Experiences that feel right.</h3><p>Thoughtful mobile and web applications.</p></div></div>
            <div className="craft-row"><span className="craft-icon"><Layers3 size={21} aria-hidden="true" /></span><div><h3>Built for the bigger picture.</h3><p>Scalable systems. Maintainable foundations.</p></div></div>
            <div className="craft-row"><span className="craft-icon"><Workflow size={21} aria-hidden="true" /></span><div><h3>Quality in every detail.</h3><p>Careful engineering, from first commit to launch.</p></div></div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
