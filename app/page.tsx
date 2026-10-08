import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { AboutSection } from '@/components/about-section'
import { ShowcaseSection } from '@/components/showcase-section'
import { ExperienceSection } from '@/components/experience-section'
import { AchievementsSection } from '@/components/achievements-section'
import { SkillsSection } from '@/components/skills-section'
import { DogsSection } from '@/components/dogs-section'

export default async function Home() {
  const supabase = await createClient()
  const [{ data: portfolioData }, { data: experiences }, { data: achievements }, { data: skills }] = await Promise.all([
    supabase.from('portfolio_info').select('*').single(),
    supabase.from('work_experience').select('*').order('order_index', { ascending: true }),
    supabase.from('achievements').select('*').order('order_index', { ascending: true }).order('created_at', { ascending: true }).order('id', { ascending: true }),
    supabase.from('skills').select('*').order('order_index', { ascending: true }),
  ])

  if (!portfolioData) {
    return <main className="site-container error-state"><p className="eyebrow">A brief intermission</p><h1>The portfolio will be right back.</h1><p>Something interrupted the connection. Please try again in a moment.</p><a href="/" className="button-primary">Try again <ArrowUpRight size={16} aria-hidden="true" /></a></main>
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header portfolioInfo={{ name: portfolioData.name }} hasExperience={!!experiences?.length} hasAchievements={!!achievements?.length} hasSkills={!!skills?.length} />
      <main id="main-content" className="portfolio-main">
        <HeroSection portfolioInfo={portfolioData} />
        <AboutSection aboutText={portfolioData.about} />
        {!!experiences?.length && <ExperienceSection experiences={experiences} />}
        <AchievementsSection achievements={achievements ?? []} />
        {!!skills?.length && <SkillsSection skills={skills} />}
        <ShowcaseSection />
        <DogsSection />
        <section id="contact" className="section-space contact-section" aria-labelledby="contact-title">
          <div className="site-container"><div className="contact-card liquid-glass"><div className="contact-haze" aria-hidden="true" /><p className="eyebrow">Good things start with a conversation</p><h2 id="contact-title">Have something<br /><span className="text-muted-foreground">in mind?</span></h2><p className="contact-description">An interesting idea, a new opportunity, or just a hello.<br />I’d love to hear from you.</p><a href={`mailto:${portfolioData.email}`} className="button-primary">Let’s make it happen <ArrowUpRight size={18} aria-hidden="true" /></a><a href={`mailto:${portfolioData.email}`} className="contact-email"><Mail size={14} aria-hidden="true" />{portfolioData.email}</a></div></div>
        </section>
      </main>
      <footer className="site-footer site-container"><div><a href="#hero" className="footer-name">{portfolioData.name}<span className="brand-dot">.</span></a><p>Thoughtfully built. Always evolving.</p></div><div className="footer-right"><div className="footer-socials">{portfolioData.github_url && <a href={portfolioData.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)"><Github size={17} /></a>}{portfolioData.linkedin_url && <a href={portfolioData.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)"><Linkedin size={17} /></a>}<a href={`mailto:${portfolioData.email}`} aria-label="Send an email"><Mail size={17} /></a></div><p>© {new Date().getFullYear()} {portfolioData.name}</p></div></footer>
    </>
  )
}
