# @shznet/nx-generators

NX generators for scaffolding micro-frontend apps in the Shz MFE workspace. Generated output is prewired with [Module Federation](https://module-federation.io/), RSBuild, React 19, Tailwind CSS v4, `@shznet/core`, and `@shznet/components`.

If you are new to this workspace, read these first:

- Workspace overview: [src/README.md](https://github.com/ShzNet/shz-mfe/blob/main/src/README.md)
- Core runtime docs: [src/libs/core/README.md](https://github.com/ShzNet/shz-mfe/blob/main/src/libs/core/README.md)
- Component docs: [src/libs/components/README.md](https://github.com/ShzNet/shz-mfe/blob/main/src/libs/components/README.md)

## Requirements

- NX workspace (`nx.json` at root)
- pnpm
- `@shznet/core` and `@shznet/components` installed

## Installation

```bash
pnpm add -D @shznet/nx-generators
```

Or add the package to workspace `devDependencies` and run `pnpm install`.

## Quick Start

### Generate host app

```bash
nx g @shznet/nx-generators:host --name=portal-host
```

### Generate remote app

```bash
nx g @shznet/nx-generators:module-app --name=remote-sales
```

### Add a remote to a host

```ts
import type { FederatedRemoteRegistration } from '@shznet/core'

export const remotes: FederatedRemoteRegistration[] = [
  {
    name: 'remote_sales',
    entry: 'https://remote.example.com/mf-manifest.json',
  },
]
```

## Template Convention

Inside this package:

- Raw scaffold files that are copied into generated apps use the `.template` suffix
- `.js` files under `src/generators/**` are generator code or template builders, not typed app source files

This keeps editor/typecheck noise low while preserving generated output as normal `.ts` and `.tsx` files.

## Generators

### `host` — Host App

Scaffolds a **host shell** that dynamically loads remote MFE modules at runtime using `@shznet/core`.

```bash
nx g @shznet/nx-generators:host --name=my-host
```

**Options**

| Option | Type | Default | Description |
|---|---|---|---|
| `name` | string | *(required)* | Project name, e.g. `my-host` |
| `displayName` | string | Title-cased `name` | Display title shown in the shell UI |
| `port` | number | `3000` | Dev server port |
| `packageName` | string | `@shznet/<name>` | Published package name |
| `componentsPackage` | string | `@shznet/components` | UI components package to use |
| `componentsVersion` | string | `workspace:*` | Components package version |
| `corePackage` | string | `@shznet/core` | Core package to use |
| `coreVersion` | string | `workspace:*` | Core package version |

**What gets generated**

```
apps/my-host/
├── index.html
├── package.json
├── rsbuild.config.ts           # RSBuild + Module Federation host config
├── tsconfig.json
├── src/
│   ├── main.tsx                # Entry point
│   ├── app.tsx                 # Root app with router + theme + toaster
│   ├── remotes.ts              # Remote registry (add remotes here)
│   └── app/
│       ├── routes.tsx          # React Router routes
│       ├── types.ts            # Shared types
│       ├── hooks/
│       │   ├── use-auth-state.ts
│       │   └── use-theme-mode.ts
│       ├── lib/
│       │   ├── auth-storage.ts
│       │   ├── remote-loader.ts
│       │   └── theme.ts
│       ├── components/
│       │   ├── auth-guard.tsx
│       │   ├── header-actions.tsx
│       │   ├── header-notification.tsx
│       │   ├── header-user.tsx
│       │   ├── remote-module.tsx
│       │   ├── remote-shell.tsx
│       │   └── theme-toggle.tsx
│       └── layouts/
│           ├── app-header.tsx
│           ├── app-shell.tsx
│           ├── app-sidebar-nav.tsx
│           ├── home-page.tsx
│           └── sign-in-page.tsx
```

---

### `module-app` — Remote Module App

Scaffolds a **remote MFE app** that exposes `./Shell` and `./config` for host consumption.

```bash
nx g @shznet/nx-generators:module-app --name=remote-sales
```

Alias: `remote-app`

**Options**

| Option | Type | Default | Description |
|---|---|---|---|
| `name` | string | *(required)* | Project name, e.g. `remote-sales` |
| `displayName` | string | Title-cased `name` | Label shown in menus and sample pages |
| `port` | number | `3001` | Dev server port |
| `basePath` | string | `/app/<segment>` | Host route path for this remote |
| `baseSegment` | string | `name` without `remote-` prefix | Path segment when `basePath` is omitted |
| `remoteName` | string | `name` with `-` → `_` | Module Federation remote name |
| `packageName` | string | `@shznet/<name>` | Published package name |
| `componentsPackage` | string | `@shznet/components` | UI components package to use |
| `componentsVersion` | string | `workspace:*` | Components package version |
| `corePackage` | string | `@shznet/core` | Core package to use |
| `coreVersion` | string | `workspace:*` | Core package version |

**What gets generated**

```
apps/remote-sales/
├── index.html
├── package.json
├── rsbuild.config.ts           # RSBuild + Module Federation remote config
├── tsconfig.json
├── src/
│   ├── main.tsx                # Standalone entry point
│   ├── menu.ts                 # Exposes nav config via ./config
│   ├── nav.tsx                 # Sidebar nav component
│   ├── shell.tsx               # Exposed ./Shell component
│   └── pages/
│       ├── app.tsx             # App wrapper with router
│       ├── dashboard.tsx       # Async stats dashboard with skeleton states
│       └── users/
│           ├── index.tsx       # Full CRUD/table sample
│           ├── columns.tsx
│           ├── config.ts
│           ├── data.ts
│           ├── helpers.ts
│           ├── types.ts
│           └── components/
│               └── user-form-dialog.tsx
```

The remote exposes two Module Federation endpoints:
- **`./Shell`** — the full app shell mounted by the host
- **`./config`** — menu metadata sourced from `src/menu.ts` and consumed by host/sidebar logic

### Full Component Scaffold

The generated `users` feature is the reference "full component" sample for `@shznet/components`. It demonstrates:

- `DataTable` with row selection, column ordering, and visibility control
- `FilterBuilder` with reusable presets and active-rule counting
- `ColumnManager` inside a `Sheet`
- Form/dialog composition with `Dialog`, `DateInput`, `Input`, and `Select`

Components can be imported directly from the package entrypoint:

```ts
import {
  Button,
  DataTable,
  FilterBuilder,
  ColumnManager,
  Dialog,
  Sheet,
} from '@shznet/components'
```

If you want the fastest starting point for a remote app that already includes the full admin component set, generate a `module-app` and start from `src/pages/users/index.tsx`.

---

## Adding a Remote to a Host

After generating both a host and a remote, register the remote in the host's `src/remotes.ts`:

```ts
// apps/my-host/src/remotes.ts
import type { FederatedRemoteRegistration } from '@shznet/core'

export const remotes: FederatedRemoteRegistration[] = [
  {
    name: 'remote_sales',
    entry: process.env.REMOTE_REMOTE_SALES_URL ?? 'https://remote.example.com/mf-manifest.json',
  },
]
```

The host `remote-loader.ts` uses this configuration to load the remote at runtime.

## Recommended Team Flow

1. Generate the host with `:host`.
2. Generate each remote domain with `:module-app`.
3. Add the remote to the host `src/remotes.ts`.
4. Use `@shznet/components` to build screens inside each remote.
5. Use `@shznet/core` when you need to extend runtime behavior, state, or remote context.
