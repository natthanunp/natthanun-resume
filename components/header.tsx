'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { ThemeToggle } from './theme-toggle'
import { Menu, X } from 'lucide-react'

interface HeaderProps {
  portfolioInfo: {
    name: string
  }
}

export function Header({ portfolioInfo }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#skills', label: 'Skills' },
    { href: '#dogs', label: 'My Dogs' },
  ]

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      const headerOffset = 65
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-white/5">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Logo/Name with Initials */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 rounded-full ring-2 ring-white/20 bg-gradient-to-br from-primary via-purple-500 to-pink-500 transition-all group-hover:ring-primary/50 dark:ring-white/10 flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-white">NP</span>
            </div>
            <span className="text-lg font-mono font-semibold">
              /natthanunp
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="rounded-full hover:bg-white/50 dark:hover:bg-white/5 dark:hover:text-blue-400 transition-all duration-300"
                asChild
              >
                <a href={item.href} onClick={(e) => handleScroll(e, item.href)}>{item.label}</a>
              </Button>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-white/20 bg-white/70 backdrop-blur-2xl dark:border-white/10 dark:bg-white/10 md:hidden">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className="w-full justify-start rounded-full hover:bg-white/50 dark:hover:bg-white/5 dark:hover:text-blue-400 transition-all duration-300"
                    asChild
                  >
                    <a href={item.href} onClick={(e) => handleScroll(e, item.href)}>{item.label}</a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[65px]" />
    </>
  )
}
