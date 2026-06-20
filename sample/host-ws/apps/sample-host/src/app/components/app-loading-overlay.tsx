import { useEffect, useState } from 'react'
import { Button } from '@shznet/components'
import { ShieldCheck, ShieldOff } from 'lucide-react'
import type { AppDefinition } from '../types'

function LoadingBar({ targetPct, duration }: { targetPct: number; duration: number }) {
  const [pct, setPct] = useState(4)

  useEffect(() => {
    setPct(4)
    const id = setTimeout(() => setPct(targetPct), 60)
    return () => clearTimeout(id)
  }, [targetPct, duration])

  return (
    <div className='h-1 w-52 overflow-hidden rounded-full bg-foreground/10'>
      <div
        className='h-full rounded-full bg-primary'
        style={{ width: `${pct}%`, transition: `width ${duration}ms cubic-bezier(0.4,0,0.2,1)` }}
      />
    </div>
  )
}

type PermissionOverlayProps = {
  app: AppDefinition
  denied: boolean
  onBack: () => void
}

export function PermissionOverlay({ app, denied, onBack }: PermissionOverlayProps) {
  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background/85 backdrop-blur-md'>
      {denied ? (
        <>
          <div className='flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
            <ShieldOff className='size-6' />
          </div>
          <div className='flex flex-col items-center gap-1 text-center'>
            <p className='text-base font-semibold'>Access denied</p>
            <p className='text-sm text-muted-foreground'>
              You don&apos;t have permission to open{' '}
              <span className='font-medium'>{app.name}</span>.
            </p>
          </div>
          <Button variant='outline' size='sm' onClick={onBack}>
            Back
          </Button>
        </>
      ) : (
        <>
          <div className='relative flex size-16 items-center justify-center'>
            <div className='absolute inset-0 animate-spin rounded-full border-[3px] border-muted border-t-primary' />
            <div className='size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
              <ShieldCheck className='size-4' />
            </div>
          </div>
          <div className='flex flex-col items-center gap-1 text-center'>
            <p className='text-sm font-medium'>Checking permissions</p>
            <p className='text-xs text-muted-foreground'>{app.name}</p>
          </div>
          <LoadingBar targetPct={70} duration={900} />
        </>
      )}
    </div>
  )
}
