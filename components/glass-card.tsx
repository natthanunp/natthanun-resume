import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> { children: ReactNode }

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return <div className={cn('liquid-glass glass-card', className)} {...props}>{children}</div>
}
