# Shz MFE — Sample Workspace

Workspace mẫu gồm 3 app được tạo bằng `@shz/nx-generators`:

| App | Role | Port | URL |
|---|---|---|---|
| `host-main` | Shell host | 3000 | http://localhost:3000 |
| `remote-crm` | Remote CRM | 3001 | http://localhost:3001 |
| `remote-hr` | Remote HR | 3002 | http://localhost:3002 |

---

## Yêu cầu

- **Node.js** ≥ 20
- **pnpm** ≥ 9
- **Docker** (để chạy Verdaccio — registry chứa `@shz/*` packages)

---

## Bước 1 — Khởi động registry

Packages `@shz/core`, `@shz/components`, `@shz/nx-generators` được host trên Verdaccio local.

```bash
# Từ root của repo Shz-Mfe
docker compose up -d
```

Verdaccio chạy tại http://localhost:4873. Kiểm tra:

```bash
curl http://localhost:4873/@shz%2Fcore
```

---

## Bước 2 — Tạo workspace mới

```bash
mkdir my-mfe-workspace
cd my-mfe-workspace
```

Tạo file `.npmrc` để trỏ scope `@shz` về registry local:

```bash
# .npmrc
@shz:registry=http://localhost:4873/
```

Tạo `package.json`:

```json
{
  "name": "my-mfe-workspace",
  "version": "0.0.0",
  "private": true,
  "scripts": {},
  "devDependencies": {
    "@shz/nx-generators": "0.0.6-local.7",
    "nx": "^21.0.0"
  }
}
```

Tạo `nx.json`:

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "defaultBase": "main"
}
```

Tạo `tsconfig.base.json`:

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "rootDir": ".",
    "sourceMap": true,
    "declaration": false,
    "moduleResolution": "bundler",
    "experimentalDecorators": true,
    "target": "ESNext",
    "module": "ESNext",
    "lib": ["ESNext", "DOM"],
    "noImplicitAny": true,
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "paths": {}
  },
  "exclude": ["node_modules", "dist", ".nx"]
}
```

---

## Bước 3 — Cài dependencies

```bash
pnpm install
```

> pnpm sẽ hỏi về build scripts của nx. Mở `pnpm-workspace.yaml` vừa được tạo và đổi `nx: set this to true or false` thành `nx: true`, rồi chạy lại `pnpm install`.

---

## Bước 4 — Generate host app

Host là shell chính — load các remote vào sidebar và router.

```bash
nx g @shz/nx-generators:host \
  --name=host-main \
  --displayName="My App" \
  --port=3000 \
  --coreVersion=0.0.6-local.7 \
  --componentsVersion=0.0.6-local.7
```

**Options hay dùng:**

| Option | Mô tả | Default |
|---|---|---|
| `--name` | Tên project (kebab-case) | *(bắt buộc)* |
| `--displayName` | Tên hiển thị trên UI | Title-case của name |
| `--port` | Dev server port | `3000` |
| `--coreVersion` | Version của `@shz/core` | `workspace:*` |
| `--componentsVersion` | Version của `@shz/components` | `workspace:*` |

---

## Bước 5 — Generate remote apps

Remote là các MFE module — expose `./Shell` và `./config` cho host.

```bash
# Remote thứ nhất
nx g @shz/nx-generators:module-app \
  --name=remote-crm \
  --displayName="CRM" \
  --port=3001 \
  --coreVersion=0.0.6-local.7 \
  --componentsVersion=0.0.6-local.7

# Remote thứ hai
nx g @shz/nx-generators:module-app \
  --name=remote-hr \
  --displayName="HR" \
  --port=3002 \
  --coreVersion=0.0.6-local.7 \
  --componentsVersion=0.0.6-local.7
```

**Options hay dùng:**

| Option | Mô tả | Default |
|---|---|---|
| `--name` | Tên project (kebab-case) | *(bắt buộc)* |
| `--displayName` | Tên hiển thị trên menu host | Title-case của name |
| `--port` | Dev server port | `3001` |
| `--basePath` | Route path trên host | `/app/<segment>` |
| `--remoteName` | Tên MF remote (dùng trong rsbuild) | `name` với `-` → `_` |

