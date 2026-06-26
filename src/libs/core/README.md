# @shznet/core

`@shznet/core` is the runtime layer for the host/remote model used in this workspace. It does not include UI components; it focuses on contracts, lightweight state, and helpers for loading Module Federation remotes.

## Main Exports

### Contracts

- `ShellMenuItem`, `ShellMenuConfig`
- `ShellRemoteModuleMeta`, `ShellResolvedModule`, `ShellRouteItem`

### Event Bus

- `createEventBus`
- `CoreEvent`, `EventBus`, `Unsubscribe`

### Federation Runtime

- `configureFederation`
- `ensureFederatedRemoteRegistered`
- `isFederationDebugEnabled`
- `loadFederatedModule`
- `loadFederatedStyles`
- `FederatedRemoteRegistration`, `FederationConfig`

### Remote Context

- `buildShellRemoteContextKey`
- `setShellRemoteContext`
- `getShellRemoteContext`
- `getShellRemoteContextData`
- `clearShellRemoteContext`

### Shell State

- `createShellStateStore`
- `ShellState`, `ShellStateStore`

## Installation

```bash
pnpm add @shznet/core
```

## Host Usage

### 1. Define the remote registry

```ts
import type { FederatedRemoteRegistration } from '@shznet/core'

export const remotes: FederatedRemoteRegistration[] = [
  {
    name: 'remote_admin',
    entry: 'https://remote.example.com/mf-manifest.json',
  },
]
```

### 2. Configure the session cache buster

```ts
import { configureFederation } from '@shznet/core'

configureFederation({
  getSessionBuster: () => Date.now().toString(),
  debug: true,
})
```

Call `configureFederation()` early in host bootstrap so every remote manifest uses the same session buster value.
The runtime caches that value on `globalThis`, which keeps remote registration and manifest cache-busting stable across HMR reloads.
Set `debug: true` to emit verbose federation logs through `console.debug`, or pass `logger` to route them elsewhere.

### 3. Load a remote module

```ts
import { loadFederatedModule } from '@shznet/core'

const remoteShell = await loadFederatedModule(
  'remote_admin',
  './Shell',
  'https://remote.example.com/mf-manifest.json'
)
```

### 4. Load remote CSS when needed

```ts
import { loadFederatedStyles } from '@shznet/core'

await loadFederatedStyles(
  'https://remote.example.com/mf-manifest.json',
  './Shell'
)
```

## Remote Context

Remote context lets the host keep runtime metadata and data keyed by `remoteName + exposedModule`.

```ts
import {
  setShellRemoteContext,
  getShellRemoteContextData,
} from '@shznet/core'

setShellRemoteContext({
  remote: { remoteName: 'remote_admin', id: 'admin', name: 'Admin' },
  exposedModule: './Shell',
  data: { tenantId: 'demo' },
})

const data = getShellRemoteContextData<{ tenantId: string }>(
  'remote_admin',
  './Shell'
)
```

## Shell State Store

`createShellStateStore()` provides a minimal store for the host shell.

```ts
import { createShellStateStore } from '@shznet/core'

const shellState = createShellStateStore({
  activeModuleId: null,
  modules: [],
})

shellState.subscribe((state) => {
  console.log(state.activeModuleId)
})
```

## When To Use This Package

- When the host needs to register and load remotes dynamically
- When you need shared contracts between host and remotes
- When you want a small state store without introducing a larger state library
- When you need to pass shell context into remote runtime code

## When Not To Use This Package

- Do not use it for UI components
- Do not use it as a replacement for routing, auth frameworks, or complex app state
- Do not use it to scaffold new projects; that belongs to `@shznet/nx-generators`
