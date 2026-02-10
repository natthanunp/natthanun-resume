'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { ThemeToggle } from './theme-toggle'
import { Heart, Menu, X } from 'lucide-react'

interface HeaderProps {
  portfolioInfo: {
    name: string
    profile_image_url: string | null
  }
}

export function Header({ portfolioInfo }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#skills', label: 'Skills' },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-white/10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Logo/Name with Image */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white/20 transition-all group-hover:ring-primary/50 dark:ring-white/10">
              <Image
                src={portfolioInfo.profile_image_url || '/images/profile.jpg'}
                alt={portfolioInfo.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="hidden text-lg font-semibold sm:block">
              {portfolioInfo.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="rounded-full hover:bg-white/50 dark:hover:bg-white/5"
                asChild
              >
                <a href={item.href}>{item.label}</a>
              </Button>
            ))}
            <Button
              variant="ghost"
              className="rounded-full hover:bg-white/50 dark:hover:bg-white/5"
              asChild
            >
              <Link href="/dogs">
                <Heart className="mr-2 h-4 w-4" />
                My Dogs
              </Link>
            </Button>
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
                    className="w-full justify-start rounded-full hover:bg-white/50 dark:hover:bg-white/5"
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <a href={item.href}>{item.label}</a>
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-full hover:bg-white/50 dark:hover:bg-white/5"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/dogs">
                    <Heart className="mr-2 h-4 w-4" />
                    My Dogs
                  </Link>
                </Button>
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
