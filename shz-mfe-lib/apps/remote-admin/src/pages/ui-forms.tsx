import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Autocomplete,
  type AutocompleteOption,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FileUploader,
  Input,
  Label,
  MultiSelect,
  type MultiSelectOption,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  SplitButton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
  toast,
} from '@shz/components'

const OPTIONS: AutocompleteOption[] = [
  { label: 'Hanoi DC', value: 'hanoi' },
  { label: 'Singapore DC', value: 'singapore' },
  { label: 'Frankfurt DC', value: 'frankfurt' },
]

const TAGS: MultiSelectOption[] = [
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
  { label: 'Security', value: 'security' },
  { label: 'Analytics', value: 'analytics' },
]

export default function UiFormsPage() {
  const [dc, setDc] = useState('')
  const [skills, setSkills] = useState<string[]>(['frontend'])

  return (
    <div className='flex flex-1 flex-col gap-6 p-4 pt-0'>
      <Toaster />
      <div className='pt-4'>
        <h1 className='text-2xl font-bold tracking-tight'>UI Forms & Actions</h1>
        <p className='text-sm text-muted-foreground'>Split button, autocomplete, multi-select, uploader, accordion, tabs, divider, toast.</p>
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader><CardTitle>Split Button</CardTitle><CardDescription>Primary action + secondary actions</CardDescription></CardHeader>
          <CardContent>
            <SplitButton
              label='Create'
              onClick={() => {}}
              items={[
                { label: 'Create Project', onSelect: () => {} },
                { label: 'Create Report', onSelect: () => {} },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Autocomplete</CardTitle><CardDescription>Search and select</CardDescription></CardHeader>
          <CardContent className='space-y-3'>
            <div className='space-y-1.5'>
              <Label>Data Center</Label>
              <Autocomplete options={OPTIONS} value={dc} onValueChange={setDc} />
            </div>
            <div className='space-y-1.5'>
              <Label>Select with autocomplete</Label>
              <Autocomplete options={OPTIONS} value={dc} onValueChange={setDc} placeholder='Choose region' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Multiple Select</CardTitle><CardDescription>Select many values</CardDescription></CardHeader>
          <CardContent>
            <MultiSelect options={TAGS} value={skills} onValueChange={setSkills} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Uploader</CardTitle><CardDescription>Basic file uploader</CardDescription></CardHeader>
          <CardContent>
            <FileUploader accept='.csv,.xlsx,.pdf' />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Accordion / Divider / Tabs</CardTitle></CardHeader>
        <CardContent className='space-y-4'>
          <Accordion type='single' collapsible>
            <AccordionItem value='a'>
              <AccordionTrigger>Form Settings</AccordionTrigger>
              <AccordionContent className='space-y-3'>
                <div className='grid gap-3 md:grid-cols-2'>
                  <Input placeholder='Project code' />
                  <Select defaultValue='active'>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='inactive'>Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />

          <Tabs defaultValue='general'>
            <TabsList>
              <TabsTrigger value='general'>General</TabsTrigger>
              <TabsTrigger value='advanced'>Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value='general'>General form section</TabsContent>
            <TabsContent value='advanced'>Advanced form section</TabsContent>
          </Tabs>

          <div className='flex gap-2'>
            <Button onClick={() => toast.success('Saved successfully')}>Toast Demo Button</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
