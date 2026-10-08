export const achievementCategories = ['Speaking', 'Conference', 'Award', 'Community'] as const

export interface Achievement {
  id: string
  title: string
  category: typeof achievementCategories[number]
  description: string
  event_date: string | null
  event_url: string | null
  order_index: number
}

export function formatAchievementMonth(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${date.slice(0, 10)}T00:00:00Z`))
}
