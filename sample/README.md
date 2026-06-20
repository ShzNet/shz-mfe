# Sample Workspaces

`sample/` contains 3 standalone Nx workspaces recreated from the published local packages:

- `host-ws` -> generates `sample-host`
- `remote-ws-1` -> generates `remote-sales`
- `remote-ws-2` -> generates `remote-hr`

Recreate everything end to end:

```bash
node ./sample/scripts/recreate-samples.mjs
```

The script will:

1. start the local Verdaccio registry with Docker Compose
2. re-publish `@shznet/core`, `@shznet/components`, and `@shznet/nx-generators`
3. remove the existing sample workspaces
4. initialize fresh Nx workspaces
5. install dependencies and generators
6. generate the 3 sample apps from scratch

Run the apps:

```bash
pnpm --dir sample/host-ws dev:sample-host
pnpm --dir sample/remote-ws-1 dev:remote-sales
pnpm --dir sample/remote-ws-2 dev:remote-hr
```
