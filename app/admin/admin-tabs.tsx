'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EditPortfolioForm } from './edit-portfolio-form'
import { ExperienceManager } from './experience-manager'
import { SkillsManager } from './skills-manager'
import { DogsManager } from './dogs-manager'

interface AdminTabsProps {
  portfolioData: any
  experiences: any[]
  skills: any[]
  dogs: any[]
}

export function AdminTabs({ portfolioData, experiences, skills, dogs }: AdminTabsProps) {
  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid rounded-full bg-white/70 backdrop-blur-2xl dark:bg-white/10 p-1">
        <TabsTrigger value="info" className="rounded-full">Portfolio Info</TabsTrigger>
        <TabsTrigger value="experience" className="rounded-full">Experience</TabsTrigger>
        <TabsTrigger value="skills" className="rounded-full">Skills</TabsTrigger>
        <TabsTrigger value="dogs" className="rounded-full">Dogs</TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="mt-6">
        <EditPortfolioForm portfolioData={portfolioData} />
      </TabsContent>

      <TabsContent value="experience" className="mt-6">
        <ExperienceManager experiences={experiences} />
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
