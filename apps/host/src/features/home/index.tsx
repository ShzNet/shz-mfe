import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, ShieldCheck, ChevronRight } from 'lucide-react'
import { Logo } from '@/assets/logo'
import { HeaderUser } from '@/components/layout/header-user'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { useAuthStore } from '@/stores/auth-store'
import { type AppModule } from '@/hooks/use-remote-routes'

const ICON_MAP: Record<string, React.ElementType> = { LayoutDashboard, Users, ShieldCheck }

const APP_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  dashboard: {
    bg: 'from-blue-500/20 to-indigo-500/20 group-hover:from-blue-500/30 group-hover:to-indigo-500/30',
    text: 'text-blue-600 dark:text-blue-400',
    ring: 'group-hover:ring-blue-500/40',
  },
  users: {
    bg: 'from-violet-500/20 to-purple-500/20 group-hover:from-violet-500/30 group-hover:to-purple-500/30',
    text: 'text-violet-600 dark:text-violet-400',
    ring: 'group-hover:ring-violet-500/40',
  },
  admin: {
    bg: 'from-rose-500/20 to-orange-500/20 group-hover:from-rose-500/30 group-hover:to-orange-500/30',
    text: 'text-rose-600 dark:text-rose-400',
    ring: 'group-hover:ring-rose-500/40',
  },
}

const FALLBACK_COLOR = {
  bg: 'from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30',
  text: 'text-primary',
  ring: 'group-hover:ring-primary/40',
}

interface NoAppSelectedProps {
  apps: AppModule[]
}

export function NoAppSelected({ apps }: NoAppSelectedProps) {
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const userName = auth.user?.email?.split('@')[0] ?? 'Admin'
  const userEmail = auth.user?.email ?? 'admin@shz-mfe.dev'

  const headerUser = { name: userName, email: userEmail, avatar: '' }

  return (
    <div className='relative flex h-svh flex-col overflow-hidden bg-background'>
      {/* Subtle background mesh */}
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

      {/* Top bar */}
      <header className='flex h-14 shrink-0 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-sm'>
        <div className='flex items-center gap-2 text-sm font-semibold'>
          <Logo className='size-5 text-primary' />
          <span>Shz MFE</span>
        </div>
        <div className='flex items-center gap-1'>
          <ThemeToggle />
          <HeaderUser user={headerUser} />
        </div>
      </header>

      {/* Main content */}
      <main className='flex flex-1 flex-col items-center justify-center px-6 py-12'>
        <div className='w-full max-w-2xl space-y-10'>
          <div className='space-y-1 text-center'>
            <h1 className='text-3xl font-semibold tracking-tight'>
              Chào mừng trở lại, {userName} 👋
            </h1>
            <p className='text-muted-foreground'>
              Chọn một module để bắt đầu làm việc.
            </p>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            {apps.map((app) => {
              const Icon = ICON_MAP[app.icon]
              const color = APP_COLORS[app.id] ?? FALLBACK_COLOR

              return (
                <button
                  key={app.id}
                  onClick={() => navigate(app.basePath)}
                  className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl border bg-gradient-to-br p-5 text-start ring-2 ring-transparent transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${color.bg} ${color.ring}`}
                >
                  <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl border bg-background/60 backdrop-blur-sm ${color.text}`}>
                    {Icon && <Icon className='size-6' />}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='font-semibold'>{app.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {app.routes.length} page{app.routes.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <ChevronRight className='size-4 shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-muted-foreground' />
                </button>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
