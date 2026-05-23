import { useState } from 'react'
import {
  Card, CardContent, CardHeader, CardTitle,
  Badge, Button,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  Input, Label, Textarea,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@shz/components'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

type EventColor = 'blue' | 'emerald' | 'violet' | 'amber' | 'rose'

interface CalEvent {
  id: string
  title: string
  date: string
  time: string
  duration: string
  color: EventColor
  description?: string
}

const COLOR_CLASSES: Record<EventColor, string> = {
  blue: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  violet: 'bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/30',
  amber: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
  rose: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
}

const DOT_CLASSES: Record<EventColor, string> = {
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  violet: 'bg-violet-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
}

const INITIAL_EVENTS: CalEvent[] = [
  { id: 'e1', title: 'Team Standup', date: '2026-05-25', time: '09:00', duration: '30m', color: 'blue', description: 'Daily sync' },
  { id: 'e2', title: 'MFE Demo', date: '2026-05-26', time: '14:00', duration: '1h', color: 'violet', description: 'Demo admin app to stakeholders' },
  { id: 'e3', title: 'Design Review', date: '2026-05-27', time: '11:00', duration: '1h', color: 'emerald' },
  { id: 'e4', title: 'Sprint Planning', date: '2026-05-28', time: '10:00', duration: '2h', color: 'amber' },
  { id: 'e5', title: 'Release Day', date: '2026-05-29', time: '00:00', duration: 'all-day', color: 'rose', description: 'v1.0 production release' },
  { id: 'e6', title: 'Code Review', date: '2026-05-23', time: '15:00', duration: '45m', color: 'blue' },
  { id: 'e7', title: '1:1 with Alice', date: '2026-05-23', time: '10:00', duration: '30m', color: 'emerald' },
  { id: 'e8', title: 'Board Meeting', date: '2026-06-02', time: '13:00', duration: '2h', color: 'rose' },
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

const UPCOMING_DAYS = 7

export default function CalendarPage() {
  const today = new Date(2026, 4, 23) // May 23 2026
  const [cur, setCur] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [events, setEvents] = useState<CalEvent[]>(INITIAL_EVENTS)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', time: '09:00', color: 'blue' as EventColor })

  const { year, month } = cur
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonth = () => setCur((p) => p.month === 0 ? { year: p.year - 1, month: 11 } : { ...p, month: p.month - 1 })
  const nextMonth = () => setCur((p) => p.month === 11 ? { year: p.year + 1, month: 0 } : { ...p, month: p.month + 1 })

  const eventsOn = (dateStr: string) => events.filter((e) => e.date === dateStr)
  const todayStr = isoDate(today.getFullYear(), today.getMonth(), today.getDate())

  const upcoming = events
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, UPCOMING_DAYS)

  function addEvent() {
    if (!newEvent.title.trim() || !selectedDate) return
    setEvents((prev) => [...prev, {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDate,
      time: newEvent.time,
      duration: '30m',
      color: newEvent.color,
    }])
    setDialogOpen(false)
    setNewEvent({ title: '', time: '09:00', color: 'blue' })
  }

  const cells = Array.from({ length: Math.ceil((firstDay + daysInMonth) / 7) * 7 }, (_, i) => {
    const day = i - firstDay + 1
    return day >= 1 && day <= daysInMonth ? day : null
  })

  return (
    <div className='flex flex-1 flex-col gap-6 p-4 pt-0'>
      <div className='flex items-center justify-between pt-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Calendar</h1>
          <p className='text-sm text-muted-foreground'>Schedule and track events across your team.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size='sm' className='gap-1.5'><Plus className='size-4' />Add Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Event {selectedDate && `— ${selectedDate}`}</DialogTitle>
            </DialogHeader>
            <div className='space-y-3'>
              <div className='space-y-1.5'><Label>Title</Label><Input placeholder='Event title' value={newEvent.title} onChange={(e) => setNewEvent((p) => ({ ...p, title: e.target.value }))} /></div>
              <div className='grid grid-cols-2 gap-3'>
                <div className='space-y-1.5'><Label>Date</Label><Input type='date' defaultValue={selectedDate ?? todayStr} onChange={(e) => setSelectedDate(e.target.value)} /></div>
                <div className='space-y-1.5'><Label>Time</Label><Input type='time' value={newEvent.time} onChange={(e) => setNewEvent((p) => ({ ...p, time: e.target.value }))} /></div>
              </div>
              <div className='space-y-1.5'>
                <Label>Color</Label>
                <Select value={newEvent.color} onValueChange={(v) => setNewEvent((p) => ({ ...p, color: v as EventColor }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(COLOR_CLASSES) as EventColor[]).map((c) => (
                      <SelectItem key={c} value={c}><div className='flex items-center gap-2'><span className={`size-3 rounded-full ${DOT_CLASSES[c]}`} />{c.charAt(0).toUpperCase() + c.slice(1)}</div></SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={addEvent}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className='grid gap-4 lg:grid-cols-4'>
        {/* Calendar grid */}
        <Card className='lg:col-span-3'>
          <CardHeader className='pb-2'>
            <div className='flex items-center justify-between'>
              <CardTitle>{MONTHS[month]} {year}</CardTitle>
              <div className='flex items-center gap-1'>
                <Button variant='ghost' size='sm' className='size-8 p-0' onClick={prevMonth}><ChevronLeft className='size-4' /></Button>
                <Button variant='ghost' size='sm' className='size-8 p-0' onClick={nextMonth}><ChevronRight className='size-4' /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-7 gap-px'>
              {DAYS.map((d) => (
                <div key={d} className='py-2 text-center text-xs font-medium text-muted-foreground'>{d}</div>
              ))}
              {cells.map((day, i) => {
                const dateStr = day ? isoDate(year, month, day) : ''
                const dayEvents = day ? eventsOn(dateStr) : []
                const isToday = dateStr === todayStr
                const isSelected = dateStr === selectedDate
                return (
                  <button
                    key={i}
                    disabled={!day}
                    onClick={() => { if (day) { setSelectedDate(dateStr); setDialogOpen(true) } }}
                    className={`relative min-h-[64px] p-1.5 text-left rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                      ${!day ? 'opacity-0 pointer-events-none' : 'hover:bg-muted/60'}
                      ${isSelected ? 'ring-2 ring-ring' : ''}
                    `}
                  >
                    {day && (
                      <>
                        <span className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-medium
                          ${isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'}
                        `}>{day}</span>
                        <div className='mt-1 space-y-0.5'>
                          {dayEvents.slice(0, 2).map((ev) => (
                            <div key={ev.id} className={`truncate rounded px-1 py-0.5 text-[10px] font-medium border ${COLOR_CLASSES[ev.color]}`}>
                              {ev.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <p className='text-[10px] text-muted-foreground pl-1'>+{dayEvents.length - 2} more</p>
                          )}
                        </div>
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming events */}
        <Card className='lg:col-span-1'>
          <CardHeader><CardTitle className='text-base'>Upcoming</CardTitle></CardHeader>
          <CardContent className='space-y-3'>
            {upcoming.length === 0 && (
              <p className='text-sm text-muted-foreground'>No upcoming events.</p>
            )}
            {upcoming.map((ev) => (
              <div key={ev.id} className={`rounded-lg border p-2.5 text-sm ${COLOR_CLASSES[ev.color]}`}>
                <div className='flex items-center gap-1.5 mb-1'>
                  <span className={`size-2 rounded-full shrink-0 ${DOT_CLASSES[ev.color]}`} />
                  <p className='font-medium leading-none line-clamp-1'>{ev.title}</p>
                </div>
                <p className='text-xs opacity-75'>{ev.date} {ev.time !== '00:00' && `· ${ev.time}`}</p>
                {ev.description && <p className='text-xs opacity-60 mt-0.5 line-clamp-1'>{ev.description}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
