import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  Badge, StatsCard, Progress, Tabs, TabsList, TabsTrigger, TabsContent,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@shz/components'
import { TrendingUp, TrendingDown, Users, MousePointerClick, Eye, Clock } from 'lucide-react'
import { useState } from 'react'

const stats = [
  { title: 'Page Views', value: '1.2M', change: '+18.3%', trend: 'up' as const, icon: Eye, description: 'vs last period' },
  { title: 'Unique Visitors', value: '84,320', change: '+11.2%', trend: 'up' as const, icon: Users, description: 'vs last period' },
  { title: 'Click-through Rate', value: '4.7%', change: '-0.8%', trend: 'down' as const, icon: MousePointerClick, description: 'vs last period' },
  { title: 'Avg Session', value: '3m 24s', change: '+5.1%', trend: 'up' as const, icon: Clock, description: 'vs last period' },
]

const WEEKLY = [
  { day: 'Mon', views: 42, sessions: 28, bounce: 38 },
  { day: 'Tue', views: 58, sessions: 41, bounce: 34 },
  { day: 'Wed', views: 74, sessions: 55, bounce: 31 },
  { day: 'Thu', views: 63, sessions: 47, bounce: 35 },
  { day: 'Fri', views: 91, sessions: 68, bounce: 29 },
  { day: 'Sat', views: 38, sessions: 24, bounce: 52 },
  { day: 'Sun', views: 29, sessions: 17, bounce: 58 },
]

const TOP_SOURCES = [
  { source: 'Organic Search', visitors: 38420, pct: 45, up: true, change: '+12%' },
  { source: 'Direct', visitors: 21540, pct: 26, up: true, change: '+4%' },
  { source: 'Referral', visitors: 12310, pct: 15, up: false, change: '-3%' },
  { source: 'Social Media', visitors: 8920, pct: 11, up: true, change: '+22%' },
  { source: 'Email', visitors: 3130, pct: 3, up: false, change: '-1%' },
]

const TOP_PAGES = [
  { path: '/', title: 'Home', views: 184320, bounce: '32%', time: '4m 12s' },
  { path: '/pricing', title: 'Pricing', views: 92100, bounce: '41%', time: '3m 05s' },
  { path: '/docs', title: 'Documentation', views: 74580, bounce: '28%', time: '6m 47s' },
  { path: '/blog', title: 'Blog', views: 56210, bounce: '55%', time: '2m 31s' },
  { path: '/login', title: 'Login', views: 43800, bounce: '18%', time: '1m 09s' },
  { path: '/register', title: 'Register', views: 38100, bounce: '22%', time: '2m 44s' },
]

const BAR_MAX = Math.max(...WEEKLY.map((d) => d.views))

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('7d')

  return (
    <div className='flex flex-1 flex-col gap-6 p-4 pt-0'>
      <div className='flex items-center justify-between pt-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Analytics</h1>
          <p className='text-sm text-muted-foreground'>Detailed traffic and engagement metrics.</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className='w-32'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='7d'>Last 7 days</SelectItem>
            <SelectItem value='30d'>Last 30 days</SelectItem>
            <SelectItem value='90d'>Last 90 days</SelectItem>
            <SelectItem value='1y'>Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className='grid gap-4 lg:grid-cols-3'>
        {/* Bar chart */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Weekly Traffic</CardTitle>
            <CardDescription>Page views per day this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-end gap-2 h-40'>
              {WEEKLY.map((d) => (
                <div key={d.day} className='flex flex-1 flex-col items-center gap-1'>
                  <span className='text-[10px] text-muted-foreground tabular-nums'>{d.views}k</span>
                  <div
                    className='w-full rounded-t-sm bg-primary/80 hover:bg-primary transition-colors'
                    style={{ height: `${(d.views / BAR_MAX) * 100}%` }}
                  />
                  <span className='text-xs text-muted-foreground'>{d.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where visitors come from</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {TOP_SOURCES.map((s) => (
              <div key={s.source} className='space-y-1'>
                <div className='flex items-center justify-between text-sm'>
                  <span>{s.source}</span>
                  <div className='flex items-center gap-1.5'>
                    <span className='tabular-nums text-muted-foreground'>{s.pct}%</span>
                    <span className={`flex items-center text-xs font-medium ${s.up ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {s.up ? <TrendingUp className='size-3' /> : <TrendingDown className='size-3' />}
                      {s.change}
                    </span>
                  </div>
                </div>
                <Progress value={s.pct} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Page breakdown */}
      <Tabs defaultValue='pages'>
        <TabsList>
          <TabsTrigger value='pages'>Top Pages</TabsTrigger>
          <TabsTrigger value='devices'>Devices</TabsTrigger>
          <TabsTrigger value='geo'>Geography</TabsTrigger>
        </TabsList>
        <TabsContent value='pages'>
          <Card>
            <CardContent className='p-0'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead className='text-right'>Views</TableHead>
                    <TableHead className='text-right'>Bounce Rate</TableHead>
                    <TableHead className='text-right'>Avg Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TOP_PAGES.map((p) => (
                    <TableRow key={p.path}>
                      <TableCell>
                        <p className='font-medium text-sm'>{p.title}</p>
                        <p className='text-xs font-mono text-muted-foreground'>{p.path}</p>
                      </TableCell>
                      <TableCell className='text-right tabular-nums'>{p.views.toLocaleString()}</TableCell>
                      <TableCell className='text-right text-muted-foreground'>{p.bounce}</TableCell>
                      <TableCell className='text-right text-muted-foreground'>{p.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='devices'>
          <Card>
            <CardContent className='pt-6 space-y-4'>
              {[
                { device: 'Desktop', pct: 58, badge: 'default' as const },
                { device: 'Mobile', pct: 34, badge: 'secondary' as const },
                { device: 'Tablet', pct: 8, badge: 'outline' as const },
              ].map((d) => (
                <div key={d.device} className='flex items-center gap-4'>
                  <span className='w-16 text-sm'>{d.device}</span>
                  <Progress value={d.pct} className='flex-1' />
                  <Badge variant={d.badge} className='w-12 justify-center'>{d.pct}%</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='geo'>
          <Card>
            <CardContent className='pt-6 space-y-3'>
              {[
                { country: '🇺🇸 United States', pct: 42 },
                { country: '🇬🇧 United Kingdom', pct: 18 },
                { country: '🇩🇪 Germany', pct: 12 },
                { country: '🇯🇵 Japan', pct: 9 },
                { country: '🇻🇳 Vietnam', pct: 7 },
                { country: '🌍 Other', pct: 12 },
              ].map((g) => (
                <div key={g.country} className='flex items-center gap-3 text-sm'>
                  <span className='w-40'>{g.country}</span>
                  <Progress value={g.pct} className='flex-1' />
                  <span className='w-8 text-right tabular-nums text-muted-foreground'>{g.pct}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
