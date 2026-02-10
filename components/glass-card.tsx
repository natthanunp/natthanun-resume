import React from "react"
import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/20 bg-white/70 p-8 backdrop-blur-2xl backdrop-saturate-150',
        'dark:border-white/10 dark:bg-white/10',
        'shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]',
        'transition-all duration-500 ease-out',
        'hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.12)] dark:hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.6)]',
        'hover:scale-[1.01]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
