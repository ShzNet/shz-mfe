import { LayoutDashboard, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface RemoteAdminMenuItem {
  title: string
  path: string
  icon: LucideIcon
  group: string
  disabled?: boolean
  hidden?: boolean
  end?: boolean
}

const baseMenu: RemoteAdminMenuItem[] = [
  { title: 'Overview', path: '', icon: LayoutDashboard, group: 'General', end: true },
  { title: 'Users', path: 'users', icon: Users, group: 'Management' },
]

export default baseMenu
