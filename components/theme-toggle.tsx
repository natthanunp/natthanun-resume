'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <button type="button" className="icon-button theme-toggle" disabled={!mounted} onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label={isDark ? 'Switch to light appearance' : 'Switch to dark appearance'} title={isDark ? 'Light appearance' : 'Dark appearance'}>
      {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
    </button>
  )
}
