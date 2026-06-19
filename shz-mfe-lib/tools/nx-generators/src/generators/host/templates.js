function buildRsbuildConfig(options) {
  return `import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'
import { pluginTypeCheck } from '@rsbuild/plugin-type-check'
import tailwindcss from '@tailwindcss/postcss'

export default defineConfig({
  server: {
    port: ${options.port},
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  dev: {
    writeToDisk: true,
    client: { host: 'localhost', port: ${options.port} },
  },
  tools: {
    postcss: (config) => {
      if (typeof config.postcssOptions === 'function') return
      config.postcssOptions ??= {}
      config.postcssOptions.plugins ??= []
      config.postcssOptions.plugins.unshift(tailwindcss)
    },
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  source: {
    entry: { index: './src/main.tsx' },
  },
  html: {
    template: './index.html',
  },
  plugins: [
    pluginReact(),
    pluginTypeCheck({
      tsCheckerOptions: {
        typescript: { configOverwrite: { include: ['src/**/*'] } },
      },
    }),
    pluginModuleFederation({
      dts: false,
      name: '${options.name.replace(/-/g, '_')}',
      remotes: {},
      shared: {
        react: { singleton: true, eager: true, requiredVersion: false },
        'react-dom': { singleton: true, eager: true, requiredVersion: false },
        'react-router-dom': { singleton: true, eager: true, requiredVersion: false },
      },
    }),
  ],
})
`
}

function buildMainTsx() {
  return `import './styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'sonner'
import { App } from './app'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <>
      <App />
      <Toaster />
    </>
  </React.StrictMode>
)
`
}

