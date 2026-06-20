# @shz/nx-generators

NX generators for scaffolding Micro-Frontend apps in the Shz MFE monorepo. Generates fully wired [Module Federation](https://module-federation.io/) apps built with RSBuild, React 19, Tailwind CSS v4, and `@shznet/core` / `@shz/components`.

## Requirements

- NX workspace (`nx.json` at root)
- pnpm
- `@shznet/core` and `@shz/components` installed (or available via local registry)

## Installation

```bash
pnpm add -D @shz/nx-generators --registry http://localhost:4873
```

Or add to your root `package.json` devDependencies and run `pnpm install`.

## Generators

### `host` — Host App

Scaffolds a **host shell** application that dynamically loads remote MFE modules at runtime using `@shznet/core`.

```bash
nx g @shz/nx-generators:host --name=my-host
```

**Options**

| Option | Type | Default | Description |
|---|---|---|---|
| `name` | string | *(required)* | Project name, e.g. `my-host` |
| `displayName` | string | Title-cased `name` | Display title shown in the shell UI |
| `port` | number | `3000` | Dev server port |
| `packageName` | string | `@shz/<name>` | Published package name |
| `componentsPackage` | string | `@shz/components` | UI components package to use |
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

Scaffolds a **remote MFE app** that exposes `./Shell` and `./config` for consumption by a host.

```bash
nx g @shz/nx-generators:module-app --name=remote-sales
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
| `packageName` | string | `@shz/<name>` | Published package name |
| `componentsPackage` | string | `@shz/components` | UI components package to use |
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
│       ├── dashboard.tsx       # Sample dashboard page
│       └── users.tsx           # Sample users page
```

The remote exposes two Module Federation endpoints:
- **`./Shell`** — the full app shell mounted by the host
- **`./config`** — nav menu metadata (label, icon, basePath) consumed by the host sidebar

---

## Adding a Remote to a Host

After generating both a host and a remote, register the remote in the host's `src/remotes.ts`:

```ts
// apps/my-host/src/remotes.ts
import type { RemoteConfig } from '@shznet/core'

export const remotes: RemoteConfig[] = [
  {
    name: 'remote_sales',
    url: process.env.REMOTE_REMOTE_SALES_URL ?? 'http://localhost:3001',
  },
]
```

The host's `remote-loader.ts` will pick this up automatically at runtime.

---

## Local Development

These generators reference `workspace:*` versions of `@shznet/core` and `@shz/components` by default, which resolves to the local packages in the monorepo.

To generate apps that point to a published version instead (e.g. from the local Verdaccio registry):

```bash
nx g @shz/nx-generators:module-app \
  --name=remote-sales \
  --coreVersion=0.0.6-local.6 \
  --componentsVersion=0.0.6-local.6
```
