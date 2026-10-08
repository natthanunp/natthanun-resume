import { z } from 'zod'
import { achievementCategories } from './achievements'

export const achievementSchema = z.object({
  title: z.string().trim().min(1, 'Add a title.').max(160, 'Keep the title under 160 characters.'),
  category: z.enum(achievementCategories),
  description: z.string().trim().min(1, 'Add a description.').max(2000, 'Keep the description under 2,000 characters.'),
  event_month: z.string().regex(/^([1-9]\d{3}-(0[1-9]|1[0-2]))?$/, 'Choose a valid event month.'),
  event_url: z.string().trim().max(2048).refine((value) => {
    if (!value) return true
    try { return ['https:', 'http:'].includes(new URL(value).protocol) } catch { return false }
  }, 'Use a complete http:// or https:// link.'),
})
