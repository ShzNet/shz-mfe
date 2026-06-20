import type { UserForm, UserRow, WorkMode } from './types'

const baseUsers: Array<Omit<UserRow, 'location' | 'manager' | 'employeeCode' | 'phone' | 'workMode' | 'timezone' | 'lastActive'>> = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', team: 'Platform', joined: '2024-01-10' },
  { id: '2', name: 'Bob Martinez', email: 'bob@example.com', role: 'editor', status: 'active', team: 'Design', joined: '2024-02-15' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'viewer', status: 'pending', team: 'Product', joined: '2024-03-22' },
  { id: '4', name: 'David Chen', email: 'david@example.com', role: 'editor', status: 'inactive', team: 'Platform', joined: '2024-04-05' },
  { id: '5', name: 'Eva Park', email: 'eva@example.com', role: 'viewer', status: 'active', team: 'Marketing', joined: '2024-05-18' },
  { id: '6', name: 'Frank Lee', email: 'frank@example.com', role: 'admin', status: 'active', team: 'Security', joined: '2024-06-01' },
  { id: '7', name: 'Grace Kim', email: 'grace@example.com', role: 'editor', status: 'active', team: 'Design', joined: '2024-06-15' },
  { id: '8', name: 'Henry Brown', email: 'henry@example.com', role: 'viewer', status: 'pending', team: 'Operations', joined: '2024-06-20' },
  { id: '9', name: 'Iris Wu', email: 'iris@example.com', role: 'viewer', status: 'active', team: 'Support', joined: '2024-07-01' },
  { id: '10', name: 'Jason Tran', email: 'jason@example.com', role: 'editor', status: 'inactive', team: 'Product', joined: '2024-07-03' },
  { id: '11', name: 'Kelly Nguyen', email: 'kelly@example.com', role: 'admin', status: 'active', team: 'Platform', joined: '2024-07-10' },
  { id: '12', name: 'Liam Pham', email: 'liam@example.com', role: 'viewer', status: 'active', team: 'Marketing', joined: '2024-07-14' },
  { id: '13', name: 'Mia Hoang', email: 'mia@example.com', role: 'editor', status: 'pending', team: 'Design', joined: '2024-07-20' },
  { id: '14', name: 'Noah Do', email: 'noah@example.com', role: 'viewer', status: 'active', team: 'Analytics', joined: '2024-08-01' },
  { id: '15', name: 'Olivia Le', email: 'olivia@example.com', role: 'admin', status: 'active', team: 'Security', joined: '2024-08-05' },
  { id: '16', name: 'Peter Vu', email: 'peter@example.com', role: 'editor', status: 'inactive', team: 'Platform', joined: '2024-08-10' },
  { id: '17', name: 'Quinn Mai', email: 'quinn@example.com', role: 'viewer', status: 'active', team: 'Operations', joined: '2024-08-14' },
  { id: '18', name: 'Ryan Bui', email: 'ryan@example.com', role: 'editor', status: 'active', team: 'Support', joined: '2024-08-18' },
  { id: '19', name: 'Sophia Tran', email: 'sophia@example.com', role: 'viewer', status: 'pending', team: 'Product', joined: '2024-08-21' },
  { id: '20', name: 'Thomas Phan', email: 'thomas@example.com', role: 'admin', status: 'active', team: 'Analytics', joined: '2024-08-25' },
]

export const LOCATIONS = ['HCMC', 'Hanoi', 'Da Nang', 'Singapore', 'Bangkok']
export const MANAGERS = ['Emma Clark', 'Daniel Tran', 'Sophia Lee', 'Lucas Nguyen']
export const WORK_MODES: WorkMode[] = ['hybrid', 'onsite', 'remote']
export const TIMEZONES = ['GMT+7', 'GMT+8', 'GMT+9']

export const INITIAL_USERS: UserRow[] = baseUsers.map((user, index) => ({
  ...user,
  location: LOCATIONS[index % LOCATIONS.length]!,
  manager: MANAGERS[index % MANAGERS.length]!,
  employeeCode: `EMP-${String(index + 1).padStart(4, '0')}`,
  phone: `090${String(1000000 + index * 137).slice(0, 7)}`,
  workMode: WORK_MODES[index % WORK_MODES.length]!,
  timezone: TIMEZONES[index % TIMEZONES.length]!,
  lastActive: `2026-06-${String((index % 9) + 1).padStart(2, '0')} 0${index % 8}:30`,
}))

export const EMPTY_FORM: UserForm = {
  name: '',
  email: '',
  role: 'viewer',
  status: 'active',
  team: '',
  joined: '',
  location: '',
  manager: '',
  employeeCode: '',
  phone: '',
  workMode: 'hybrid',
  timezone: 'GMT+7',
  lastActive: '',
}
