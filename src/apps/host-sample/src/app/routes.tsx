import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { apps } from '../remotes'
import { AuthGuard } from './components/auth-guard'
import { useAuthState } from './hooks/use-auth-state'
import { AppShell } from './layouts/app-shell'
import { HomePage } from './layouts/home-page'
import { SignInPage } from './layouts/sign-in-page'
import type { AuthState } from './types'

function AppRoutesContent() {
  const navigate = useNavigate()
  const { auth, signIn, signOut } = useAuthState()

  function handleSignIn(nextAuth: AuthState) {
    signIn(nextAuth)
    navigate('/', { replace: true })
  }

  return (
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
              <AppShell app={app} auth={auth!} onSignOut={signOut} />
            </AuthGuard>
          }
        />
      ))}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AppRoutesContent />
    </BrowserRouter>
  )
}
