import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shz/components'

const ALL_COMPONENTS = [
  'Accordion', 'Alert', 'Alert Dialog', 'Aspect Ratio', 'Avatar', 'Badge', 'Breadcrumb', 'Button',
  'Button Group', 'Calendar', 'Card', 'Carousel', 'Chart', 'Checkbox', 'Collapsible', 'Combobox',
  'Command', 'Context Menu', 'Data Table', 'Date Picker', 'Dialog', 'Direction', 'Drawer',
  'Dropdown Menu', 'Empty', 'Field', 'Hover Card', 'Input', 'Input Group', 'Input OTP', 'Item',
  'Kbd', 'Label', 'Menubar', 'Native Select', 'Navigation Menu', 'Pagination', 'Popover',
  'Progress', 'Radio Group', 'Resizable', 'Scroll Area', 'Select', 'Separator', 'Sheet', 'Sidebar',
  'Skeleton', 'Slider', 'Sonner', 'Spinner', 'Switch', 'Table', 'Tabs', 'Textarea', 'Toast',
  'Toggle', 'Toggle Group', 'Tooltip', 'Typography',
] as const

const INSTALLED = new Set([
  'Accordion', 'Avatar', 'Badge', 'Breadcrumb', 'Button', 'Card', 'Checkbox', 'Collapsible',
  'Command', 'Data Table', 'Dialog', 'Dropdown Menu', 'Input', 'Label', 'Pagination', 'Popover',
  'Progress', 'Radio Group', 'Scroll Area', 'Select', 'Separator', 'Sheet', 'Sidebar', 'Skeleton',
  'Slider', 'Sonner', 'Switch', 'Table', 'Tabs', 'Textarea', 'Toggle', 'Toggle Group', 'Tooltip',
])

export default function ShadcnCatalogPage() {
  const installed = ALL_COMPONENTS.filter((name) => INSTALLED.has(name)).length
  const missing = ALL_COMPONENTS.length - installed

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>shadcn/ui Components Catalog</CardTitle>
          <CardDescription>
            Nguon doi chieu: https://ui.shadcn.com/docs/components
          </CardDescription>
        </CardHeader>
        <CardContent className='flex items-center gap-3'>
          <Badge>{installed} installed</Badge>
          <Badge variant='secondary'>{missing} missing</Badge>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Coverage</CardTitle>
          <CardDescription>Danh sach day du va trang thai trong @shz/components</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ALL_COMPONENTS.map((name) => {
                const ok = INSTALLED.has(name)
                return (
                  <TableRow key={name}>
                    <TableCell>{name}</TableCell>
                    <TableCell>
                      <Badge variant={ok ? 'default' : 'outline'}>{ok ? 'Installed' : 'Missing'}</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
