import { useCallback, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { apps } from '../remotes'
import { PermissionOverlay } from './components/app-loading-overlay'
import { preloadRemoteShell } from './components/remote-shell'
import { AuthGuard } from './components/auth-guard'
import { useAuthState } from './hooks/use-auth-state'
import { AppNavContext, permissionCache } from './lib/app-nav'
import { checkPermission } from './lib/app-permission'
import { AppShell } from './layouts/app-shell'
import { HomePage } from './layouts/home-page'
import { SignInPage } from './layouts/sign-in-page'
import type { AppDefinition, AuthState } from './types'

type PermCheckState = { app: AppDefinition; denied: boolean } | null

function AppRoutesContent() {
  const navigate = useNavigate()
  const { auth, signIn, signOut } = useAuthState()
  const [permCheck, setPermCheck] = useState<PermCheckState>(null)

  const navigateToApp = useCallback((app: AppDefinition) => {
    setPermCheck({ app, denied: false })

    // Check permission and preload the MF module in parallel.
    Promise.all([
      checkPermission(app.id),
      preloadRemoteShell(app.remoteName, app.entry).catch(() => null as null),
    ]).then(([ok]) => {
      if (ok) {
        permissionCache.add(app.id)
        setPermCheck(null)
        navigate(app.basePath)
      } else {
        setPermCheck({ app, denied: true })
      }
    }).catch(() => {
      setPermCheck({ app, denied: true })
    })
  }, [navigate])

  function handleSignIn(nextAuth: AuthState) {
    signIn(nextAuth)
    navigate('/', { replace: true })
  }

  return (
    <AppNavContext.Provider value={{ navigateToApp }}>
      {permCheck && (
        <PermissionOverlay
          app={permCheck.app}
          denied={permCheck.denied}
          onBack={() => setPermCheck(null)}
        />
      )}

      <Routes>
        <Route path='/sign-in' element={<SignInPage onSignIn={handleSignIn} />} />
        <Route
          index
          element={
            <AuthGuard auth={auth}>
              <HomePage auth={auth!} onSignOut={signOut} />
            </AuthGuard>
          }
        />
        {apps.map((app) => (
          <Route
            key={app.id}
            path={`${app.basePath}/*`}
            element={
              <AuthGuard auth={auth}>
                <AppShell key={app.id} app={app} auth={auth!} onSignOut={signOut} />
              </AuthGuard>
            }
          />
        ))}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </AppNavContext.Provider>
  )
}

export function AppRoutes() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppRoutesContent />
    </BrowserRouter>
  )
}