> Alias: `nx g @shz/nx-generators:remote-app` cũng được.

---

## Bước 6 — Đăng ký remotes vào host

Mở `apps/host-main/src/remotes.ts` và thêm các remote vào mảng `apps`:

```ts
export const apps = [
  {
    id: 'remote-crm',
    name: 'CRM',
    basePath: '/app/crm',
    remoteName: 'remote_crm',
    entry: withRemoteCacheBuster(
      (import.meta as { env?: Record<string, string | undefined> }).env?.REMOTE_REMOTE_CRM_URL ??
        'http://localhost:3001/mf-manifest.json',
    ),
  },
  {
    id: 'remote-hr',
    name: 'HR',
    basePath: '/app/hr',
    remoteName: 'remote_hr',
    entry: withRemoteCacheBuster(
      (import.meta as { env?: Record<string, string | undefined> }).env?.REMOTE_REMOTE_HR_URL ??
        'http://localhost:3002/mf-manifest.json',
    ),
  },
] satisfies HostRemoteApp[]
```

**Quy tắc điền:**

| Field | Lấy từ đâu | Ví dụ |
|---|---|---|
| `id` | `--name` của remote | `remote-crm` |
| `name` | `--displayName` của remote | `CRM` |
| `basePath` | `--basePath` (hoặc `/app/<segment>`) | `/app/crm` |
| `remoteName` | `name` trong `apps/remote-crm/rsbuild.config.ts` | `remote_crm` |
| URL env var | `REMOTE_<CONSTANT_NAME>_URL` | `REMOTE_REMOTE_CRM_URL` |

---

## Bước 7 — Cài dependencies cho từng app

Generator tạo `package.json` riêng cho mỗi app. Cần install:

```bash
pnpm install
```

---

## Bước 8 — Chạy

Chạy tất cả cùng lúc:

```bash
pnpm dev
# hoặc: nx run-many -t dev --parallel=10
```

Chạy từng app riêng:

```bash
pnpm dev:host-main    # http://localhost:3000
pnpm dev:remote-crm   # http://localhost:3001
pnpm dev:remote-hr    # http://localhost:3002
```

> **Lưu ý:** Remote phải chạy trước host (hoặc chạy đồng thời). Host load `mf-manifest.json` từ URL của remote lúc start.

---

## Cấu trúc sau khi generate

```
my-mfe-workspace/
├── .npmrc
├── nx.json
├── package.json
├── tsconfig.base.json
└── apps/
    ├── host-main/              # Shell host — port 3000
    │   ├── rsbuild.config.ts
    │   └── src/
    │       ├── remotes.ts      # ← Đăng ký remote ở đây
    │       ├── app/
    │       │   ├── routes.tsx
    │       │   ├── hooks/
    │       │   ├── lib/
    │       │   ├── components/
    │       │   └── layouts/
    │       ├── app.tsx
    │       └── main.tsx
    ├── remote-crm/             # Remote CRM — port 3001
    │   ├── rsbuild.config.ts
    │   └── src/
    │       ├── shell.tsx       # Exposed: ./Shell
    │       ├── menu.ts         # Exposed: ./config
    │       ├── nav.tsx
    │       └── pages/
    └── remote-hr/              # Remote HR — port 3002
        ├── rsbuild.config.ts
        └── src/
            ├── shell.tsx
            ├── menu.ts
            ├── nav.tsx
            └── pages/
```

---

## Thêm remote mới sau này

```bash
nx g @shz/nx-generators:module-app \
  --name=remote-inventory \
  --displayName="Inventory" \
  --port=3003 \
  --coreVersion=0.0.6-local.7 \
  --componentsVersion=0.0.6-local.7
```

Sau đó thêm entry vào `apps/host-main/src/remotes.ts` như Bước 6.