function buildAppTsx(options) {
  return `import { Suspense, lazy, useEffect, useMemo, useState, type ComponentType, type FormEvent, type ReactNode } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  ScrollArea,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '${options.componentsPackage}'
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  LogIn,
  LogOut,
  Monitor,
  Moon,
  PlugZap,
  ShieldCheck,
  Sparkles,
  Sun,
} from 'lucide-react'
import { apps } from './remotes'

const AUTH_KEY = '${options.name}-auth'
const THEME_KEY = '${options.name}-theme'

type AuthState = {
  email: string
}

type ThemeMode = 'light' | 'dark' | 'system'

type RemotePageModule = {
  default: ComponentType
}

type RemoteNavModule = {
  default: ComponentType
}

type RemoteManifest = {
  exposes?: Array<{
    path: string
    assets?: {
      css?: {
        sync?: string[]
        async?: string[]
      }
    }
  }>
}

const loadedRemoteStyles = new Set<string>()

function buildModuleId(remoteName: string, exposedModule: string) {
  return \`\${remoteName}\${exposedModule.replace(/^\\./, '')}\`
}

function readAuthState(): AuthState | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(AUTH_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthState
  } catch {
    return null
  }
}

function writeAuthState(auth: AuthState | null) {
  if (typeof window === 'undefined') return
  if (!auth) {
    window.localStorage.removeItem(AUTH_KEY)
    return
  }
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system'
  return (window.localStorage.getItem(THEME_KEY) as ThemeMode) ?? 'system'
}

async function loadRemoteStyles(manifestUrl: string, exposedModule: string) {
  const manifest = (await fetch(manifestUrl).then((response) => response.json())) as RemoteManifest
  const expose = manifest.exposes?.find((item) => item.path === exposedModule)
  const cssAssets = [...(expose?.assets?.css?.sync ?? []), ...(expose?.assets?.css?.async ?? [])]
  const baseUrl = new URL(manifestUrl)

  await Promise.all(
    cssAssets.map(async (asset) => {
      const href = new URL(asset, baseUrl).toString()
      if (loadedRemoteStyles.has(href)) return

      await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLLinkElement>(\`link[rel="stylesheet"][href="\${href}"]\`)
        if (existing) {
          loadedRemoteStyles.add(href)
          resolve()
          return
        }

        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        link.onload = () => {
          loadedRemoteStyles.add(href)
          resolve()
        }
        link.onerror = () => reject(new Error(\`Failed to load remote stylesheet: \${href}\`))
        document.head.appendChild(link)
      })
    })
  )
}

async function loadRemoteModule<T>(remoteName: string, exposedModule: string, entry: string) {
  const { loadRemote } = await import('@module-federation/enhanced/runtime')
  await loadRemoteStyles(entry, exposedModule)
  const moduleId = buildModuleId(remoteName, exposedModule)
  return (await loadRemote(moduleId)) as T
}

function AuthGuard({ auth, children }: { auth: AuthState | null; children: ReactNode }) {
  const location = useLocation()
  if (!auth) {
    const redirect = encodeURIComponent(\`\${location.pathname}\${location.search}\`)
    return <Navigate to={\`/sign-in?redirect=\${redirect}\`} replace />
  }
  return <>{children}</>
}

function Home({ auth }: { auth: AuthState }) {
  return (
    <div className='relative flex min-h-svh flex-col overflow-hidden bg-background'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10'
        style={{
          backgroundImage: \`
            radial-gradient(ellipse 80% 50% at 20% -10%, oklch(0.6 0.2 265 / 0.08), transparent),
            radial-gradient(ellipse 60% 40% at 80% 110%, oklch(0.6 0.2 290 / 0.06), transparent)
          \`,
        }}
      />
      <header className='flex h-14 shrink-0 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-sm'>
        <div className='flex items-center gap-2 text-sm font-semibold'>
          <ShieldCheck className='size-4 text-primary' />
          <span>${options.displayName}</span>
        </div>
        <Badge variant='secondary'>{auth.email}</Badge>
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

function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => readThemeMode())
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(getSystemTheme())
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  function handleSetTheme(nextTheme: ThemeMode) {
    window.localStorage.setItem(THEME_KEY, nextTheme)
    setTheme(nextTheme)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          {resolvedTheme === 'dark' ? <Moon className='size-5' /> : <Sun className='size-5' />}
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => handleSetTheme('light')} className='gap-2'>
          <Sun className='size-4' />
          Light
          {theme === 'light' && <span className='ml-auto text-xs text-muted-foreground'>✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetTheme('dark')} className='gap-2'>
          <Moon className='size-4' />
          Dark
          {theme === 'dark' && <span className='ml-auto text-xs text-muted-foreground'>✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetTheme('system')} className='gap-2'>
          <Monitor className='size-4' />
          System
          {theme === 'system' && <span className='ml-auto text-xs text-muted-foreground'>✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function HeaderNotification() {
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'New user registered', description: 'user@example.com just signed up.', time: '2 min ago', read: false },
    { id: '2', title: 'Dashboard report ready', description: 'Monthly analytics report has been generated.', time: '1 hr ago', read: false },
    { id: '3', title: 'System update', description: 'Maintenance scheduled for Sunday 2:00 AM.', time: '3 hr ago', read: true },
  ])

  const unreadCount = notifications.filter((item) => !item.read).length
  const markAllRead = () => setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
  const markRead = (id: string) => setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='size-5' />
          {unreadCount > 0 && (
            <span className='absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white'>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className='sr-only'>Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80 p-0' sideOffset={8}>
        <div className='flex items-center justify-between px-4 py-3'>
          <div>
            <p className='text-sm font-semibold'>Notifications</p>
            {unreadCount > 0 && <p className='text-xs text-muted-foreground'>{unreadCount} unread</p>}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className='text-xs text-primary hover:underline'>
              Mark all read
            </button>
          )}
        </div>
        <Separator />
        <ScrollArea className='max-h-80'>
          <div>
            {notifications.map((item, index) => (
              <div key={item.id}>
                <button
                  onClick={() => markRead(item.id)}
                  className={\`flex w-full gap-3 px-4 py-3 text-start transition-colors hover:bg-muted/50 \${!item.read ? 'bg-muted/20' : ''}\`}
                >
                  <span className={\`mt-1.5 size-2 shrink-0 rounded-full \${item.read ? 'bg-transparent' : 'bg-primary'}\`} />
                  <div className='min-w-0 flex-1'>
                    <p className={\`text-sm \${!item.read ? 'font-medium' : ''}\`}>{item.title}</p>
                    <p className='truncate text-xs text-muted-foreground'>{item.description}</p>
                    <p className='mt-0.5 text-xs text-muted-foreground/70'>{item.time}</p>
                  </div>
                </button>
                {index < notifications.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SignIn({ onSignIn }: { onSignIn: (auth: AuthState) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email || password.length < 7) return
    onSignIn({ email })
  }

  return (
    <div className='flex min-h-svh items-center justify-center bg-muted/30 p-6'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Sign in</CardTitle>
          <CardDescription>Use any email and a password with at least 7 characters.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className='grid gap-4' onSubmit={handleSubmit}>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' value={email} placeholder='name@example.com' onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' type='password' value={password} placeholder='••••••••' onChange={(event) => setPassword(event.target.value)} />
            </div>
            <Button type='submit' className='mt-2' disabled={!email || password.length < 7}>
              <LogIn />
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function HeaderUser({ auth, onSignOut }: { auth: AuthState; onSignOut: () => void }) {
  const [signOutOpen, setSignOutOpen] = useState(false)
  const initials = auth.email.slice(0, 2).toUpperCase()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className='rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring'>
            <Avatar className='size-8'>
              <AvatarImage src='' alt={auth.email} />
              <AvatarFallback className='text-xs font-semibold'>{initials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='min-w-56 rounded-lg'>
          <DropdownMenuLabel className='p-0 font-normal'>
            <div className='flex items-center gap-2 px-1 py-1.5'>
              <Avatar className='size-8 rounded-lg'>
                <AvatarImage src='' alt={auth.email} />
                <AvatarFallback className='rounded-lg text-xs'>{initials}</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-start text-sm leading-tight'>
                <span className='truncate font-semibold'>{auth.email.split('@')[0]}</span>
                <span className='truncate text-xs text-muted-foreground'>{auth.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Sparkles className='size-4' />
              Upgrade to Pro
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <BadgeCheck className='size-4' />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className='size-4' />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className='size-4' />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setSignOutOpen(true)}>
            <LogOut className='size-4' />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={signOutOpen} onOpenChange={setSignOutOpen}>
        <DialogContent className='sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle>Sign out</DialogTitle>
            <DialogDescription>Are you sure you want to sign out?</DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2'>
            <Button variant='outline' onClick={() => setSignOutOpen(false)}>Cancel</Button>
            <Button variant='destructive' onClick={onSignOut}>Sign out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function RemotePage({ remoteName, exposedModule, entry }: { remoteName: string; exposedModule: string; entry: string }) {
  const LazyComp = lazy(async () => {
    const mod = await loadRemoteModule<RemotePageModule>(remoteName, exposedModule, entry)
    return { default: mod.default }
  })

  return (
    <Suspense fallback={<div className='p-6 text-sm text-muted-foreground'>Loading module...</div>}>
      <LazyComp />
    </Suspense>
  )
}

function RemoteNav({ remoteName, entry }: { remoteName: string; entry: string }) {
  const LazyComp = lazy(async () => {
    const mod = await loadRemoteModule<RemoteNavModule>(remoteName, './Nav', entry)
    return { default: mod.default }
  })

  return (
    <Suspense fallback={<div className='p-6 text-sm text-muted-foreground'>Loading module...</div>}>
      <LazyComp />
    </Suspense>
  )
}

function AppHeader({ app, auth, onSignOut }: { app: (typeof apps)[number]; auth: AuthState; onSignOut: () => void }) {
  return (
    <header className='flex h-14 items-center gap-3 border-b bg-sidebar/95 px-4'>
      <SidebarTrigger />
      <Separator orientation='vertical' className='h-4' />
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium'>{app.name}</p>
        <p className='truncate text-xs text-muted-foreground'>{app.basePath}</p>
      </div>
      <Badge variant='secondary' className='hidden sm:inline-flex'>
        {auth.email}
      </Badge>
      <div className='ml-auto flex items-center gap-1'>
        <ThemeToggle />
        <HeaderNotification />
        <HeaderUser auth={auth} onSignOut={onSignOut} />
      </div>
    </header>
  )
}

function AppSidebarNav({ app }: { app: (typeof apps)[number] }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activeApp = apps.find((item) => pathname === item.basePath || pathname.startsWith(\`\${item.basePath}/\`)) ?? app

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              variant='outline'
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex size-8 items-center justify-center rounded-lg border bg-primary/10 text-primary'>
                <PlugZap className='size-4' />
              </div>
              <div className='grid min-w-0 flex-1 text-start text-sm leading-tight group-data-[collapsible=icon]:hidden'>
                <span className='truncate font-semibold'>{activeApp.name}</span>
                <span className='truncate text-xs text-muted-foreground'>App selector</span>
              </div>
              <ChevronsUpDown className='ms-auto size-4 group-data-[collapsible=icon]:hidden' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='min-w-56 rounded-lg' align='start' side='right' sideOffset={4}>
            <DropdownMenuLabel className='text-xs text-muted-foreground'>Applications</DropdownMenuLabel>
            {apps.map((item) => {
              const isActive = item.id === activeApp.id
              return (
                <DropdownMenuItem key={item.id} onClick={() => navigate(item.basePath)} className='gap-2 p-2'>
                  <div className='flex size-7 items-center justify-center rounded-md border bg-primary/10 text-primary'>
                    <PlugZap className='size-4' />
                  </div>
                  <span className={isActive ? 'font-medium' : ''}>{item.name}</span>
                  {isActive && <span className='ms-auto text-xs text-muted-foreground'>active</span>}
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 p-2 text-muted-foreground' onClick={() => navigate('/')}>
              Back to home
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <Separator />
      <RemoteNav remoteName={app.remoteName} entry={app.entry} />
    </SidebarMenu>
  )
}

function AppFrame({ app }: { app: (typeof apps)[number] }) {
  const navigate = useNavigate()
  const [auth, setAuth] = useState<AuthState | null>(() => readAuthState())

  useEffect(() => {
    setAuth(readAuthState())
  }, [])

  function handleSignOut() {
    writeAuthState(null)
    setAuth(null)
    navigate('/sign-in', { replace: true })
  }

  return (
    <AuthGuard auth={auth}>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible='icon'>
          <SidebarHeader className='gap-3 p-4'>
            <AppSidebarNav app={app} />
          </SidebarHeader>
          <SidebarContent className='p-2' />
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <AppHeader app={app} auth={auth!} onSignOut={handleSignOut} />
          <main className='flex min-h-0 flex-1 flex-col'>
            <RemotePage remoteName={app.remoteName} exposedModule='./Page' entry={app.entry} />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}

function AppRoutes() {
  const navigate = useNavigate()
  const [auth, setAuth] = useState<AuthState | null>(() => readAuthState())

  const handleSignIn = useMemo(
    () => (nextAuth: AuthState) => {
      writeAuthState(nextAuth)
      setAuth(nextAuth)
      navigate('/', { replace: true })
    },
    [navigate]
  )

  return (
    <Routes>
      <Route path='/sign-in' element={<SignIn onSignIn={handleSignIn} />} />
      <Route
        index
        element={
          <AuthGuard auth={auth}>
            <Home auth={auth!} />
          </AuthGuard>
        }
      />
      {apps.map((app) => (
        <Route key={app.id} path={\`\${app.basePath}/*\`} element={<AppFrame app={app} />} />
      ))}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}

export function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppRoutes />
    </BrowserRouter>
  )
}
`
}

function buildRemotesTs() {
  return `import { registerRemotes } from '@module-federation/enhanced/runtime'

export interface HostRemoteApp {
  id: string
  name: string
  basePath: string
  remoteName: string
  entry: string
}

export const apps: HostRemoteApp[] = [
  {
    id: 'sample',
    name: 'Sample Module',
    basePath: '/app/sample',
    remoteName: 'remote_sample',
    entry: 'http://localhost:3001/mf-manifest.json',
  },
]

registerRemotes(apps.map((app) => ({ name: app.remoteName, entry: app.entry })))
`
}

module.exports = {
  buildRsbuildConfig,
  buildMainTsx,
  buildAppTsx,
  buildRemotesTs,
}
