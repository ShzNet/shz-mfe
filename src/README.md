# Shz MFE Workspace Docs

This workspace provides three main building blocks for micro-frontend development:

- `@shznet/core`: shared runtime contracts and host/remote helpers
- `@shznet/components`: shared UI component library
- `@shznet/nx-generators`: generators for scaffolding host and remote apps
- `create-shznet-workspace`: CLI bootstrap for new Nx workspaces

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

- Core runtime: [libs/core/README.md](https://github.com/ShzNet/shz-mfe/blob/main/src/libs/core/README.md)
- Component library: [libs/components/README.md](https://github.com/ShzNet/shz-mfe/blob/main/src/libs/components/README.md)
- NX generators: [tools/nx-generators/README.md](https://github.com/ShzNet/shz-mfe/blob/main/src/tools/nx-generators/README.md)
- Workspace bootstrap CLI: [tools/create-shznet-workspace/README.md](https://github.com/ShzNet/shz-mfe/blob/main/src/tools/create-shznet-workspace/README.md)

## Recommended Flow

1. Use `create-shznet-workspace` to bootstrap a fresh Nx workspace.
2. Use `@shznet/nx-generators` to create host or remote apps.
3. Use `@shznet/core` in the host to register and load remotes.
4. Use `@shznet/components` to keep UI patterns consistent across host and remotes.
5. Use the sample apps as reference implementations when extending the platform.

## Sample Apps

- `apps/host-sample`: reference host shell
- `apps/demo-host`: minimal demo host
- `apps/remote-admin`: remote app with dashboard and user management
- `apps/remote-demo`: secondary demo remote

If you are starting a new project, use the generators rather than copying a sample app by hand.
