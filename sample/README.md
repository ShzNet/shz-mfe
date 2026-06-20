# Sample Workspaces

`sample/` contains 3 standalone Nx workspaces recreated from the local published packages:

- `host-ws` -> generates `sample-host`
- `remote-ws-1` -> generates `remote-sales`
- `remote-ws-2` -> generates `remote-hr`

Recreate everything end to end:

```bash
node ./sample/scripts/recreate-samples.mjs
```

The script will:

1. start the local Verdaccio registry
2. republish `@shznet/core`, `@shznet/components`, and `@shznet/nx-generators`
3. recreate the 3 sample workspaces from scratch
4. install dependencies and generators
5. generate the sample apps
6. build each workspace to verify the result

Run all 3 apps together:

```bash
node ./sample/scripts/run-samples.mjs
```

Run the apps individually:

```bash
pnpm --dir sample/host-ws dev:sample-host
pnpm --dir sample/remote-ws-1 dev:remote-sales
pnpm --dir sample/remote-ws-2 dev:remote-hr
```
