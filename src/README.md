# Shz MFE Workspace Docs

This workspace provides three main building blocks for micro-frontend development:

- `@shznet/core`: shared runtime contracts and host/remote helpers
- `@shznet/components`: shared UI component library
- `@shznet/nx-generators`: generators for scaffolding host and remote apps

## Workspace Structure

```text
src/
├── apps/                     # sample host/remote apps
├── libs/
│   ├── core/                 # @shznet/core package
│   └── components/           # @shznet/components package
└── tools/
    └── nx-generators/        # @shznet/nx-generators package
```

## Quick Start

Install workspace dependencies:

```bash
cd src
pnpm install
```

Run the sample host and remote:

```bash
pnpm dev:host-sample
pnpm dev:remote-admin
```

Build the workspace:

```bash
pnpm build
```

## Package Docs

- Core runtime: [libs/core/README.md](/Users/shizaki/Works/Shizaki/Shz-Mfe/src/libs/core/README.md)
- Component library: [libs/components/README.md](/Users/shizaki/Works/Shizaki/Shz-Mfe/src/libs/components/README.md)
- NX generators: [tools/nx-generators/README.md](/Users/shizaki/Works/Shizaki/Shz-Mfe/src/tools/nx-generators/README.md)

## Recommended Flow

1. Use `@shznet/nx-generators` to create host or remote apps.
2. Use `@shznet/core` in the host to register and load remotes.
3. Use `@shznet/components` to keep UI patterns consistent across host and remotes.
4. Use the sample apps as reference implementations when extending the platform.

## Sample Apps

- `apps/host-sample`: reference host shell
- `apps/demo-host`: minimal demo host
- `apps/remote-admin`: remote app with dashboard and user management
- `apps/remote-demo`: secondary demo remote

If you are starting a new project, use the generators rather than copying a sample app by hand.
