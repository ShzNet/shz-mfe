import { useState } from 'react'
import {
  Card, CardContent,
  Badge, Button, Avatar, AvatarFallback,
  Input, ScrollArea, Separator,
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from '@shz/components'
import { Search, Send, Paperclip, Smile, MoreHorizontal, Phone, Video } from 'lucide-react'

interface Message {
  id: string
  text: string
  time: string
  from: 'me' | 'them'
}

interface Conversation {
  id: string
  name: string
  initials: string
  role: string
  lastMsg: string
  time: string
  unread: number
  online: boolean
  messages: Message[]
}

const CONVERSATIONS: Conversation[] = [
  {
    id: '1', name: 'Alice Johnson', initials: 'AJ', role: 'Engineering Lead', online: true,
    lastMsg: 'The MF manifest is fixed 🎉', time: '2m', unread: 2,
    messages: [
      { id: 'm1', text: 'Hey, the publicPath issue was because dev.assetPrefix was not set.', time: '10:12', from: 'them' },
      { id: 'm2', text: 'Good catch! Fixed and pushed.', time: '10:14', from: 'me' },
      { id: 'm3', text: 'The MF manifest is fixed 🎉', time: '10:15', from: 'them' },
    ],
  },
  {
    id: '2', name: 'Bob Martinez', initials: 'BM', role: 'Design Lead', online: false,
    lastMsg: 'Tailwind v4 config looks clean', time: '1h', unread: 0,
    messages: [
      { id: 'm1', text: 'Did you use the @custom-variant dark syntax?', time: '09:40', from: 'them' },
      { id: 'm2', text: 'Yes, works perfectly with class-based dark mode.', time: '09:42', from: 'me' },
      { id: 'm3', text: 'Tailwind v4 config looks clean 👍', time: '09:45', from: 'them' },
    ],
  },
  {
    id: '3', name: 'Carol White', initials: 'CW', role: 'Product Manager', online: true,
    lastMsg: 'Can you demo the admin app tomorrow?', time: '3h', unread: 1,
    messages: [
      { id: 'm1', text: 'The component library is looking great!', time: '07:10', from: 'them' },
      { id: 'm2', text: 'Thanks! Just added 33 components.', time: '07:12', from: 'me' },
      { id: 'm3', text: 'Can you demo the admin app tomorrow?', time: '07:15', from: 'them' },
    ],
  },
  {
    id: '4', name: 'David Chen', initials: 'DC', role: 'Backend Engineer', online: false,
    lastMsg: 'Auth service PR is ready for review', time: 'Yesterday', unread: 0,
    messages: [
      { id: 'm1', text: 'Auth service PR is ready for review', time: 'Yesterday', from: 'them' },
      { id: 'm2', text: 'On it, will review by EOD', time: 'Yesterday', from: 'me' },
    ],
  },
  {
    id: '5', name: 'Eva Park', initials: 'EP', role: 'Marketing', online: true,
    lastMsg: 'Analytics numbers look good this week', time: 'Yesterday', unread: 0,
    messages: [
      { id: 'm1', text: 'Analytics numbers look good this week', time: 'Yesterday', from: 'them' },
    ],
  },
]

export default function MessagesPage() {
  const [activeId, setActiveId] = useState('1')
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [conversations, setConversations] = useState(CONVERSATIONS)

  const filtered = conversations.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase())
  )
  const active = conversations.find((c) => c.id === activeId)!

  function sendMessage() {
    if (!draft.trim()) return
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              lastMsg: draft,
              time: 'now',
              messages: [...c.messages, { id: Date.now().toString(), text: draft, time: 'now', from: 'me' }],
            }
          : c
      )
    )
    setDraft('')
  }

  return (
    <TooltipProvider>
      <div className='flex flex-1 gap-0 p-4 pt-0 h-[calc(100vh-8rem)]'>
        {/* Sidebar */}
        <Card className='w-72 shrink-0 flex flex-col rounded-r-none border-r-0'>
          <div className='p-3 border-b'>
            <div className='flex items-center justify-between mb-2'>
              <h2 className='font-semibold text-sm'>Messages</h2>
              <Badge variant='secondary' className='text-xs'>
                {conversations.reduce((s, c) => s + c.unread, 0)} new
              </Badge>
            </div>
            <div className='relative'>
              <Search className='absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground' />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search…'
                className='h-8 pl-7 text-xs'
              />
            </div>
          </div>
          <ScrollArea className='flex-1'>
            <div className='divide-y'>
              {filtered.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setActiveId(conv.id)
                    setConversations((prev) =>
                      prev.map((c) => c.id === conv.id ? { ...c, unread: 0 } : c)
                    )
                  }}
                  className={`w-full text-left p-3 transition-colors hover:bg-muted/60 ${activeId === conv.id ? 'bg-muted' : ''}`}
                >
                  <div className='flex items-start gap-2.5'>
                    <div className='relative shrink-0'>
                      <Avatar className='size-9'>
                        <AvatarFallback className='text-xs'>{conv.initials}</AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <span className='absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 border-2 border-background' />
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium truncate'>{conv.name}</span>
                        <span className='text-[10px] text-muted-foreground shrink-0 ml-1'>{conv.time}</span>
                      </div>
                      <p className='text-xs text-muted-foreground truncate mt-0.5'>{conv.lastMsg}</p>
                    </div>
                    {conv.unread > 0 && (
                      <Badge className='size-4 p-0 flex items-center justify-center text-[10px] shrink-0'>
                        {conv.unread}
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat area */}
        <Card className='flex-1 flex flex-col rounded-l-none'>
          {/* Header */}
          <div className='flex items-center justify-between px-4 py-3 border-b shrink-0'>
            <div className='flex items-center gap-3'>
              <div className='relative'>
                <Avatar className='size-8'>
                  <AvatarFallback className='text-xs'>{active.initials}</AvatarFallback>
                </Avatar>
                {active.online && (
                  <span className='absolute bottom-0 right-0 size-2 rounded-full bg-emerald-500 border-2 border-background' />
                )}
              </div>
              <div>
                <p className='text-sm font-semibold leading-none'>{active.name}</p>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  {active.online ? 'Online' : 'Offline'} · {active.role}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-1'>
              {[
                { icon: Phone, label: 'Call' },
                { icon: Video, label: 'Video' },
                { icon: MoreHorizontal, label: 'More' },
              ].map(({ icon: Icon, label }) => (
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' size='sm' className='size-8 p-0'>
                      <Icon className='size-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className='flex-1 px-4'>
            <div className='space-y-4 py-4'>
              {active.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] space-y-1 ${msg.from === 'me' ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-sm ${
                        msg.from === 'me'
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-muted rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className='text-[10px] text-muted-foreground px-1'>{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator />

          {/* Input */}
          <div className='p-3 flex items-center gap-2 shrink-0'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='sm' className='size-8 p-0 shrink-0'>
                  <Paperclip className='size-4 text-muted-foreground' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={`Message ${active.name}…`}
              className='flex-1'
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='sm' className='size-8 p-0 shrink-0'>
                  <Smile className='size-4 text-muted-foreground' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Emoji</TooltipContent>
            </Tooltip>
            <Button size='sm' className='size-8 p-0 shrink-0' onClick={sendMessage} disabled={!draft.trim()}>
              <Send className='size-4' />
            </Button>
          </div>
        </Card>
      </div>
    </TooltipProvider>
  )
}
