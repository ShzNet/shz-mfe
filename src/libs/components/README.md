# @shznet/components

`@shznet/components` is the shared UI library for host and remote apps. It is based on the `shadcn-admin` foundation, extended with shared primitives and higher-level admin components such as data tables, filter builders, tree tables, and file upload flows.

## Installation

```bash
pnpm add @shznet/components lucide-react
```

Current peer dependencies:

- `react`
- `react-dom`
- `lucide-react`

## Basic Import

```ts
import '@shznet/components/styles/theme.css'

import {
  Button,
  Card,
  DataTable,
  FilterBuilder,
  Sidebar,
  Toaster,
} from '@shznet/components'
```

## Remote Config Compatibility

If older code imports menu types from the components package:

```ts
import type { RemoteNavItem, RemoteAppConfig } from '@shznet/components/remote-config'
```

the package still provides a backward-compatible re-export from `@shznet/core`.

## Foundation

The component system starts from `shadcn-admin` and is adapted for this workspace's host/remote shell and admin-module use cases. That means the library includes standard shadcn-style building blocks plus project-specific data and navigation components.

## Supported Components

| Group | Component | Status | Notes |
|---|---|---|---|
| Foundation | `Alert` | Supported | Message, feedback block |
| Foundation | `AspectRatio` | Supported | Media/frame ratio |
| Foundation | `Avatar` | Supported | User/profile avatar |
| Foundation | `Badge` | Supported | Small status label |
| Foundation | `Button` | Supported | Variant button |
| Foundation | `Card` | Supported | Content container |
| Foundation | `Progress` | Supported | Progress bar |
| Foundation | `Skeleton` | Supported | Loading placeholder |
| Form Base | `Checkbox` | Supported | Boolean input |
| Form Base | `Form` | Supported | `react-hook-form` helpers |
| Form Base | `Input` | Supported | Text input |
| Form Base | `InputOTP` | Supported | OTP segmented input |
| Form Base | `Label` | Supported | Form label |
| Form Base | `RadioGroup` | Supported | Single choice group |
| Form Base | `Select` | Supported | Dropdown select |
| Form Base | `Slider` | Supported | Numeric range slider |
| Form Base | `Switch` | Supported | Toggle switch |
| Form Base | `Textarea` | Supported | Multi-line input |
| Form Base | `Toggle` | Supported | Single toggle |
| Form Base | `ToggleGroup` | Supported | Toggle button group |
| Enhanced Input | `Autocomplete` | Supported | Search + choose option |
| Enhanced Input | `DateInput` | Supported | Date entry helper |
| Enhanced Input | `FileUploader` | Supported | File picker/upload UX |
| Enhanced Input | `MultiSelect` | Supported | Multi option picker |
| Enhanced Input | `SplitButton` | Supported | Primary action + menu |
| Layout / Nav | `Accordion` | Supported | Expand/collapse sections |
| Layout / Nav | `Breadcrumb` | Supported | Path navigation |
| Layout / Nav | `Collapsible` | Supported | Generic collapsed content |
| Layout / Nav | `NavigationMenu` | Supported | Top-level navigation |
| Layout / Nav | `Pagination` | Supported | Page navigation |
| Layout / Nav | `ResizablePanelGroup` | Supported | Resizable panels |
| Layout / Nav | `ScrollArea` | Supported | Custom scroll container |
| Layout / Nav | `Separator` | Supported | Visual divider |
| Layout / Nav | `Sheet` | Supported | Side panel / drawer |
| Layout / Nav | `Sidebar` | Supported | App sidebar primitives |
| Layout / Nav | `Tabs` | Supported | Tab navigation |
| Overlay | `AlertDialog` | Supported | Confirm/destructive modal |
| Overlay | `Command` | Supported | Command palette |
| Overlay | `ContextMenu` | Supported | Right-click menu |
| Overlay | `Dialog` | Supported | Modal dialog |
| Overlay | `Drawer` | Supported | Bottom/side drawer |
| Overlay | `DropdownMenu` | Supported | Action dropdown |
| Overlay | `HoverCard` | Supported | Hover preview content |
| Overlay | `Menubar` | Supported | Desktop-style menubar |
| Overlay | `Popover` | Supported | Floating content |
| Overlay | `Toaster` / `toast` | Supported | Toast notification |
| Overlay | `Tooltip` | Supported | Small hover hint |
| Data Display | `Carousel` | Supported | Horizontal carousel |
| Data Display | `Chart` | Supported | Recharts wrapper |
| Data Display | `StatsCard` | Supported | KPI summary card |
| Data Display | `Table` | Supported | Base table primitive |
| Data Heavy | `ColumnManager` | Supported | Column visibility/order |
| Data Heavy | `DataTable` | Supported | TanStack-based table |
| Data Heavy | `FilterBuilder` | Supported | Rule/group filter builder |
| Data Heavy | `Tree` | Supported | Hierarchical tree |
| Data Heavy | `TreeTable` | Supported | Tree + columns |
| Data Heavy | `VirtualList` | Supported | Large list rendering |
| Utility | `cn` | Supported | Class merge helper |
| Theme | `styles/theme.css` | Supported | Shared theme stylesheet |

## Suggested Component Sets By Use Case

### CRUD Forms

- `Form`
- `Input`
- `Textarea`
- `Select`
- `Checkbox`
- `RadioGroup`
- `Switch`
- `DateInput`
- `FileUploader`
- `Dialog`

### Admin Tables

- `DataTable`
- `ColumnManager`
- `FilterBuilder`
- `Sheet`
- `Badge`
- `Button`
- `DropdownMenu`

### Shell Navigation

- `Sidebar`
- `Breadcrumb`
- `NavigationMenu`
- `Tabs`
- `ScrollArea`

## Quick Example

```tsx
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
} from '@shznet/components'

export function UsersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Add user</Button>
        <DataTable columns={[]} data={[]} />
      </CardContent>
    </Card>
  )
}
```

## Usage Notes

- Import the theme CSS once at the app entry point.
- `DataTable`, `FilterBuilder`, and `TreeTable` are better suited for admin and module-style screens.
- If you need legacy menu contracts, use `@shznet/components/remote-config`; for new code, import types directly from `@shznet/core`.
