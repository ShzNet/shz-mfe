import { useState } from 'react'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  Button, Badge,
} from '@shz/components'
import { Save, Bell, Shield, Globe, Palette } from 'lucide-react'

interface ToggleProps {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div className='flex items-center justify-between py-3'>
      <div>
        <p className='text-sm font-medium'>{label}</p>
        <p className='text-xs text-muted-foreground'>{description}</p>
      </div>
      <button
        role='switch'
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${checked ? 'bg-primary' : 'bg-input'}`}
      >
        <span
          className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  )
}

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('Shz MFE Admin')
  const [siteUrl, setSiteUrl] = useState('https://admin.shz-mfe.dev')

  const [notifs, setNotifs] = useState({
    email: true,
    push: false,
    digest: true,
    security: true,
  })

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: true,
    auditLog: true,
  })

  const sections = [
    {
      icon: Globe,
      title: 'General',
      description: 'Basic site configuration.',
      content: (
        <div className='space-y-4'>
          <div className='space-y-1.5'>
            <label className='text-sm font-medium'>Site Name</label>
            <input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className='h-9 w-full rounded-md border bg-transparent px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring'
            />
          </div>
          <div className='space-y-1.5'>
            <label className='text-sm font-medium'>Site URL</label>
            <input
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              className='h-9 w-full rounded-md border bg-transparent px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring'
            />
          </div>
        </div>
      ),
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Control when and how you receive alerts.',
      content: (
        <div className='divide-y'>
          <Toggle label='Email Notifications' description='Receive updates via email.' checked={notifs.email} onChange={(v) => setNotifs((p) => ({ ...p, email: v }))} />
          <Toggle label='Push Notifications' description='Browser push alerts for real-time events.' checked={notifs.push} onChange={(v) => setNotifs((p) => ({ ...p, push: v }))} />
          <Toggle label='Weekly Digest' description='Summary email every Monday morning.' checked={notifs.digest} onChange={(v) => setNotifs((p) => ({ ...p, digest: v }))} />
          <Toggle label='Security Alerts' description='Immediate notification on suspicious activity.' checked={notifs.security} onChange={(v) => setNotifs((p) => ({ ...p, security: v }))} />
        </div>
      ),
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Authentication and access control settings.',
      content: (
        <div className='divide-y'>
          <Toggle label='Two-Factor Authentication' description='Require 2FA for all admin accounts.' checked={security.twoFactor} onChange={(v) => setSecurity((p) => ({ ...p, twoFactor: v }))} />
          <Toggle label='Session Timeout' description='Auto-logout after 30 minutes of inactivity.' checked={security.sessionTimeout} onChange={(v) => setSecurity((p) => ({ ...p, sessionTimeout: v }))} />
          <Toggle label='Audit Log' description='Track all admin actions with timestamps.' checked={security.auditLog} onChange={(v) => setSecurity((p) => ({ ...p, auditLog: v }))} />
        </div>
      ),
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'UI preferences (managed by host shell).',
      content: (
        <div className='flex items-center gap-3 rounded-lg border border-dashed p-4'>
          <Badge variant='secondary'>Host-controlled</Badge>
          <p className='text-sm text-muted-foreground'>
            Theme and layout settings are configured in the host shell's Settings menu.
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className='flex flex-1 flex-col gap-6 p-4 pt-0'>
      <div className='flex items-center justify-between pt-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Settings</h1>
          <p className='text-sm text-muted-foreground'>Manage application configuration.</p>
        </div>
        <Button size='sm' className='gap-1.5'>
          <Save className='size-4' />
          Save Changes
        </Button>
      </div>

      <div className='grid gap-6'>
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <section.icon className='size-4 text-muted-foreground' />
                <CardTitle>{section.title}</CardTitle>
              </div>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>{section.content}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
