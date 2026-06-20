import { useEffect, useState } from 'react'
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shznet/components'
import { ArrowRight, CircleAlert, LayoutGrid, PlugZap, Server, ShieldCheck, TrendingUp, Users } from 'lucide-react'
import { apps } from '../../remotes'
import { HeaderActions } from '../components/header-actions'
import { useAppNav } from '../lib/app-nav'
import type { AuthState } from '../types'

type HomePageProps = {
  auth: AuthState
  onSignOut: () => void
}

type DashboardData = {
  stats: { title: string; value: string; description: string; icon: React.ComponentType<{ className?: string }> }[]
  activityChart: { day: string; requests: number; errors: number }[]
}

async function fetchHomeData(): Promise<DashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    stats: [
      { title: 'Connected apps', value: `${apps.length}`, description: 'Remote modules registered in host', icon: LayoutGrid },
      { title: 'Signed-in user', value: '01', description: 'Current host session is active', icon: Users },
      { title: 'Federation health', value: '99.9%', description: 'Mock uptime for sample dashboard', icon: Server },
      { title: 'Open alerts', value: '03', description: 'Fake items for dashboard preview', icon: CircleAlert },
    ],
    activityChart: [
      { day: 'Mon', requests: 42, errors: 3 },
      { day: 'Tue', requests: 78, errors: 5 },
      { day: 'Wed', requests: 55, errors: 1 },
      { day: 'Thu', requests: 91, errors: 8 },
      { day: 'Fri', requests: 63, errors: 2 },
      { day: 'Sat', requests: 28, errors: 0 },
      { day: 'Sun', requests: 34, errors: 1 },
    ],
  }
}

