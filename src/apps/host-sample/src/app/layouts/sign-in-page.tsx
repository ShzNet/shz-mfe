import type { FormEvent } from 'react'
import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '@shznet/components'
import type { AuthState } from '../types'

type SignInPageProps = {
  onSignIn: (auth: AuthState) => void
}

export function SignInPage({ onSignIn }: SignInPageProps) {
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
