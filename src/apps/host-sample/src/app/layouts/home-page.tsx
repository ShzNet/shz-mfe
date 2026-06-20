import { Link } from 'react-router-dom'
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shz/components'
import { Activity, ArrowRight, CircleAlert, LayoutGrid, PlugZap, Server, ShieldCheck, Users } from 'lucide-react'
import { apps } from '../../remotes'
import { HeaderActions } from '../components/header-actions'
import type { AuthState } from '../types'

type HomePageProps = {
  auth: AuthState
  onSignOut: () => void
}

const stats = [
  { title: 'Connected apps', value: `${apps.length}`, description: 'Remote modules registered in host', icon: LayoutGrid },
  { title: 'Signed-in user', value: '01', description: 'Current host session is active', icon: Users },
  { title: 'Federation health', value: '99.9%', description: 'Mock uptime for sample dashboard', icon: Server },
  { title: 'Open alerts', value: '03', description: 'Fake items for dashboard preview', icon: CircleAlert },
]

const recentActivity = [
  { title: 'Admin sample manifest refreshed', time: '5 minutes ago' },
  { title: 'Host session validated', time: '18 minutes ago' },
  { title: 'Remote shell menu loaded', time: '32 minutes ago' },
]

export function HomePage({ auth, onSignOut }: HomePageProps) {
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
                  <CardTitle>Recent activity</CardTitle>
                  <CardDescription>Fake data to make the host landing page usable as a dashboard.</CardDescription>
                </div>
                <Activity className='size-4 text-muted-foreground' />
              </div>
            </CardHeader>
            <CardContent className='space-y-3'>
              {recentActivity.map((item, index) => (
                <div key={item.title} className='flex items-center gap-3 rounded-lg border p-3'>
                  <div className='flex size-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary'>
                    {index + 1}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='font-medium'>{item.title}</p>
                    <p className='text-sm text-muted-foreground'>{item.time}</p>
                  </div>
                </div>
              ))}
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
                <Link
                  key={app.id}
                  to={app.basePath}
                  className='group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50'
                >
                  <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                    <PlugZap className='size-4' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate font-medium'>{app.name}</p>
                    <p className='truncate text-sm text-muted-foreground'>{app.basePath}</p>
                  </div>
                  <ArrowRight className='size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5' />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
