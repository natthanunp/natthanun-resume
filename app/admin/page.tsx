import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'
import { ArrowLeft, LogOut } from 'lucide-react'
import { EditPortfolioForm } from './edit-portfolio-form'

export default async function AdminPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch portfolio info
  const { data: portfolioData } = await supabase
    .from('portfolio_info')
    .select('*')
    .single()

  if (!portfolioData) {
    return <div>Loading...</div>
  }

  return (
    <main className="relative min-h-screen">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-background via-background to-muted" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/40 backdrop-blur-xl dark:bg-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Button
            variant="ghost"
            className="rounded-full bg-white/40 backdrop-blur-xl dark:bg-white/5"
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
                className="rounded-full bg-white/40 backdrop-blur-xl dark:bg-white/5"
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
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold tracking-tight md:text-5xl">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Edit your portfolio information below
            </p>
          </div>

          <EditPortfolioForm portfolioData={portfolioData} />
        </div>
      </div>
    </main>
  )
}
