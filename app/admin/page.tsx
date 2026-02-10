import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'
import { ArrowLeft, LogOut } from 'lucide-react'
import { AdminTabs } from './admin-tabs'

export default async function AdminPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch all data
  const { data: portfolioData } = await supabase
    .from('portfolio_info')
    .select('*')
    .single()

  const { data: experiences } = await supabase
    .from('work_experience')
    .select('*')
    .order('order_index', { ascending: true })

  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .order('order_index', { ascending: true })

  const { data: dogs } = await supabase
    .from('dog_pictures')
    .select('*')
    .order('order_index', { ascending: true })

  if (!portfolioData) {
    return <div>Loading...</div>
  }

  return (
    <main className="relative min-h-screen">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-background via-background to-muted" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/70 backdrop-blur-2xl backdrop-saturate-150 dark:bg-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Button
            variant="ghost"
            className="rounded-full hover:bg-white/50 dark:hover:bg-white/5"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Portfolio
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <form action="/auth/logout" method="post">
              <Button
                type="submit"
                variant="ghost"
                className="rounded-full hover:bg-white/50 dark:hover:bg-white/5"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </form>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold tracking-tight text-balance md:text-5xl">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your portfolio content
            </p>
          </div>

          <AdminTabs
            portfolioData={portfolioData}
            experiences={experiences || []}
            skills={skills || []}
            dogs={dogs || []}
          />
        </div>
      </div>
    </main>
  )
}
