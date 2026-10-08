import { Code2, Presentation, Trophy, Users } from 'lucide-react'
import type { Achievement } from '@/lib/achievements'

export function AchievementIcon({ category }: { category: Achievement['category'] }) {
  const Icon = category === 'Speaking' ? Presentation : category === 'Conference' ? Code2 : category === 'Award' ? Trophy : Users
  return <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
}
