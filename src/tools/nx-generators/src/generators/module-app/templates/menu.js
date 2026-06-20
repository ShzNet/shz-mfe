function buildMenuTs(options, menuItemTypeName) {
  return `import { LayoutDashboard, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface ${menuItemTypeName} {
  title: string
  path: string
  icon: LucideIcon
  group: string
  disabled?: boolean
  hidden?: boolean
  end?: boolean
}

const baseMenu: ${menuItemTypeName}[] = [
  { title: 'Overview', path: '', icon: LayoutDashboard, group: 'General', end: true },
  { title: 'Users', path: 'users', icon: Users, group: 'Management' },
]

export default baseMenu
`
}

module.exports = { buildMenuTs }
