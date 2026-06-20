# create-shznet-workspace

Bootstrap a new Nx workspace for the ShzNet micro-frontend stack.

## Usage

```bash
npx create-shznet-workspace my-mfe
```

Create a workspace and generate a host immediately:

```bash
npx create-shznet-workspace my-host-ws \
  --type host \
  --name portal-host \
  --displayName "Portal Host" \
  --packageScope acme
```

Create a workspace and generate a remote app immediately:

```bash
npx create-shznet-workspace my-remote-ws \
  --type app \
  --name remote-sales \
  --displayName "Sales" \
  --basePath /app/sales \
  --remoteName sales_remote \
  --packageScope acme
```

Use a local Verdaccio registry for `@shznet/*` packages:

```bash
npx --registry http://localhost:4873 create-shznet-workspace my-mfe \
  --registry http://localhost:4873 \
  --type host \
  --name portal-host
```

## Main Options

- `--type`: `empty`, `host`, `app`, or `module-app`
- `--name`: project name passed to the Nx generator
- `--displayName`: UI label for the generated app
- `--packageName`: explicit package name, for example `@acme/portal-host`
- `--packageScope`: shorthand to build `packageName` from `@scope/name`
- `--port`: dev server port
- `--basePath`: remote route base path for `app` / `module-app`
- `--remoteName`: explicit Module Federation remote name
- `--registry`: writes `@shznet:registry=...` to the generated workspace `.npmrc`
