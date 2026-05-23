import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { RemoteModule } from '@/mf/remote-module'
import { SignIn } from '@/features/auth/sign-in'
import { NoAppSelected } from '@/features/home'
import { useRemoteRoutes } from '@/hooks/use-remote-routes'
import { useAuthStore } from '@/stores/auth-store'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { auth } = useAuthStore()
  if (!auth.accessToken) {
    return <Navigate to='/sign-in' replace />
  }
  return <>{children}</>
}

function AppLoading() {
  return (
    <div className='flex h-svh w-full items-center justify-center'>
      <div className='flex flex-col items-center gap-4'>
        <div className='size-10 animate-spin rounded-full border-4 border-primary border-t-transparent' />
        <p className='text-sm text-muted-foreground'>Loading application...</p>
      </div>
    </div>
  )
}

export function App() {
  const { apps, loading, error } = useRemoteRoutes()

  if (loading) return <AppLoading />

  if (error) {
    return (
      <div className='flex h-svh items-center justify-center p-4'>
        <div className='text-center'>
          <p className='text-destructive font-medium'>Failed to load modules</p>
          <p className='text-sm text-muted-foreground mt-1'>{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path='/sign-in' element={<SignIn />} />

        {/* Standalone home — no sidebar/navbar layout */}
        <Route
          index
          element={
            <AuthGuard>
              <NoAppSelected apps={apps} />
            </AuthGuard>
          }
        />

        {/* App routes — full layout with sidebar + navbar */}
        <Route
          element={
            <AuthGuard>
              <AuthenticatedLayout apps={apps} />
            </AuthGuard>
          }
        >
          {apps.map((app) => (
            <Route
              key={app.id}
              path={`${app.basePath}/*`}
              element={
                <RemoteModule
                  remoteName={app.remoteName}
                  exposedModule='./Page'
                />
              }
            />
          ))}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}
