import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  Badge,
} from '@shz/components'
import { BarChart3, TrendingUp, Users, DollarSign, Activity } from 'lucide-react'

const stats = [
  { title: 'Total Revenue', value: '$45,231.89', change: '+20.1%', icon: DollarSign, up: true },
  { title: 'Subscriptions', value: '+2350', change: '+180.1%', icon: Users, up: true },
  { title: 'Sales', value: '+12,234', change: '+19%', icon: BarChart3, up: true },
  { title: 'Active Now', value: '+573', change: '+201', icon: Activity, up: true },
]

const recentActivity = [
  { user: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00' },
  { user: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00' },
  { user: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00' },
  { user: 'William Kim', email: 'william.kim@email.com', amount: '+$99.00' },
  { user: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+$39.00' },
]

export default function DashboardPage() {
  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      {/* Page header */}
      <div className='flex items-center justify-between pt-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground text-sm'>
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <Badge variant='secondary' className='text-xs'>
          remote_dashboard · port 3001
        </Badge>
      </div>

      {/* Stats grid */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardDescription>{stat.title}</CardDescription>
                <stat.icon className='size-4 text-muted-foreground' />
              </div>
              <CardTitle className='text-2xl'>{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-1 text-sm'>
                <TrendingUp className='size-3 text-emerald-500' />
                <span className='text-emerald-600 font-medium'>{stat.change}</span>
                <span className='text-muted-foreground'>from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>You made 265 sales this month.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {recentActivity.map((item) => (
              <div key={item.email} className='flex items-center justify-between gap-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium'>
                    {item.user.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className='text-sm font-medium leading-none'>{item.user}</p>
                    <p className='text-xs text-muted-foreground'>{item.email}</p>
                  </div>
                </div>
                <span className='ml-auto font-medium text-emerald-600'>{item.amount}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
