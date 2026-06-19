import { Link } from 'react-router-dom'
import { ShieldCheck, ChevronRight, PlugZap } from 'lucide-react'
import { apps } from '../../remotes'
import { HeaderActions } from '../components/header-actions'
import type { AuthState } from '../types'

type HomePageProps = {
  auth: AuthState
  onSignOut: () => void
}

export function HomePage({ auth, onSignOut }: HomePageProps) {
  return (
    <div className='relative flex min-h-svh flex-col overflow-hidden bg-background'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10'
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 20% -10%, oklch(0.6 0.2 265 / 0.08), transparent),
            radial-gradient(ellipse 60% 40% at 80% 110%, oklch(0.6 0.2 290 / 0.06), transparent)
          `,
        }}
      />
      <header className='flex h-14 shrink-0 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-sm'>
        <div className='flex items-center gap-2 text-sm font-semibold'>
          <ShieldCheck className='size-4 text-primary' />
          <span>Host Sample</span>
        </div>
        <HeaderActions auth={auth} onSignOut={onSignOut} />
      </header>
      <main className='flex flex-1 flex-col items-center justify-center px-6 py-12'>
        <div className='w-full max-w-2xl space-y-10'>
          <div className='space-y-1 text-center'>
            <h1 className='text-3xl font-semibold tracking-tight'>Welcome back</h1>
            <p className='text-muted-foreground'>Choose a module to continue working.</p>
          </div>

          <div className='grid gap-4'>
            {apps.map((app) => (
              <Link
                key={app.id}
                to={app.basePath}
                className='group flex items-center gap-4 rounded-2xl border bg-card/80 p-5 text-start shadow-sm ring-2 ring-transparent transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-primary/20'
              >
                <div className='flex size-12 shrink-0 items-center justify-center rounded-xl border bg-primary/10 text-primary'>
                  <PlugZap className='size-5' />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='font-semibold'>{app.name}</p>
                  <p className='text-xs text-muted-foreground'>{app.basePath}</p>
                </div>
                <ChevronRight className='size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground' />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
