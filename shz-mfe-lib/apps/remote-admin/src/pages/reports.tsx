import { useState } from 'react'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  Badge, Button, Progress, Skeleton,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Checkbox, Label,
} from '@shz/components'
import { FileText, Download, RefreshCw, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

type ReportStatus = 'ready' | 'generating' | 'failed' | 'scheduled'

interface Report {
  id: string
  name: string
  type: string
  status: ReportStatus
  generated: string
  size: string
  rows: number
}

const REPORTS: Report[] = [
  { id: 'R1', name: 'Monthly Revenue Summary', type: 'Finance', status: 'ready', generated: '2026-05-01', size: '2.4 MB', rows: 14280 },
  { id: 'R2', name: 'User Activity Log', type: 'Users', status: 'ready', generated: '2026-05-10', size: '8.1 MB', rows: 98432 },
  { id: 'R3', name: 'System Audit Trail', type: 'Security', status: 'ready', generated: '2026-05-15', size: '1.2 MB', rows: 6210 },
  { id: 'R4', name: 'Q2 Traffic Analysis', type: 'Analytics', status: 'generating', generated: '—', size: '—', rows: 0 },
  { id: 'R5', name: 'Error Rate Report', type: 'System', status: 'failed', generated: '2026-05-18', size: '—', rows: 0 },
  { id: 'R6', name: 'Weekly KPI Digest', type: 'Finance', status: 'scheduled', generated: 'Every Mon 08:00', size: '—', rows: 0 },
  { id: 'R7', name: 'Onboarding Funnel', type: 'Analytics', status: 'ready', generated: '2026-05-20', size: '512 KB', rows: 3804 },
  { id: 'R8', name: 'Billing Transactions', type: 'Finance', status: 'ready', generated: '2026-05-22', size: '4.8 MB', rows: 24100 },
]

const STATUS_CONFIG: Record<ReportStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; icon: React.ElementType }> = {
  ready: { label: 'Ready', variant: 'default', icon: CheckCircle2 },
  generating: { label: 'Generating', variant: 'secondary', icon: RefreshCw },
  failed: { label: 'Failed', variant: 'destructive', icon: AlertCircle },
  scheduled: { label: 'Scheduled', variant: 'outline', icon: Clock },
}

const COLS = ['Finance', 'Users', 'Analytics', 'Security', 'System']

export default function ReportsPage() {
  const [format, setFormat] = useState('csv')
  const [period, setPeriod] = useState('30d')
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  const selectedCount = Object.values(selected).filter(Boolean).length

  function handleGenerate() {
    setGenerating(true)
    setProgress(0)
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(id); setGenerating(false); return 100 }
        return p + 8
      })
    }, 150)
  }

  return (
    <div className='flex flex-1 flex-col gap-6 p-4 pt-0'>
      <div className='flex items-center justify-between pt-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Reports</h1>
          <p className='text-sm text-muted-foreground'>Generate, schedule and download data exports.</p>
        </div>
        <Button size='sm' className='gap-1.5' onClick={handleGenerate} disabled={generating}>
          {generating ? <RefreshCw className='size-4 animate-spin' /> : <FileText className='size-4' />}
          {generating ? 'Generating…' : 'New Report'}
        </Button>
      </div>

      {generating && (
        <Card className='border-primary/30 bg-primary/5'>
          <CardContent className='pt-4 space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span className='font-medium'>Generating report…</span>
              <span className='tabular-nums text-muted-foreground'>{progress}%</span>
            </div>
            <Progress value={progress} />
          </CardContent>
        </Card>
      )}

      <div className='grid gap-4 lg:grid-cols-3'>
        {/* Report builder */}
        <Card>
          <CardHeader>
            <CardTitle>Build Report</CardTitle>
            <CardDescription>Configure and export a custom dataset</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-1.5'>
              <Label>Period</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='7d'>Last 7 days</SelectItem>
                  <SelectItem value='30d'>Last 30 days</SelectItem>
                  <SelectItem value='90d'>Last quarter</SelectItem>
                  <SelectItem value='1y'>Last year</SelectItem>
                  <SelectItem value='custom'>Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-1.5'>
              <Label>Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='csv'>CSV</SelectItem>
                  <SelectItem value='xlsx'>Excel (.xlsx)</SelectItem>
                  <SelectItem value='json'>JSON</SelectItem>
                  <SelectItem value='pdf'>PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label>Include sections</Label>
              {COLS.map((col) => (
                <div key={col} className='flex items-center gap-2'>
                  <Checkbox
                    id={`col-${col}`}
                    checked={!!selected[col]}
                    onCheckedChange={(v) => setSelected((p) => ({ ...p, [col]: !!v }))}
                  />
                  <Label htmlFor={`col-${col}`} className='cursor-pointer font-normal'>{col}</Label>
                </div>
              ))}
            </div>
            <Button className='w-full gap-2' onClick={handleGenerate} disabled={generating || selectedCount === 0}>
              <Download className='size-4' />
              Export {selectedCount > 0 ? `(${selectedCount})` : ''}
            </Button>
          </CardContent>
        </Card>

        {/* Report history */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Report History</CardTitle>
            <CardDescription>{REPORTS.length} reports available</CardDescription>
          </CardHeader>
          <CardContent className='p-0'>
            <Tabs defaultValue='all'>
              <div className='px-6 border-b'>
                <TabsList className='h-10 -mb-px rounded-none bg-transparent gap-1'>
                  <TabsTrigger value='all' className='rounded-md data-[state=active]:bg-muted'>All</TabsTrigger>
                  <TabsTrigger value='ready' className='rounded-md data-[state=active]:bg-muted'>Ready</TabsTrigger>
                  <TabsTrigger value='scheduled' className='rounded-md data-[state=active]:bg-muted'>Scheduled</TabsTrigger>
                </TabsList>
              </div>
              {(['all', 'ready', 'scheduled'] as const).map((tab) => (
                <TabsContent key={tab} value={tab} className='mt-0'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Generated</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {REPORTS.filter((r) => tab === 'all' || r.status === tab).map((r) => {
                        const sc = STATUS_CONFIG[r.status]
                        const StatusIcon = sc.icon
                        return (
                          <TableRow key={r.id}>
                            <TableCell>
                              <div className='flex items-center gap-2'>
                                <FileText className='size-4 text-muted-foreground shrink-0' />
                                <div>
                                  <p className='text-sm font-medium leading-none'>{r.name}</p>
                                  <p className='text-xs text-muted-foreground mt-0.5'>{r.type}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={sc.variant} className='gap-1 text-xs'>
                                <StatusIcon className={`size-3 ${r.status === 'generating' ? 'animate-spin' : ''}`} />
                                {sc.label}
                              </Badge>
                            </TableCell>
                            <TableCell className='text-sm text-muted-foreground tabular-nums'>{r.generated}</TableCell>
                            <TableCell className='text-sm text-muted-foreground'>{r.size}</TableCell>
                            <TableCell>
                              {r.status === 'ready' && (
                                <Button variant='ghost' size='sm' className='h-7 gap-1'>
                                  <Download className='size-3' />
                                </Button>
                              )}
                              {r.status === 'generating' && <Skeleton className='h-4 w-16' />}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
