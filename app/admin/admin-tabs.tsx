'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EditPortfolioForm } from './edit-portfolio-form'
import { ExperienceManager } from './experience-manager'
import { AchievementsManager } from './achievements-manager'
import type { Achievement } from '@/lib/achievements'
import { SkillsManager } from './skills-manager'
import { DogsManager } from './dogs-manager'

interface AdminTabsProps {
  portfolioData: any
  experiences: any[]
  achievements: Achievement[]
  achievementsError?: boolean
  skills: any[]
  dogs: any[]
}

export function AdminTabs({ portfolioData, experiences, achievements, achievementsError, skills, dogs }: AdminTabsProps) {
  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl bg-white/70 p-1 backdrop-blur-2xl dark:bg-white/10 sm:w-fit sm:rounded-full">
        <TabsTrigger value="info" className="rounded-full">Portfolio Info</TabsTrigger>
        <TabsTrigger value="experience" className="rounded-full">Experience</TabsTrigger>
        <TabsTrigger value="achievements" className="rounded-full">Achievements</TabsTrigger>
        <TabsTrigger value="skills" className="rounded-full">Skills</TabsTrigger>
        <TabsTrigger value="dogs" className="rounded-full">Dogs</TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="mt-6">
        <EditPortfolioForm portfolioData={portfolioData} />
      </TabsContent>

      <TabsContent value="experience" className="mt-6">
        <ExperienceManager experiences={experiences} />
      </TabsContent>

      <TabsContent value="achievements" className="mt-6">
        {achievementsError ? <p role="alert" className="rounded-xl border border-destructive/30 p-4">Could not load achievements. Please refresh and try again.</p> : <AchievementsManager achievements={achievements} />}
      </TabsContent>

      <TabsContent value="skills" className="mt-6">
        <SkillsManager skills={skills} />
      </TabsContent>

      <TabsContent value="dogs" className="mt-6">
        <DogsManager dogs={dogs} />
      </TabsContent>
    </Tabs>
  )
}
