import { Checkbox, Input, Label, RadioGroup, RadioGroupItem, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Slider, Switch, Textarea } from '@shz/components'

export default function ShadcnInputsPage() {
  return (
    <div className='grid gap-6 md:grid-cols-2'>
      <section className='space-y-4 rounded-lg border p-4'>
        <h2 className='text-lg font-semibold'>Text Inputs</h2>
        <div className='space-y-2'>
          <Label htmlFor='name'>Name</Label>
          <Input id='name' placeholder='John Doe' />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='bio'>Bio</Label>
          <Textarea id='bio' placeholder='Tell us about yourself' />
        </div>
      </section>

      <section className='space-y-4 rounded-lg border p-4'>
        <h2 className='text-lg font-semibold'>Choice Inputs</h2>
        <div className='flex items-center gap-2'>
          <Checkbox id='terms' />
          <Label htmlFor='terms'>Accept terms</Label>
        </div>
        <RadioGroup defaultValue='basic' className='space-y-2'>
          <div className='flex items-center gap-2'><RadioGroupItem value='basic' id='basic' /><Label htmlFor='basic'>Basic</Label></div>
          <div className='flex items-center gap-2'><RadioGroupItem value='pro' id='pro' /><Label htmlFor='pro'>Pro</Label></div>
        </RadioGroup>
        <div className='flex items-center gap-2'>
          <Switch id='notify' defaultChecked />
          <Label htmlFor='notify'>Notifications</Label>
        </div>
      </section>

      <section className='space-y-4 rounded-lg border p-4'>
        <h2 className='text-lg font-semibold'>Select</h2>
        <Select defaultValue='ap-sg'>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value='ap-sg'>Singapore</SelectItem>
            <SelectItem value='us-va'>US East</SelectItem>
            <SelectItem value='eu-fr'>EU West</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <section className='space-y-4 rounded-lg border p-4'>
        <h2 className='text-lg font-semibold'>Slider</h2>
        <Slider defaultValue={[30]} max={100} step={1} />
      </section>
    </div>
  )
}
