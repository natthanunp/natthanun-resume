'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

interface HeaderProps {
  portfolioInfo: { name: string }
  hasExperience?: boolean
  hasSkills?: boolean
}

export function Header({ portfolioInfo, hasExperience = true, hasSkills = true }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const initials = portfolioInfo.name.split(' ').map((part) => part[0]).slice(0, 2).join('')
  const navItems = [
    { href: '#about', label: 'About' },
    ...(hasExperience ? [{ href: '#experience', label: 'Experience' }] : []),
    ...(hasSkills ? [{ href: '#skills', label: 'Skills' }] : []),
    { href: '#showcase', label: 'Showcase' },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`)
      }
    }, { rootMargin: '-15% 0px -65% 0px' })
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isMenuOpen])

  return (
    <header className="site-header">
      <nav className="nav-shell liquid-glass" aria-label="Main navigation">
        <Link href="/#hero" className="brand" aria-label={`${portfolioInfo.name} — home`} onClick={() => setIsMenuOpen(false)}>
          <span className="brand-mark">{initials}</span>
          <span className="brand-name">{portfolioInfo.name.split(' ')[0]}<span className="brand-dot">.</span></span>
        </Link>
        <div className="desktop-nav">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="nav-link" aria-current={activeSection === item.href ? 'location' : undefined}>{item.label}</a>
          ))}
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          <a href="#contact" className="nav-contact" onClick={() => setIsMenuOpen(false)}>Let’s talk <ArrowUpRight size={14} aria-hidden="true" /></a>
          <button className="mobile-menu-button icon-button" onClick={() => setIsMenuOpen((open) => !open)} aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={isMenuOpen} aria-controls="mobile-navigation">
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {isMenuOpen && (
          <div id="mobile-navigation" className="mobile-nav">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="nav-link" aria-current={activeSection === item.href ? 'location' : undefined} onClick={() => setIsMenuOpen(false)}>{item.label}<ArrowUpRight size={16} aria-hidden="true" /></a>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