function useAsyncData<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetcher().then((result) => {
      if (!active) return
      setData(result)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  return { data, loading }
}

function HomePageSkeleton({ auth, onSignOut }: HomePageProps) {
  return (
    <div className='flex min-h-svh flex-col bg-muted/30'>
      <header className='flex h-16 items-center justify-between border-b bg-background px-6'>
        <div className='flex items-center gap-3'>
          <div className='flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary'>
            <ShieldCheck className='size-5' />
          </div>
          <div>
            <p className='text-sm font-semibold tracking-tight'>Host Sample</p>
            <p className='text-xs text-muted-foreground'>Dashboard overview</p>
          </div>
        </div>
        <HeaderActions auth={auth} onSignOut={onSignOut} />
      </header>

      <main className='mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 md:p-6'>
        <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
          <div className='space-y-2'>
            <div className='animate-pulse rounded-md bg-foreground/10 h-8 w-48' />
            <div className='animate-pulse rounded-md bg-foreground/10 h-4 w-80' />
          </div>
          <div className='animate-pulse rounded-full bg-foreground/10 h-6 w-40' />
        </div>

        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {Array.from({ length: 4 }, (_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div className='animate-pulse rounded-md bg-foreground/10 h-4 w-24' />
                  <div className='animate-pulse rounded-md bg-foreground/10 size-4' />
                </div>
                <div className='animate-pulse rounded-md bg-foreground/10 h-8 w-16 mt-1' />
              </CardHeader>
              <CardContent>
                <div className='animate-pulse rounded-md bg-foreground/10 h-4 w-40' />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]'>
          <Card>
            <CardHeader>
              <div className='space-y-2'>
                <div className='animate-pulse rounded-md bg-foreground/10 h-5 w-36' />
                <div className='animate-pulse rounded-md bg-foreground/10 h-4 w-64' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='flex items-end gap-2 h-36'>
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className='flex flex-1 flex-col items-center gap-1.5'>
                    <div className='animate-pulse rounded-t-sm bg-foreground/10 w-full' style={{ height: `${40 + Math.random() * 60}%` }} />
                    <div className='animate-pulse rounded-md bg-foreground/10 h-3 w-6' />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className='space-y-2'>
                <div className='animate-pulse rounded-md bg-foreground/10 h-5 w-28' />
                <div className='animate-pulse rounded-md bg-foreground/10 h-4 w-48' />
              </div>
            </CardHeader>
            <CardContent className='space-y-3'>
              {apps.map((app) => (
                <div key={app.id} className='animate-pulse rounded-lg bg-foreground/10 h-16 w-full' />
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export function HomePage({ auth, onSignOut }: HomePageProps) {
  const { navigateToApp } = useAppNav()
  const { data, loading } = useAsyncData(fetchHomeData)

  if (loading || !data) return <HomePageSkeleton auth={auth} onSignOut={onSignOut} />

  const { stats, activityChart } = data
  const maxRequests = Math.max(...activityChart.map((d) => d.requests))

  return (
    <div className='flex min-h-svh flex-col bg-muted/30'>
      <header className='flex h-16 items-center justify-between border-b bg-background px-6'>
        <div className='flex items-center gap-3'>
          <div className='flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary'>
            <ShieldCheck className='size-5' />
          </div>
          <div>
            <p className='text-sm font-semibold tracking-tight'>Host Sample</p>
            <p className='text-xs text-muted-foreground'>Dashboard overview</p>
          </div>
        </div>
        <HeaderActions auth={auth} onSignOut={onSignOut} />
      </header>

      <main className='mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 md:p-6'>
        <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Host Dashboard</h1>
            <p className='text-sm text-muted-foreground'>
              Giao diện này bám theo sample dashboard và giữ app selector trong một block riêng.
            </p>
          </div>
          <Badge variant='secondary' className='w-fit text-xs'>
            {auth.email}
          </Badge>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardDescription>{stat.title}</CardDescription>
                  <stat.icon className='size-4 text-muted-foreground' />
                </div>
                <CardTitle className='text-2xl'>{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <CardTitle>Request activity</CardTitle>
                  <CardDescription>Requests vs errors over the last 7 days.</CardDescription>
                </div>
                <TrendingUp className='size-4 text-muted-foreground' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='flex items-end gap-2 h-36'>
                {activityChart.map((item) => (
                  <div key={item.day} className='flex flex-1 flex-col items-center gap-1.5'>
                    <div className='relative flex w-full flex-col items-center justify-end gap-0.5' style={{ height: '112px' }}>
                      <div
                        className='w-full rounded-t-sm bg-destructive/60 transition-all duration-500'
                        style={{ height: `${(item.errors / maxRequests) * 100}%` }}
                      />
                      <div
                        className='w-full rounded-t-sm bg-primary/70 transition-all duration-500'
                        style={{ height: `${(item.requests / maxRequests) * 100}%` }}
                      />
                    </div>
                    <span className='text-xs text-muted-foreground'>{item.day}</span>
                  </div>
                ))}
              </div>
              <div className='mt-3 flex items-center gap-4 text-xs text-muted-foreground'>
                <span className='flex items-center gap-1.5'><span className='inline-block size-2.5 rounded-sm bg-primary/70' />Requests</span>
                <span className='flex items-center gap-1.5'><span className='inline-block size-2.5 rounded-sm bg-destructive/60' />Errors</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <CardTitle>App selector</CardTitle>
                  <CardDescription>Chọn app từ block này để mở remote module.</CardDescription>
                </div>
                <PlugZap className='size-4 text-muted-foreground' />
              </div>
            </CardHeader>
            <CardContent className='space-y-3'>
              {apps.map((app) => (
                <button
                  key={app.id}
                  type='button'
                  onClick={() => navigateToApp(app)}
                  className='group flex w-full items-center gap-3 rounded-lg border p-3 text-start transition-colors hover:bg-muted/50'
                >
                  <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                    <PlugZap className='size-4' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate font-medium'>{app.name}</p>
                    <p className='truncate text-sm text-muted-foreground'>{app.basePath}</p>
                  </div>
                  <ArrowRight className='size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5' />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
